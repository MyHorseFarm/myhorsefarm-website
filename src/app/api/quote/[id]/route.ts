import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { verifySignedToken } from "@/lib/url-signing";

export const runtime = "nodejs";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const token = _request.nextUrl.searchParams.get("token");

  const { data: quote, error } = await supabase
    .from("quotes")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !quote) {
    return NextResponse.json({ error: "Quote not found" }, { status: 404 });
  }

  // Verify token if provided; determine access level
  const hasValidToken = token
    ? verifySignedToken("quote", id, token)
    : false;

  // Also fetch the service display name
  const { data: service } = await supabase
    .from("service_pricing")
    .select("display_name, description, unit")
    .eq("service_key", quote.service_key)
    .single();

  if (hasValidToken) {
    // Full data but strip internal CRM IDs
    const { hubspot_contact_id: _hubspot_contact_id, hubspot_deal_id: _hubspot_deal_id, ...safeQuote } = quote;
    return NextResponse.json({
      ...safeQuote,
      service_display_name: service?.display_name ?? quote.service_key,
      service_description: service?.description ?? "",
      service_unit: service?.unit ?? "",
    });
  }

  // No valid token — return only non-PII fields
  return NextResponse.json({
    id: quote.id,
    quote_number: quote.quote_number,
    status: quote.status,
    total_amount: quote.estimated_amount,
    service_type: quote.service_key,
    valid_until: quote.expires_at,
    service_display_name: service?.display_name ?? quote.service_key,
  });
}
