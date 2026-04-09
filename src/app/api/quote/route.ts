import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { rateLimit } from "@/lib/rate-limit";
import { getServiceByKey, calculateQuote } from "@/lib/pricing";
import {
  findContactByEmail,
  createContact,
  createDeal,
  findActiveDealForContact,
  updateDealStage,
  createContactNote,
  STAGE_QUOTED,
} from "@/lib/hubspot";
import {
  sendEmail,
  createUnsubscribeUrl,
  quoteConfirmationEmail,
  siteVisitRequestEmail,
} from "@/lib/emails";
import { EMAIL_SALES, PHONE_CELL_TEL } from "@/lib/constants";
import { sendMetaEvent } from "@/lib/meta-capi";
import { buildSignedUrl, generateSignedToken } from "@/lib/url-signing";
import type { QuoteRequest } from "@/lib/types";

export const runtime = "nodejs";
export const maxDuration = 30;

export async function POST(request: NextRequest) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";

  // Supabase-based rate limiting: 5 per IP per hour (works across serverless instances)
  const { allowed } = await rateLimit(ip, "quote", 5, 3600);

  if (!allowed) {
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      { status: 429 },
    );
  }

  try {
    const body = (await request.json()) as QuoteRequest;

    // Validate required fields
    if (
      !body.service_key ||
      !body.customer_name ||
      !body.customer_email ||
      !body.customer_phone ||
      !body.customer_location
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    // Look up service pricing
    const service = await getServiceByKey(body.service_key);
    if (!service) {
      return NextResponse.json(
        { error: "Service not found" },
        { status: 404 },
      );
    }

    // Calculate price
    const tier = (body.service_tier === "premium" ? "premium" : "standard") as "standard" | "premium";
    const breakdown = calculateQuote(service, body.property_details || {}, tier);

    // Apply referral discount if valid code
    let referralCode: string | null = null;
    if (body.referral_code) {
      const { data: referral } = await supabase
        .from("referrals")
        .select("*")
        .eq("referral_code", body.referral_code)
        .eq("status", "pending")
        .single();

      if (referral) {
        const discount = Number(referral.referee_discount_amount) || 25;
        if (breakdown.total > discount) {
          breakdown.adjustments.push({
            label: "Referral discount",
            amount: -discount,
          });
          breakdown.total = Math.round((breakdown.total - discount) * 100) / 100;
        }
        referralCode = body.referral_code;
      }
    }

    // Generate quote number: MHF-Q-YYYYMMDD-NNN
    const today = new Date().toISOString().split("T")[0].replace(/-/g, "");
    const { count } = await supabase
      .from("quotes")
      .select("*", { count: "exact", head: true })
      .like("quote_number", `MHF-Q-${today}%`);
    const seq = String((count ?? 0) + 1).padStart(3, "0");
    const quoteNumber = `MHF-Q-${today}-${seq}`;

    const status = service.requires_site_visit ? "pending_site_visit" : "pending";
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();

    // Insert quote into Supabase
    const { data: quote, error: insertError } = await supabase
      .from("quotes")
      .insert({
        quote_number: quoteNumber,
        status,
        customer_name: body.customer_name,
        customer_email: body.customer_email,
        customer_phone: body.customer_phone,
        customer_location: body.customer_location,
        service_key: body.service_key,
        property_details: body.property_details || {},
        estimated_amount: breakdown.total,
        pricing_breakdown: breakdown,
        requires_site_visit: service.requires_site_visit,
        source: body.source || "form",
        chat_session_id: body.chat_session_id || null,
        referral_code: referralCode,
        expires_at: expiresAt,
        service_tier: tier,
        ...(body.utm_params ? { utm_params: body.utm_params } : {}),
      })
      .select()
      .single();

    if (insertError) throw new Error(`Supabase insert: ${insertError.message}`);

    // Link referral to this quote
    if (referralCode) {
      await supabase
        .from("referrals")
        .update({
          referee_name: body.customer_name,
          referee_email: body.customer_email,
          referee_quote_id: quote.id,
          status: "signed_up",
        })
        .eq("referral_code", referralCode)
        .eq("status", "pending");
    }

    // HubSpot: find or create contact, create deal at Quoted stage
    let hubspotContactId: string | null = null;
    let hubspotDealId: string | null = null;

    try {
      let contact = await findContactByEmail(body.customer_email);
      if (!contact) {
        const nameParts = body.customer_name.split(" ");
        contact = await createContact(
          body.customer_email,
          nameParts[0] || body.customer_name,
          nameParts.slice(1).join(" ") || "",
          body.customer_phone,
        );
      }
      hubspotContactId = contact.id;

      // Reuse active deal if one exists for this contact, otherwise create new
      const existingDeal = await findActiveDealForContact(contact.id);
      let deal;
      if (existingDeal) {
        deal = existingDeal;
        await updateDealStage(existingDeal.id, STAGE_QUOTED);
      } else {
        deal = await createDeal(
          contact.id,
          `${service.display_name} – ${body.customer_name}`,
          String(breakdown.total),
          STAGE_QUOTED,
        );
      }
      hubspotDealId = deal.id;

      await createContactNote(
        contact.id,
        `[QUOTE:${quoteNumber}] Quote created via ${body.source || "form"} for ${service.display_name}. Amount: $${breakdown.total}`,
      );

      // Update quote with HubSpot IDs
      await supabase
        .from("quotes")
        .update({
          hubspot_contact_id: hubspotContactId,
          hubspot_deal_id: hubspotDealId,
        })
        .eq("id", quote.id);
    } catch (err) {
      console.error("HubSpot sync error (non-fatal):", err);
    }

    // Send email
    try {
      const unsub = createUnsubscribeUrl(body.customer_email);
      if (service.requires_site_visit) {
        const template = siteVisitRequestEmail(
          body.customer_name.split(" ")[0],
          service.display_name,
          quoteNumber,
          unsub,
        );
        await sendEmail(body.customer_email, template.subject, template.html);

        // Internal notification to Jose
        const internalTemplate = siteVisitRequestEmail(
          "Jose",
          `${service.display_name} – ${body.customer_name} (${body.customer_phone})`,
          quoteNumber,
          unsub,
        );
        await sendEmail(EMAIL_SALES, internalTemplate.subject, internalTemplate.html);
      } else {
        const quoteUrl = buildSignedUrl(`/quote/${quote.id}`, "quote", quote.id);
        const template = quoteConfirmationEmail(
          body.customer_name.split(" ")[0],
          quoteNumber,
          service.display_name,
          breakdown,
          quoteUrl,
          unsub,
        );
        await sendEmail(body.customer_email, template.subject, template.html);
      }
    } catch (err) {
      console.error("Email send error (non-fatal):", err);
    }

    // Instant lead alert email to Jose — speed to lead (non-fatal)
    try {
      const esc = (s: string) => s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
      const safeName = esc(body.customer_name);
      const safePhone = esc(body.customer_phone);
      const safeEmail = esc(body.customer_email);
      const safeLocation = esc(body.customer_location);
      const utmSource = body.utm_params?.utm_medium === "cpc" ? "GOOGLE ADS"
        : body.utm_params?.utm_source === "facebook" ? "FACEBOOK AD"
        : (body.source || "form").toUpperCase();
      const isPaid = utmSource === "GOOGLE ADS" || utmSource === "FACEBOOK AD";
      const tag = isPaid ? " [PAID AD]" : "";
      const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.myhorsefarm.com";
      const alertSubject = `🚨 NEW LEAD${tag}: ${safeName} - ${service.display_name} $${breakdown.total}`;
      const alertHtml = `
        <div style="font-family:Arial,sans-serif;max-width:500px;margin:0 auto;">
          <div style="background:${isPaid ? "#c62828" : "#2d5016"};color:#fff;padding:15px 20px;border-radius:8px 8px 0 0;">
            <h2 style="margin:0;font-size:18px;">🚨 NEW LEAD${tag}</h2>
          </div>
          <div style="background:#fff;border:1px solid #e5e7eb;padding:20px;border-radius:0 0 8px 8px;">
            <table style="width:100%;font-size:15px;">
              <tr><td style="padding:8px 0;color:#666;">Name</td><td style="padding:8px 0;font-weight:bold;">${safeName}</td></tr>
              <tr><td style="padding:8px 0;color:#666;">Phone</td><td style="padding:8px 0;font-weight:bold;"><a href="tel:${safePhone}" style="color:#2d5016;">${safePhone}</a></td></tr>
              <tr><td style="padding:8px 0;color:#666;">Email</td><td style="padding:8px 0;"><a href="mailto:${safeEmail}" style="color:#2d5016;">${safeEmail}</a></td></tr>
              <tr><td style="padding:8px 0;color:#666;">Service</td><td style="padding:8px 0;">${service.display_name}</td></tr>
              <tr><td style="padding:8px 0;color:#666;">Amount</td><td style="padding:8px 0;font-weight:bold;font-size:18px;color:#2d5016;">$${breakdown.total.toFixed(2)}</td></tr>
              <tr><td style="padding:8px 0;color:#666;">Location</td><td style="padding:8px 0;">${safeLocation}</td></tr>
              <tr><td style="padding:8px 0;color:#666;">Source</td><td style="padding:8px 0;font-weight:bold;color:${isPaid ? "#c62828" : "#333"};">${utmSource}</td></tr>
              <tr><td style="padding:8px 0;color:#666;">Quote</td><td style="padding:8px 0;">${quoteNumber}</td></tr>
            </table>
            <div style="margin-top:15px;text-align:center;">
              <a href="tel:${safePhone}" style="display:inline-block;padding:12px 30px;background:#2d5016;color:#fff;text-decoration:none;border-radius:6px;font-size:16px;font-weight:bold;">📞 Call Now</a>
            </div>
            ${isPaid ? '<p style="margin-top:15px;text-align:center;color:#c62828;font-weight:bold;font-size:13px;">⚡ PAID LEAD — Call within 5 minutes!</p>' : ""}
          </div>
        </div>
      `;
      const joseEmail = process.env.ADMIN_EMAIL || "manureservice@gmail.com";
      const { Resend } = await import("resend");
      const resend = new Resend(process.env.RESEND_API_KEY);
      await resend.emails.send({
        from: process.env.RESEND_FROM_EMAIL || "My Horse Farm <onboarding@resend.dev>",
        to: joseEmail,
        subject: alertSubject,
        html: alertHtml,
      });
    } catch (err) {
      console.error("Lead alert email error (non-fatal):", err);
    }

    // Meta CAPI: send Lead event (non-fatal)
    try {
      const nameParts = body.customer_name.split(" ");
      await sendMetaEvent({
        event_name: "Lead",
        event_id: body.event_id,
        event_source_url: `${process.env.NEXT_PUBLIC_SITE_URL || "https://www.myhorsefarm.com"}/quote`,
        user_data: {
          email: body.customer_email,
          phone: body.customer_phone,
          first_name: nameParts[0],
          last_name: nameParts.slice(1).join(" "),
          fbc: body.fbc,
          fbp: body.fbp,
          client_ip_address: request.headers.get("x-forwarded-for")?.split(",")[0] || undefined,
          client_user_agent: request.headers.get("user-agent") || undefined,
        },
        custom_data: {
          currency: "USD",
          value: breakdown.total,
          content_name: service.display_name,
        },
      });
    } catch (err) {
      console.error("Meta CAPI error (non-fatal):", err);
    }

    // Set segment cookie for retargeting
    const res = NextResponse.json({
      ok: true,
      quote: {
        id: quote.id,
        quote_number: quoteNumber,
        estimated_amount: breakdown.total,
        pricing_breakdown: breakdown,
        requires_site_visit: service.requires_site_visit,
        status,
        token: generateSignedToken("quote", quote.id),
      },
    });
    res.cookies.set("mhf_segment", "quoted", {
      maxAge: 60 * 60 * 24 * 90,
      path: "/",
      sameSite: "lax",
    });
    return res;
  } catch (err) {
    console.error("Quote creation error:", err);
    return NextResponse.json(
      { error: "Failed to create quote" },
      { status: 500 },
    );
  }
}
