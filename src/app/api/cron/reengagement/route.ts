import { NextRequest, NextResponse } from "next/server";
import {
  searchDeals,
  getDealContacts,
  getContactById,
  getContactDealSummary,
  hasAutomationTag,
  createContactNote,
  isSubscribed,
  searchContacts,
  HUBSPOT_PIPELINE_ID,
  STAGE_LOST,
  STAGE_COMPLETED,
  STAGE_NEW_LEAD,
} from "@/lib/hubspot";
import {
  sendEmail,
  createUnsubscribeUrl,
  lostDealReengageEmail,
  lapsedCustomerReengageEmail,
  coldLeadReengageEmail,
} from "@/lib/emails";

export const runtime = "nodejs";
export const maxDuration = 300;

const MAX_EMAILS = 50;
const YEAR = new Date().getFullYear().toString();
const TAG_LOST = `[AUTO:REENGAGE_LOST_${YEAR}]`;
const TAG_LAPSED = `[AUTO:REENGAGE_LAPSED_${YEAR}]`;
const TAG_COLD = `[AUTO:REENGAGE_COLD_${YEAR}]`;
const QUOTE_URL = "https://www.myhorsefarm.com/quote";

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const results: string[] = [];
  const processedContactIds = new Set<string>();
  let emailsSent = 0;

  // -----------------------------------------------------------------------
  // Phase 1: Lost Deals
  // -----------------------------------------------------------------------
  try {
    const lostDeals = await searchDeals(
      [
        {
          filters: [
            { propertyName: "pipeline", operator: "EQ", value: HUBSPOT_PIPELINE_ID },
            { propertyName: "dealstage", operator: "EQ", value: STAGE_LOST },
          ],
        },
      ],
      ["dealname", "dealstage"],
    );

    for (const deal of lostDeals) {
      if (emailsSent >= MAX_EMAILS) break;

      try {
        const contactIds = await getDealContacts(deal.id);
        if (contactIds.length === 0) continue;
        const contactId = contactIds[0];

        if (processedContactIds.has(contactId)) continue;
        processedContactIds.add(contactId);

        // Skip if contact has an active deal
        const summary = await getContactDealSummary(contactId);
        if (summary.hasActiveDeal) continue;

        // Check yearly tag
        if (await hasAutomationTag("contacts", contactId, TAG_LOST)) continue;

        const contact = await getContactById(contactId, [
          "email",
          "firstname",
          "lastname",
        ]);
        const email = contact.properties.email;
        if (!email) continue;

        if (!(await isSubscribed(email))) continue;

        const firstname = contact.properties.firstname || "";
        const dealName = deal.properties.dealname || "your project";
        const unsub = createUnsubscribeUrl(email);
        const template = lostDealReengageEmail(firstname, dealName, QUOTE_URL, unsub);

        await sendEmail(email, template.subject, template.html);
        await createContactNote(
          contactId,
          `${TAG_LOST} Re-engagement email sent (lost deal "${dealName}") on ${new Date().toISOString()}`,
        );

        emailsSent++;
        results.push(`lost_deal → ${email} (deal: ${dealName})`);
      } catch (err) {
        results.push(`FAIL lost_deal ${deal.id}: ${err}`);
      }
    }
  } catch (err) {
    results.push(`FAIL phase1: ${err}`);
  }

  // -----------------------------------------------------------------------
  // Phase 2: Lapsed Customers (completed 6+ months ago, no recent activity)
  // -----------------------------------------------------------------------
  try {
    if (emailsSent < MAX_EMAILS) {
      const sixMonthsAgo = new Date();
      sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

      const completedDeals = await searchDeals(
        [
          {
            filters: [
              { propertyName: "pipeline", operator: "EQ", value: HUBSPOT_PIPELINE_ID },
              { propertyName: "dealstage", operator: "EQ", value: STAGE_COMPLETED },
              {
                propertyName: "closedate",
                operator: "LT",
                value: sixMonthsAgo.getTime().toString(),
              },
            ],
          },
        ],
        ["dealname", "dealstage", "closedate"],
      );

      for (const deal of completedDeals) {
        if (emailsSent >= MAX_EMAILS) break;

        try {
          const contactIds = await getDealContacts(deal.id);
          if (contactIds.length === 0) continue;
          const contactId = contactIds[0];

          if (processedContactIds.has(contactId)) continue;
          processedContactIds.add(contactId);

          // Skip if contact has active deal or a recent completion
          const summary = await getContactDealSummary(contactId);
          if (summary.hasActiveDeal) continue;

          if (summary.mostRecentCloseDate) {
            const recentClose = new Date(summary.mostRecentCloseDate).getTime();
            if (recentClose > sixMonthsAgo.getTime()) continue;
          }

          if (await hasAutomationTag("contacts", contactId, TAG_LAPSED)) continue;

          const contact = await getContactById(contactId, [
            "email",
            "firstname",
            "lastname",
          ]);
          const email = contact.properties.email;
          if (!email) continue;

          if (!(await isSubscribed(email))) continue;

          const firstname = contact.properties.firstname || "";
          const unsub = createUnsubscribeUrl(email);
          const template = lapsedCustomerReengageEmail(firstname, QUOTE_URL, unsub);

          await sendEmail(email, template.subject, template.html);
          await createContactNote(
            contactId,
            `${TAG_LAPSED} Re-engagement email sent (lapsed customer) on ${new Date().toISOString()}`,
          );

          emailsSent++;
          results.push(`lapsed → ${email}`);
        } catch (err) {
          results.push(`FAIL lapsed ${deal.id}: ${err}`);
        }
      }
    }
  } catch (err) {
    results.push(`FAIL phase2: ${err}`);
  }

  // -----------------------------------------------------------------------
  // Phase 3: Cold Leads (30 days – 2 years old, no deals or only New Lead)
  // -----------------------------------------------------------------------
  try {
    if (emailsSent < MAX_EMAILS) {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      const twoYearsAgo = new Date();
      twoYearsAgo.setFullYear(twoYearsAgo.getFullYear() - 2);

      const coldContacts = await searchContacts(
        [
          {
            filters: [
              {
                propertyName: "createdate",
                operator: "LT",
                value: thirtyDaysAgo.getTime().toString(),
              },
              {
                propertyName: "createdate",
                operator: "GT",
                value: twoYearsAgo.getTime().toString(),
              },
            ],
          },
        ],
        ["email", "firstname", "lastname", "createdate"],
      );

      for (const contact of coldContacts) {
        if (emailsSent >= MAX_EMAILS) break;

        try {
          if (processedContactIds.has(contact.id)) continue;
          processedContactIds.add(contact.id);

          const email = contact.properties.email;
          if (!email) continue;

          // Only target contacts with no deals, or only "New Lead" stage deals
          const summary = await getContactDealSummary(contact.id);
          if (summary.hasActiveDeal) continue;
          const hasRealDeal = summary.dealStages.some(
            (s) => s !== STAGE_NEW_LEAD && s !== "",
          );
          if (hasRealDeal) continue;

          if (await hasAutomationTag("contacts", contact.id, TAG_COLD)) continue;
          if (!(await isSubscribed(email))) continue;

          const firstname = contact.properties.firstname || "";
          const unsub = createUnsubscribeUrl(email);
          const template = coldLeadReengageEmail(firstname, QUOTE_URL, unsub);

          await sendEmail(email, template.subject, template.html);
          await createContactNote(
            contact.id,
            `${TAG_COLD} Re-engagement email sent (cold lead) on ${new Date().toISOString()}`,
          );

          emailsSent++;
          results.push(`cold_lead → ${email}`);
        } catch (err) {
          results.push(`FAIL cold ${contact.id}: ${err}`);
        }
      }
    }
  } catch (err) {
    results.push(`FAIL phase3: ${err}`);
  }

  return NextResponse.json({
    ok: true,
    emailsSent,
    results,
    timestamp: new Date().toISOString(),
  });
}
