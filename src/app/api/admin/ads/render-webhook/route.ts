import { NextRequest, NextResponse } from "next/server";
import {
  validateWebhookSignature,
  type WebhookPayload,
} from "@remotion/lambda/client";
import {
  handleAdRenderComplete,
  handleAdRenderFailed,
} from "@/lib/remotion";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const body = await req.text();
    const payload = JSON.parse(body) as WebhookPayload;

    // Validate webhook signature if secret is set
    const secret = process.env.REMOTION_WEBHOOK_SECRET;
    if (secret) {
      const signature = req.headers.get("x-remotion-signature");
      if (!signature) {
        return NextResponse.json(
          { error: "Missing signature" },
          { status: 401 }
        );
      }

      try {
        validateWebhookSignature({
          secret,
          body,
          signatureHeader: signature,
        });
      } catch {
        return NextResponse.json(
          { error: "Invalid signature" },
          { status: 401 }
        );
      }
    }

    const jobId = (payload.customData as { jobId?: string })?.jobId;
    if (!jobId) {
      console.error("Webhook missing jobId in customData");
      return NextResponse.json({ error: "Missing jobId" }, { status: 400 });
    }

    if (payload.type === "success") {
      await handleAdRenderComplete(jobId, payload.outputUrl!);
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
