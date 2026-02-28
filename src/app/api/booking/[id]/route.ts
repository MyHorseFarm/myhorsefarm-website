import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export const runtime = "nodejs";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  const { data: booking, error } = await supabase
    .from("bookings")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !booking) {
    return NextResponse.json({ error: "Booking not found" }, { status: 404 });
  }

  const { data: service } = await supabase
    .from("service_pricing")
    .select("display_name")
    .eq("service_key", booking.service_key)
    .single();

  return NextResponse.json({
    ...booking,
    service_display_name: service?.display_name ?? booking.service_key,
  });
}
