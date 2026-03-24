import { NextRequest, NextResponse } from "next/server";
import { after } from "next/server";
import { triggerAdRender, triggerLambdaInBackground } from "@/lib/remotion";

export const runtime = "nodejs";
export const maxDuration = 300;

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

    const inputProps = { images: imageUrls, headline, description, ctaText, serviceName };

    // Create the job record and return immediately
    const job = await triggerAdRender({ inputProps });

    // Trigger Lambda in the background — runs after the response is sent
    after(async () => {
      await triggerLambdaInBackground(job.id, inputProps);
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
