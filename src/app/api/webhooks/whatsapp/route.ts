import { NextRequest, NextResponse } from "next/server";
import {
  findContactByPhone,
  createContact,
  createDeal,
  createContactNote,
  findActiveDealForContact,
  STAGE_NEW_LEAD,
} from "@/lib/hubspot";
import { sendEmail } from "@/lib/emails";
import { sendWhatsAppMessage } from "@/lib/whatsapp";

export const runtime = "nodejs";

// ---------------------------------------------------------------------------
// Meta WhatsApp webhook payload types
// ---------------------------------------------------------------------------

interface WhatsAppTextMessage {
  from: string;
  id: string;
  timestamp: string;
  type: "text";
  text: { body: string };
}

interface WhatsAppImageMessage {
  from: string;
  id: string;
  timestamp: string;
  type: "image";
  image: { id: string; mime_type: string; caption?: string };
}

interface WhatsAppButtonMessage {
  from: string;
  id: string;
  timestamp: string;
  type: "button";
  button: { text: string; payload: string };
}

type WhatsAppMessage =
  | WhatsAppTextMessage
  | WhatsAppImageMessage
  | WhatsAppButtonMessage
  | { from: string; id: string; timestamp: string; type: string };

interface WhatsAppContact {
  profile: { name: string };
  wa_id: string;
}

interface WhatsAppMetadata {
  display_phone_number: string;
  phone_number_id: string;
}

interface WhatsAppValue {
  messaging_product: "whatsapp";
  metadata: WhatsAppMetadata;
  contacts?: WhatsAppContact[];
  messages?: WhatsAppMessage[];
  statuses?: Array<{
    id: string;
    status: string;
    timestamp: string;
    recipient_id: string;
  }>;
}

interface WhatsAppChange {
  value: WhatsAppValue;
  field: string;
}

interface WhatsAppEntry {
  id: string;
  changes: WhatsAppChange[];
}

interface WhatsAppWebhookPayload {
  object: string;
  entry: WhatsAppEntry[];
}

// ---------------------------------------------------------------------------
// Interest keyword detection (matches Twilio handler)
// ---------------------------------------------------------------------------

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

// ---------------------------------------------------------------------------
// GET — Meta webhook verification
// ---------------------------------------------------------------------------

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const mode = searchParams.get("hub.mode");
  const token = searchParams.get("hub.verify_token");
  const challenge = searchParams.get("hub.challenge");

  if (
    mode === "subscribe" &&
    token === process.env.WHATSAPP_VERIFY_TOKEN
  ) {
    console.info("WhatsApp webhook verified");
    return new NextResponse(challenge, { status: 200 });
  }

  return NextResponse.json({ error: "Forbidden" }, { status: 403 });
}

// ---------------------------------------------------------------------------
// POST — Incoming messages
// ---------------------------------------------------------------------------

export async function POST(request: NextRequest) {
  // Meta requires 200 OK within 20 seconds — always return 200
  try {
    const payload = (await request.json()) as WhatsAppWebhookPayload;

    // Only process whatsapp_business_account events
    if (payload.object !== "whatsapp_business_account") {
      return NextResponse.json({ status: "ignored" }, { status: 200 });
    }

    for (const entry of payload.entry) {
      for (const change of entry.changes) {
        if (change.field !== "messages") continue;

        const value = change.value;
        const messages = value.messages ?? [];
        const contacts = value.contacts ?? [];

        for (const message of messages) {
          await handleInboundMessage(message, contacts);
        }
      }
    }
  } catch (err) {
    // Log but still return 200 — Meta will retry on non-200
    console.error("WhatsApp webhook processing error:", err);
  }

  return NextResponse.json({ status: "ok" }, { status: 200 });
}

// ---------------------------------------------------------------------------
// Message handler
// ---------------------------------------------------------------------------

