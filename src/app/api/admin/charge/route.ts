import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { chargeCard } from "@/lib/square";
import { paymentReceivedEmail, createUnsubscribeUrl, sendEmail } from "@/lib/emails";

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

  if (log.status !== "pending") {
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
      `crew-log-${log.id}`, // idempotency key
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

    // Send receipt email if customer has email
    if (customer.email) {
      try {
        const unsubUrl = createUnsubscribeUrl(customer.email);
        const email = paymentReceivedEmail(
          customer.name.split(" ")[0],
          chargeAmount.toFixed(2),
          [note],
          unsubUrl,
        );
        await sendEmail(customer.email, email.subject, email.html);
      } catch (emailErr) {
        console.error("Receipt email failed:", emailErr);
        // Don't fail the charge if email fails
      }
    }

    return NextResponse.json({
      success: true,
      payment_id: result.paymentId,
      receipt_url: result.receiptUrl,
      amount: chargeAmount,
    });
  } catch (err: unknown) {
    // Mark as failed
    await supabase
      .from("service_logs")
      .update({ status: "failed" })
      .eq("id", log.id);

    const message = err instanceof Error ? err.message : "Charge failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
