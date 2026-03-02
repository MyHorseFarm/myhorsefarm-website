import { NextRequest, NextResponse } from "next/server";
import { processChat } from "@/lib/ai/chat";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(request: NextRequest) {
  try {
    const { session_id, message, image } = await request.json();

    if (!session_id || !message) {
      return NextResponse.json(
        { error: "Missing session_id or message" },
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
