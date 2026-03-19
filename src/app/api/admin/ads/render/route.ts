import { NextRequest, NextResponse } from "next/server";
import { triggerAdRender } from "@/lib/remotion";
import { uploadAdImages } from "@/lib/supabase-storage";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(req: NextRequest) {
  // Auth check
  const auth = req.headers.get("authorization");
  if (auth !== `Bearer ${process.env.ADMIN_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { images, headline, description, ctaText, serviceName } = body;

    if (!images?.length || !headline || !description || !ctaText) {
      return NextResponse.json(
        { error: "Missing required fields: images, headline, description, ctaText" },
        { status: 400 }
      );
    }

    // Upload base64 images to Supabase Storage so Lambda can fetch them
    const imageUrls = await uploadAdImages(images);

    // Trigger Lambda render
    const job = await triggerAdRender({
      inputProps: {
        images: imageUrls,
        headline,
        description,
        ctaText,
        serviceName,
      },
    });

    return NextResponse.json({ job });
  } catch (err) {
    console.error("Render trigger error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to trigger render" },
      { status: 500 }
    );
  }
}
