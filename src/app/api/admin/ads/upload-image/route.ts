import { NextRequest, NextResponse } from "next/server";
import { uploadAdImage } from "@/lib/supabase-storage";

export const runtime = "nodejs";
export const maxDuration = 30;

export async function POST(req: NextRequest) {
  const auth = req.headers.get("authorization");
  if (auth !== `Bearer ${process.env.ADMIN_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { image, index } = await req.json();
    if (!image) {
      return NextResponse.json({ error: "Missing image" }, { status: 400 });
    }

    const url = await uploadAdImage(image, `ad-image-${index || 0}.jpg`);
    return NextResponse.json({ url });
  } catch (err) {
    console.error("Image upload error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Upload failed" },
      { status: 500 }
    );
  }
}
