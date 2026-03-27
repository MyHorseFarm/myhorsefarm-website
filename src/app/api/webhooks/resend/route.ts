import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { findContactByEmail, createContactNote } from "@/lib/hubspot";

export const runtime = "nodejs";

/**
 * POST /api/webhooks/resend
 * Receives email events from Resend:
 *   - email.sent, email.delivered, email.opened, email.clicked
 *   - email.bounced, email.complained
 *
 * 1. Updates email_ab_sends for A/B test analytics (existing)
 * 2. Logs all events to email_events table for daily digest
 * 3. Tags HubSpot contacts on meaningful engagement (open, click)
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, data, created_at } = body as {
      type: string;
      created_at?: string;
      data?: {
        email_id?: string;
        from?: string;
        to?: string | string[];
        subject?: string;
        click?: { link?: string };
      };
    };

    if (!data?.email_id) {
      return NextResponse.json({ ok: true, skipped: "no email_id" });
    }

    const emailId = data.email_id;
    const now = new Date().toISOString();
    const recipientEmail =
      typeof data.to === "string"
        ? data.to
        : Array.isArray(data.to)
          ? data.to[0]
          : null;

    // -----------------------------------------------------------------------
    // 1. Update A/B test tracking (existing logic)
    // -----------------------------------------------------------------------
    if (type === "email.opened") {
      await supabase
        .from("email_ab_sends")
        .update({ opened: true, opened_at: now })
        .eq("resend_email_id", emailId)
        .eq("opened", false)
        .then(() => {});
    } else if (type === "email.clicked") {
      await supabase
        .from("email_ab_sends")
        .update({ clicked: true, clicked_at: now })
        .eq("resend_email_id", emailId)
        .eq("clicked", false)
        .then(() => {});
    }

    // -----------------------------------------------------------------------
    // 2. Log event to email_events table for daily digest
    // -----------------------------------------------------------------------
    try {
      await supabase.from("email_events").insert({
        resend_email_id: emailId,
        event_type: type.replace("email.", ""),
        recipient_email: recipientEmail?.toLowerCase() || null,
        subject: data.subject || null,
        click_url: data.click?.link || null,
        event_at: created_at || now,
      });
    } catch {
      // Table may not exist yet — non-fatal
    }

    // -----------------------------------------------------------------------
    // 3. Tag HubSpot contact on engagement (open/click)
    // -----------------------------------------------------------------------
    if (recipientEmail && (type === "email.opened" || type === "email.clicked")) {
      try {
        const contact = await findContactByEmail(recipientEmail);
        if (contact) {
          const action = type === "email.opened" ? "opened" : "clicked";
          const subject = data.subject ? ` "${data.subject}"` : "";
          const link = data.click?.link ? ` → ${data.click.link}` : "";
          await createContactNote(
            contact.id,
            `[EMAIL:${action.toUpperCase()}] Contact ${action} email${subject}${link} on ${now}`,
          );
        }
      } catch {
        // HubSpot tagging is non-fatal
      }
    }

    return NextResponse.json({ ok: true, type });
  } catch (err) {
    console.error("Resend webhook error:", err);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 },
    );
  }
}
