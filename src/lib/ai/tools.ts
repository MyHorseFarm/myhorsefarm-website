import type { ToolDeclaration } from "@/lib/gemini";
import { supabase } from "@/lib/supabase";
import { getServiceByKey, calculateQuote } from "@/lib/pricing";
import { getAvailableDates, hasCapacity } from "@/lib/availability";
import { buildSignedUrl } from "@/lib/url-signing";
import {
  sendEmail,
  createUnsubscribeUrl,
  bookingConfirmationEmail,
} from "@/lib/emails";
import {
  findContactByEmail,
  createContact,
  createDeal,
  findActiveDealForContact,
  updateDealStage,
  createContactNote,
  STAGE_QUOTED,
  STAGE_SCHEDULED,
} from "@/lib/hubspot";

/**
 * Tool definitions for AI to call.
 */
export const toolDefinitions: ToolDeclaration[] = [
  {
    name: "generate_quote",
    description:
      "Generate a price quote for a customer. Call this when you have gathered the service type, property details, customer location, and customer contact info.",
    parameters: {
      type: "object",
      properties: {
        service_key: {
          type: "string",
          description: "The service key (e.g. manure_removal, trash_bin_service, junk_removal, sod_installation, fill_dirt, dumpster_rental, farm_repairs, millings_asphalt)",
        },
        customer_name: { type: "string", description: "Customer full name" },
        customer_email: { type: "string", description: "Customer email" },
        customer_phone: { type: "string", description: "Customer phone number" },
        customer_location: {
          type: "string",
          description: "Service area (e.g. wellington, loxahatchee, royal_palm_beach, west_palm_beach, palm_beach_gardens)",
        },
        property_details: {
          type: "object",
          description: "Property details like loads, cans, estimated_tons, yards, sqft, frequency, notes",
        },
      },
      required: ["service_key", "customer_name", "customer_email", "customer_phone", "customer_location"],
    },
  },
  {
    name: "check_availability",
    description:
      "Check available dates for scheduling a service. Call this when a customer wants to schedule.",
    parameters: {
      type: "object",
      properties: {
        days: {
          type: "number",
          description: "Number of days to check ahead (default 30)",
        },
      },
      required: [],
    },
  },
  {
    name: "book_service",
    description:
      "Book a service for a customer. Call this after the customer has confirmed their preferred date, time slot, and all contact details. If they have an existing quote, pass the quote_id.",
    parameters: {
      type: "object",
      properties: {
        quote_id: {
          type: "string",
          description: "Optional quote ID if booking from an existing quote",
        },
        service_key: {
          type: "string",
          description: "The service key (e.g. manure_removal, trash_bin_service, junk_removal, sod_installation, fill_dirt, dumpster_rental, farm_repairs, millings_asphalt)",
        },
        customer_name: { type: "string", description: "Customer full name" },
        customer_email: { type: "string", description: "Customer email" },
        customer_phone: { type: "string", description: "Customer phone number" },
        customer_location: {
          type: "string",
          description: "Service address (street and city)",
        },
        preferred_date: {
          type: "string",
          description: "Preferred date in YYYY-MM-DD format",
        },
        time_slot: {
          type: "string",
          description: "Preferred time window: morning (8 AM – 12 PM) or afternoon (12 PM – 5 PM)",
          enum: ["morning", "afternoon"],
        },
      },
      required: ["service_key", "customer_name", "customer_email", "customer_phone", "customer_location", "preferred_date", "time_slot"],
    },
  },
  {
    name: "schedule_callback",
    description:
      "Schedule a callback from Jose to the customer. Use when the customer wants to speak with Jose directly or has a complex request that needs personal attention.",
    parameters: {
      type: "object",
      properties: {
        customer_name: {
          type: "string",
          description: "Name of the customer",
        },
        customer_phone: {
          type: "string",
          description: "Phone number to call back",
        },
        reason: {
          type: "string",
          description: "Brief summary of what the customer needs",
        },
        preferred_time: {
          type: "string",
          description: "When the customer would like to be called back (e.g. 'tomorrow morning', 'after 3pm', 'anytime')",
        },
      },
      required: ["customer_name", "customer_phone", "reason"],
    },
  },
];

/**
 * Execute a tool call and return the result string.
 */
