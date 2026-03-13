import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import {
  hasAutomationTag,
  createContactNote,
  isSubscribed,
  findContactByEmail,
} from "@/lib/hubspot";
import {
  sendEmail,
  createUnsubscribeUrl,
  quoteFollowup1Email,
  quoteFollowup2Email,
  quoteExpiringEmail,
} from "@/lib/emails";

export const runtime = "nodejs";
export const maxDuration = 300;

const TAGS = {
  FOLLOWUP_1: "[AUTO:QUOTE_FOLLOWUP_1]",
  FOLLOWUP_2: "[AUTO:QUOTE_FOLLOWUP_2]",
  EXPIRING: "[AUTO:QUOTE_EXPIRING]",
};

function daysAgo(days: number): string {
  return new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();
}

function daysFromNow(days: number): string {
  return new Date(Date.now() + days * 24 * 60 * 60 * 1000).toISOString();
}

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://www.myhorsefarm.com";
  const results: string[] = [];

  try {
    // -----------------------------------------------------------------------
    // Followup 1: Quotes created 2–4 days ago, still pending
    // -----------------------------------------------------------------------
    const { data: followup1Quotes } = await supabase
      .from("quotes")
      .select("*")
      .eq("status", "pending")
      .gte("created_at", daysAgo(4))
      .lte("created_at", daysAgo(2));

    for (const quote of followup1Quotes ?? []) {
      try {
        // Re-check status
        const { data: fresh } = await supabase
          .from("quotes")
          .select("status")
          .eq("id", quote.id)
          .single();
        if (fresh?.status !== "pending") continue;

        // Check expiry
        if (new Date(quote.expires_at) < new Date()) continue;

        // Check subscription
        if (!(await isSubscribed(quote.customer_email))) continue;

        // Resolve HubSpot contact
        const contactId =
          quote.hubspot_contact_id ||
          (await findContactByEmail(quote.customer_email))?.id;
        if (!contactId) {
          results.push(`followup_1 SKIP ${quote.quote_number}: no HS contact`);
          continue;
        }

        // Dedup
        if (await hasAutomationTag("contacts", contactId, TAGS.FOLLOWUP_1))
          continue;

        const unsub = createUnsubscribeUrl(quote.customer_email);
        const acceptUrl = `${siteUrl}/quote/${quote.id}`;
        const template = quoteFollowup1Email(
          quote.customer_name.split(" ")[0],
          quote.quote_number,
          acceptUrl,
          unsub,
        );
        await sendEmail(quote.customer_email, template.subject, template.html);
        await createContactNote(
          contactId,
          `${TAGS.FOLLOWUP_1} Sent for ${quote.quote_number} on ${new Date().toISOString()}`,
        );
        results.push(`followup_1 → ${quote.customer_email} (${quote.quote_number})`);
      } catch (err) {
        results.push(`followup_1 FAIL ${quote.quote_number}: ${err}`);
      }
    }

    // -----------------------------------------------------------------------
    // Followup 2: Quotes created 5–8 days ago, still pending, has followup 1
    // -----------------------------------------------------------------------
    const { data: followup2Quotes } = await supabase
      .from("quotes")
      .select("*")
      .eq("status", "pending")
      .gte("created_at", daysAgo(8))
      .lte("created_at", daysAgo(5));

    for (const quote of followup2Quotes ?? []) {
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

        // Requires followup 1, no followup 2
        if (!(await hasAutomationTag("contacts", contactId, TAGS.FOLLOWUP_1)))
          continue;
        if (await hasAutomationTag("contacts", contactId, TAGS.FOLLOWUP_2))
          continue;

        const unsub = createUnsubscribeUrl(quote.customer_email);
        const acceptUrl = `${siteUrl}/quote/${quote.id}`;
        const template = quoteFollowup2Email(
          quote.customer_name.split(" ")[0],
          quote.quote_number,
          acceptUrl,
          unsub,
        );
        await sendEmail(quote.customer_email, template.subject, template.html);
        await createContactNote(
          contactId,
          `${TAGS.FOLLOWUP_2} Sent for ${quote.quote_number} on ${new Date().toISOString()}`,
        );
        results.push(`followup_2 → ${quote.customer_email} (${quote.quote_number})`);
      } catch (err) {
        results.push(`followup_2 FAIL ${quote.quote_number}: ${err}`);
      }
    }

    // -----------------------------------------------------------------------
    // Expiration warning: Quotes expiring in 4–6 days, still pending
    // -----------------------------------------------------------------------
    const { data: expiringQuotes } = await supabase
      .from("quotes")
      .select("*")
      .eq("status", "pending")
      .gte("expires_at", daysFromNow(4))
      .lte("expires_at", daysFromNow(6));

    for (const quote of expiringQuotes ?? []) {
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

        const unsub = createUnsubscribeUrl(quote.customer_email);
        const acceptUrl = `${siteUrl}/quote/${quote.id}`;
        const template = quoteExpiringEmail(
          quote.customer_name.split(" ")[0],
          quote.quote_number,
          daysLeft,
          acceptUrl,
          unsub,
        );
        await sendEmail(quote.customer_email, template.subject, template.html);
        await createContactNote(
          contactId,
          `${TAGS.EXPIRING} Sent for ${quote.quote_number} (${daysLeft}d left) on ${new Date().toISOString()}`,
        );
        results.push(`expiring → ${quote.customer_email} (${quote.quote_number}, ${daysLeft}d)`);
      } catch (err) {
        results.push(`expiring FAIL ${quote.quote_number}: ${err}`);
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
