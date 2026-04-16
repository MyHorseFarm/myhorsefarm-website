import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import {
  hasAutomationTag,
  createContactNote,
  isSubscribed,
  findContactByEmail,
} from "@/lib/hubspot";
import { buildSignedUrl } from "@/lib/url-signing";
import {
  sendEmail,
  createUnsubscribeUrl,
  quoteFollowup1Email,
  quoteFollowup2Email,
  quoteExpiringEmail,
  quoteExpiredRecoveryEmail,
} from "@/lib/emails";
import {
  getActiveTest,
  pickVariant,
  getVariantSubject,
  recordSend,
} from "@/lib/ab-testing";
import { withCronMonitor } from "@/lib/cron-monitor";
import {
  generatePersonalizedFollowup,
  getChatSummary,
  FollowUpStage,
} from "@/lib/ai/follow-up";

export const runtime = "nodejs";
export const maxDuration = 300;

const TAGS = {
  FOLLOWUP_1: "[AUTO:QUOTE_FOLLOWUP_1]",
  FOLLOWUP_2: "[AUTO:QUOTE_FOLLOWUP_2]",
  EXPIRING: "[AUTO:QUOTE_EXPIRING]",
  EXPIRED_RECOVERY: "[AUTO:QUOTE_EXPIRED_RECOVERY]",
};

// Service display names for expired recovery email
const SERVICE_NAMES: Record<string, string> = {
  manure_removal: "Manure Removal",
  trash_bin_service: "Trash Bin Service",
  junk_removal: "Junk Removal",
  sod_installation: "Sod Installation",
  fill_dirt: "Fill Dirt Delivery",
  dumpster_rental: "Dumpster Rental",
  farm_repairs: "Farm Repairs & Maintenance",
  millings_asphalt: "Millings Asphalt Delivery",
  shipping_container: "Shipping Container",
};

function daysAgo(days: number): string {
  return new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();
}

function daysFromNow(days: number): string {
  return new Date(Date.now() + days * 24 * 60 * 60 * 1000).toISOString();
}

/**
 * Try to generate an AI-personalized follow-up body.
 * Returns undefined on failure so the caller falls back to the template.
 */
