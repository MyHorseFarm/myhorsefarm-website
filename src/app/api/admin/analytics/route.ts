import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export const runtime = "nodejs";

function checkAuth(request: NextRequest): boolean {
  const auth = request.headers.get("authorization");
  return auth === `Bearer ${process.env.ADMIN_SECRET}`;
}

export async function GET(request: NextRequest) {
  if (!checkAuth(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const range = request.nextUrl.searchParams.get("range") || "30";
  const days = parseInt(range) || 30;
  const since = new Date();
  since.setDate(since.getDate() - days);
  const sinceStr = since.toISOString().split("T")[0];

  const [logsRes, customersRes, invoicesRes, quotesRes, bookingsRes] = await Promise.all([
    supabase
      .from("service_logs")
      .select("service_date, total_amount, status, crew_member")
      .gte("service_date", sinceStr),
    supabase
      .from("recurring_customers")
      .select("id, active, auto_charge, default_service, created_at"),
    supabase
      .from("invoices")
      .select("amount, created_at")
      .gte("created_at", since.toISOString()),
    supabase
      .from("quotes")
      .select("id, status, total_amount, created_at")
      .gte("created_at", since.toISOString()),
    supabase
      .from("bookings")
      .select("id, status, created_at")
      .gte("created_at", since.toISOString()),
  ]);

  const logs = logsRes.data ?? [];
  const customers = customersRes.data ?? [];
  const invoices = invoicesRes.data ?? [];
  const quotes = quotesRes.data ?? [];
  const bookings = bookingsRes.data ?? [];

  // Revenue by day
  const revenueByDay: Record<string, number> = {};
  const chargedLogs = logs.filter((l) => l.status === "charged");
  for (const log of chargedLogs) {
    const d = log.service_date;
    revenueByDay[d] = (revenueByDay[d] || 0) + Number(log.total_amount);
  }

  // Revenue by crew
  const revenueByCrew: Record<string, number> = {};
  for (const log of chargedLogs) {
    const crew = log.crew_member || "Unassigned";
    revenueByCrew[crew] = (revenueByCrew[crew] || 0) + Number(log.total_amount);
  }

  // Service breakdown
  const serviceBreakdown: Record<string, number> = {};
  for (const c of customers) {
    const svc = c.default_service || "trash_bin_service";
    serviceBreakdown[svc] = (serviceBreakdown[svc] || 0) + 1;
  }

  // Summary stats
  const totalRevenue = chargedLogs.reduce((s, l) => s + Number(l.total_amount), 0);
  const failedCount = logs.filter((l) => l.status === "failed").length;
  const pendingCount = logs.filter((l) => l.status === "pending").length;
  const activeCustomers = customers.filter((c) => c.active).length;
  const autoChargeCustomers = customers.filter((c) => c.auto_charge).length;
  const quoteConversion =
    quotes.length > 0
      ? quotes.filter((q) => q.status === "accepted").length / quotes.length
      : 0;

  return NextResponse.json({
    summary: {
      totalRevenue,
      chargedCount: chargedLogs.length,
      failedCount,
      pendingCount,
      totalCustomers: customers.length,
      activeCustomers,
      autoChargeCustomers,
      totalQuotes: quotes.length,
      quotesAccepted: quotes.filter((q) => q.status === "accepted").length,
      quoteConversion,
      totalBookings: bookings.length,
      invoiceTotal: invoices.reduce((s, i) => s + Number(i.amount), 0),
    },
    revenueByDay,
    revenueByCrew,
    serviceBreakdown,
  });
}
