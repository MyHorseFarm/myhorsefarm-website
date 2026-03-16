import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { chargeCard } from "@/lib/square";
import {
  afterServiceEmail,
  autoChargeSummaryEmail,
  createUnsubscribeUrl,
  sendEmail,
} from "@/lib/emails";
import {
  findContactByEmail,
  findActiveDealForContact,
  updateDealStage,
  STAGE_COMPLETED,
} from "@/lib/hubspot";

export const runtime = "nodejs";
export const maxDuration = 300;

function advanceDate(
  current: string,
  frequency: string,
): string {
  const d = new Date(current + "T12:00:00Z");
  switch (frequency) {
    case "daily":
      d.setUTCDate(d.getUTCDate() + 1);
      break;
    case "weekly":
      d.setUTCDate(d.getUTCDate() + 7);
      break;
    case "biweekly":
      d.setUTCDate(d.getUTCDate() + 14);
      break;
    case "monthly":
      d.setUTCMonth(d.getUTCMonth() + 1);
      break;
    default:
      d.setUTCDate(d.getUTCDate() + 7);
  }
  return d.toISOString().split("T")[0];
}

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const today = new Date().toISOString().split("T")[0];
  const chargeResults: { name: string; amount: string; status: string }[] = [];

  try {
    // Query customers due for auto-charge
    const { data: customers, error: queryErr } = await supabase
      .from("recurring_customers")
      .select("*")
      .eq("active", true)
      .eq("auto_charge", true)
      .not("square_customer_id", "is", null)
      .lte("next_charge_date", today);

    if (queryErr) throw new Error(queryErr.message);

    for (const customer of customers ?? []) {
      const bins = customer.default_bins || 1;
      const binRate = customer.default_bin_rate;
      const discountPct = Number(customer.contract_discount_pct) || 0;
      const baseAmount = bins * binRate;
      const totalAmount = Math.round(baseAmount * (1 - discountPct / 100) * 100) / 100;
      const amountCents = Math.round(totalAmount * 100);

      try {
        // Skip if pending service_log already exists for today
        const { data: existingLog } = await supabase
          .from("service_logs")
          .select("id")
          .eq("customer_id", customer.id)
          .eq("service_date", today)
          .eq("status", "pending")
          .limit(1);

        if (existingLog && existingLog.length > 0) {
          chargeResults.push({
            name: customer.name,
            amount: totalAmount.toFixed(2),
            status: "skipped (pending log exists)",
          });
          continue;
        }

        // Create service log
        const { data: log, error: logErr } = await supabase
          .from("service_logs")
          .insert({
            customer_id: customer.id,
            crew_member: "auto-charge",
            service_date: today,
            bins_collected: bins,
            bin_rate: binRate,
            total_amount: totalAmount,
            notes: "Auto-charge",
            status: "pending",
          })
          .select()
          .single();

        if (logErr || !log) {
          chargeResults.push({
            name: customer.name,
            amount: totalAmount.toFixed(2),
            status: "failed (log creation)",
          });
          continue;
        }

        // Charge card
        const note = `Manure Removal - ${bins} bin${bins !== 1 ? "s" : ""} (${today})`;
        const result = await chargeCard(
          customer.square_customer_id!,
          amountCents,
          note,
          `auto-charge-${customer.id}-${today}`,
        );

        // Update log as charged
        await supabase
          .from("service_logs")
          .update({
            status: "charged",
            square_payment_id: result.paymentId,
            approved_by: "auto-charge",
            approved_at: new Date().toISOString(),
            charged_at: new Date().toISOString(),
          })
          .eq("id", log.id);

        // Advance next charge date
        await supabase
          .from("recurring_customers")
          .update({
            next_charge_date: advanceDate(
              customer.next_charge_date,
              customer.charge_frequency || "weekly",
            ),
          })
          .eq("id", customer.id);

        // Auto-complete bookings
        if (customer.email) {
          try {
            await supabase
              .from("bookings")
              .update({ status: "completed" })
              .eq("customer_email", customer.email)
              .eq("scheduled_date", today)
              .eq("status", "confirmed");
          } catch {
            // non-fatal
          }
        }

        // Update HubSpot deal (non-fatal)
        if (customer.email) {
          try {
            const contact = await findContactByEmail(customer.email);
            if (contact) {
              const deal = await findActiveDealForContact(contact.id);
              if (deal) await updateDealStage(deal.id, STAGE_COMPLETED);
            }
          } catch {
            // non-fatal
          }
        }

        // Create invoice
        let invoiceUrl: string | null = null;
        try {
          const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.myhorsefarm.com";
          const dateStr = today.replace(/-/g, "");
          const { count } = await supabase
            .from("invoices")
            .select("*", { count: "exact", head: true })
            .like("invoice_number", `MHF-INV-${dateStr}%`);
          const seq = String((count ?? 0) + 1).padStart(3, "0");
          const invoiceNumber = `MHF-INV-${dateStr}-${seq}`;

          const { data: invoice } = await supabase
            .from("invoices")
            .insert({
              invoice_number: invoiceNumber,
              customer_id: customer.id,
              service_log_id: log.id,
              customer_name: customer.name,
              customer_email: customer.email,
              amount: totalAmount,
              service_description: note,
              service_date: today,
              sent_at: new Date().toISOString(),
            })
            .select("id")
            .single();

          if (invoice) {
            invoiceUrl = `${siteUrl}/api/invoice/${invoice.id}`;
          }
        } catch {
          // non-fatal
        }

        // Send after-service email
        if (customer.email) {
          try {
            const unsubUrl = createUnsubscribeUrl(customer.email);
            const email = afterServiceEmail(
              customer.name.split(" ")[0],
              bins,
              today,
              totalAmount.toFixed(2),
              invoiceUrl,
              unsubUrl,
            );
            await sendEmail(customer.email, email.subject, email.html);
          } catch {
            // non-fatal
          }
        }

        chargeResults.push({
          name: customer.name,
          amount: totalAmount.toFixed(2),
          status: "charged",
        });
      } catch (err) {
        // Mark log as failed if it was created
        const { data: failedLogs } = await supabase
          .from("service_logs")
          .select("id")
          .eq("customer_id", customer.id)
          .eq("service_date", today)
          .eq("status", "pending")
          .limit(1);

        if (failedLogs && failedLogs.length > 0) {
          await supabase
            .from("service_logs")
            .update({ status: "failed" })
            .eq("id", failedLogs[0].id);
        }

        // Do NOT advance next_charge_date on failure
        chargeResults.push({
          name: customer.name,
          amount: totalAmount.toFixed(2),
          status: "failed",
        });
        console.error(`Auto-charge failed for ${customer.name}:`, err);
      }
    }

    // Send summary email to Jose
    if (chargeResults.length > 0) {
      try {
        const summary = autoChargeSummaryEmail(today, chargeResults);
        const joseEmail =
          process.env.ADMIN_EMAIL || "jose@myhorsefarm.com";
        await sendEmail(joseEmail, summary.subject, summary.html);
      } catch (err) {
        console.error("Summary email failed:", err);
      }
    }
  } catch (err) {
    return NextResponse.json(
      { error: String(err), results: chargeResults },
      { status: 500 },
    );
  }

  return NextResponse.json({
    ok: true,
    processed: chargeResults.length,
    results: chargeResults,
    timestamp: new Date().toISOString(),
  });
}
