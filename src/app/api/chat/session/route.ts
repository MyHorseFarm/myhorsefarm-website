import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export const runtime = "nodejs";

const RATE_LIMIT = 10; // max sessions per IP per hour

export async function POST(request: NextRequest) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";

  try {
    // Rate limit: count recent sessions created by this IP in the last hour
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
    const { count, error: countError } = await supabase
      .from("chat_sessions")
      .select("*", { count: "exact", head: true })
      .eq("extracted_details->>client_ip", ip)
      .gte("created_at", oneHourAgo);

    if (countError) {
      console.error("Rate limit check error:", countError.message);
      // Allow the request if the rate limit check fails
    } else if (count !== null && count >= RATE_LIMIT) {
      return NextResponse.json(
        { error: "Too many sessions. Please try again later." },
        { status: 429 },
      );
    }

    const { data: session, error } = await supabase
      .from("chat_sessions")
      .insert({
        messages: [],
        status: "active",
        extracted_details: { client_ip: ip },
      })
      .select()
      .single();

    if (error) throw new Error(`Supabase: ${error.message}`);

    return NextResponse.json({ session_id: session.id });
  } catch (err) {
    console.error("Chat session creation error:", err);
    return NextResponse.json(
      { error: "Failed to create chat session" },
      { status: 500 },
    );
  }
}
