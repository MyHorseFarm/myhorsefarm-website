import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { createPortalUrl } from "@/lib/portal-auth";
import { sendEmail, createUnsubscribeUrl, portalLoginEmail } from "@/lib/emails";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const { email } = (await request.json()) as { email?: string };

    if (!email || typeof email !== "string") {
      return NextResponse.json({ ok: true }); // No email enumeration
    }

    const normalizedEmail = email.trim().toLowerCase();

    // Look up recurring customer by email
    const { data: customer } = await supabase
      .from("recurring_customers")
      .select("id, name")
      .eq("email", normalizedEmail)
      .eq("active", true)
      .maybeSingle();

    if (customer) {
      const portalUrl = createPortalUrl(normalizedEmail, customer.id);
      const unsubUrl = createUnsubscribeUrl(normalizedEmail);
      const firstname = customer.name.split(" ")[0];
      const template = portalLoginEmail(firstname, portalUrl, unsubUrl);
      await sendEmail(normalizedEmail, template.subject, template.html);
    }

    // Always return ok (no email enumeration)
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Portal login error:", err);
    return NextResponse.json({ ok: true });
  }
}