export async function executeTool(
  name: string,
  input: Record<string, unknown>,
  chatSessionId: string,
): Promise<string> {
  switch (name) {
    case "generate_quote":
      return executeGenerateQuote(input, chatSessionId);
    case "check_availability":
      return executeCheckAvailability(input);
    case "book_service":
      return executeBookService(input, chatSessionId);
    case "schedule_callback":
      return executeScheduleCallback(input, chatSessionId);
    default:
      return JSON.stringify({ error: `Unknown tool: ${name}` });
  }
}

async function executeGenerateQuote(
  input: Record<string, unknown>,
  chatSessionId: string,
): Promise<string> {
  const serviceKey = input.service_key as string;
  const service = await getServiceByKey(serviceKey);
  if (!service) return JSON.stringify({ error: "Service not found" });

  const details = (input.property_details as Record<string, unknown>) || {};
  const breakdown = calculateQuote(service, details);

  // Generate quote number
  const today = new Date().toISOString().split("T")[0].replace(/-/g, "");
  const { count } = await supabase
    .from("quotes")
    .select("*", { count: "exact", head: true })
    .like("quote_number", `MHF-Q-${today}%`);
  const seq = String((count ?? 0) + 1).padStart(3, "0");
  const quoteNumber = `MHF-Q-${today}-${seq}`;

  const status = service.requires_site_visit ? "pending_site_visit" : "pending";
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();

  // Save to Supabase
  const { data: quote, error: insertError } = await supabase
    .from("quotes")
    .insert({
      quote_number: quoteNumber,
      status,
      customer_name: input.customer_name as string,
      customer_email: input.customer_email as string,
      customer_phone: input.customer_phone as string,
      customer_location: input.customer_location as string,
      service_key: serviceKey,
      property_details: details,
      estimated_amount: breakdown.total,
      pricing_breakdown: breakdown,
      requires_site_visit: service.requires_site_visit,
      source: "chatbot",
      chat_session_id: chatSessionId,
      expires_at: expiresAt,
    })
    .select()
    .single();

  if (insertError) {
    console.error("Quote insert error:", insertError.message);
    return JSON.stringify({ error: "Failed to save quote. Please try again." });
  }

  // HubSpot sync
  try {
    let contact = await findContactByEmail(input.customer_email as string);
    if (!contact) {
      const nameParts = (input.customer_name as string).split(" ");
      contact = await createContact(
        input.customer_email as string,
        nameParts[0],
        nameParts.slice(1).join(" ") || "",
        input.customer_phone as string,
      );
    }

    // Reuse active deal if one exists, otherwise create new
    const existingDeal = await findActiveDealForContact(contact.id);
    let deal;
    if (existingDeal) {
      deal = existingDeal;
      await updateDealStage(existingDeal.id, STAGE_QUOTED);
    } else {
      deal = await createDeal(
        contact.id,
        `${service.display_name} – ${input.customer_name}`,
        String(breakdown.total),
        STAGE_QUOTED,
      );
    }

    await createContactNote(
      contact.id,
      `[QUOTE:${quoteNumber}] Quote created via chatbot for ${service.display_name}. Amount: $${breakdown.total}`,
    );

    await supabase
      .from("quotes")
      .update({
        hubspot_contact_id: contact.id,
        hubspot_deal_id: deal.id,
      })
      .eq("id", quote.id);

    // Link chat session to quote
    await supabase
      .from("chat_sessions")
      .update({ quote_id: quote.id })
      .eq("id", chatSessionId);
  } catch (err) {
    console.error("HubSpot sync error in chatbot (non-fatal):", err);
  }

  return JSON.stringify({
    quote_number: quoteNumber,
    quote_id: quote.id,
    service: service.display_name,
    total: breakdown.total,
    breakdown,
    requires_site_visit: service.requires_site_visit,
    quote_url: buildSignedUrl(`/quote/${quote.id}`, "quote", quote.id),
    status,
  });
}

async function executeCheckAvailability(
  input: Record<string, unknown>,
): Promise<string> {
  const days = (input.days as number) || 30;

  const dates = await getAvailableDates(days);

  const available = dates.filter((d) => d.status !== "full");
  const summary = available.slice(0, 10).map((d) => ({
    date: d.date,
    day: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][d.day_of_week],
    slots: d.slots_available,
    status: d.status,
  }));

  return JSON.stringify({
    total_available_dates: available.length,
    next_dates: summary,
  });
}

