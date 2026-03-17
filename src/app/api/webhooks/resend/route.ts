import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export const runtime = "nodejs";

/**
 * POST /api/webhooks/resend
 * Receives email.opened and email.clicked webhooks from Resend.
 * Updates email_ab_sends tracking table for A/B test analytics.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, data } = body as {
      type: string;
      data?: { email_id?: string };
    };

    if (!data?.email_id) {
      return NextResponse.json({ ok: true, skipped: "no email_id" });
    }

    const emailId = data.email_id;
    const now = new Date().toISOString();

    if (type === "email.opened") {
      await supabase
        .from("email_ab_sends")
        .update({ opened: true, opened_at: now })
        .eq("resend_email_id", emailId)
        .eq("opened", false);
    } else if (type === "email.clicked") {
      await supabase
        .from("email_ab_sends")
        .update({ clicked: true, clicked_at: now })
        .eq("resend_email_id", emailId)
        .eq("clicked", false);
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