async function handleInboundMessage(
  message: WhatsAppMessage,
  contacts: WhatsAppContact[],
) {
  // Extract text content based on message type
  let textBody: string;
  if (message.type === "text" && "text" in message) {
    textBody = (message as WhatsAppTextMessage).text.body.trim();
  } else if (message.type === "button" && "button" in message) {
    textBody = (message as WhatsAppButtonMessage).button.text.trim();
  } else {
    // For images, stickers, audio, etc. — treat as non-interest
    textBody = `[${message.type} message]`;
  }

  const senderPhone = message.from; // E.164 without +, e.g. "15615767667"
  const senderName =
    contacts.find((c) => c.wa_id === senderPhone)?.profile.name ?? "WhatsApp Lead";
  const now = new Date().toISOString();
  const interested = isInterestMessage(textBody);

  // Format phone for display: "+15615767667"
  const displayPhone = `+${senderPhone}`;

  // -------------------------------------------------------------------------
  // HubSpot operations (non-fatal)
  // -------------------------------------------------------------------------
  try {
    // Find or create HubSpot contact by phone
    let contact = await findContactByPhone(displayPhone);

    if (!contact) {
      // Parse first/last name from WhatsApp profile name
      const nameParts = senderName.split(" ");
      const firstName = nameParts[0] || "WhatsApp";
      const lastName = nameParts.slice(1).join(" ") || "Lead";

      contact = await createContact(
        "", // no email yet
        firstName,
        lastName,
        displayPhone,
      );
    }

    // Always log the inbound message as a note
    await createContactNote(
      contact.id,
      `[WHATSAPP:INBOUND] "${textBody}" received on ${now} from ${displayPhone} (${senderName})`,
    );

    if (interested) {
      // Check for existing active deal — don't create duplicates
      const existingDeal = await findActiveDealForContact(contact.id);

      if (!existingDeal) {
        await createDeal(
          contact.id,
          `WhatsApp Lead — ${senderName} (${displayPhone})`,
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
          `New WhatsApp Lead: ${senderName} (${displayPhone})`,
          `<p>New inbound WhatsApp lead from <strong>${senderName}</strong> (${displayPhone}):</p>
<blockquote>${escapeHtml(textBody)}</blockquote>
<p>Received at ${now}</p>
<p>A HubSpot deal has been ${existingDeal ? "found (already active)" : "created"} in the New Lead stage.</p>`,
        );
      } catch (emailErr) {
        console.error("Failed to send WhatsApp lead notification email:", emailErr);
      }

      // Auto-reply with offers link
      try {
        await sendWhatsAppMessage(
          senderPhone,
          "Thanks for reaching out! Jose from My Horse Farm will call you shortly. In the meantime, check out our current offers at myhorsefarm.com/offers",
        );
      } catch (replyErr) {
        console.error("Failed to send WhatsApp auto-reply:", replyErr);
      }
    } else {
      // Non-interest message — send generic auto-reply
      try {
        await sendWhatsAppMessage(
          senderPhone,
          "Hi! Thanks for messaging My Horse Farm. For a free quote visit myhorsefarm.com/offers or call (561) 576-7667",
        );
      } catch (replyErr) {
        console.error("Failed to send WhatsApp auto-reply:", replyErr);
      }
    }
  } catch (hubspotErr) {
    // HubSpot/email failures are non-fatal — log and continue
    console.error("WhatsApp webhook HubSpot/email error:", hubspotErr);

    // Still try to send auto-reply even if HubSpot failed
    try {
      const replyText = interested
        ? "Thanks for reaching out! Jose from My Horse Farm will call you shortly. In the meantime, check out our current offers at myhorsefarm.com/offers"
        : "Hi! Thanks for messaging My Horse Farm. For a free quote visit myhorsefarm.com/offers or call (561) 576-7667";
      await sendWhatsAppMessage(senderPhone, replyText);
    } catch (replyErr) {
      console.error("Failed to send WhatsApp fallback auto-reply:", replyErr);
    }
  }
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;");
}
