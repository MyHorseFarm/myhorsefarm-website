import { NextRequest, NextResponse } from "next/server";
import { processChat } from "@/lib/ai/chat";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(request: NextRequest) {
  try {
    const { session_id, message } = await request.json();

    if (!session_id || !message) {
      return NextResponse.json(
        { error: "Missing session_id or message" },
        { status: 400 },
      );
    }

    const stream = await processChat(session_id, message);

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
