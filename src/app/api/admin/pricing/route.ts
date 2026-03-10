import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { requireAdmin } from "@/lib/api-auth";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const authError = requireAdmin(request);
  if (authError) return authError;

  const { data, error } = await supabase
    .from("service_pricing")
    .select("*")
    .order("display_name");

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ services: data });
}

export async function PUT(request: NextRequest) {
  const putAuthError = requireAdmin(request);
  if (putAuthError) return putAuthError;

  const body = await request.json();

  if (!body.id) {
    return NextResponse.json({ error: "Missing service id" }, { status: 400 });
  }

  const { id, ...updates } = body;

  const { data, error } = await supabase
    .from("service_pricing")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ service: data });
}
