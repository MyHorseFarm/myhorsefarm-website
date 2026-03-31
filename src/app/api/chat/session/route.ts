import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export const runtime = "nodejs";

const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 10;
const WINDOW_MS = 60 * 60 * 1000; // 1 hour

export async function POST(request: NextRequest) {
  // Simple IP-based rate limiting
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (entry && now < entry.resetAt) {
    if (entry.count >= RATE_LIMIT) {
      return NextResponse.json(
        { error: "Too many sessions. Please try again later." },
        { status: 429 },
      );
    }
    entry.count++;
  } else {
    rateLimitMap.set(ip, { count: 1, resetAt: now + WINDOW_MS });
  }

  try {
    const { data: session, error } = await supabase
      .from("chat_sessions")
      .insert({
        messages: [],
        status: "active",
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
