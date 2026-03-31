import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import {
  hasAutomationTag,
  createContactNote,
  isSubscribed,
  findContactByEmail,
} from "@/lib/hubspot";
import {
  sendEmail,
  createUnsubscribeUrl,
  winbackEmail,
} from "@/lib/emails";
import { withCronMonitor } from "@/lib/cron-monitor";

export const runtime = "nodejs";
export const maxDuration = 300;

const TAG = "[AUTO:WINBACK]";

const SERVICE_NAMES: Record<string, string> = {
  manure_removal: "Manure Removal",
  trash_bin_service: "Trash Bin Service",
  junk_removal: "Junk Removal",
  sod_installation: "Sod Installation",
  fill_dirt: "Fill Dirt Delivery",
  dumpster_rental: "Dumpster Rental",
  farm_repairs: "Farm Repairs",
};

/**
 * Win-back cron: Email customers who cancelled ~30 days ago.
 * Checks notes for cancellation timestamp.
 */
export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return withCronMonitor("winback", async () => {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.myhorsefarm.com";
  const results: string[] = [];

    // Find inactive customers who were cancelled 25-35 days ago
    // We look for "Cancelled on" in the notes field
    const { data: customers } = await supabase
      .from("recurring_customers")
      .select("*")
      .eq("active", false)
      .not("email", "is", null);

    const now = Date.now();
    const day25 = 25 * 24 * 60 * 60 * 1000;
    const day35 = 35 * 24 * 60 * 60 * 1000;

    for (const customer of customers ?? []) {
      try {
        if (!customer.email || !customer.notes) continue;

        // Extract cancellation date from notes
        const cancelMatch = customer.notes.match(/Cancelled on (\d{4}-\d{2}-\d{2})/);
        if (!cancelMatch) continue;

        const cancelDate = new Date(cancelMatch[1]).getTime();
        const daysSince = now - cancelDate;
        if (daysSince < day25 || daysSince > day35) continue;

        if (!(await isSubscribed(customer.email))) continue;

        const contact = await findContactByEmail(customer.email);
        if (!contact) continue;
        if (await hasAutomationTag("contacts", contact.id, TAG)) continue;

        const unsub = createUnsubscribeUrl(customer.email);
        const enrollUrl = `${siteUrl}/enroll`;
        const serviceName = SERVICE_NAMES[customer.default_service] || customer.default_service?.replace(/_/g, " ") || "farm services";

        const template = winbackEmail(
          customer.name.split(" ")[0],
          serviceName,
          enrollUrl,
          unsub,
        );
        await sendEmail(customer.email, template.subject, template.html);

        await createContactNote(
          contact.id,
          `${TAG} Win-back email sent on ${new Date().toISOString()}`,
        );

        results.push(`winback → ${customer.email}`);
      } catch (err) {
        results.push(`FAIL ${customer.email}: ${err}`);
      }
    }

    return {
      processed: results.length,
      sent: results.filter((r) => r.startsWith("winback →")).length,
      errors: results.filter((r) => r.includes("FAIL")).length > 0
        ? results.filter((r) => r.includes("FAIL"))
        : undefined,
      results,
    };
  });
}
