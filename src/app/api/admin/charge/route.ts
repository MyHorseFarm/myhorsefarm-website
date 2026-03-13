import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { chargeCard } from "@/lib/square";
import { afterServiceEmail, chargeFailedAlertEmail, createUnsubscribeUrl, sendEmail } from "@/lib/emails";
import { findContactByEmail, findActiveDealForContact, updateDealStage, STAGE_COMPLETED } from "@/lib/hubspot";

export const runtime = "nodejs";

function checkAuth(request: NextRequest): boolean {
  const auth = request.headers.get("authorization");
  return auth === `Bearer ${process.env.ADMIN_SECRET}`;
}

export async function POST(request: NextRequest) {
  if (!checkAuth(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { log_id, override_amount } = body;

  if (!log_id) {
    return NextResponse.json({ error: "log_id is required" }, { status: 400 });
  }

  // Fetch service log with customer info
  const { data: log, error: logErr } = await supabase
    .from("service_logs")
    .select("*, recurring_customers(*)")
    .eq("id", log_id)
    .single();

  if (logErr || !log) {
    return NextResponse.json({ error: "Service log not found" }, { status: 404 });
  }

  if (log.status !== "pending" && log.status !== "failed") {
    return NextResponse.json(
      { error: `Log already ${log.status}` },
      { status: 400 },
    );
  }

  const customer = log.recurring_customers;
  if (!customer?.square_customer_id) {
    return NextResponse.json(
      { error: "Customer has no Square ID linked" },
      { status: 400 },
    );
  }

  const chargeAmount = override_amount ?? log.total_amount;
  const amountCents = Math.round(chargeAmount * 100);
  const note = `Manure Removal - ${log.bins_collected} bin${log.bins_collected !== 1 ? "s" : ""} (${log.service_date})`;

  try {
    const result = await chargeCard(
      customer.square_customer_id,
      amountCents,
      note,
      `crew-log-${log.id}-${Date.now()}`, // idempotency key (unique per attempt)
    );

    // Update log as charged
    await supabase
      .from("service_logs")
      .update({
        status: "charged",
        square_payment_id: result.paymentId,
        total_amount: chargeAmount,
        approved_by: "admin",
        approved_at: new Date().toISOString(),
        charged_at: new Date().toISOString(),
      })
      .eq("id", log.id);

    // Auto-complete matching bookings
    if (customer.email) {
      try {
        await supabase
          .from("bookings")
          .update({ status: "completed" })
          .eq("customer_email", customer.email)
          .eq("scheduled_date", log.service_date)
          .eq("status", "confirmed");
      } catch (bookingErr) {
        console.error("Booking completion failed:", bookingErr);
      }
    }

    // Update HubSpot deal to Completed (non-fatal)
    if (customer.email) {
      try {
        const contact = await findContactByEmail(customer.email);
        if (contact) {
          const deal = await findActiveDealForContact(contact.id);
          if (deal) {
            await updateDealStage(deal.id, STAGE_COMPLETED);
          }
        }
      } catch (hsErr) {
        console.error("HubSpot deal update failed:", hsErr);
      }
    }

    // Create invoice
    let invoiceUrl: string | null = null;
    try {
      const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.myhorsefarm.com";
      const dateStr = log.service_date.replace(/-/g, "");
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
          amount: chargeAmount,
          service_description: note,
          service_date: log.service_date,
          sent_at: new Date().toISOString(),
        })
        .select("id")
        .single();

      if (invoice) {
        invoiceUrl = `${siteUrl}/api/invoice/${invoice.id}`;
      }
    } catch (invErr) {
      console.error("Invoice creation failed:", invErr);
    }

    // Send after-service email if customer has email
    if (customer.email) {
      try {
        const unsubUrl = createUnsubscribeUrl(customer.email);
        const email = afterServiceEmail(
          customer.name.split(" ")[0],
          log.bins_collected,
          log.service_date,
          chargeAmount.toFixed(2),
          invoiceUrl,
          unsubUrl,
        );
        await sendEmail(customer.email, email.subject, email.html);
      } catch (emailErr) {
        console.error("After-service email failed:", emailErr);
      }
    }

    return NextResponse.json({
      success: true,
      payment_id: result.paymentId,
      receipt_url: result.receiptUrl,
      amount: chargeAmount,
      invoice_url: invoiceUrl,
    });
  } catch (err: unknown) {
    // Mark as failed
    await supabase
      .from("service_logs")
      .update({ status: "failed" })
      .eq("id", log.id);

    // Send failure alert to admin
    const message = err instanceof Error ? err.message : "Charge failed";
    try {
      const alertEmail = chargeFailedAlertEmail(
        customer.name,
        log.service_date,
        Number(chargeAmount).toFixed(2),
        message,
      );
      const adminEmail = process.env.ADMIN_ALERT_EMAIL || "jose@myhorsefarm.com";
      await sendEmail(adminEmail, alertEmail.subject, alertEmail.html);
    } catch (alertErr) {
      console.error("Failed to send charge failure alert:", alertErr);
    }

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
