import { NextRequest, NextResponse } from "next/server";
import {
  searchDeals,
  getDealContacts,
  getContactById,
  hasAutomationTag,
  createDealNote,
  createContactNote,
  findContactByEmail,
  isSubscribed,
} from "@/lib/hubspot";
import {
  sendEmail,
  createUnsubscribeUrl,
  reviewRequestEmail,
} from "@/lib/emails";
import { supabase } from "@/lib/supabase";

export const runtime = "nodejs";
export const maxDuration = 300;

// "Completed" stage in the Farm Services Pipeline
const COMPLETED_STAGE_ID = "3248645833";
const DEAL_TAG = "[AUTO:REVIEW]";
const CONTACT_TAG_PREFIX = "[AUTO:REVIEW_";
const REVIEW_COOLDOWN_MONTHS = 6;

/** Returns the contact-level tag for the current period, e.g. "[AUTO:REVIEW_2026-H1]" */
function currentReviewTag(): string {
  const now = new Date();
  const half = now.getMonth() < 6 ? "H1" : "H2";
  return `${CONTACT_TAG_PREFIX}${now.getFullYear()}-${half}]`;
}

/** Check if the contact was sent a review request within the cooldown window */
async function recentlyAskedForReview(contactId: string): Promise<boolean> {
  const now = new Date();
  // Check current half-year and previous half-year tags
  const currentTag = currentReviewTag();

  const prevDate = new Date(now);
  prevDate.setMonth(prevDate.getMonth() - REVIEW_COOLDOWN_MONTHS);
  const prevHalf = prevDate.getMonth() < 6 ? "H1" : "H2";
  const prevTag = `${CONTACT_TAG_PREFIX}${prevDate.getFullYear()}-${prevHalf}]`;

  if (await hasAutomationTag("contacts", contactId, currentTag)) return true;
  if (currentTag !== prevTag && await hasAutomationTag("contacts", contactId, prevTag)) return true;
  return false;
}

/** Check if Supabase last_review_request_at is within cooldown */
function supabaseRecentlyAsked(lastRequestAt: string | null): boolean {
  if (!lastRequestAt) return false;
  const cooldownMs = REVIEW_COOLDOWN_MONTHS * 30 * 24 * 60 * 60 * 1000;
  return Date.now() - new Date(lastRequestAt).getTime() < cooldownMs;
}

