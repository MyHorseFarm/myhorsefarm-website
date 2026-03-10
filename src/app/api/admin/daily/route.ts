import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { requireAdmin } from "@/lib/api-auth";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const authError = requireAdmin(request);
  if (authError) return authError;

  const date = request.nextUrl.searchParams.get("date") || new Date().toISOString().split("T")[0];

  const { data, error } = await supabase
    .from("service_logs")
    .select("*, recurring_customers(name, address, square_customer_id, email)")
    .eq("service_date", date)
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ logs: data, date });
}
