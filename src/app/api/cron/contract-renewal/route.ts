import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import {
  findContactByEmail,
  hasAutomationTag,
  createContactNote,
  isSubscribed,
} from "@/lib/hubspot";
import { sendEmail, createUnsubscribeUrl } from "@/lib/emails";
import { withCronMonitor } from "@/lib/cron-monitor";

export const runtime = "nodejs";
export const maxDuration = 120;

const TAG_RENEWAL_30 = "[AUTO:CONTRACT_RENEWAL_30]";
const TAG_RENEWAL_AUTO = "[AUTO:CONTRACT_AUTO_RENEWED]";

function daysFromNow(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().split("T")[0];
}

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return withCronMonitor("contract-renewal", async () => {
  const results: string[] = [];
  const today = new Date().toISOString().split("T")[0];

    // -----------------------------------------------------------------------
    // 30-day renewal notice: contracts ending in 28-32 days
    // -----------------------------------------------------------------------
    const { data: expiringSoon } = await supabase
      .from("recurring_customers")
      .select("*")
      .eq("active", true)
      .neq("contract_type", "month_to_month")
      .gte("contract_end_date", daysFromNow(28))
      .lte("contract_end_date", daysFromNow(32));

    for (const customer of expiringSoon ?? []) {
      try {
        if (!customer.email) continue;
        if (!(await isSubscribed(customer.email))) continue;

        const contactId = (await findContactByEmail(customer.email))?.id;
        if (!contactId) continue;
        if (await hasAutomationTag("contacts", contactId, `${TAG_RENEWAL_30}:${customer.contract_end_date}`))
          continue;

        const unsub = createUnsubscribeUrl(customer.email);
        const firstName = customer.name.split(" ")[0];
        const endDate = new Date(customer.contract_end_date + "T12:00:00").toLocaleDateString("en-US", {
          month: "long",
          day: "numeric",
          year: "numeric",
        });

        await sendEmail(
          customer.email,
          `Your ${customer.contract_type === "annual" ? "Annual" : "6-Month"} Plan Renews Soon`,
          contractRenewalHtml(firstName, endDate, customer.auto_renew, customer.contract_type, unsub),
        );

        await createContactNote(
          contactId,
          `${TAG_RENEWAL_30}:${customer.contract_end_date} Contract renewal notice sent (ends ${customer.contract_end_date}, auto_renew=${customer.auto_renew})`,
        );
        results.push(`renewal_notice → ${customer.email} (ends ${customer.contract_end_date})`);
      } catch (err) {
        results.push(`renewal_notice FAIL ${customer.name}: ${err}`);
      }
    }

    // -----------------------------------------------------------------------
    // Auto-renew: contracts that ended today or yesterday with auto_renew=true
    // -----------------------------------------------------------------------
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split("T")[0];

    const { data: expiredContracts } = await supabase
      .from("recurring_customers")
      .select("*")
      .eq("active", true)
      .eq("auto_renew", true)
      .neq("contract_type", "month_to_month")
      .gte("contract_end_date", yesterdayStr)
      .lte("contract_end_date", today);

    for (const customer of expiredContracts ?? []) {
      try {
        // Calculate new contract period
        const newStart = new Date(customer.contract_end_date + "T12:00:00");
        newStart.setDate(newStart.getDate() + 1);
        const newEnd = new Date(newStart);
        if (customer.contract_type === "annual") {
          newEnd.setFullYear(newEnd.getFullYear() + 1);
        } else {
          newEnd.setMonth(newEnd.getMonth() + 6);
        }

        await supabase
          .from("recurring_customers")
          .update({
            contract_start_date: newStart.toISOString().split("T")[0],
            contract_end_date: newEnd.toISOString().split("T")[0],
          })
          .eq("id", customer.id);

        // Tag in HubSpot
        if (customer.email) {
          try {
            const contactId = (await findContactByEmail(customer.email))?.id;
            if (contactId) {
              await createContactNote(
                contactId,
                `${TAG_RENEWAL_AUTO} Contract auto-renewed: ${customer.contract_type} starting ${newStart.toISOString().split("T")[0]}`,
              );
            }
          } catch {
            // non-fatal
          }
        }

        results.push(`auto_renewed → ${customer.name} (${customer.contract_type})`);
      } catch (err) {
        results.push(`auto_renew FAIL ${customer.name}: ${err}`);
      }
    }

    return {
      processed: results.length,
      sent: results.filter((r) => !r.includes("FAIL")).length,
      errors: results.filter((r) => r.includes("FAIL")).length > 0
        ? results.filter((r) => r.includes("FAIL"))
        : undefined,
      results,
    };
  });
}

function contractRenewalHtml(
  name: string,
  endDate: string,
  autoRenew: boolean,
  contractType: string,
  unsubscribeUrl: string,
): string {
  const planName = contractType === "annual" ? "Annual" : "6-Month";
  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="margin:0;padding:0;background-color:#f4f4f4;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f4;">
<tr><td align="center" style="padding:20px 0;">
<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;color:#333;background:#fff;">
<div style="text-align:center;padding:25px;background-color:#2d5016;">
<img src="https://www.myhorsefarm.com/logo.png" alt="My Horse Farm" style="width:80px;margin-bottom:10px;" />
<h1 style="color:#ffffff;font-size:22px;margin:0;">Contract Renewal</h1>
</div>
<div style="padding:30px 20px;">
<p style="font-size:16px;line-height:1.6;">Hi ${name},</p>
<p style="font-size:16px;line-height:1.6;">Your <strong>${planName} Plan</strong> with My Horse Farm is set to ${autoRenew ? "auto-renew" : "expire"} on <strong>${endDate}</strong>.</p>
${autoRenew
    ? `<p style="font-size:16px;line-height:1.6;">No action is needed — your plan will automatically renew and you'll continue to enjoy your discount. If you'd like to make any changes, just give us a call.</p>`
    : `<p style="font-size:16px;line-height:1.6;">To continue enjoying your discounted rate, please call us to renew your plan. Otherwise, your service will continue at our standard month-to-month rate after ${endDate}.</p>`
}
<p style="font-size:16px;line-height:1.6;">Questions? Call us at <a href="tel:+15615767667" style="color:#2d5016;font-weight:bold;">(561) 576-7667</a>.</p>
<p style="font-size:16px;line-height:1.6;">Talk soon,<br/><strong>Jose Gomez</strong><br/>Owner, My Horse Farm</p>
</div>
</div>
<div style="max-width:600px;margin:0 auto;text-align:center;padding:20px;font-size:12px;color:#999;">
<p style="margin:5px 0;">My Horse Farm &middot; Royal Palm Beach, FL 33411 &middot; (561) 576-7667</p>
<p style="margin:5px 0;"><a href="${unsubscribeUrl}" style="color:#999;">Unsubscribe</a></p>
</div>
</td></tr></table>
</body></html>`;
}
