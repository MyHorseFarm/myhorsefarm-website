import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import Anthropic from "@anthropic-ai/sdk";

export const runtime = "nodejs";

function checkAuth(request: NextRequest): boolean {
  const auth = request.headers.get("authorization");
  return auth === `Bearer ${process.env.ADMIN_SECRET}`;
}

let _anthropic: Anthropic | null = null;
function getClient(): Anthropic {
  if (!_anthropic) {
    _anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
      maxRetries: 2,
    });
  }
  return _anthropic;
}

async function generateSummary(data: {
  pendingCount: number;
  pendingTotal: number;
  bookingsToday: number;
  activeCustomers: number;
  overdueInvoices: number;
  newQuotes: number;
  bookingLocations: string[];
}): Promise<string> {
  try {
    const client = getClient();
    const msg = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 150,
      messages: [
        {
          role: "user",
          content: `You are an assistant for a horse farm services business. Generate a brief, friendly daily summary in one sentence based on this data:
- ${data.pendingCount} pending charges ($${data.pendingTotal.toFixed(2)} total)
- ${data.bookingsToday} bookings today${data.bookingLocations.length > 0 ? ` in ${[...new Set(data.bookingLocations)].join(", ")}` : ""}
- ${data.activeCustomers} active customers
- ${data.overdueInvoices} overdue invoices
- ${data.newQuotes} new quote requests (last 7 days)

Keep it under 100 words, conversational, and actionable. Example: "3 pending charges ($450 total), 2 bookings today in Wellington, 1 new quote request."`,
        },
      ],
    });
    const block = msg.content[0];
    return block.type === "text" ? block.text : "Dashboard loaded.";
  } catch (err) {
    console.error("AI summary failed:", err);
    return `${data.pendingCount} pending charges ($${data.pendingTotal.toFixed(2)} total), ${data.bookingsToday} bookings today, ${data.newQuotes} new quotes.`;
  }
}

export async function GET(request: NextRequest) {
  if (!checkAuth(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const today = new Date().toISOString().split("T")[0];
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];

  const [
    pendingLogsResult,
    todayBookingsResult,
    activeCustomersResult,
    overdueInvoicesResult,
    recentQuotesResult,
    recentLogsResult,
    recentAllQuotesResult,
  ] = await Promise.all([
    // Pending charges
    supabase
      .from("service_logs")
      .select("id, total_amount, recurring_customers(name, address)")
      .eq("status", "pending"),
    // Today's bookings
    supabase
      .from("bookings")
      .select("id, customer_name, customer_location, service_key, time_slot, status")
      .eq("scheduled_date", today)
      .in("status", ["confirmed", "pending"]),
    // Active customers count
    supabase
      .from("recurring_customers")
      .select("id", { count: "exact", head: true })
      .eq("active", true),
    // Overdue invoices (sent but no payment, older than 30 days)
    supabase
      .from("invoices")
      .select("id, amount, customer_name, invoice_number, service_date")
      .is("paid_at", null)
      .lt("sent_at", new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()),
    // New quotes in last 7 days
    supabase
      .from("quotes")
      .select("id, customer_name, service, status, created_at")
      .gte("created_at", sevenDaysAgo + "T00:00:00")
      .order("created_at", { ascending: false })
      .limit(10),
    // Recent service logs (last 10)
    supabase
      .from("service_logs")
      .select("id, service_date, status, total_amount, created_at, recurring_customers(name)")
      .order("created_at", { ascending: false })
      .limit(10),
    // Recent quotes for activity feed
    supabase
      .from("quotes")
      .select("id, customer_name, service, status, created_at")
      .order("created_at", { ascending: false })
      .limit(5),
  ]);

  const pendingLogs = pendingLogsResult.data ?? [];
  const pendingCount = pendingLogs.length;
  const pendingTotal = pendingLogs.reduce((sum, l) => sum + Number(l.total_amount), 0);
  const todayBookings = todayBookingsResult.data ?? [];
  const activeCustomers = activeCustomersResult.count ?? 0;
  const overdueInvoices = overdueInvoicesResult.data ?? [];
  const recentQuotes = recentQuotesResult.data ?? [];
  const recentLogs = recentLogsResult.data ?? [];
  const recentAllQuotes = recentAllQuotesResult.data ?? [];

  const bookingLocations = todayBookings
    .map((b) => b.customer_location)
    .filter(Boolean) as string[];

  // Generate AI summary
  const summary = await generateSummary({
    pendingCount,
    pendingTotal,
    bookingsToday: todayBookings.length,
    activeCustomers,
    overdueInvoices: overdueInvoices.length,
    newQuotes: recentQuotes.length,
    bookingLocations,
  });

  return NextResponse.json({
    snapshot: {
      pendingCount,
      pendingTotal,
      bookingsToday: todayBookings.length,
      todayBookings,
      activeCustomers,
      overdueInvoices: overdueInvoices.length,
      overdueInvoicesList: overdueInvoices,
    },
    pendingLogs,
    activity: {
      recentLogs,
      recentQuotes: recentAllQuotes,
    },
    summary,
  });
}
