import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export const runtime = "nodejs";

function checkPin(request: NextRequest): boolean {
  const pin = request.headers.get("x-crew-pin");
  return !!pin && pin === process.env.CREW_PIN;
}

export async function GET(request: NextRequest) {
  if (!checkPin(request)) {
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
