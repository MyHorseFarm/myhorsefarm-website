import { NextRequest, NextResponse } from "next/server";
import {
  searchDeals,
  getDealContacts,
  getContactById,
  hasAutomationTag,
  createDealNote,
  isSubscribed,
} from "@/lib/hubspot";
import {
  sendEmail,
  createUnsubscribeUrl,
  reviewRequestEmail,
} from "@/lib/emails";

export const runtime = "nodejs";
export const maxDuration = 300;

// "Completed" stage in the Farm Services Pipeline
const COMPLETED_STAGE_ID = "3248645833";
const TAG = "[AUTO:REVIEW]";

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const results: string[] = [];

  try {
    // Find deals in "Completed" stage that closed in the last 30 days
    const thirtyDaysAgo = new Date(
      Date.now() - 30 * 24 * 60 * 60 * 1000,
    ).toISOString();

    const completedDeals = await searchDeals(
      [
        {
          filters: [
            {
              propertyName: "dealstage",
              operator: "EQ",
              value: COMPLETED_STAGE_ID,
            },
            {
              propertyName: "closedate",
              operator: "GTE",
              value: thirtyDaysAgo,
            },
          ],
        },
      ],
      ["dealname", "closedate", "dealstage"],
    );

    for (const deal of completedDeals) {
      try {
        // Skip if review already sent for this deal
        if (await hasAutomationTag("deals", deal.id, TAG)) continue;

        // Get associated contacts
        const contactIds = await getDealContacts(deal.id);
        if (contactIds.length === 0) continue;

        // Send review request to the first associated contact
        const contact = await getContactById(contactIds[0], [
          "email",
          "firstname",
        ]);
        const email = contact.properties.email;
        if (!email) continue;

        if (!(await isSubscribed(email))) continue;

        const unsub = createUnsubscribeUrl(email);
        const template = reviewRequestEmail(
          contact.properties.firstname || "",
          unsub,
        );
        await sendEmail(email, template.subject, template.html);
        await createDealNote(
          deal.id,
          `${TAG} Review request sent to ${email} on ${new Date().toISOString()}`,
        );
        results.push(`review → ${email} (deal ${deal.id})`);
      } catch (err) {
        results.push(`review FAIL deal ${deal.id}: ${err}`);
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
