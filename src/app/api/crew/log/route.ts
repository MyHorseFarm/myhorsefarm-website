import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export const runtime = "nodejs";

async function authenticateCrew(
  request: NextRequest,
): Promise<{ id: string; name: string } | null> {
  const pin = request.headers.get("x-crew-pin");
  if (!pin) return null;

  // Try crew_members table first
  const { data: member } = await supabase
    .from("crew_members")
    .select("id, name")
    .eq("pin", pin)
    .eq("active", true)
    .single();

  if (member) return member;

  // Fall back to legacy CREW_PIN env var
  if (pin === process.env.CREW_PIN) {
    return { id: "legacy", name: "field" };
  }

  return null;
}

export async function POST(request: NextRequest) {
  const crew = await authenticateCrew(request);
  if (!crew) {
    return NextResponse.json({ error: "Invalid PIN" }, { status: 401 });
  }

  const body = await request.json();
  const { customer_id, bins_collected, notes } = body;

  if (!customer_id || typeof bins_collected !== "number" || bins_collected < 1) {
    return NextResponse.json(
      { error: "customer_id and bins_collected (>= 1) are required" },
      { status: 400 },
    );
  }

  // Get customer's bin rate
  const { data: customer, error: custErr } = await supabase
    .from("recurring_customers")
    .select("default_bin_rate, name")
    .eq("id", customer_id)
    .eq("active", true)
    .single();

  if (custErr || !customer) {
    return NextResponse.json({ error: "Customer not found" }, { status: 404 });
  }

  const bin_rate = customer.default_bin_rate;
  const total_amount = bins_collected * bin_rate;

  const { data, error } = await supabase
    .from("service_logs")
    .insert({
      customer_id,
      crew_member: crew.name,
      bins_collected,
      bin_rate,
      total_amount,
      notes: notes || null,
      status: "pending",
      assigned_crew: crew.id !== "legacy" ? crew.id : null,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(
    { log: data, customer_name: customer.name, total_amount },
    { status: 201 },
  );
}
