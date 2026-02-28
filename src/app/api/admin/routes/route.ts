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

  const { data, error } = await supabase
    .from("schedule_settings")
    .select("*")
    .limit(1)
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ settings: data });
}

export async function PUT(request: NextRequest) {
  if (!checkAuth(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();

  // Get current settings row
  const { data: current, error: fetchError } = await supabase
    .from("schedule_settings")
    .select("id")
    .limit(1)
    .single();

  if (fetchError || !current) {
    return NextResponse.json({ error: "Schedule settings not found" }, { status: 500 });
  }

  const updates: Record<string, unknown> = { updated_at: new Date().toISOString() };
  if (body.max_jobs_per_day !== undefined) updates.max_jobs_per_day = body.max_jobs_per_day;
  if (body.work_days !== undefined) updates.work_days = body.work_days;
  if (body.blocked_dates !== undefined) updates.blocked_dates = body.blocked_dates;

  const { data, error } = await supabase
    .from("schedule_settings")
    .update(updates)
    .eq("id", current.id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ settings: data });
}