/** Cross-update last_review_request_at in Supabase for a given email */
async function updateSupabaseReviewTimestamp(email: string): Promise<void> {
  await supabase
    .from("recurring_customers")
    .update({ last_review_request_at: new Date().toISOString() })
    .eq("email", email)
    .eq("active", true);
}

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const results: string[] = [];
  // Track emails sent in Phase 1 so Phase 2 can skip them
  const sentEmails = new Set<string>();

  try {
    // -----------------------------------------------------------------------
    // Phase 1: HubSpot deals in "Completed" stage (existing logic)
    // -----------------------------------------------------------------------
    const thirtyDaysAgo = new Date(
      Date.now() - 30 * 24 * 60 * 60 * 1000,
    ).toISOString();

    const completedDeals = await searchDeals(
      [
        {
          filters: [
            {
              propertyName: "dealstage",
              operator: "EQ",
              value: COMPLETED_STAGE_ID,
            },
            {
              propertyName: "closedate",
              operator: "GTE",
              value: thirtyDaysAgo,
            },
          ],
        },
      ],
      ["dealname", "closedate", "dealstage"],
    );

    for (const deal of completedDeals) {
      try {
        // Skip if review already sent for this deal
        if (await hasAutomationTag("deals", deal.id, DEAL_TAG)) continue;

        // Get associated contacts
        const contactIds = await getDealContacts(deal.id);
        if (contactIds.length === 0) continue;

        const contactId = contactIds[0];

        // Skip if this contact was already asked in the last 6 months
        if (await recentlyAskedForReview(contactId)) {
          // Still mark the deal so we don't re-check it every run
          await createDealNote(
            deal.id,
            `${DEAL_TAG} Skipped — contact ${contactId} was recently asked on ${new Date().toISOString()}`,
          );
          continue;
        }

        const contact = await getContactById(contactId, [
          "email",
          "firstname",
        ]);
        const email = contact.properties.email;
        if (!email) continue;

        if (!(await isSubscribed(email))) continue;

        const unsub = createUnsubscribeUrl(email);
        const template = reviewRequestEmail(
          contact.properties.firstname || "",
          unsub,
        );
        await sendEmail(email, template.subject, template.html);
        sentEmails.add(email.toLowerCase());

        const tag = currentReviewTag();
        // Tag the deal so we don't process it again
        await createDealNote(
          deal.id,
          `${DEAL_TAG} Review request sent to ${email} on ${new Date().toISOString()}`,
        );
        // Tag the contact so we don't ask again for 6 months
        await createContactNote(
          contactId,
          `${tag} Review request sent to ${email} on ${new Date().toISOString()}`,
        );
        // Cross-update Supabase so both systems stay in sync
        await updateSupabaseReviewTimestamp(email);
        results.push(`review → ${email} (deal ${deal.id})`);
      } catch (err) {
        results.push(`review FAIL deal ${deal.id}: ${err}`);
      }
    }

    // -----------------------------------------------------------------------
    // Phase 2: Supabase recurring customers with recent charged service logs
    // -----------------------------------------------------------------------
    const twoDaysAgo = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString();
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

    const { data: recentLogs, error: logsError } = await supabase
      .from("service_logs")
      .select("customer_id")
      .eq("status", "charged")
      .gte("charged_at", sevenDaysAgo)
      .lte("charged_at", twoDaysAgo);

    if (logsError) {
      results.push(`Phase 2 FAIL fetching logs: ${logsError.message}`);
    } else if (recentLogs && recentLogs.length > 0) {
      // Deduplicate by customer_id
      const uniqueCustomerIds = [...new Set(recentLogs.map((l: { customer_id: string }) => l.customer_id))];

      const { data: customers, error: custError } = await supabase
        .from("recurring_customers")
        .select("id, name, email, last_review_request_at")
        .in("id", uniqueCustomerIds)
        .eq("active", true)
        .not("email", "is", null);

      if (custError) {
        results.push(`Phase 2 FAIL fetching customers: ${custError.message}`);
      } else if (customers) {
        for (const customer of customers) {
          try {
            const email = customer.email as string;

            // Skip if already sent in Phase 1
            if (sentEmails.has(email.toLowerCase())) continue;

            // Skip if Supabase cooldown applies (6 months)
            if (supabaseRecentlyAsked(customer.last_review_request_at)) continue;

            // Check HubSpot subscription + cooldown if contact exists there
            let hubspotContactId: string | null = null;
            try {
              const hsContact = await findContactByEmail(email);
              if (hsContact) {
                hubspotContactId = hsContact.id;
                // Respect HubSpot unsubscribe
                if (!(await isSubscribed(email))) continue;
                // Respect HubSpot contact-level cooldown
                if (await recentlyAskedForReview(hsContact.id)) continue;
              }
            } catch {
              // Contact not in HubSpot — proceed (active paying customer)
            }

            const unsub = createUnsubscribeUrl(email);
            const firstname = (customer.name || "").split(" ")[0];
            const template = reviewRequestEmail(firstname, unsub);
            await sendEmail(email, template.subject, template.html);

            // Update Supabase timestamp
            await supabase
              .from("recurring_customers")
              .update({ last_review_request_at: new Date().toISOString() })
              .eq("id", customer.id);

            // If HubSpot contact exists, create note for cross-system consistency
            if (hubspotContactId) {
              const tag = currentReviewTag();
              await createContactNote(
                hubspotContactId,
                `${tag} Review request sent to ${email} (via Supabase recurring) on ${new Date().toISOString()}`,
              );
            }

            results.push(`review → ${email} (recurring ${customer.id})`);
          } catch (err) {
            results.push(`review FAIL recurring ${customer.id}: ${err}`);
          }
        }
      }
    }
  } catch (err) {
    return NextResponse.json(
      { error: String(err), results },
      { status: 500 },
    );
  }

  return NextResponse.json({
    ok: true,
    processed: results.length,
    results,
    timestamp: new Date().toISOString(),
  });
}
