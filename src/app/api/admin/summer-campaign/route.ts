import { NextRequest, NextResponse } from "next/server";
import {
  sendEmail,
  createUnsubscribeUrl,
  existingCustomerSummerEmail,
  propertyManagerOutreachEmail,
  reactivationCampaignEmail,
} from "@/lib/emails";
import { searchContacts, type Contact } from "@/lib/hubspot";

export const runtime = "nodejs";
export const maxDuration = 300;

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "jose@myhorsefarm.com";

// ---------------------------------------------------------------------------
// Auth
// ---------------------------------------------------------------------------

function isAuthorized(request: NextRequest): boolean {
  const auth = request.headers.get("authorization");
  const secret = process.env.ADMIN_SECRET;
  return !!secret && auth === `Bearer ${secret}`;
}

// ---------------------------------------------------------------------------
// Contact queries
// ---------------------------------------------------------------------------

/** Existing customers: contacts with at least one closed-won deal */
async function getExistingCustomers(): Promise<Contact[]> {
  return searchContacts(
    [
      {
        filters: [
          {
            propertyName: "hs_lifecyclestage_customer_date",
            operator: "HAS_PROPERTY",
          },
        ],
      },
    ],
    ["firstname", "lastname", "email", "hs_additional_emails", "notes_last_updated"],
  );
}

/** Property managers: contacts tagged with job title or company containing property-related terms */
async function getPropertyManagers(): Promise<Contact[]> {
  return searchContacts(
    [
      {
        filters: [
          {
            propertyName: "jobtitle",
            operator: "CONTAINS_TOKEN",
            value: "property manager",
          },
        ],
      },
      {
        filters: [
          {
            propertyName: "jobtitle",
            operator: "CONTAINS_TOKEN",
            value: "property management",
          },
        ],
      },
      {
        filters: [
          {
            propertyName: "company",
            operator: "CONTAINS_TOKEN",
            value: "property management",
          },
        ],
      },
    ],
    ["firstname", "lastname", "email", "company", "jobtitle"],
  );
}

/** Inactive customers: had a deal but no activity in 6+ months */
async function getInactiveCustomers(): Promise<Contact[]> {
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

  return searchContacts(
    [
      {
        filters: [
          {
            propertyName: "hs_lifecyclestage_customer_date",
            operator: "HAS_PROPERTY",
          },
          {
            propertyName: "notes_last_updated",
            operator: "LT",
            value: sixMonthsAgo.getTime().toString(),
          },
        ],
      },
    ],
    ["firstname", "lastname", "email", "notes_last_updated"],
  );
}

// ---------------------------------------------------------------------------
// POST handler
// ---------------------------------------------------------------------------

type CampaignType = "summer" | "property-manager" | "reactivation";

interface CampaignRequest {
  campaign: CampaignType;
  test?: boolean;
}

export async function POST(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: CampaignRequest;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { campaign, test = false } = body;

  if (!["summer", "property-manager", "reactivation"].includes(campaign)) {
    return NextResponse.json(
      { error: "Invalid campaign. Must be: summer | property-manager | reactivation" },
      { status: 400 },
    );
  }

  const results: { email: string; status: string; error?: string }[] = [];
  let sent = 0;
  let skipped = 0;
  let failed = 0;

  try {
    // ----- Summer: existing customers -----
    if (campaign === "summer") {
      const contacts = test
        ? [{ id: "test", properties: { firstname: "Test", email: ADMIN_EMAIL } }]
        : await getExistingCustomers();

      for (const contact of contacts) {
        const email = test ? ADMIN_EMAIL : contact.properties.email;
        if (!email) { skipped++; continue; }

        const firstName = contact.properties.firstname || "there";
        const unsubUrl = createUnsubscribeUrl(email);
        const template = existingCustomerSummerEmail(firstName, [], unsubUrl);

        try {
          await sendEmail(email, template.subject, template.html, "LOW", "summer-existing-customer");
          results.push({ email, status: "sent" });
          sent++;
        } catch (err) {
          const msg = err instanceof Error ? err.message : String(err);
          results.push({ email, status: "failed", error: msg });
          failed++;
        }

        // Rate-limit: 200ms between sends
        await new Promise((r) => setTimeout(r, 200));
      }
    }

    // ----- Property Manager outreach -----
    if (campaign === "property-manager") {
      const contacts = test
        ? [{ id: "test", properties: { firstname: "Test", email: ADMIN_EMAIL, company: "Test PM Co" } }]
        : await getPropertyManagers();

      for (const contact of contacts) {
        const email = test ? ADMIN_EMAIL : contact.properties.email;
        if (!email) { skipped++; continue; }

        const firstName = contact.properties.firstname || "there";
        const company = contact.properties.company || "";
        const unsubUrl = createUnsubscribeUrl(email);
        const template = propertyManagerOutreachEmail(firstName, company, unsubUrl);

        try {
          await sendEmail(email, template.subject, template.html, "LOW", "summer-property-manager");
          results.push({ email, status: "sent" });
          sent++;
        } catch (err) {
          const msg = err instanceof Error ? err.message : String(err);
          results.push({ email, status: "failed", error: msg });
          failed++;
        }

        await new Promise((r) => setTimeout(r, 200));
      }
    }

    // ----- Reactivation campaign -----
    if (campaign === "reactivation") {
      const contacts = test
        ? [{ id: "test", properties: { firstname: "Test", email: ADMIN_EMAIL, notes_last_updated: "2024-06-01" } }]
        : await getInactiveCustomers();

      for (const contact of contacts) {
        const email = test ? ADMIN_EMAIL : contact.properties.email;
        if (!email) { skipped++; continue; }

        const firstName = contact.properties.firstname || "there";
        const lastDate = contact.properties.notes_last_updated
          ? new Date(Number(contact.properties.notes_last_updated) || contact.properties.notes_last_updated).toLocaleDateString("en-US", { month: "long", year: "numeric" })
          : "a while back";
        const unsubUrl = createUnsubscribeUrl(email);
        const template = reactivationCampaignEmail(firstName, lastDate, unsubUrl);

        try {
          await sendEmail(email, template.subject, template.html, "LOW", "summer-reactivation");
          results.push({ email, status: "sent" });
          sent++;
        } catch (err) {
          const msg = err instanceof Error ? err.message : String(err);
          results.push({ email, status: "failed", error: msg });
          failed++;
        }

        await new Promise((r) => setTimeout(r, 200));
      }
    }

    return NextResponse.json({
      ok: true,
      campaign,
      test,
      summary: { sent, skipped, failed, total: sent + skipped + failed },
      results: test ? results : undefined, // Only show details in test mode
    });
  } catch (err) {
    console.error(`[SUMMER-CAMPAIGN] Error running ${campaign}:`, err);
    return NextResponse.json(
      {
        error: "Campaign failed",
        message: err instanceof Error ? err.message : String(err),
        partial: { sent, skipped, failed },
      },
      { status: 500 },
    );
  }
}
