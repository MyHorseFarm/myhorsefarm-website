import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { rateLimit } from "@/lib/rate-limit";
import { createPortalUrl } from "@/lib/portal-auth";
import type { CustomerType } from "@/lib/portal-auth";
import { sendEmail, createUnsubscribeUrl, portalLoginEmail } from "@/lib/emails";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
    const { allowed } = await rateLimit(ip, "portal-login", 3, 900);
    if (!allowed) {
      return NextResponse.json({ ok: true }); // Don't reveal rate limiting
    }

    const { email } = (await request.json()) as { email?: string };

    if (!email || typeof email !== "string") {
      return NextResponse.json({ ok: true }); // No email enumeration
    }

    const normalizedEmail = email.trim().toLowerCase();

    let customerId: string | null = null;
    let customerName: string | null = null;
    let customerType: CustomerType | null = null;

    // 1. Check recurring customers first (highest priority)
    const { data: recurringCustomer } = await supabase
      .from("recurring_customers")
      .select("id, name")
      .eq("email", normalizedEmail)
      .eq("active", true)
      .maybeSingle();

    if (recurringCustomer) {
      customerId = recurringCustomer.id;
      customerName = recurringCustomer.name;
      customerType = "recurring";
    }

    // 2. Check quotes table
    if (!customerId) {
      const { data: quote } = await supabase
        .from("quotes")
        .select("id, customer_name")
        .eq("customer_email", normalizedEmail)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (quote) {
        customerId = quote.id;
        customerName = quote.customer_name;
        customerType = "quote";
      }
    }

    // 3. Check bookings table
    if (!customerId) {
      const { data: booking } = await supabase
        .from("bookings")
        .select("id, customer_name")
        .eq("customer_email", normalizedEmail)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (booking) {
        customerId = booking.id;
        customerName = booking.customer_name;
        customerType = "booking";
      }
    }

    // Send magic link if found in any table
    if (customerId && customerName && customerType) {
      const portalUrl = createPortalUrl(normalizedEmail, customerId, customerType);
      const unsubUrl = createUnsubscribeUrl(normalizedEmail);
      const firstname = customerName.split(" ")[0];
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
