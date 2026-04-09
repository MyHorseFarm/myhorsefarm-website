import { NextRequest, NextResponse } from "next/server";
import { createHmac, timingSafeEqual } from "crypto";
import { supabase } from "@/lib/supabase";
import {
  findContactByPhone,
  createContact,
  createDeal,
  createContactNote,
  findActiveDealForContact,
  STAGE_NEW_LEAD,
} from "@/lib/hubspot";
import { sendEmail } from "@/lib/emails";

export const runtime = "nodejs";

// Keywords that signal a potential lead
const INTEREST_KEYWORDS = [
  "yes",
  "interested",
  "quote",
  "how much",
  "price",
  "call me",
  "info",
  "schedule",
  "estimate",
  "appointment",
  "available",
  "cost",
  "book",
  "help",
];

function isInterestMessage(text: string): boolean {
  const lower = text.toLowerCase();
  return INTEREST_KEYWORDS.some((kw) => lower.includes(kw));
}

function isOptOutCommand(body: string): boolean {
  return ["STOP", "UNSUBSCRIBE", "QUIT"].includes(body);
}

function isOptInCommand(body: string): boolean {
  return ["START", "SUBSCRIBE"].includes(body);
}

function twimlResponse(message?: string): NextResponse {
  const body = message
    ? `<?xml version="1.0" encoding="UTF-8"?><Response><Message>${message}</Message></Response>`
    : '<?xml version="1.0" encoding="UTF-8"?><Response></Response>';
  return new NextResponse(body, {
    headers: { "Content-Type": "text/xml" },
  });
}

/**
 * Twilio webhook for inbound SMS.
 * - Validates Twilio request signature
 * - Handles STOP/START opt-out/opt-in keywords
 * - Detects interest keywords and auto-creates HubSpot deals
 * - Logs all inbound messages as HubSpot notes
 */
export async function POST(request: NextRequest) {
  try {
    // -----------------------------------------------------------------------
    // Twilio signature verification
    // -----------------------------------------------------------------------
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    if (!authToken) {
      return NextResponse.json({ error: "Twilio auth token not configured" }, { status: 401 });
    }

    const twilioSignature = request.headers.get("x-twilio-signature");
    if (!twilioSignature) {
      return NextResponse.json({ error: "Missing Twilio signature" }, { status: 401 });
    }

    const formData = await request.formData();

    // Build the validation URL from the request
    const validationUrl = request.url;

    // Sort form params alphabetically and append key+value to URL
    const params: Record<string, string> = {};
    formData.forEach((value, key) => {
      params[key] = value as string;
    });

    const sortedKeys = Object.keys(params).sort();
    let dataString = validationUrl;
    for (const key of sortedKeys) {
      dataString += key + params[key];
    }

    // Compute HMAC-SHA1 and base64-encode
    const computedSignature = createHmac("sha1", authToken)
      .update(dataString)
      .digest("base64");

    try {
      const valid = timingSafeEqual(
        Buffer.from(computedSignature),
        Buffer.from(twilioSignature)
      );
      if (!valid) {
        return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
      }
    } catch {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    // -----------------------------------------------------------------------
    // Business logic (unchanged)
    // -----------------------------------------------------------------------
    const from = params["From"] || "";
    const rawBody = (params["Body"] || "").trim();
    const upperBody = rawBody.toUpperCase();

    if (!from) {
      return twimlResponse();
    }

    // Normalize phone to match DB format
    const digits = from.replace(/\D/g, "");
    const phoneVariants = [from, digits, `+${digits}`];
    if (digits.length === 11 && digits.startsWith("1")) {
      const local = digits.slice(1);
      phoneVariants.push(
        local,
        `(${local.slice(0, 3)}) ${local.slice(3, 6)}-${local.slice(6)}`,
      );
    }

    // -----------------------------------------------------------------------
    // Handle STOP / START opt-out/opt-in
    // -----------------------------------------------------------------------
    if (isOptOutCommand(upperBody)) {
      for (const phone of phoneVariants) {
        await supabase
          .from("recurring_customers")
          .update({ sms_opted_in: false })
          .ilike("phone", `%${phone.slice(-10)}%`);
      }
      return twimlResponse();
    }

    if (isOptInCommand(upperBody)) {
      for (const phone of phoneVariants) {
        await supabase
          .from("recurring_customers")
          .update({ sms_opted_in: true })
          .ilike("phone", `%${phone.slice(-10)}%`);
      }
      return twimlResponse();
    }

    // -----------------------------------------------------------------------
    // Inbound message handling — run HubSpot/email ops non-fatally
    // -----------------------------------------------------------------------
    const interested = isInterestMessage(rawBody);
    const now = new Date().toISOString();

    try {
      // Find or create HubSpot contact by phone
      let contact = await findContactByPhone(from);

      if (!contact) {
        // Create a minimal contact with the phone number
        contact = await createContact(
          "", // no email yet
          "SMS Lead",
          from,
          from,
        );
      }

      // Always log the inbound message as a note
      await createContactNote(
        contact.id,
        `[SMS:INBOUND] "${rawBody}" received on ${now} from ${from}`,
      );

      if (interested) {
        // Check if there's already an active deal — don't create duplicates
        const existingDeal = await findActiveDealForContact(contact.id);

        if (!existingDeal) {
          await createDeal(
            contact.id,
            `SMS Lead — ${from}`,
            "0",
            STAGE_NEW_LEAD,
          );
        }

        // Notify Jose via email (non-fatal)
        try {
          const joseEmail =
            process.env.EMAIL_BCC_ADDRESS || "jose@myhorsefarm.com";
          await sendEmail(
            joseEmail,
            `New SMS Lead: ${from}`,
            `<p>New inbound SMS lead from <strong>${from}</strong>:</p>
<blockquote>${rawBody}</blockquote>
<p>Received at ${now}</p>
<p>A HubSpot deal has been ${existingDeal ? "found (already active)" : "created"} in the New Lead stage.</p>`,
          );
        } catch (emailErr) {
          console.error("Failed to send SMS lead notification email:", emailErr);
        }

        // Auto-reply via TwiML
        return twimlResponse(
          "Thanks for reaching out! Jose from My Horse Farm will call you shortly. In the meantime, check out our current offers at myhorsefarm.com/offers",
        );
      }
    } catch (hubspotErr) {
      // HubSpot/email failures are non-fatal — log and continue
      console.error("Twilio webhook HubSpot/email error:", hubspotErr);
    }

    // Non-interest message or HubSpot failed — return empty TwiML
    return twimlResponse();
  } catch (err) {
    console.error("Twilio webhook error:", err);
    return twimlResponse();
  }
}
