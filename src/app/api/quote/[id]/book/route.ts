import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { hasCapacity } from "@/lib/availability";
import {
  updateDealStage,
  createContactNote,
  STAGE_SCHEDULED,
} from "@/lib/hubspot";
import {
  sendEmail,
  createUnsubscribeUrl,
  bookingConfirmationEmail,
} from "@/lib/emails";
import { verifySignedToken } from "@/lib/url-signing";

export const runtime = "nodejs";
export const maxDuration = 30;

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  // Require valid token to book
  const token = request.nextUrl.searchParams.get("token");
  if (!token || !verifySignedToken("quote", id, token)) {
    return NextResponse.json(
      { error: "Invalid or missing token" },
      { status: 403 },
    );
  }

  try {
    const body = await request.json();
    const { scheduled_date, time_slot } = body as {
      scheduled_date: string;
      time_slot: "morning" | "afternoon";
    };

    if (!scheduled_date || !time_slot) {
      return NextResponse.json(
        { error: "Missing scheduled_date or time_slot" },
        { status: 400 },
      );
    }

    // Fetch quote
    const { data: quote, error: quoteError } = await supabase
      .from("quotes")
      .select("*")
      .eq("id", id)
      .single();

    if (quoteError || !quote) {
      return NextResponse.json({ error: "Quote not found" }, { status: 404 });
    }

    if (quote.status !== "accepted") {
      return NextResponse.json(
        { error: `Quote cannot be booked (status: ${quote.status})` },
        { status: 400 },
      );
    }

    // Check expiry
    if (new Date(quote.expires_at) < new Date()) {
      await supabase.from("quotes").update({ status: "expired" }).eq("id", id);
      return NextResponse.json({ error: "Quote has expired" }, { status: 400 });
    }

    // Validate capacity
    const available = await hasCapacity(scheduled_date);
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

    // Get service display name
    const { data: service } = await supabase
      .from("service_pricing")
      .select("display_name")
      .eq("service_key", quote.service_key)
      .single();
    const serviceName = service?.display_name ?? quote.service_key;

    // Fetch recurring customer if linked to quote
    let recurringCustomer: { id: string; gate_code?: string; access_instructions?: string; num_horses?: number; property_size?: string } | null = null;
    if (quote.recurring_customer_id) {
      const { data: rc } = await supabase
        .from("recurring_customers")
        .select("id, gate_code, access_instructions, num_horses, property_size")
        .eq("id", quote.recurring_customer_id)
        .single();
      recurringCustomer = rc;
    }

    // Insert booking using quote's customer data
    const { data: booking, error: insertError } = await supabase
      .from("bookings")
      .insert({
        booking_number: bookingNumber,
        quote_id: id,
        status: "confirmed",
        customer_name: quote.customer_name,
        customer_email: quote.customer_email,
        customer_phone: quote.customer_phone,
        customer_location: quote.customer_location,
        service_key: quote.service_key,
        scheduled_date,
        time_slot,
        ...(quote.recurring_customer_id ? { recurring_customer_id: quote.recurring_customer_id } : {}),
      })
      .select()
      .single();

    if (insertError) throw new Error(`Supabase insert: ${insertError.message}`);

    // Update quote status to "booked"
    await supabase.from("quotes").update({ status: "booked" }).eq("id", id);

    // Auto-create recurring_customer if none exists for this email
    try {
      if (quote.customer_email) {
        const { data: existing } = await supabase
          .from("recurring_customers")
          .select("id")
          .eq("email", quote.customer_email)
          .maybeSingle();
        if (!existing) {
          await supabase.from("recurring_customers").insert({
            name: quote.customer_name,
            email: quote.customer_email,
            phone: quote.customer_phone || null,
            address: quote.customer_location || null,
            default_service: quote.service_key || "trash_bin_service",
            default_bins: 1,
            auto_charge: false,
            active: true,
          });
        }
      }
    } catch (err) {
      console.error("Auto-create recurring_customer error (non-fatal):", err);
    }

    // HubSpot: update deal to Scheduled stage
    try {
      if (quote.hubspot_deal_id) {
        await updateDealStage(quote.hubspot_deal_id, STAGE_SCHEDULED);
      }
      if (quote.hubspot_contact_id) {
        await createContactNote(
          quote.hubspot_contact_id,
          `[BOOKING:${bookingNumber}] Booked ${serviceName} for ${scheduled_date} (${time_slot})`,
        );
      }
    } catch (err) {
      console.error("HubSpot sync error (non-fatal):", err);
    }

    // Google Calendar: create event on business calendar
    let googleCalendarEventId: string | null = null;
    try {
      const { createCalendarEvent } = await import("@/lib/google-calendar");

      // Build description with farm details if available
      const descriptionLines = [
        `Booking #${bookingNumber}`,
        `Service: ${serviceName}`,
        `Customer: ${quote.customer_name}`,
        `Phone: ${quote.customer_phone}`,
        `Location: ${quote.customer_location}`,
        `Quote: ${quote.quote_number}`,
      ];
      if (recurringCustomer) {
        if (recurringCustomer.gate_code) descriptionLines.push(`Gate Code: ${recurringCustomer.gate_code}`);
        if (recurringCustomer.access_instructions) descriptionLines.push(`Access: ${recurringCustomer.access_instructions}`);
        if (recurringCustomer.num_horses) descriptionLines.push(`Horses: ${recurringCustomer.num_horses}`);
        if (recurringCustomer.property_size) descriptionLines.push(`Property: ${recurringCustomer.property_size}`);
      }

      googleCalendarEventId = await createCalendarEvent({
        summary: `${bookingNumber} | ${serviceName} - ${quote.customer_name}`,
        description: descriptionLines.join("\n"),
        location: quote.customer_location,
        startDate: scheduled_date,
        timeSlot: time_slot,
      });
      if (googleCalendarEventId) {
        await supabase
          .from("bookings")
          .update({ google_calendar_event_id: googleCalendarEventId })
          .eq("id", booking.id);
      }
    } catch (err) {
      console.error("Google Calendar error (non-fatal):", err);
    }

    // Send confirmation email
    try {
      const unsub = createUnsubscribeUrl(quote.customer_email);
      const formattedDate = new Date(scheduled_date + "T12:00:00").toLocaleDateString(
        "en-US",
        { weekday: "long", month: "long", day: "numeric", year: "numeric" },
      );
      const template = bookingConfirmationEmail(
        quote.customer_name.split(" ")[0],
        bookingNumber,
        serviceName,
        formattedDate,
        time_slot,
        unsub,
      );
      await sendEmail(quote.customer_email, template.subject, template.html);
    } catch (err) {
      console.error("Email send error (non-fatal):", err);
    }

    return NextResponse.json({
      ok: true,
      booking: {
        id: booking.id,
        booking_number: bookingNumber,
        scheduled_date,
        time_slot,
        service_name: serviceName,
      },
    });
  } catch (err) {
    console.error("Quote booking error:", err);
    return NextResponse.json(
      { error: "Failed to create booking" },
      { status: 500 },
    );
  }
}
