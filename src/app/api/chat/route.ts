import { NextRequest, NextResponse } from "next/server";
import { processChat } from "@/lib/ai/chat";
import { supabase } from "@/lib/supabase";

export const runtime = "nodejs";
export const maxDuration = 60;

const MAX_MESSAGES_PER_SESSION = 40; // ~20 user messages + ~20 bot replies
const MIN_INTERVAL_MS = 2000; // 2 seconds between messages

export async function POST(request: NextRequest) {
  try {
    const { session_id, message, image } = await request.json();

    if (!session_id || !message) {
      return NextResponse.json(
        { error: "Missing session_id or message" },
        { status: 400 },
      );
    }

    // Validate message length
    if (typeof message !== "string" || message.length > 2000) {
      return NextResponse.json(
        { error: "Message too long" },
        { status: 400 },
      );
    }

    // Validate image if provided (base64 string, max ~5MB)
    if (image && (typeof image !== "string" || image.length > 7_000_000)) {
      return NextResponse.json(
        { error: "Image too large. Please use a smaller photo." },
        { status: 400 },
      );
    }

    // Load session and check limits
    const { data: session, error: sessionError } = await supabase
      .from("chat_sessions")
      .select("messages, status, extracted_details")
      .eq("id", session_id)
      .single();

    if (sessionError || !session) {
      return NextResponse.json(
        { error: "Session not found" },
        { status: 404 },
      );
    }

    // Validate IP ownership — only the IP that created the session can post to it
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
    const sessionIp = (session.extracted_details as Record<string, unknown>)?.client_ip;
    if (sessionIp && sessionIp !== ip) {
      return NextResponse.json(
        { error: "Forbidden" },
        { status: 403 },
      );
    }

    // Block if session is already resolved/handed off
    if (session.status !== "active") {
      return NextResponse.json(
        { error: "This conversation has ended. Start a new chat or call (561) 576-7667." },
        { status: 400 },
      );
    }

    const msgs = (session.messages || []) as { timestamp?: string }[];

    // Check message count limit
    if (msgs.length >= MAX_MESSAGES_PER_SESSION) {
      return NextResponse.json(
        { error: "limit_reached" },
        { status: 429 },
      );
    }

    // Check rate limit (time since last message)
    if (msgs.length > 0) {
      const lastMsg = msgs[msgs.length - 1];
      if (lastMsg.timestamp) {
        const elapsed = Date.now() - new Date(lastMsg.timestamp).getTime();
        if (elapsed < MIN_INTERVAL_MS) {
          return NextResponse.json(
            { error: "Too fast — give me a sec!" },
            { status: 429 },
          );
        }
      }
    }

    const stream = await processChat(session_id, message, image || undefined);

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (err) {
    console.error("Chat error:", err);
    return NextResponse.json(
      { error: "Chat processing failed" },
      { status: 500 },
    );
  }
}
