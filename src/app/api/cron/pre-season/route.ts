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
  preSeasonEmail,
} from "@/lib/emails";
import { withCronMonitor } from "@/lib/cron-monitor";

export const runtime = "nodejs";
export const maxDuration = 300;

/** Maximum emails to send per run. Runs daily Oct 1-7 with yearly tag dedup. */
const SEND_LIMIT = 100;

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return withCronMonitor("pre-season", async () => {
  const year = new Date().getFullYear();
  const TAG = `[AUTO:PRESEASON_${year}]`;
  const results: string[] = [];

    // Get all contacts with a phone number containing "561" (Wellington/PBC area)
    // This mirrors the "Wellington / PBC Area 561" list (ILS ID 22)
    const contacts = await searchContacts(
      [
        {
          filters: [
            {
              propertyName: "phone",
              operator: "CONTAINS_TOKEN",
              value: "561",
            },
          ],
        },
      ],
      ["email", "firstname", "phone"],
    );

    let sent = 0;
    for (const contact of contacts) {
      if (sent >= SEND_LIMIT) {
        results.push(`Hit send limit of ${SEND_LIMIT}, stopping`);
        break;
      }

      const email = contact.properties.email;
      if (!email) continue;

      try {
        if (!(await isSubscribed(email))) continue;
        if (await hasAutomationTag("contacts", contact.id, TAG)) continue;

        const unsub = createUnsubscribeUrl(email);
        const template = preSeasonEmail(
          contact.properties.firstname || "",
          unsub,
        );
        await sendEmail(email, template.subject, template.html);
        await createContactNote(
          contact.id,
          `${TAG} Sent to ${email} on ${new Date().toISOString()}`,
        );
        results.push(`pre-season → ${email}`);
        sent++;
      } catch (err) {
        results.push(`pre-season FAIL ${email}: ${err}`);
      }
    }

    return {
      processed: results.length,
      sent: results.filter((r) => r.startsWith("pre-season →")).length,
      errors: results.filter((r) => r.includes("FAIL")).length > 0
        ? results.filter((r) => r.includes("FAIL"))
        : undefined,
      results,
    };
  });
}
