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
  welcomeEmail1,
  welcomeEmail2,
  welcomeEmail3,
} from "@/lib/emails";

export const runtime = "nodejs";
export const maxDuration = 300;

const TAGS = {
  WELCOME_1: "[AUTO:WELCOME_1]",
  WELCOME_2: "[AUTO:WELCOME_2]",
  WELCOME_3: "[AUTO:WELCOME_3]",
};

export async function GET(request: NextRequest) {
  // Verify cron secret
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const results: string[] = [];

  try {
    // -----------------------------------------------------------------------
    // Email 1: Contacts created in the last 24 hours, no WELCOME_1 tag
    // -----------------------------------------------------------------------
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

    const newContacts = await searchContacts(
      [
        {
          filters: [
            {
              propertyName: "createdate",
              operator: "GTE",
              value: oneDayAgo,
            },
          ],
        },
      ],
      ["email", "firstname", "createdate"],
    );

    for (const contact of newContacts) {
      const email = contact.properties.email;
      if (!email) continue;

      try {
        if (!(await isSubscribed(email))) continue;
        if (await hasAutomationTag("contacts", contact.id, TAGS.WELCOME_1))
          continue;

        const unsub = createUnsubscribeUrl(email);
        const template = welcomeEmail1(
          contact.properties.firstname || "",
          unsub,
        );
        await sendEmail(email, template.subject, template.html);
        await createContactNote(
          contact.id,
          `${TAGS.WELCOME_1} Sent to ${email} on ${new Date().toISOString()}`,
        );
        results.push(`welcome_1 → ${email}`);
      } catch (err) {
        results.push(`welcome_1 FAIL ${email}: ${err}`);
      }
    }

    // -----------------------------------------------------------------------
    // Email 2: Contacts created 3–10 days ago with WELCOME_1 but no WELCOME_2
    // -----------------------------------------------------------------------
    const threeDaysAgo = new Date(
      Date.now() - 3 * 24 * 60 * 60 * 1000,
    ).toISOString();
    const tenDaysAgo = new Date(
      Date.now() - 10 * 24 * 60 * 60 * 1000,
    ).toISOString();

    const midContacts = await searchContacts(
      [
        {
          filters: [
            {
              propertyName: "createdate",
              operator: "LTE",
              value: threeDaysAgo,
            },
            {
              propertyName: "createdate",
              operator: "GTE",
              value: tenDaysAgo,
            },
          ],
        },
      ],
      ["email", "firstname"],
    );

    for (const contact of midContacts) {
      const email = contact.properties.email;
      if (!email) continue;

      try {
        if (!(await isSubscribed(email))) continue;
        if (!(await hasAutomationTag("contacts", contact.id, TAGS.WELCOME_1)))
          continue;
        if (await hasAutomationTag("contacts", contact.id, TAGS.WELCOME_2))
          continue;

        const unsub = createUnsubscribeUrl(email);
        const template = welcomeEmail2(
          contact.properties.firstname || "",
          unsub,
        );
        await sendEmail(email, template.subject, template.html);
        await createContactNote(
          contact.id,
          `${TAGS.WELCOME_2} Sent to ${email} on ${new Date().toISOString()}`,
        );
        results.push(`welcome_2 → ${email}`);
      } catch (err) {
        results.push(`welcome_2 FAIL ${email}: ${err}`);
      }
    }

    // -----------------------------------------------------------------------
    // Email 3: Contacts created 7–21 days ago with WELCOME_2 but no WELCOME_3
    // -----------------------------------------------------------------------
    const sevenDaysAgo = new Date(
      Date.now() - 7 * 24 * 60 * 60 * 1000,
    ).toISOString();
    const twentyOneDaysAgo = new Date(
      Date.now() - 21 * 24 * 60 * 60 * 1000,
    ).toISOString();

    const lateContacts = await searchContacts(
      [
        {
          filters: [
            {
              propertyName: "createdate",
              operator: "LTE",
              value: sevenDaysAgo,
            },
            {
              propertyName: "createdate",
              operator: "GTE",
              value: twentyOneDaysAgo,
            },
          ],
        },
      ],
      ["email", "firstname"],
    );

    for (const contact of lateContacts) {
      const email = contact.properties.email;
      if (!email) continue;

      try {
        if (!(await isSubscribed(email))) continue;
        if (!(await hasAutomationTag("contacts", contact.id, TAGS.WELCOME_2)))
          continue;
        if (await hasAutomationTag("contacts", contact.id, TAGS.WELCOME_3))
          continue;

        const unsub = createUnsubscribeUrl(email);
        const template = welcomeEmail3(
          contact.properties.firstname || "",
          unsub,
        );
        await sendEmail(email, template.subject, template.html);
        await createContactNote(
          contact.id,
          `${TAGS.WELCOME_3} Sent to ${email} on ${new Date().toISOString()}`,
        );
        results.push(`welcome_3 → ${email}`);
      } catch (err) {
        results.push(`welcome_3 FAIL ${email}: ${err}`);
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