async function tryPersonalize(
  quote: {
    customer_name: string;
    service_key: string;
    estimated_amount: number;
    customer_location: string;
    quote_number: string;
    chat_session_id: string | null;
  },
  stage: FollowUpStage,
  daysLeft?: number,
): Promise<string | undefined> {
  try {
    const chatSummary = await getChatSummary(quote.chat_session_id);
    const body = await generatePersonalizedFollowup({
      customerName: quote.customer_name,
      serviceKey: quote.service_key,
      amount: quote.estimated_amount,
      location: quote.customer_location,
      quoteNumber: quote.quote_number,
      stage,
      daysLeft,
      chatSummary,
    });
    // Sanity check — AI should return something meaningful
    if (body && body.length > 20) return body;
    return undefined;
  } catch {
    // AI generation failed — fall back to template
    return undefined;
  }
}

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return withCronMonitor("quote-followup", async () => {
  const MAX_PER_RUN = 15; // Cap to stay within Resend daily quota
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://www.myhorsefarm.com";
  const results: string[] = [];
  let totalSent = 0;

    // -----------------------------------------------------------------------
    // Followup 1: Quotes created 1–2 days ago, still pending
    // -----------------------------------------------------------------------
    const { data: followup1Quotes } = await supabase
      .from("quotes")
      .select("*")
      .eq("status", "pending")
      .gte("created_at", daysAgo(2))
      .lte("created_at", daysAgo(1));

    for (const quote of followup1Quotes ?? []) {
      if (totalSent >= MAX_PER_RUN) break;
      try {
        const { data: fresh } = await supabase
          .from("quotes")
          .select("status")
          .eq("id", quote.id)
          .single();
        if (fresh?.status !== "pending") continue;
        if (new Date(quote.expires_at) < new Date()) continue;
        if (!(await isSubscribed(quote.customer_email))) continue;

        const contactId =
          quote.hubspot_contact_id ||
          (await findContactByEmail(quote.customer_email))?.id;
        if (!contactId) {
          results.push(`followup_1 SKIP ${quote.quote_number}: no HS contact`);
          continue;
        }

        if (await hasAutomationTag("contacts", contactId, TAGS.FOLLOWUP_1))
          continue;

        const personalizedBody = await tryPersonalize(quote, "first");

        const unsub = createUnsubscribeUrl(quote.customer_email);
        const acceptUrl = buildSignedUrl(`/quote/${quote.id}`, "quote", quote.id);
        const template = quoteFollowup1Email(
          quote.customer_name.split(" ")[0],
          quote.quote_number,
          acceptUrl,
          unsub,
          quote.service_key,
          personalizedBody,
        );

        // A/B test: override subject if active test exists for this template
        let finalSubject = template.subject;
        let abVariant: "a" | "b" | null = null;
        let abTest: Awaited<ReturnType<typeof getActiveTest>> = null;
        try {
          abTest = await getActiveTest("quote_followup_1");
          if (abTest) {
            abVariant = pickVariant(abTest);
            finalSubject = getVariantSubject(abTest, abVariant);
          }
        } catch { /* A/B test lookup non-fatal */ }

        const emailId = await sendEmail(quote.customer_email, finalSubject, template.html);

        // Record A/B send if test is active
        if (abTest && abVariant) {
          try {
            await recordSend(abTest.id, quote.customer_email, abVariant, emailId);
          } catch { /* recording non-fatal */ }
        }

        await createContactNote(
          contactId,
          `${TAGS.FOLLOWUP_1} Sent for ${quote.quote_number} on ${new Date().toISOString()}${personalizedBody ? " [AI-personalized]" : ""}`,
        );
        totalSent++;
        results.push(`followup_1 → ${quote.customer_email} (${quote.quote_number})${personalizedBody ? " [AI]" : ""}`);
      } catch (err) {
        results.push(`followup_1 FAIL ${quote.quote_number}: ${err}`);
      }
    }

    // -----------------------------------------------------------------------
    // Followup 2: Quotes created 3–4 days ago, still pending
    // -----------------------------------------------------------------------
    const { data: followup2Quotes } = await supabase
      .from("quotes")
      .select("*")
      .eq("status", "pending")
      .gte("created_at", daysAgo(4))
      .lte("created_at", daysAgo(3));

    for (const quote of followup2Quotes ?? []) {
      if (totalSent >= MAX_PER_RUN) break;
      try {
        const { data: fresh } = await supabase
          .from("quotes")
          .select("status")
          .eq("id", quote.id)
          .single();
        if (fresh?.status !== "pending") continue;
        if (new Date(quote.expires_at) < new Date()) continue;
        if (!(await isSubscribed(quote.customer_email))) continue;

        const contactId =
          quote.hubspot_contact_id ||
          (await findContactByEmail(quote.customer_email))?.id;
        if (!contactId) continue;

        if (!(await hasAutomationTag("contacts", contactId, TAGS.FOLLOWUP_1)))
          continue;
        if (await hasAutomationTag("contacts", contactId, TAGS.FOLLOWUP_2))
          continue;

        const personalizedBody = await tryPersonalize(quote, "second");

        const unsub = createUnsubscribeUrl(quote.customer_email);
        const acceptUrl = buildSignedUrl(`/quote/${quote.id}`, "quote", quote.id);
        const template = quoteFollowup2Email(
          quote.customer_name.split(" ")[0],
          quote.quote_number,
          acceptUrl,
          unsub,
          quote.service_key,
          personalizedBody,
        );

        // A/B test: override subject if active test exists for this template
        let finalSubject2 = template.subject;
        let abVariant2: "a" | "b" | null = null;
        let abTest2: Awaited<ReturnType<typeof getActiveTest>> = null;
        try {
          abTest2 = await getActiveTest("quote_followup_2");
          if (abTest2) {
            abVariant2 = pickVariant(abTest2);
            finalSubject2 = getVariantSubject(abTest2, abVariant2);
          }
        } catch { /* non-fatal */ }

        const emailId2 = await sendEmail(quote.customer_email, finalSubject2, template.html);

        if (abTest2 && abVariant2) {
          try {
            await recordSend(abTest2.id, quote.customer_email, abVariant2, emailId2);
          } catch { /* non-fatal */ }
        }
        await createContactNote(
          contactId,
          `${TAGS.FOLLOWUP_2} Sent for ${quote.quote_number} on ${new Date().toISOString()}${personalizedBody ? " [AI-personalized]" : ""}`,
        );
        totalSent++;
        results.push(`followup_2 → ${quote.customer_email} (${quote.quote_number})${personalizedBody ? " [AI]" : ""}`);
      } catch (err) {
        results.push(`followup_2 FAIL ${quote.quote_number}: ${err}`);
      }
    }

    // -----------------------------------------------------------------------
    // Expiration warning: Quotes expiring in 1–2 days
    // -----------------------------------------------------------------------
    const { data: expiringQuotes } = await supabase
      .from("quotes")
      .select("*")
      .eq("status", "pending")
      .gte("expires_at", daysFromNow(1))
      .lte("expires_at", daysFromNow(2));

    for (const quote of expiringQuotes ?? []) {
      if (totalSent >= MAX_PER_RUN) break;
      try {
        const { data: fresh } = await supabase
          .from("quotes")
          .select("status")
          .eq("id", quote.id)
          .single();
        if (fresh?.status !== "pending") continue;
        if (!(await isSubscribed(quote.customer_email))) continue;

        const contactId =
          quote.hubspot_contact_id ||
          (await findContactByEmail(quote.customer_email))?.id;
        if (!contactId) continue;

        if (await hasAutomationTag("contacts", contactId, TAGS.EXPIRING))
          continue;

        const daysLeft = Math.ceil(
          (new Date(quote.expires_at).getTime() - Date.now()) /
            (24 * 60 * 60 * 1000),
        );

        const personalizedBody = await tryPersonalize(quote, "expiring", daysLeft);

        const unsub = createUnsubscribeUrl(quote.customer_email);
        const acceptUrl = buildSignedUrl(`/quote/${quote.id}`, "quote", quote.id);
        const template = quoteExpiringEmail(
          quote.customer_name.split(" ")[0],
          quote.quote_number,
          daysLeft,
          acceptUrl,
          unsub,
          personalizedBody,
        );
        await sendEmail(quote.customer_email, template.subject, template.html);

        await createContactNote(
          contactId,
          `${TAGS.EXPIRING} Sent for ${quote.quote_number} (${daysLeft}d left) on ${new Date().toISOString()}${personalizedBody ? " [AI-personalized]" : ""}`,
        );
        totalSent++;
        results.push(`expiring → ${quote.customer_email} (${quote.quote_number}, ${daysLeft}d)${personalizedBody ? " [AI]" : ""}`);
      } catch (err) {
        results.push(`expiring FAIL ${quote.quote_number}: ${err}`);
      }
    }

    // -----------------------------------------------------------------------
    // Expired recovery: Quotes expired 1–3 days ago
    // -----------------------------------------------------------------------
    const { data: expiredQuotes } = await supabase
      .from("quotes")
      .select("*")
      .eq("status", "pending")
      .gte("expires_at", daysAgo(3))
      .lte("expires_at", daysAgo(0));

    for (const quote of expiredQuotes ?? []) {
      if (totalSent >= MAX_PER_RUN) break;
      try {
        // Only for actually expired quotes
        if (new Date(quote.expires_at) > new Date()) continue;
        if (!(await isSubscribed(quote.customer_email))) continue;

        const contactId =
          quote.hubspot_contact_id ||
          (await findContactByEmail(quote.customer_email))?.id;
        if (!contactId) continue;

        if (await hasAutomationTag("contacts", contactId, TAGS.EXPIRED_RECOVERY))
          continue;

        // Mark the quote as expired
        await supabase
          .from("quotes")
          .update({ status: "expired" })
          .eq("id", quote.id)
          .eq("status", "pending");

        const personalizedBody = await tryPersonalize(quote, "expired");

        const unsub = createUnsubscribeUrl(quote.customer_email);
        const newQuoteUrl = `${siteUrl}/quote`;
        const serviceName = SERVICE_NAMES[quote.service_key] || quote.service_key;
        const template = quoteExpiredRecoveryEmail(
          quote.customer_name.split(" ")[0],
          serviceName,
          newQuoteUrl,
          unsub,
          personalizedBody,
        );
        await sendEmail(quote.customer_email, template.subject, template.html);
        await createContactNote(
          contactId,
          `${TAGS.EXPIRED_RECOVERY} Sent for expired ${quote.quote_number} on ${new Date().toISOString()}${personalizedBody ? " [AI-personalized]" : ""}`,
        );
        totalSent++;
        results.push(`expired_recovery → ${quote.customer_email} (${quote.quote_number})${personalizedBody ? " [AI]" : ""}`);
      } catch (err) {
        results.push(`expired_recovery FAIL ${quote.quote_number}: ${err}`);
      }
    }

    return {
      processed: results.length,
      sent: results.filter((r) => !r.includes("FAIL")).length,
      errors: results.filter((r) => r.includes("FAIL")).length > 0
        ? results.filter((r) => r.includes("FAIL"))
        : undefined,
      results,
    };
  });
}
