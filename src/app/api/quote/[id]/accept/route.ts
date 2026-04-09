import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { updateDealStage, STAGE_QUOTED } from "@/lib/hubspot";
import { verifySignedToken } from "@/lib/url-signing";

export const runtime = "nodejs";

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    // Require valid token to accept
    const token = _request.nextUrl.searchParams.get("token");
    if (!token || !verifySignedToken("quote", id, token)) {
      return NextResponse.json(
        { error: "Invalid or missing token" },
        { status: 403 },
      );
    }

    const { data: quote, error } = await supabase
      .from("quotes")
      .select("*")
      .eq("id", id)
      .single();

    if (error || !quote) {
      return NextResponse.json({ error: "Quote not found" }, { status: 404 });
    }

    if (quote.status !== "pending") {
      return NextResponse.json(
        { error: `Quote cannot be accepted (status: ${quote.status})` },
        { status: 400 },
      );
    }

    // Check expiry
    if (new Date(quote.expires_at) < new Date()) {
      await supabase.from("quotes").update({ status: "expired" }).eq("id", id);
      return NextResponse.json({ error: "Quote has expired" }, { status: 400 });
    }

    // Update status
    const { error: updateError } = await supabase
      .from("quotes")
      .update({ status: "accepted" })
      .eq("id", id);

    if (updateError) throw new Error(`Supabase: ${updateError.message}`);

    // Update HubSpot deal stage (keep at Quoted — will move to Scheduled when booking is made)
    if (quote.hubspot_deal_id) {
      try {
        await updateDealStage(quote.hubspot_deal_id, STAGE_QUOTED);
      } catch (err) {
        console.error("HubSpot update error (non-fatal):", err);
      }
    }

    return NextResponse.json({ ok: true, status: "accepted" });
  } catch (err) {
    console.error("Quote accept error:", err);
    return NextResponse.json(
      { error: "Failed to accept quote" },
      { status: 500 },
    );
  }
}
