import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export const runtime = "nodejs";

function checkAuth(request: NextRequest): boolean {
  const auth = request.headers.get("authorization");
  return auth === `Bearer ${process.env.ADMIN_SECRET}`;
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!checkAuth(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  const [logsRes, invoicesRes] = await Promise.all([
    supabase
      .from("service_logs")
      .select("id, service_date, bins_collected, bin_rate, total_amount, status, crew_member, notes, created_at")
      .eq("customer_id", id)
      .order("service_date", { ascending: false })
      .limit(50),
    supabase
      .from("invoices")
      .select("id, invoice_number, amount, service_date, created_at")
      .eq("customer_id", id)
      .order("created_at", { ascending: false })
      .limit(50),
  ]);

  return NextResponse.json({
    logs: logsRes.data ?? [],
    invoices: invoicesRes.data ?? [],
  });
}
