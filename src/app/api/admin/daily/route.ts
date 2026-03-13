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

  const date = request.nextUrl.searchParams.get("date") || new Date().toISOString().split("T")[0];

  const [logsResult, crewResult, bookingsResult] = await Promise.all([
    supabase
      .from("service_logs")
      .select("*, recurring_customers(name, address, square_customer_id, email)")
      .eq("service_date", date)
      .order("created_at", { ascending: false }),
    supabase
      .from("crew_members")
      .select("id, name")
      .eq("active", true)
      .order("name"),
    supabase
      .from("bookings")
      .select("id, booking_number, customer_name, customer_location, service_key, time_slot, status, assigned_crew")
      .eq("scheduled_date", date)
      .eq("status", "confirmed")
      .order("time_slot"),
  ]);

  if (logsResult.error) {
    return NextResponse.json({ error: logsResult.error.message }, { status: 500 });
  }

  return NextResponse.json({
    logs: logsResult.data,
    crew_members: crewResult.data ?? [],
    bookings: bookingsResult.data ?? [],
    date,
  });
}

// PATCH — assign crew to a booking
export async function PATCH(request: NextRequest) {
  if (!checkAuth(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { booking_id, crew_id } = body;

  if (!booking_id) {
    return NextResponse.json({ error: "booking_id is required" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("bookings")
    .update({ assigned_crew: crew_id || null })
    .eq("id", booking_id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ booking: data });
}