async function executeBookService(
  input: Record<string, unknown>,
  chatSessionId: string,
): Promise<string> {
  const preferredDate = input.preferred_date as string;
  const timeSlot = input.time_slot as string;
  const serviceKey = input.service_key as string;
  const quoteId = input.quote_id as string | undefined;

  // Reject past dates
  const today = new Date().toISOString().split("T")[0];
  if (preferredDate < today) {
    return JSON.stringify({ error: "That date is in the past. Can you pick a date from today onward?" });
  }

  // Check capacity
  const available = await hasCapacity(preferredDate);
  if (!available) {
    // Suggest alternatives
    const dates = await getAvailableDates(14);
    const alternatives = dates
      .filter((d) => d.status !== "full")
      .slice(0, 5)
      .map((d) => ({
        date: d.date,
        day: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][d.day_of_week],
      }));
    return JSON.stringify({
      error: "no_availability",
      message: `Sorry, ${preferredDate} is fully booked.`,
      alternative_dates: alternatives,
    });
  }

  // If booking from a quote, look it up for deal info
  let quoteData: { hubspot_deal_id?: string; hubspot_contact_id?: string; estimated_amount?: number } | null = null;
  if (quoteId) {
    const { data } = await supabase
      .from("quotes")
      .select("hubspot_deal_id, hubspot_contact_id, estimated_amount")
      .eq("id", quoteId)
      .single();
    quoteData = data;
  }

  // Get service display name
  const { data: service } = await supabase
    .from("service_pricing")
    .select("display_name")
    .eq("service_key", serviceKey)
    .single();
  const serviceName = service?.display_name ?? serviceKey;

  // Generate booking number: MHF-B-YYYYMMDD-NNN
  const todayCompact = today.replace(/-/g, "");
  const { count } = await supabase
    .from("bookings")
    .select("*", { count: "exact", head: true })
    .like("booking_number", `MHF-B-${todayCompact}%`);
  const seq = String((count ?? 0) + 1).padStart(3, "0");
  const bookingNumber = `MHF-B-${todayCompact}-${seq}`;

  // Insert booking
  const { data: booking, error: insertError } = await supabase
    .from("bookings")
    .insert({
      booking_number: bookingNumber,
      quote_id: quoteId || null,
      status: "confirmed",
      customer_name: input.customer_name as string,
      customer_email: input.customer_email as string,
      customer_phone: input.customer_phone as string,
      customer_location: input.customer_location as string,
      service_key: serviceKey,
      scheduled_date: preferredDate,
      time_slot: timeSlot,
    })
    .select()
    .single();

  if (insertError) {
    console.error("Booking insert error:", insertError.message);
    return JSON.stringify({ error: "Failed to create booking. Please try again." });
  }

  // HubSpot sync
  try {
    if (quoteData?.hubspot_deal_id) {
      // From quote — reuse existing deal
      await updateDealStage(quoteData.hubspot_deal_id, STAGE_SCHEDULED);
      if (quoteData.hubspot_contact_id) {
        await createContactNote(
          quoteData.hubspot_contact_id,
          `[BOOKING:${bookingNumber}] Booked ${serviceName} for ${preferredDate} (${timeSlot}) via chatbot`,
        );
      }
    } else {
      // Direct booking — find or create contact
      let contact = await findContactByEmail(input.customer_email as string);
      if (!contact) {
        const nameParts = (input.customer_name as string).split(" ");
        contact = await createContact(
          input.customer_email as string,
          nameParts[0],
          nameParts.slice(1).join(" ") || "",
          input.customer_phone as string,
        );
      }

      const existingDeal = await findActiveDealForContact(contact.id);
      let deal;
      if (existingDeal) {
        deal = existingDeal;
        await updateDealStage(existingDeal.id, STAGE_SCHEDULED);
      } else {
        deal = await createDeal(
          contact.id,
          `${serviceName} – ${input.customer_name}`,
          String(quoteData?.estimated_amount || 0),
          STAGE_SCHEDULED,
        );
      }

      await createContactNote(
        contact.id,
        `[BOOKING:${bookingNumber}] Booked ${serviceName} for ${preferredDate} (${timeSlot}) via chatbot`,
      );

      await supabase
        .from("bookings")
        .update({ hubspot_deal_id: deal.id })
        .eq("id", booking.id);
    }
  } catch (err) {
    console.error("HubSpot sync error in chatbot booking (non-fatal):", err);
  }

  // Send confirmation email
  try {
    const unsub = createUnsubscribeUrl(input.customer_email as string);
    const formattedDate = new Date(preferredDate + "T12:00:00").toLocaleDateString(
      "en-US",
      { weekday: "long", month: "long", day: "numeric", year: "numeric" },
    );
    const template = bookingConfirmationEmail(
      (input.customer_name as string).split(" ")[0],
      bookingNumber,
      serviceName,
      formattedDate,
      timeSlot,
      unsub,
    );
    await sendEmail(input.customer_email as string, template.subject, template.html);
  } catch (err) {
    console.error("Email send error in chatbot booking (non-fatal):", err);
  }

  // Google Calendar event
  try {
    const { createCalendarEvent } = await import("@/lib/google-calendar");
    const eventId = await createCalendarEvent({
      summary: `${bookingNumber} | ${serviceName} - ${input.customer_name}`,
      description: `Booking #${bookingNumber}\nService: ${serviceName}\nCustomer: ${input.customer_name}\nPhone: ${input.customer_phone}\nLocation: ${input.customer_location}\nBooked via: chatbot`,
      location: input.customer_location as string,
      startDate: preferredDate,
      timeSlot: timeSlot as "morning" | "afternoon",
    });
    if (eventId) {
      await supabase
        .from("bookings")
        .update({ google_calendar_event_id: eventId })
        .eq("id", booking.id);
    }
  } catch (err) {
    console.error("Google Calendar error in chatbot booking (non-fatal):", err);
  }

  // Link chat session to booking
  try {
    await supabase
      .from("chat_sessions")
      .update({ booking_id: booking.id })
      .eq("id", chatSessionId);
  } catch {
    // non-fatal — chat_sessions may not have booking_id column yet
  }

  // If from a quote, update quote status to booked
  if (quoteId) {
    await supabase
      .from("quotes")
      .update({ status: "booked" })
      .eq("id", quoteId);
  }

  const bookingUrl = buildSignedUrl(`/booking/${booking.id}`, "booking", booking.id);

  return JSON.stringify({
    booking_number: bookingNumber,
    booking_id: booking.id,
    service: serviceName,
    scheduled_date: preferredDate,
    time_slot: timeSlot,
    booking_url: bookingUrl,
  });
}

