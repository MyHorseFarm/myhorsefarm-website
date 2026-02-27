import { NextRequest, NextResponse } from "next/server";
import {
  searchDeals,
  getDealContacts,
  getContactById,
  hasAutomationTag,
  createDealNote,
  createContactNote,
  isSubscribed,
} from "@/lib/hubspot";
import {
  sendEmail,
  createUnsubscribeUrl,
  reviewRequestEmail,
} from "@/lib/emails";

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

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const results: string[] = [];

  try {
    // Find deals in "Completed" stage that closed in the last 30 days
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
        results.push(`review → ${email} (deal ${deal.id})`);
      } catch (err) {
        results.push(`review FAIL deal ${deal.id}: ${err}`);
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
