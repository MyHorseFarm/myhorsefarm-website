import type { ToolDeclaration } from "@/lib/gemini";
import { supabase } from "@/lib/supabase";
import { getServiceByKey, calculateQuote } from "@/lib/pricing";
import { getAvailableDates } from "@/lib/availability";
import { buildSignedUrl } from "@/lib/url-signing";
import {
  findContactByEmail,
  createContact,
  createDeal,
  findActiveDealForContact,
  updateDealStage,
  createContactNote,
  STAGE_QUOTED,
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
