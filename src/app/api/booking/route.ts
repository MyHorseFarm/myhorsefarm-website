import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { hasCapacity } from "@/lib/availability";
import {
  findContactByEmail,
  createDeal,
  updateDealStage,
  createContactNote,
  STAGE_SCHEDULED,
} from "@/lib/hubspot";
import {
  sendEmail,
  createUnsubscribeUrl,
  bookingConfirmationEmail,
} from "@/lib/emails";
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

    // Validate capacity
    const available = await hasCapacity(body.scheduled_date);
    if (!available) {
      return NextResponse.json(
        { error: "No availability on the selected date" },
        { status: 409 },
      );
    }

    // Generate booking number: MHF-B-YYYYMMDD-NNN
    const today = new Date().toISOString().split("T")[0].replace(/-/g, "");
    const { count } = await supabase
      .from("bookings")
      .select("*", { count: "exact", head: true })
      .like("booking_number", `MHF-B-${today}%`);
    const seq = String((count ?? 0) + 1).padStart(3, "0");
    const bookingNumber = `MHF-B-${today}-${seq}`;

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
        // Direct booking without quote — find/create contact
        const contact = await findContactByEmail(body.customer_email);
        if (contact) {
          const deal = await createDeal(
            contact.id,
            `${serviceName} – ${body.customer_name}`,
            "0",
            STAGE_SCHEDULED,
          );
          hubspotDealId = deal.id;

          await createContactNote(
            contact.id,
            `[BOOKING:${bookingNumber}] Booked ${serviceName} for ${body.scheduled_date} (${body.time_slot})`,
          );
        }
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

    return NextResponse.json({
      ok: true,
      booking: {
        id: booking.id,
        booking_number: bookingNumber,
        scheduled_date: body.scheduled_date,
        time_slot: body.time_slot,
        service_name: serviceName,
      },
    });
  } catch (err) {
    console.error("Booking creation error:", err);
    return NextResponse.json(
      { error: "Failed to create booking" },
      { status: 500 },
    );
  }
}
