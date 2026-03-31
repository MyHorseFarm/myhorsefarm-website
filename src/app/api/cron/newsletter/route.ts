import { NextRequest, NextResponse } from "next/server";
import {
  searchContacts,
  hasAutomationTag,
  createContactNote,
  isSubscribed,
} from "@/lib/hubspot";
import {
  sendEmail,
  createUnsubscribeUrl,
  monthlyNewsletterEmail,
} from "@/lib/emails";

export const runtime = "nodejs";
export const maxDuration = 300;

/** Maximum emails per run (Resend free tier limit). */
const SEND_LIMIT = 80;

/** Maximum contacts to scan per run to stay within Vercel timeout. */
const SCAN_LIMIT = 200;

function getMonthlyTag(date: Date): string {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  return `[AUTO:NEWSLETTER_${yyyy}-${mm}]`;
}

export async function GET(request: NextRequest) {
  // Verify cron secret
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const now = new Date();
  const tag = getMonthlyTag(now);
  const month = now.getMonth(); // 0-indexed
  const year = now.getFullYear();

  const results: string[] = [];
  let sent = 0;
  let skipped = 0;
  let errors = 0;

  try {
    // -----------------------------------------------------------------------
    // Fetch all contacts with an email address (paginated via searchContacts)
    // -----------------------------------------------------------------------
    const allContacts = await searchContacts(
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
      ["email", "firstname", "lastname"],
    );

    results.push(`Found ${allContacts.length} contacts with email`);

    let scanned = 0;
    for (const contact of allContacts) {
      if (sent >= SEND_LIMIT) {
        results.push(`Hit send limit of ${SEND_LIMIT}, stopping`);
        break;
      }
      if (scanned >= SCAN_LIMIT) {
        results.push(`Hit scan limit of ${SCAN_LIMIT}, stopping`);
        break;
      }
      scanned++;

      const email = contact.properties.email;
      if (!email) {
        skipped++;
        continue;
      }

      try {
        // Check subscription status
        const subscribed = await isSubscribed(email);
        if (!subscribed) {
          skipped++;
          continue;
        }

        // Check if already sent this month
        const alreadySent = await hasAutomationTag("contacts", contact.id, tag);
        if (alreadySent) {
          skipped++;
          continue;
        }

        // Generate and send newsletter
        const firstname = contact.properties.firstname || "";
        const unsubscribeUrl = createUnsubscribeUrl(email);
        const { subject, html } = monthlyNewsletterEmail(
          firstname,
          month,
          year,
          unsubscribeUrl,
        );

        await sendEmail(email, subject, html);

        // Tag the contact so we don't double-send
        await createContactNote(
          contact.id,
          `${tag} Monthly newsletter sent on ${now.toISOString()}`,
        );

        sent++;
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        results.push(`Error for ${email}: ${msg}`);
        errors++;
      }
    }

    results.push(
      `Newsletter complete: ${sent} sent, ${skipped} skipped, ${errors} errors`,
    );

    return NextResponse.json({ ok: true, tag, sent, skipped, errors, results });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("Newsletter cron failed:", msg);
    return NextResponse.json(
      { error: msg, results },
      { status: 500 },
    );
  }
}
