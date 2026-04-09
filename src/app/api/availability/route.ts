import { NextRequest, NextResponse } from "next/server";
import { getAvailableDates } from "@/lib/availability";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const days = Math.min(Number(searchParams.get("days")) || 30, 90);

  try {
    const dates = await getAvailableDates(days);
    return NextResponse.json({ dates });
  } catch (err) {
    console.error("Availability error:", err);
    return NextResponse.json(
      { error: "Failed to fetch availability" },
      { status: 500 },
    );
  }
}
