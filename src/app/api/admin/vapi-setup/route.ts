import { NextRequest, NextResponse } from "next/server";
import {
  createAssistant,
  updateAssistant,
  getAssistant,
  assignPhoneNumber,
} from "@/lib/vapi";

export const runtime = "nodejs";
export const maxDuration = 30;

function checkAuth(request: NextRequest): boolean {
  const auth = request.headers.get("authorization");
  return auth === `Bearer ${process.env.ADMIN_SECRET}`;
}

/**
 * POST /api/admin/vapi-setup
 *
 * Create or update the Vapi voice assistant and optionally assign it
 * to the configured phone number.
 *
 * Body (optional):
 *   { "assistantId": "existing-id", "assignPhone": true }
 *
 * If assistantId is provided, updates that assistant.
 * If not, creates a new one.
 * If assignPhone is true (default), links the assistant to the phone number.
 *
 * Requires: Authorization: Bearer <ADMIN_SECRET>
 */
export async function POST(request: NextRequest) {
  if (!checkAuth(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!process.env.VAPI_API_KEY) {
    return NextResponse.json(
      { error: "VAPI_API_KEY environment variable is not set" },
      { status: 500 },
    );
  }

  let body: { assistantId?: string; assignPhone?: boolean } = {};
  try {
    body = await request.json();
  } catch {
    // Empty body is fine — will create new assistant
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.myhorsefarm.com";
  const webhookUrl = `${siteUrl}/api/webhooks/vapi`;
  const assignPhone = body.assignPhone !== false; // default true

  try {
    let assistant;
    const existingId = body.assistantId || process.env.VAPI_ASSISTANT_ID;

    if (existingId) {
      // Verify the assistant exists before updating
      try {
        await getAssistant(existingId);
        assistant = await updateAssistant(existingId, webhookUrl);
        console.info(`[Vapi Setup] Updated assistant: ${assistant.id}`);
      } catch {
        // Assistant not found — create new one
        console.info(`[Vapi Setup] Assistant ${existingId} not found, creating new one`);
        assistant = await createAssistant(webhookUrl);
        console.info(`[Vapi Setup] Created new assistant: ${assistant.id}`);
      }
    } else {
      assistant = await createAssistant(webhookUrl);
      console.info(`[Vapi Setup] Created new assistant: ${assistant.id}`);
    }

    // Assign to phone number
    let phoneAssigned = false;
    if (assignPhone && process.env.VAPI_PHONE_NUMBER_ID) {
      try {
        await assignPhoneNumber(assistant.id);
        phoneAssigned = true;
        console.info(`[Vapi Setup] Assigned assistant to phone number`);
      } catch (err) {
        console.error("[Vapi Setup] Phone assignment error:", err);
      }
    }

    return NextResponse.json({
      ok: true,
      assistantId: assistant.id,
      assistantName: assistant.name,
      webhookUrl,
      phoneAssigned,
      instructions: [
        `Save the assistant ID in your .env.local: VAPI_ASSISTANT_ID=${assistant.id}`,
        phoneAssigned
          ? "Phone number has been assigned to the assistant."
          : "Set VAPI_PHONE_NUMBER_ID in .env.local and run this endpoint again to assign the phone number.",
        "Set VAPI_WEBHOOK_SECRET in .env.local to secure the webhook endpoint.",
        `Webhook URL: ${webhookUrl}`,
      ],
    });
  } catch (err) {
    console.error("[Vapi Setup] Error:", err);
    return NextResponse.json(
      {
        error: "Failed to set up Vapi assistant",
        details: err instanceof Error ? err.message : String(err),
      },
      { status: 500 },
    );
  }
}

/**
 * GET /api/admin/vapi-setup
 *
 * Check the current Vapi assistant configuration.
 */
export async function GET(request: NextRequest) {
  if (!checkAuth(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const assistantId = process.env.VAPI_ASSISTANT_ID;
  if (!assistantId) {
    return NextResponse.json({
      configured: false,
      message: "No VAPI_ASSISTANT_ID set. POST to this endpoint to create one.",
    });
  }

  try {
    const assistant = await getAssistant(assistantId);
    return NextResponse.json({
      configured: true,
      assistantId: assistant.id,
      assistantName: assistant.name,
      phoneNumberId: process.env.VAPI_PHONE_NUMBER_ID || null,
    });
  } catch (err) {
    return NextResponse.json({
      configured: false,
      assistantId,
      error: err instanceof Error ? err.message : "Failed to fetch assistant",
    });
  }
}
