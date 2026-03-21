import { NextRequest, NextResponse } from "next/server";
import { triggerAdRender } from "@/lib/remotion";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(req: NextRequest) {
  const auth = req.headers.get("authorization");
  if (auth !== `Bearer ${process.env.ADMIN_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { imageUrls, headline, description, ctaText, serviceName } = body;

    if (!imageUrls?.length || !headline || !description || !ctaText) {
      return NextResponse.json(
        { error: "Missing required fields: imageUrls, headline, description, ctaText" },
        { status: 400 }
      );
    }

    // Trigger Lambda render (images are already uploaded as URLs)
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
