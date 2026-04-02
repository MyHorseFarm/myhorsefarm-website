import { NextRequest, NextResponse } from "next/server";
import {
  searchContacts,
  hasAutomationTag,
  createContactNote,
  isSubscribed,
  normalizePhone,
} from "@/lib/hubspot";
import {
  sendEmail,
  createUnsubscribeUrl,
  springSpecialEmail,
} from "@/lib/emails";
import { sendSMS } from "@/lib/twilio";

export const runtime = "nodejs";
export const maxDuration = 300;

const DEDUP_TAG = "[CAMPAIGN:SPRING_2026]";

export async function POST(request: NextRequest) {
  // ---------------------------------------------------------------------------
  // Auth
  // ---------------------------------------------------------------------------
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.ADMIN_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // ---------------------------------------------------------------------------
  // Parse body
  // ---------------------------------------------------------------------------
  let type: "email" | "sms" | "both" = "both";
  let limit = 100;

  try {
    const body = await request.json();
    if (body.type && ["email", "sms", "both"].includes(body.type)) {
      type = body.type;
    }
    if (typeof body.limit === "number" && body.limit > 0) {
      limit = body.limit;
    }
  } catch {
    // No body or invalid JSON — use defaults
  }

  // ---------------------------------------------------------------------------
  // Fetch all contacts with email and phone
  // ---------------------------------------------------------------------------
  const contacts = await searchContacts(
    [
      {
        filters: [
          {
            propertyName: "email",
            operator: "HAS_PROPERTY",
          },
        ],
      },
    ],
    ["email", "firstname", "lastname", "phone"],
  );

  const results = {
    emailSent: 0,
    emailSkipped: 0,
    emailErrors: 0,
    smsSent: 0,
    smsSkipped: 0,
    smsErrors: 0,
    details: [] as string[],
  };

  let totalSends = 0;

  for (const contact of contacts) {
    if (totalSends >= limit) break;

    const contactId = contact.id;
    const email = contact.properties.email;
    const phone = contact.properties.phone;
    const firstname = contact.properties.firstname || "";

    // Check dedup tag once for this contact
    let alreadyTagged = false;
    try {
      alreadyTagged = await hasAutomationTag("contacts", contactId, DEDUP_TAG);
    } catch {
      // If note check fails, skip to be safe
      continue;
    }

    if (alreadyTagged) {
      if (type === "email" || type === "both") results.emailSkipped++;
      if (type === "sms" || type === "both") results.smsSkipped++;
      continue;
    }

    let didSendAnything = false;

    // ------- EMAIL -------
    if ((type === "email" || type === "both") && email && totalSends < limit) {
      try {
        const subscribed = await isSubscribed(email);
        if (!subscribed) {
          results.emailSkipped++;
        } else {
          const unsub = createUnsubscribeUrl(email);
          const template = springSpecialEmail(firstname, unsub);
          await sendEmail(email, template.subject, template.html);
          results.emailSent++;
          totalSends++;
          didSendAnything = true;
          results.details.push(`email -> ${email}`);
        }
      } catch (err) {
        results.emailErrors++;
        results.details.push(`FAIL email ${email}: ${err}`);
      }
    }

    // ------- SMS -------
    if ((type === "sms" || type === "both") && phone && totalSends < limit) {
      const normalized = normalizePhone(phone);
      // Only send to 561 area code numbers
      if (!normalized.startsWith("561")) {
        results.smsSkipped++;
      } else {
        try {
          const first = firstname || "there";
          const smsBody = `Hey ${first}, it's Jose from My Horse Farm! \ud83c\udf3f Spring special: 15% off all farm services through April 30. Manure removal, repairs, junk hauling & more. Book now: myhorsefarm.com/spring-special or reply to this text!`;
          await sendSMS(phone, smsBody);
          results.smsSent++;
          totalSends++;
          didSendAnything = true;
          results.details.push(`sms -> ${phone}`);
        } catch (err) {
          results.smsErrors++;
          results.details.push(`FAIL sms ${phone}: ${err}`);
        }
      }
    }

    // Write dedup note if we sent anything
    if (didSendAnything) {
      try {
        const channels: string[] = [];
        if (results.details.some((d) => d === `email -> ${email}`)) channels.push("email");
        if (results.details.some((d) => d === `sms -> ${phone}`)) channels.push("sms");
        await createContactNote(
          contactId,
          `${DEDUP_TAG} Spring 2026 campaign sent (${channels.join(", ")}) on ${new Date().toISOString()}`,
        );
      } catch {
        // Non-fatal — dedup note failed but message was sent
      }
    }
  }

  return NextResponse.json({
    campaign: "spring_2026",
    type,
    limit,
    email: {
      sent: results.emailSent,
      skipped: results.emailSkipped,
      errors: results.emailErrors,
    },
    sms: {
      sent: results.smsSent,
      skipped: results.smsSkipped,
      errors: results.smsErrors,
    },
    totalSends,
    details: results.details,
  });
}
