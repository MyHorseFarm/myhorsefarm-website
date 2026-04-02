import { NextRequest, NextResponse } from "next/server";
import {
  hasAutomationTag,
  createContactNote,
  isSubscribed,
} from "@/lib/hubspot";
import {
  sendEmail,
  createUnsubscribeUrl,
  springSpecialEmail,
} from "@/lib/emails";

export const runtime = "nodejs";
export const maxDuration = 300;

const DEDUP_TAG = "[CAMPAIGN:SPRING_2026]";

export async function POST(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.ADMIN_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let limit = 25;
  let startAfter: string | undefined;

  try {
    const body = await request.json();
    if (typeof body.limit === "number" && body.limit > 0) {
      limit = Math.min(body.limit, 50);
    }
    if (typeof body.after === "string") {
      startAfter = body.after;
    }
  } catch {
    // defaults
  }

  const results = {
    sent: 0,
    skipped: 0,
    errors: 0,
    scanned: 0,
    details: [] as string[],
  };

  let totalSends = 0;
  let after: string | undefined = startAfter;
  let lastAfter: string | undefined = startAfter;
  const HUBSPOT_TOKEN = process.env.HUBSPOT_API_TOKEN;
  const MAX_SCAN = limit * 10; // Don't scan more than 10x the limit to avoid timeout

  while (totalSends < limit && results.scanned < MAX_SCAN) {
    const searchBody: Record<string, unknown> = {
      filterGroups: [
        { filters: [{ propertyName: "email", operator: "HAS_PROPERTY" }] },
      ],
      properties: ["email", "firstname"],
      limit: 100,
    };
    if (after) searchBody.after = after;

    let data: {
      results: Array<{ id: string; properties: Record<string, string> }>;
      paging?: { next?: { after: string } };
    };
    try {
      const res = await fetch(
        "https://api.hubapi.com/crm/v3/objects/contacts/search",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${HUBSPOT_TOKEN}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(searchBody),
        },
      );
      data = await res.json();
    } catch {
      results.details.push("HubSpot search failed");
      break;
    }

    if (!data.results || data.results.length === 0) break;

    for (const contact of data.results) {
      if (totalSends >= limit) break;
      results.scanned++;

      const contactId = contact.id;
      const email = contact.properties.email;
      const firstname = contact.properties.firstname || "";

      if (!email) {
        results.skipped++;
        continue;
      }

      // Check dedup
      let alreadyTagged = false;
      try {
        alreadyTagged = await hasAutomationTag(
          "contacts",
          contactId,
          DEDUP_TAG,
        );
      } catch {
        results.skipped++;
        continue;
      }

      if (alreadyTagged) {
        results.skipped++;
        continue;
      }

      // Check subscription
      try {
        const subscribed = await isSubscribed(email);
        if (!subscribed) {
          results.skipped++;
          continue;
        }
      } catch {
        results.skipped++;
        continue;
      }

      // Send email
      try {
        const unsub = createUnsubscribeUrl(email);
        const template = springSpecialEmail(firstname, unsub);
        await sendEmail(email, template.subject, template.html);
        results.sent++;
        totalSends++;
        results.details.push(email);
      } catch (err) {
        results.errors++;
        results.details.push(`FAIL: ${email} - ${err}`);
      }

      // Write dedup note
      try {
        await createContactNote(
          contactId,
          `${DEDUP_TAG} Spring 2026 campaign sent (email) on ${new Date().toISOString()}`,
        );
      } catch {
        // non-fatal
      }
    }

    // Next page
    lastAfter = data.paging?.next?.after;
    after = lastAfter;
    if (!after) break;
  }

  return NextResponse.json({
    campaign: "spring_2026",
    sent: results.sent,
    skipped: results.skipped,
    errors: results.errors,
    scanned: results.scanned,
    nextCursor: lastAfter || null,
    details: results.details,
  });
}