async function executeScheduleCallback(
  input: Record<string, unknown>,
  chatSessionId: string,
): Promise<string> {
  const customerName = input.customer_name as string;
  const customerPhone = input.customer_phone as string;
  const reason = input.reason as string;
  const preferredTime = (input.preferred_time as string) || "anytime";

  // Send notification email to Jose
  try {
    const html = `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;color:#333;">
        <h2 style="color:#2d5016;">Callback Requested</h2>
        <table style="width:100%;border-collapse:collapse;">
          <tr><td style="padding:8px 0;font-weight:bold;width:140px;">Customer</td><td>${customerName}</td></tr>
          <tr><td style="padding:8px 0;font-weight:bold;">Phone</td><td><a href="tel:${customerPhone}">${customerPhone}</a></td></tr>
          <tr><td style="padding:8px 0;font-weight:bold;">Preferred Time</td><td>${preferredTime}</td></tr>
          <tr><td style="padding:8px 0;font-weight:bold;">Reason</td><td>${reason}</td></tr>
          <tr><td style="padding:8px 0;font-weight:bold;">Source</td><td>Website Chat (session ${chatSessionId})</td></tr>
        </table>
      </div>
    `;
    await sendEmail(
      "manureservice@gmail.com",
      `Callback Request: ${customerName} — ${reason}`,
      html,
      "HIGH",
    );
  } catch (err) {
    console.error("Callback email error (non-fatal):", err);
  }

  // Create HubSpot note if contact exists
  try {
    const contact = await findContactByEmail("manureservice@gmail.com");
    if (contact) {
      // Try to find the customer contact to attach the note
      // If we can't find by email, just log it
    }
    // Search for customer contact by phone is not reliable, so create a note
    // on whatever contact we can find or just log it
    const existingContact = await findContactByEmail(customerPhone);
    // If no contact found by phone, that's fine — the email notification is the primary channel
    if (existingContact) {
      await createContactNote(
        existingContact.id,
        `[CHAT:CALLBACK] ${customerName} requested callback. Reason: ${reason}. Preferred time: ${preferredTime}`,
      );
    }
  } catch (err) {
    console.error("HubSpot callback note error (non-fatal):", err);
  }

  return JSON.stringify({
    success: true,
    message: `Callback scheduled for ${customerName} at ${customerPhone}. Jose will reach out ${preferredTime === "anytime" ? "shortly" : preferredTime}.`,
  });
}
