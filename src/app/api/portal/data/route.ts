import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { verifyPortalToken } from "@/lib/portal-auth";

export const runtime = "nodejs";

const FREQ_DAYS: Record<string, number> = {
  daily: 1,
  weekly: 7,
  biweekly: 14,
  monthly: 30,
};

export async function GET(request: NextRequest) {
  const auth = request.headers.get("authorization");
  if (!auth?.startsWith("Bearer ")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const token = auth.slice(7);
  const payload = verifyPortalToken(token);
  if (!payload) {
    return NextResponse.json({ error: "Invalid or expired token" }, { status: 401 });
  }

  const { email, customerType } = payload;

  // ---- Recurring customer ----
  if (customerType === "recurring") {
    return handleRecurring(payload.customerId);
  }

  // ---- Quote customer ----
  if (customerType === "quote") {
    return handleQuoteCustomer(email);
  }

  // ---- Booking customer ----
  if (customerType === "booking") {
    return handleBookingCustomer(email);
  }

  return NextResponse.json({ error: "Unknown customer type" }, { status: 400 });
}

// ---------------------------------------------------------------------------
// Recurring customer — existing behavior
// ---------------------------------------------------------------------------
async function handleRecurring(customerId: string) {
  const { data: customer } = await supabase
    .from("recurring_customers")
    .select("id, name, email, phone, address, default_service, default_bin_rate, auto_charge, charge_frequency, next_charge_date, default_bins, active, contract_type, contract_end_date, contract_discount_pct")
    .eq("id", customerId)
    .single();

  if (!customer) {
    return NextResponse.json({ error: "Customer not found" }, { status: 404 });
  }

  const { data: logs } = await supabase
    .from("service_logs")
    .select("id, service_date, bins_collected, bin_rate, total_amount, status, crew_member, photo_url")
    .eq("customer_id", customerId)
    .order("service_date", { ascending: false })
    .limit(50);

  const { data: invoices } = await supabase
    .from("invoices")
    .select("id, invoice_number, amount, service_date")
    .eq("customer_id", customerId)
    .order("created_at", { ascending: false })
    .limit(50);

  // Project upcoming dates
  const upcoming: string[] = [];
  if (customer.auto_charge && customer.charge_frequency && customer.next_charge_date) {
    const freq = FREQ_DAYS[customer.charge_frequency] || 7;
    let d = new Date(customer.next_charge_date + "T00:00:00");
    const now = new Date();
    while (d < now) {
      d = new Date(d.getTime() + freq * 86400000);
    }
    for (let i = 0; i < 10 && upcoming.length < 10; i++) {
      upcoming.push(d.toISOString().split("T")[0]);
      d = new Date(d.getTime() + freq * 86400000);
    }
  }

  return NextResponse.json({
    customerType: "recurring",
    customer: {
      name: customer.name,
      email: customer.email,
      address: customer.address,
      service: customer.default_service,
      rate: customer.default_bin_rate,
      frequency: customer.charge_frequency,
      active: customer.active,
      auto_charge: customer.auto_charge,
      contract_type: customer.contract_type || "month_to_month",
      contract_end_date: customer.contract_end_date,
      contract_discount_pct: customer.contract_discount_pct || 0,
    },
    logs: logs ?? [],
    invoices: invoices ?? [],
    upcoming,
  });
}

// ---------------------------------------------------------------------------
// Quote customer — show their quotes + any linked bookings
// ---------------------------------------------------------------------------
async function handleQuoteCustomer(email: string) {
  const { data: quotes } = await supabase
    .from("quotes")
    .select("id, quote_number, status, customer_name, service_key, estimated_amount, pricing_breakdown, created_at, expires_at")
    .eq("customer_email", email)
    .order("created_at", { ascending: false })
    .limit(25);

  const customerName = quotes?.[0]?.customer_name || "Customer";

  // Fetch bookings linked to this email
  const { data: bookings } = await supabase
    .from("bookings")
    .select("id, booking_number, status, service_key, scheduled_date, time_slot, created_at")
    .eq("customer_email", email)
    .order("created_at", { ascending: false })
    .limit(25);

  return NextResponse.json({
    customerType: "quote",
    customer: { name: customerName, email },
    quotes: quotes ?? [],
    bookings: bookings ?? [],
  });
}

// ---------------------------------------------------------------------------
// Booking customer — show their bookings
// ---------------------------------------------------------------------------
async function handleBookingCustomer(email: string) {
  const { data: bookings } = await supabase
    .from("bookings")
    .select("id, booking_number, status, customer_name, service_key, scheduled_date, time_slot, created_at")
    .eq("customer_email", email)
    .order("created_at", { ascending: false })
    .limit(25);

  const customerName = bookings?.[0]?.customer_name || "Customer";

  // Also fetch any quotes for this email
  const { data: quotes } = await supabase
    .from("quotes")
    .select("id, quote_number, status, service_key, estimated_amount, created_at, expires_at")
    .eq("customer_email", email)
    .order("created_at", { ascending: false })
    .limit(25);

  return NextResponse.json({
    customerType: "booking",
    customer: { name: customerName, email },
    bookings: bookings ?? [],
    quotes: quotes ?? [],
  });
}
