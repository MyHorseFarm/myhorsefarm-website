import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { requireCrew } from "@/lib/api-auth";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const authError = requireCrew(request);
  if (authError) return authError;

  const { data, error } = await supabase
    .from("recurring_customers")
    .select("id, name, address, default_bin_rate, notes")
    .eq("active", true)
    .order("name");

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ customers: data });
}
