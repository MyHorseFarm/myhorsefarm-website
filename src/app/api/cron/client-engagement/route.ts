import { NextRequest, NextResponse } from "next/server";
import {
  searchContacts,
  countAutomationTags,
  hasAutomationTag,
  createContactNote,
  isSubscribed,
  type Contact,
} from "@/lib/hubspot";
import {
  sendEmail,
  createUnsubscribeUrl,
  loyaltyMilestoneEmail,
  referralRequestEmail,
  serviceUpsellEmail,
} from "@/lib/emails";

export const runtime = "nodejs";
export const maxDuration = 300;

const PAYMENT_TAG_PREFIX = "[SQUARE:PAYMENT]";
const MILESTONE_6M_TAG = "[AUTO:MILESTONE_6M]";
const MILESTONE_12M_TAG = "[AUTO:MILESTONE_12M]";
const REFERRAL_TAG = "[AUTO:REFERRAL]";
const UPSELL_TAG_PREFIX = "[AUTO:UPSELL_";

const REFERRAL_THRESHOLD = 5;
const UPSELL_THRESHOLD = 3;
const MILESTONE_PAYMENT_THRESHOLD = 3;

const SERVICE_CATALOG = [
  "Manure Removal",
  "Junk Removal",
  "Sod Installation",
  "Fill Dirt",
  "Dumpster Rental",
  "Farm Repairs",
];

function currentUpsellTag(): string {
  return `${UPSELL_TAG_PREFIX}${new Date().getFullYear()}]`;
}

/** Get all contacts that have at least one Square payment note */
async function getPayingContacts(): Promise<Contact[]> {
  // Search for contacts created in the last 13 months (covers 12-month milestone)
  const thirteenMonthsAgo = new Date(
    Date.now() - 13 * 30 * 24 * 60 * 60 * 1000,
  ).toISOString();

  return searchContacts(
    [
      {
        filters: [
          {
            propertyName: "createdate",
            operator: "GTE",
            value: thirteenMonthsAgo,
          },
        ],
      },
    ],
    ["email", "firstname", "createdate"],
  );
}

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const results: string[] = [];

  try {
    const contacts = await getPayingContacts();

    for (const contactSummary of contacts) {
      try {
        const email = contactSummary.properties.email;
        if (!email) continue;

        const paymentCount = await countAutomationTags(
          "contacts",
          contactSummary.id,
          PAYMENT_TAG_PREFIX,
        );
        if (paymentCount === 0) continue;

        // Only one engagement email per contact per run — check in priority order
        let sent = false;

        // --- Priority 1: Loyalty milestones ---
        if (!sent) {
          const createDate = contactSummary.properties.createdate;
          if (createDate) {
            const createdAt = new Date(createDate);
            const now = new Date();
            const monthsAgo = (now.getFullYear() - createdAt.getFullYear()) * 12 +
              (now.getMonth() - createdAt.getMonth());

            // 12-month milestone (check first since it's higher priority)
            if (
              monthsAgo >= 12 &&
              paymentCount >= MILESTONE_PAYMENT_THRESHOLD
            ) {
              const already = await hasAutomationTag(
                "contacts",
                contactSummary.id,
                MILESTONE_12M_TAG,
              );
              if (!already) {
                if (await isSubscribed(email)) {
                  const unsub = createUnsubscribeUrl(email);
                  const template = loyaltyMilestoneEmail(
                    contactSummary.properties.firstname || "",
                    12,
                    unsub,
                  );
                  await sendEmail(email, template.subject, template.html);
                  await createContactNote(
                    contactSummary.id,
                    `${MILESTONE_12M_TAG} Sent 12-month milestone on ${now.toISOString()}`,
                  );
                  results.push(`milestone-12m → ${email}`);
                  sent = true;
                }
              }
            }

            // 6-month milestone
            if (
              !sent &&
              monthsAgo >= 6 &&
              paymentCount >= MILESTONE_PAYMENT_THRESHOLD
            ) {
              const already = await hasAutomationTag(
                "contacts",
                contactSummary.id,
                MILESTONE_6M_TAG,
              );
              if (!already) {
                if (await isSubscribed(email)) {
                  const unsub = createUnsubscribeUrl(email);
                  const template = loyaltyMilestoneEmail(
                    contactSummary.properties.firstname || "",
                    6,
                    unsub,
                  );
                  await sendEmail(email, template.subject, template.html);
                  await createContactNote(
                    contactSummary.id,
                    `${MILESTONE_6M_TAG} Sent 6-month milestone on ${now.toISOString()}`,
                  );
                  results.push(`milestone-6m → ${email}`);
                  sent = true;
                }
              }
            }
          }
        }

        // --- Priority 2: Referral request ---
        if (!sent && paymentCount >= REFERRAL_THRESHOLD) {
          const already = await hasAutomationTag(
            "contacts",
            contactSummary.id,
            REFERRAL_TAG,
          );
          if (!already) {
            if (await isSubscribed(email)) {
              const unsub = createUnsubscribeUrl(email);
              const template = referralRequestEmail(
                contactSummary.properties.firstname || "",
                unsub,
              );
              await sendEmail(email, template.subject, template.html);
              await createContactNote(
                contactSummary.id,
                `${REFERRAL_TAG} Sent referral request on ${new Date().toISOString()}`,
              );
              results.push(`referral → ${email}`);
              sent = true;
            }
          }
        }

        // --- Priority 3: Service upsell ---
        if (!sent && paymentCount >= UPSELL_THRESHOLD) {
          const upsellTag = currentUpsellTag();
          const already = await hasAutomationTag(
            "contacts",
            contactSummary.id,
            upsellTag,
          );
          if (!already) {
            if (await isSubscribed(email)) {
              // Suggest services they haven't used
              // Since we can't reliably parse service names from payment notes,
              // suggest less-common services (exclude Manure Removal since recurring
              // clients almost certainly already use it)
              const suggestedServices = SERVICE_CATALOG.filter(
                (s) => s !== "Manure Removal",
              );

              const unsub = createUnsubscribeUrl(email);
              const template = serviceUpsellEmail(
                contactSummary.properties.firstname || "",
                suggestedServices,
                unsub,
              );
              await sendEmail(email, template.subject, template.html);
              await createContactNote(
                contactSummary.id,
                `${upsellTag} Sent service upsell on ${new Date().toISOString()}`,
              );
              results.push(`upsell → ${email}`);
              sent = true;
            }
          }
        }
      } catch (err) {
        results.push(`FAIL contact ${contactSummary.id}: ${err}`);
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
