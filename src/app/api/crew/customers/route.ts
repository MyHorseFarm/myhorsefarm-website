import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export const runtime = "nodejs";

async function authenticateCrew(request: NextRequest): Promise<boolean> {
  const pin = request.headers.get("x-crew-pin");
  if (!pin) return false;

  // Try crew_members table first
  const { data: member } = await supabase
    .from("crew_members")
    .select("id")
    .eq("pin", pin)
    .eq("active", true)
    .single();

  if (member) return true;

  // Fall back to legacy CREW_PIN env var
  return pin === process.env.CREW_PIN;
}

export async function GET(request: NextRequest) {
  if (!(await authenticateCrew(request))) {
    return NextResponse.json({ error: "Invalid PIN" }, { status: 401 });
  }

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
