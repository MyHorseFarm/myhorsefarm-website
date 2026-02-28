import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export const runtime = "nodejs";

export async function POST() {
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
