import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export const runtime = "nodejs";

async function authenticateCrew(request: NextRequest): Promise<{ authenticated: boolean; crewId: string | null }> {
  const pin = request.headers.get("x-crew-pin");
  if (!pin) return { authenticated: false, crewId: null };

  // Try crew_members table first
  const { data: member } = await supabase
    .from("crew_members")
    .select("id")
    .eq("pin", pin)
    .eq("active", true)
    .single();

  if (member) return { authenticated: true, crewId: member.id };

  // Fall back to legacy CREW_PIN env var
  if (pin === process.env.CREW_PIN) return { authenticated: true, crewId: null };
  return { authenticated: false, crewId: null };
}

export async function GET(request: NextRequest) {
  const { authenticated, crewId } = await authenticateCrew(request);
  if (!authenticated) {
    return NextResponse.json({ error: "Invalid PIN" }, { status: 401 });
  }

  const today = new Date().toISOString().split("T")[0];

  const [customersRes, jobsRes] = await Promise.all([
    supabase
      .from("recurring_customers")
      .select("id, name, address, default_bin_rate, notes")
      .eq("active", true)
      .order("name"),
    crewId
      ? supabase
          .from("bookings")
          .select("id, booking_number, customer_name, customer_location, service_key, time_slot, status")
          .eq("assigned_crew", crewId)
          .eq("scheduled_date", today)
          .in("status", ["confirmed", "completed"])
          .order("time_slot")
      : Promise.resolve({ data: [], error: null }),
  ]);

  if (customersRes.error) {
    return NextResponse.json({ error: customersRes.error.message }, { status: 500 });
  }

  return NextResponse.json({
    customers: customersRes.data,
    todayJobs: jobsRes.data ?? [],
  });
}
