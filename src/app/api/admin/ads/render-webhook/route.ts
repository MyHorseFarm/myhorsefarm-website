import { NextRequest, NextResponse } from "next/server";
import { createHmac } from "crypto";
import {
  handleAdRenderComplete,
  handleAdRenderFailed,
} from "@/lib/remotion";

export const runtime = "nodejs";

interface WebhookPayload {
  type: "success" | "error" | "timeout";
  renderId: string;
  expectedBucketOwner: string;
  outputUrl?: string;
  errors?: { message: string }[];
  customData?: Record<string, unknown>;
}

function validateSignature(secret: string, body: string, signature: string): boolean {
  const expected = createHmac("sha512", secret).update(body).digest("hex");
  return `sha512=${expected}` === signature;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.text();
    const payload = JSON.parse(body) as WebhookPayload;

    // Validate webhook signature — fail-closed if secret is not configured
    const secret = process.env.REMOTION_WEBHOOK_SECRET;
    if (!secret) {
      return NextResponse.json(
        { error: "Webhook secret not configured" },
        { status: 401 }
      );
    }

    const signature = req.headers.get("x-remotion-signature");
    if (!signature || !validateSignature(secret, body, signature)) {
      return NextResponse.json(
        { error: "Invalid signature" },
        { status: 401 }
      );
    }

    const jobId = (payload.customData as { jobId?: string })?.jobId;
    if (!jobId) {
      console.error("Webhook missing jobId in customData");
      return NextResponse.json({ error: "Missing jobId" }, { status: 400 });
    }

    if (payload.type === "success" && payload.outputUrl) {
      await handleAdRenderComplete(jobId, payload.outputUrl);
    } else if (payload.type === "error" || payload.type === "timeout") {
      const errMsg =
        payload.type === "timeout"
          ? "Render timed out"
          : payload.errors?.map((e) => e.message).join("; ") ||
            "Render failed";
      await handleAdRenderFailed(jobId, errMsg);
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Webhook error:", err);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    );
  }
}
