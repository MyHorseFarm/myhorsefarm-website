import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export const runtime = "nodejs";

/**
 * Twilio webhook for inbound SMS.
 * Handles STOP/START opt-out/opt-in keywords.
 * Twilio handles STOP automatically but we track it in our DB too.
 */
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const from = formData.get("From") as string;
    const body = (formData.get("Body") as string || "").trim().toUpperCase();

    if (!from) {
      return new NextResponse(
        '<?xml version="1.0" encoding="UTF-8"?><Response></Response>',
        { headers: { "Content-Type": "text/xml" } },
      );
    }

    // Normalize phone to match DB format
    const digits = from.replace(/\D/g, "");
    const phoneVariants = [from, digits, `+${digits}`];
    if (digits.length === 11 && digits.startsWith("1")) {
      const local = digits.slice(1);
      phoneVariants.push(local, `(${local.slice(0, 3)}) ${local.slice(3, 6)}-${local.slice(6)}`);
    }

    if (body === "STOP" || body === "UNSUBSCRIBE" || body === "QUIT") {
      // Opt out: set sms_opted_in = false
      for (const phone of phoneVariants) {
        await supabase
          .from("recurring_customers")
          .update({ sms_opted_in: false })
          .ilike("phone", `%${phone.slice(-10)}%`);
      }
    } else if (body === "START" || body === "SUBSCRIBE") {
      // Opt back in
      for (const phone of phoneVariants) {
        await supabase
          .from("recurring_customers")
          .update({ sms_opted_in: true })
          .ilike("phone", `%${phone.slice(-10)}%`);
      }
    }

    // Return empty TwiML response
    return new NextResponse(
      '<?xml version="1.0" encoding="UTF-8"?><Response></Response>',
      { headers: { "Content-Type": "text/xml" } },
    );
  } catch (err) {
    console.error("Twilio webhook error:", err);
    return new NextResponse(
      '<?xml version="1.0" encoding="UTF-8"?><Response></Response>',
      { headers: { "Content-Type": "text/xml" } },
    );
  }
}
