import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { hasCapacity } from "@/lib/availability";
import {
  findContactByEmail,
  createContact,
  createDeal,
  findActiveDealForContact,
  updateDealStage,
  createContactNote,
  STAGE_SCHEDULED,
} from "@/lib/hubspot";
import {
  sendEmail,
  createUnsubscribeUrl,
  bookingConfirmationEmail,
} from "@/lib/emails";
import { sendMetaEvent } from "@/lib/meta-capi";
import type { BookingRequest } from "@/lib/types";

export const runtime = "nodejs";
export const maxDuration = 30;

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as BookingRequest;

    if (
      !body.customer_name ||
      !body.customer_email ||
      !body.customer_phone ||
      !body.customer_location ||
      !body.service_key ||
      !body.scheduled_date ||
      !body.time_slot
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    // Reject past dates
    const today = new Date().toISOString().split("T")[0];
    if (body.scheduled_date < today) {
      return NextResponse.json(
        { error: "Cannot book a date in the past" },
        { status: 400 },
      );
    }

    // Validate capacity
    const available = await hasCapacity(body.scheduled_date);
    if (!available) {
      return NextResponse.json(
        { error: "No availability on the selected date" },
        { status: 409 },
      );
    }

    // Generate booking number: MHF-B-YYYYMMDD-NNN
    const todayCompact = today.replace(/-/g, "");
    const { count } = await supabase
      .from("bookings")
      .select("*", { count: "exact", head: true })
      .like("booking_number", `MHF-B-${todayCompact}%`);
    const seq = String((count ?? 0) + 1).padStart(3, "0");
    const bookingNumber = `MHF-B-${todayCompact}-${seq}`;

    // Get service name for display
    const { data: service } = await supabase
      .from("service_pricing")
      .select("display_name")
      .eq("service_key", body.service_key)
      .single();
    const serviceName = service?.display_name ?? body.service_key;

    // Insert booking
    const { data: booking, error: insertError } = await supabase
      .from("bookings")
      .insert({
        booking_number: bookingNumber,
        quote_id: body.quote_id || null,
        status: "confirmed",
        customer_name: body.customer_name,
        customer_email: body.customer_email,
        customer_phone: body.customer_phone,
        customer_location: body.customer_location,
        service_key: body.service_key,
        scheduled_date: body.scheduled_date,
        time_slot: body.time_slot,
        ...(body.utm_params ? { utm_params: body.utm_params } : {}),
      })
      .select()
      .single();

    if (insertError) throw new Error(`Supabase insert: ${insertError.message}`);

    // HubSpot: update deal to Scheduled stage
    let hubspotDealId: string | null = null;

    try {
      // If from a quote, use the quote's deal
      if (body.quote_id) {
        const { data: quote } = await supabase
          .from("quotes")
          .select("hubspot_deal_id, hubspot_contact_id")
          .eq("id", body.quote_id)
          .single();

        if (quote?.hubspot_deal_id) {
          hubspotDealId = quote.hubspot_deal_id as string;
          await updateDealStage(hubspotDealId, STAGE_SCHEDULED);
        }

        if (quote?.hubspot_contact_id) {
          await createContactNote(
            quote.hubspot_contact_id,
            `[BOOKING:${bookingNumber}] Booked ${serviceName} for ${body.scheduled_date} (${body.time_slot})`,
          );
        }
      } else {
        // Direct booking without quote — find or create contact
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

        // Reuse active deal if one exists, otherwise create new
        const existingDeal = await findActiveDealForContact(contact.id);
        if (existingDeal) {
          hubspotDealId = existingDeal.id;
          await updateDealStage(existingDeal.id, STAGE_SCHEDULED);
        } else {
          const deal = await createDeal(
            contact.id,
            `${serviceName} – ${body.customer_name}`,
            "0",
            STAGE_SCHEDULED,
          );
          hubspotDealId = deal.id;
        }

        await createContactNote(
          contact.id,
          `[BOOKING:${bookingNumber}] Booked ${serviceName} for ${body.scheduled_date} (${body.time_slot})`,
        );
      }

      // Store HubSpot deal ID on booking
      if (hubspotDealId) {
        await supabase
          .from("bookings")
          .update({ hubspot_deal_id: hubspotDealId })
          .eq("id", booking.id);
      }
    } catch (err) {
      console.error("HubSpot sync error (non-fatal):", err);
    }

    // Send confirmation email
    try {
      const unsub = createUnsubscribeUrl(body.customer_email);
      const formattedDate = new Date(body.scheduled_date + "T12:00:00").toLocaleDateString(
        "en-US",
        { weekday: "long", month: "long", day: "numeric", year: "numeric" },
      );
      const template = bookingConfirmationEmail(
        body.customer_name.split(" ")[0],
        bookingNumber,
        serviceName,
        formattedDate,
        body.time_slot,
        unsub,
      );
      await sendEmail(body.customer_email, template.subject, template.html);
    } catch (err) {
      console.error("Email send error (non-fatal):", err);
    }

    // Send SMS confirmation (non-fatal)
    if (body.customer_phone) {
      try {
        const { sendSMS, bookingConfirmedSMS } = await import("@/lib/twilio");
        const formattedDate = new Date(body.scheduled_date + "T12:00:00").toLocaleDateString(
          "en-US",
          { weekday: "short", month: "short", day: "numeric" },
        );
        const sms = bookingConfirmedSMS(body.customer_name, formattedDate, body.time_slot);
        await sendSMS(body.customer_phone, sms);
      } catch (err) {
        console.error("SMS send error (non-fatal):", err);
      }
    }

    // Google Calendar: create event on business calendar
    try {
      const { createCalendarEvent } = await import("@/lib/google-calendar");
      const eventId = await createCalendarEvent({
        summary: `${bookingNumber} | ${serviceName} - ${body.customer_name}`,
        description: `Booking #${bookingNumber}\nService: ${serviceName}\nCustomer: ${body.customer_name}\nPhone: ${body.customer_phone}\nLocation: ${body.customer_location}`,
        location: body.customer_location,
        startDate: body.scheduled_date,
        timeSlot: body.time_slot,
      });
      if (eventId) {
        await supabase
          .from("bookings")
          .update({ google_calendar_event_id: eventId })
          .eq("id", booking.id);
      }
    } catch (err) {
      console.error("Google Calendar error (non-fatal):", err);
    }

    // Meta CAPI: send Purchase event (non-fatal)
    try {
      const nameParts = body.customer_name.split(" ");
      await sendMetaEvent({
        event_name: "Purchase",
        event_id: body.event_id,
        event_source_url: `${process.env.NEXT_PUBLIC_SITE_URL || "https://www.myhorsefarm.com"}/booking`,
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
          value: 0,
          content_name: serviceName,
        },
      });
    } catch (err) {
      console.error("Meta CAPI error (non-fatal):", err);
    }

    // Set segment cookie for retargeting
    const res = NextResponse.json({
      ok: true,
      booking: {
        id: booking.id,
        booking_number: bookingNumber,
        scheduled_date: body.scheduled_date,
        time_slot: body.time_slot,
        service_name: serviceName,
      },
    });
    res.cookies.set("mhf_segment", "booked", {
      maxAge: 60 * 60 * 24 * 90,
      path: "/",
      sameSite: "lax",
    });
    return res;
  } catch (err) {
    console.error("Booking creation error:", err);
    return NextResponse.json(
      { error: "Failed to create booking" },
      { status: 500 },
    );
  }
}
