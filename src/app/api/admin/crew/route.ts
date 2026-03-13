import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export const runtime = "nodejs";

function checkAuth(request: NextRequest): boolean {
  const auth = request.headers.get("authorization");
  return auth === `Bearer ${process.env.ADMIN_SECRET}`;
}

// GET — list crew members
export async function GET(request: NextRequest) {
  if (!checkAuth(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const activeOnly = request.nextUrl.searchParams.get("active") === "true";

  let query = supabase
    .from("crew_members")
    .select("id, name, pin, phone, email, active, created_at")
    .order("name");

  if (activeOnly) {
    query = query.eq("active", true);
  }

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ crew: data });
}

// POST — create crew member
export async function POST(request: NextRequest) {
  if (!checkAuth(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();

  if (!body.name || !body.pin) {
    return NextResponse.json(
      { error: "Name and PIN are required" },
      { status: 400 },
    );
  }

  const { data, error } = await supabase
    .from("crew_members")
    .insert({
      name: body.name,
      pin: body.pin,
      phone: body.phone || null,
      email: body.email || null,
      active: body.active ?? true,
    })
    .select()
    .single();

  if (error) {
    if (error.message.includes("duplicate") || error.message.includes("unique")) {
      return NextResponse.json({ error: "PIN already in use" }, { status: 409 });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ crew_member: data }, { status: 201 });
}

// PUT — update crew member
export async function PUT(request: NextRequest) {
  if (!checkAuth(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();

  if (!body.id) {
    return NextResponse.json({ error: "Missing crew member id" }, { status: 400 });
  }

  const { id, ...updates } = body;

  const { data, error } = await supabase
    .from("crew_members")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    if (error.message.includes("duplicate") || error.message.includes("unique")) {
      return NextResponse.json({ error: "PIN already in use" }, { status: 409 });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ crew_member: data });
}
