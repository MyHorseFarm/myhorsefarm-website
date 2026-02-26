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

export const runtime = "nodejs";
export const maxDuration = 300;

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const year = new Date().getFullYear();
  const TAG = `[AUTO:PRESEASON_${year}]`;
  const results: string[] = [];

  try {
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

    for (const contact of contacts) {
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
      } catch (err) {
        results.push(`pre-season FAIL ${email}: ${err}`);
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
