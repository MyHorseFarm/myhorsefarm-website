import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export const runtime = "nodejs";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  const { data: quote, error } = await supabase
    .from("quotes")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !quote) {
    return NextResponse.json({ error: "Quote not found" }, { status: 404 });
  }

  // Also fetch the service display name
  const { data: service } = await supabase
    .from("service_pricing")
    .select("display_name, description, unit")
    .eq("service_key", quote.service_key)
    .single();

  return NextResponse.json({
    ...quote,
    service_display_name: service?.display_name ?? quote.service_key,
    service_description: service?.description ?? "",
    service_unit: service?.unit ?? "",
  });
}
