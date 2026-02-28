import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { getServiceByKey, calculateQuote } from "@/lib/pricing";
import {
  findContactByEmail,
  createContact,
  createDeal,
  createContactNote,
  STAGE_QUOTED,
} from "@/lib/hubspot";
import {
  sendEmail,
  createUnsubscribeUrl,
  quoteConfirmationEmail,
  siteVisitRequestEmail,
} from "@/lib/emails";
import { EMAIL_SALES } from "@/lib/constants";
import type { QuoteRequest } from "@/lib/types";

export const runtime = "nodejs";
export const maxDuration = 30;

export async function POST(request: NextRequest) {
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
    const breakdown = calculateQuote(service, body.property_details || {});

    // Generate quote number: MHF-Q-YYYYMMDD-NNN
    const today = new Date().toISOString().split("T")[0].replace(/-/g, "");
    const { count } = await supabase
      .from("quotes")
      .select("*", { count: "exact", head: true })
      .like("quote_number", `MHF-Q-${today}%`);
    const seq = String((count ?? 0) + 1).padStart(3, "0");
    const quoteNumber = `MHF-Q-${today}-${seq}`;

    const status = service.requires_site_visit ? "pending_site_visit" : "pending";
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();

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
        expires_at: expiresAt,
      })
      .select()
      .single();

    if (insertError) throw new Error(`Supabase insert: ${insertError.message}`);

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

      const deal = await createDeal(
        contact.id,
        `${service.display_name} – ${body.customer_name}`,
        String(breakdown.total),
        STAGE_QUOTED,
      );
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
        const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.myhorsefarm.com";
        const template = quoteConfirmationEmail(
          body.customer_name.split(" ")[0],
          quoteNumber,
          service.display_name,
          breakdown,
          `${siteUrl}/quote/${quote.id}`,
          unsub,
        );
        await sendEmail(body.customer_email, template.subject, template.html);
      }
    } catch (err) {
      console.error("Email send error (non-fatal):", err);
    }

    return NextResponse.json({
      ok: true,
      quote: {
        id: quote.id,
        quote_number: quoteNumber,
        estimated_amount: breakdown.total,
        pricing_breakdown: breakdown,
        requires_site_visit: service.requires_site_visit,
        status,
      },
    });
  } catch (err) {
    console.error("Quote creation error:", err);
    return NextResponse.json(
      { error: "Failed to create quote" },
      { status: 500 },
    );
  }
}
