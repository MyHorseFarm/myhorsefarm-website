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
  chatRecoveryEmail,
} from "@/lib/emails";
import { withCronMonitor } from "@/lib/cron-monitor";

export const runtime = "nodejs";
export const maxDuration = 300;

const TAG = "[AUTO:CHAT_RECOVERY]";

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

/**
 * Find chat sessions where the customer provided their email during conversation
 * but never completed a quote. Send them a recovery email.
 *
 * Targets sessions from 1-3 days ago that have no linked quote_id.
 */
export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return withCronMonitor("chat-recovery", async () => {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.myhorsefarm.com";
  const results: string[] = [];

    const threeDaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString();
    const oneDayAgo = new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString();

    // Get chat sessions from 1-3 days ago that have no quote linked
    const { data: sessions } = await supabase
      .from("chat_sessions")
      .select("*")
      .is("quote_id", null)
      .gte("created_at", threeDaysAgo)
      .lte("created_at", oneDayAgo)
      .in("status", ["active", "handed_off"]);

    for (const session of sessions ?? []) {
      try {
        // Extract email from the conversation messages
        const email = extractEmailFromMessages(session.messages || []);
        if (!email) continue;

        // Extract name and service for personalization
        const name = extractNameFromMessages(session.messages || []) || "there";
        const serviceKey = session.extracted_service;
        const serviceName = serviceKey
          ? SERVICE_NAMES[serviceKey] || serviceKey.replace(/_/g, " ")
          : "farm services";

        if (!(await isSubscribed(email))) continue;

        const contactId = (await findContactByEmail(email))?.id;
        if (!contactId) continue;

        if (await hasAutomationTag("contacts", contactId, TAG)) continue;

        const unsub = createUnsubscribeUrl(email);
        const quoteUrl = serviceKey
          ? `${siteUrl}/quote?service=${serviceKey}`
          : `${siteUrl}/quote`;

        const template = chatRecoveryEmail(
          name.split(" ")[0],
          serviceName,
          quoteUrl,
          unsub,
        );
        await sendEmail(email, template.subject, template.html);

        await createContactNote(
          contactId,
          `${TAG} Sent chat recovery email for session ${session.id} on ${new Date().toISOString()}`,
        );

        results.push(`recovery → ${email} (session ${session.id.slice(0, 8)})`);
      } catch (err) {
        results.push(`FAIL session ${session.id.slice(0, 8)}: ${err}`);
      }
    }

    return {
      processed: results.length,
      sent: results.filter((r) => r.startsWith("recovery →")).length,
      errors: results.filter((r) => r.includes("FAIL")).length > 0
        ? results.filter((r) => r.includes("FAIL"))
        : undefined,
      results,
    };
  });
}

/**
 * Scan chat messages for an email address the user provided.
 */
function extractEmailFromMessages(
  messages: { role: string; content: string }[],
): string | null {
  const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
  // Look through user messages for an email
  for (const msg of messages) {
    if (msg.role !== "user") continue;
    const match = msg.content.match(emailRegex);
    if (match) return match[0].toLowerCase();
  }
  return null;
}

/**
 * Try to extract a name from the conversation (user responses after "what's your name").
 */
function extractNameFromMessages(
  messages: { role: string; content: string }[],
): string | null {
  for (let i = 0; i < messages.length - 1; i++) {
    const msg = messages[i];
    if (
      msg.role === "assistant" &&
      /name/i.test(msg.content) &&
      messages[i + 1]?.role === "user"
    ) {
      const response = messages[i + 1].content.trim();
      // Basic check: 1-3 words, no special chars that suggest it's not a name
      if (response.length < 50 && /^[A-Za-z\s'-]+$/.test(response)) {
        return response;
      }
    }
  }
  return null;
}
