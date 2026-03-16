import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { verifyPortalToken } from "@/lib/portal-auth";
import {
  findContactByEmail,
  createContactNote,
} from "@/lib/hubspot";

export const runtime = "nodejs";

/**
 * POST /api/portal/subscription
 * Actions: pause, resume, cancel
 * Requires portal auth token.
 */
export async function POST(request: NextRequest) {
  const auth = request.headers.get("authorization");
  if (!auth?.startsWith("Bearer ")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const token = auth.slice(7);
  const payload = verifyPortalToken(token);
  if (!payload) {
    return NextResponse.json({ error: "Invalid or expired token" }, { status: 401 });
  }

  const { customerId } = payload;
  const body = await request.json();
  const { action, reason, feedback } = body as {
    action: "pause" | "resume" | "cancel";
    reason?: string;
    feedback?: string;
  };

  if (!["pause", "resume", "cancel"].includes(action)) {
    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  }

  // Fetch customer
  const { data: customer } = await supabase
    .from("recurring_customers")
    .select("*")
    .eq("id", customerId)
    .single();

  if (!customer) {
    return NextResponse.json({ error: "Customer not found" }, { status: 404 });
  }

  const notePrefix = `[AUTO:SUBSCRIPTION_${action.toUpperCase()}]`;
  const timestamp = new Date().toISOString();

  if (action === "pause") {
    // Pause: set paused_at, keep active=true but auto_charge=false
    await supabase
      .from("recurring_customers")
      .update({
        auto_charge: false,
        notes: [customer.notes, `Paused on ${timestamp}. Reason: ${reason || "Not specified"}`]
          .filter(Boolean)
          .join("\n"),
      })
      .eq("id", customerId);

    // HubSpot note
    try {
      const contact = await findContactByEmail(customer.email);
      if (contact) {
        await createContactNote(
          contact.id,
          `${notePrefix} Service paused. Reason: ${reason || "Not specified"}. ${timestamp}`,
        );
      }
    } catch { /* non-fatal */ }

    return NextResponse.json({ ok: true, status: "paused" });
  }

  if (action === "resume") {
    // Resume: re-enable auto_charge, set next_charge_date to tomorrow
    const tomorrow = new Date(Date.now() + 86400000).toISOString().split("T")[0];
    await supabase
      .from("recurring_customers")
      .update({
        auto_charge: true,
        next_charge_date: tomorrow,
        notes: [customer.notes, `Resumed on ${timestamp}`]
          .filter(Boolean)
          .join("\n"),
      })
      .eq("id", customerId);

    try {
      const contact = await findContactByEmail(customer.email);
      if (contact) {
        await createContactNote(
          contact.id,
          `${notePrefix} Service resumed. Next charge: ${tomorrow}. ${timestamp}`,
        );
      }
    } catch { /* non-fatal */ }

    return NextResponse.json({ ok: true, status: "active" });
  }

  if (action === "cancel") {
    // Cancel: set active=false, auto_charge=false
    await supabase
      .from("recurring_customers")
      .update({
        active: false,
        auto_charge: false,
        notes: [customer.notes, `Cancelled on ${timestamp}. Reason: ${reason || "Not specified"}. Feedback: ${feedback || "None"}`]
          .filter(Boolean)
          .join("\n"),
      })
      .eq("id", customerId);

    try {
      const contact = await findContactByEmail(customer.email);
      if (contact) {
        await createContactNote(
          contact.id,
          `${notePrefix} Service cancelled. Reason: ${reason || "Not specified"}. ${timestamp}`,
        );
      }
    } catch { /* non-fatal */ }

    return NextResponse.json({ ok: true, status: "cancelled" });
  }

  return NextResponse.json({ error: "Unknown action" }, { status: 400 });
}
