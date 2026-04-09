import { NextRequest, NextResponse } from "next/server";
import { createHmac, timingSafeEqual } from "crypto";
import { supabase } from "@/lib/supabase";
import {
  findContactByPhone,
  findContactByEmail,
  createContact,
  createContactNote,
  createDeal,
  findActiveDealForContact,
  updateDealStage,
  STAGE_NEW_LEAD,
  STAGE_QUOTED,
  normalizePhone,
} from "@/lib/hubspot";
import { getServiceByKey, calculateQuote } from "@/lib/pricing";
import { sendEmail, createUnsubscribeUrl, quoteConfirmationEmail } from "@/lib/emails";
import { buildSignedUrl } from "@/lib/url-signing";
import { EMAIL_SALES } from "@/lib/constants";
import type { VapiWebhookPayload, VapiCallEndedPayload, VapiFunctionCallPayload } from "@/lib/vapi";

export const runtime = "nodejs";
export const maxDuration = 60;

// ---------------------------------------------------------------------------
// Webhook signature verification
// ---------------------------------------------------------------------------

function verifySignature(
  request: NextRequest,
  body: string,
): { valid: true } | { valid: false; reason: "no_secret" | "bad_signature" } {
  const secret = process.env.VAPI_WEBHOOK_SECRET;
  if (!secret) {
    console.error("VAPI_WEBHOOK_SECRET not set — rejecting request");
    return { valid: false, reason: "no_secret" };
  }

  const signature = request.headers.get("x-vapi-signature");
  if (!signature) return { valid: false, reason: "bad_signature" };

  const expected = createHmac("sha256", secret).update(body).digest("hex");
  const expectedBuf = Buffer.from(expected);
  const sigBuf = Buffer.from(signature);
  if (expectedBuf.length !== sigBuf.length) return { valid: false, reason: "bad_signature" };
  return timingSafeEqual(expectedBuf, sigBuf)
    ? { valid: true }
    : { valid: false, reason: "bad_signature" };
}

// ---------------------------------------------------------------------------
// POST handler
// ---------------------------------------------------------------------------

export async function POST(request: NextRequest) {
  const rawBody = await request.text();

  const sigResult = verifySignature(request, rawBody);
  if (!sigResult.valid) {
    if (sigResult.reason === "no_secret") {
      return NextResponse.json({ error: "Webhook secret not configured" }, { status: 500 });
    }
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  let payload: VapiWebhookPayload;
  try {
    payload = JSON.parse(rawBody) as VapiWebhookPayload;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const messageType = payload.message?.type;

  try {
    switch (messageType) {
      case "end-of-call-report":
        await handleCallEnded(payload as VapiCallEndedPayload);
        break;

      case "function-call":
        return await handleFunctionCall(payload as VapiFunctionCallPayload);

      case "status-update":
        // Acknowledge status updates (call started, ringing, etc.)
        console.info("[Vapi] Status update:", JSON.stringify(payload.message).slice(0, 200));
        break;

      case "hang":
        // Vapi "hang" notification — caller or system hung up
        break;

      default:
        console.warn(`[Vapi] Unhandled message type: ${messageType}`);
    }
  } catch (err) {
    console.error(`[Vapi] Error handling ${messageType}:`, err);
    // Return 200 to prevent Vapi from retrying — errors are logged
  }

  return NextResponse.json({ ok: true });
}

// ---------------------------------------------------------------------------
// Handle end-of-call report
// ---------------------------------------------------------------------------

async function handleCallEnded(payload: VapiCallEndedPayload): Promise<void> {
  const { call, summary, analysis, artifact } = payload.message;

  const callerPhone = call.customer?.number || "";
  const callerName = call.customer?.name || analysis?.structuredData?.caller_name as string || "";
  const callSummary = analysis?.summary || summary || "No summary available";
  const structuredData = analysis?.structuredData || {};
  const successScore = analysis?.successEvaluation || "N/A";
  const transcript = artifact?.transcript || "";

  // Calculate duration
  const startedAt = call.startedAt ? new Date(call.startedAt) : null;
  const endedAt = call.endedAt ? new Date(call.endedAt) : null;
  const durationSec = startedAt && endedAt
    ? Math.round((endedAt.getTime() - startedAt.getTime()) / 1000)
    : 0;
  const durationFormatted = `${Math.floor(durationSec / 60)}m ${durationSec % 60}s`;

  console.info(
    `[Vapi] Call ended: ${callerPhone} | Duration: ${durationFormatted} | Reason: ${payload.message.endedReason}`,
  );

  // -------------------------------------------------------------------
  // Find or create HubSpot contact
  // -------------------------------------------------------------------
  let contactId: string | null = null;

  try {
    if (callerPhone) {
      const contact = await findContactByPhone(callerPhone);
      if (contact) {
        contactId = contact.id;
      }
    }

    // If structured data has email, try that too
    const extractedEmail = structuredData.caller_email as string | undefined;
    if (!contactId && extractedEmail) {
      const contact = await findContactByEmail(extractedEmail);
      if (contact) {
        contactId = contact.id;
      }
    }

    // Create a new contact if we have enough info
    if (!contactId && callerPhone) {
      const nameParts = callerName ? callerName.split(" ") : ["Phone", "Caller"];
      const email = extractedEmail || `phone-${normalizePhone(callerPhone)}@placeholder.myhorsefarm.com`;
      const contact = await createContact(
        email,
        nameParts[0],
        nameParts.slice(1).join(" ") || "",
        callerPhone,
      );
      contactId = contact.id;
    }
  } catch (err) {
    console.error("[Vapi] HubSpot contact resolution error (non-fatal):", err);
  }

  // -------------------------------------------------------------------
  // Add call note to HubSpot contact
  // -------------------------------------------------------------------
  if (contactId) {
    try {
      const serviceRequested = structuredData.service_requested || "Not specified";
      const requestedCallback = structuredData.requested_callback ? "Yes" : "No";
      const quoteCreated = structuredData.quote_created ? "Yes" : "No";

      const noteBody = `[PHONE:AI_CALL] AI Phone Call Summary
Duration: ${durationFormatted}
Caller: ${callerName || callerPhone || "Unknown"}
Phone: ${callerPhone || "Unknown"}
Service Requested: ${serviceRequested}
Quote Created: ${quoteCreated}
Callback Requested: ${requestedCallback}
Success Score: ${successScore}
End Reason: ${payload.message.endedReason}

Summary: ${callSummary}

${transcript ? `Transcript (first 500 chars): ${transcript.slice(0, 500)}` : ""}`;

      await createContactNote(contactId, noteBody);
    } catch (err) {
      console.error("[Vapi] HubSpot note creation error (non-fatal):", err);
    }
  }

  // -------------------------------------------------------------------
  // If caller requested a callback, notify Jose
  // -------------------------------------------------------------------
  if (structuredData.requested_callback) {
    try {
      await sendEmail(
        EMAIL_SALES,
        `Callback Requested: ${callerName || callerPhone}`,
        buildCallbackEmailHtml(
          callerName || "Unknown caller",
          callerPhone,
          structuredData.service_requested as string || "Not specified",
          callSummary,
          durationFormatted,
        ),
      );
    } catch (err) {
      console.error("[Vapi] Callback notification email error (non-fatal):", err);
    }
  }

  // -------------------------------------------------------------------
  // Log call to Supabase for analytics
  // -------------------------------------------------------------------
  try {
    await supabase.from("phone_calls").insert({
      vapi_call_id: call.id,
      caller_phone: callerPhone || null,
      caller_name: callerName || null,
      duration_seconds: durationSec,
      summary: callSummary,
      transcript: transcript || null,
      structured_data: structuredData,
      success_score: successScore,
      ended_reason: payload.message.endedReason,
      hubspot_contact_id: contactId,
    });
  } catch (err) {
    // Table may not exist yet — non-fatal
    console.error("[Vapi] Supabase phone_calls insert error (non-fatal):", err);
  }
}

// ---------------------------------------------------------------------------
// Handle function calls from the voice agent
// ---------------------------------------------------------------------------

async function handleFunctionCall(
  payload: VapiFunctionCallPayload,
): Promise<NextResponse> {
  const { functionCall, call } = payload.message;
  const { name, parameters } = functionCall;
  const callerPhone = call.customer?.number || "";

  console.info(`[Vapi] Function call: ${name}`, JSON.stringify(parameters).slice(0, 300));

  try {
    switch (name) {
      case "create_quote":
        return await handleCreateQuote(parameters, callerPhone);

      case "schedule_callback":
        return await handleScheduleCallback(parameters);

      case "transfer_to_jose":
        return await handleTransferToJose(parameters, callerPhone);

      default:
        return NextResponse.json({
          results: [
            {
              toolCallId: name,
              result: `Unknown function: ${name}`,
            },
          ],
        });
    }
  } catch (err) {
    console.error(`[Vapi] Function ${name} error:`, err);
    return NextResponse.json({
      results: [
        {
          toolCallId: name,
          result: "I'm sorry, there was a technical issue. Let me have Jose follow up with you directly.",
        },
      ],
    });
  }
}

// ---------------------------------------------------------------------------
// Function: create_quote
// ---------------------------------------------------------------------------

async function handleCreateQuote(
  params: Record<string, unknown>,
  callerPhone: string,
): Promise<NextResponse> {
  const customerName = (params.customer_name as string) || "Phone Caller";
  const customerEmail = (params.customer_email as string) || "";
  const customerPhone = (params.customer_phone as string) || callerPhone;
  const customerLocation = (params.customer_location as string) || "";
  const serviceKey = (params.service_key as string) || "";
  const frequency = (params.frequency as string) || "one_time";
  const numStalls = (params.num_stalls as number) || 0;
  const description = (params.description as string) || "";
  const requiresSiteVisit = (params.requires_site_visit as boolean) || false;

  // Look up service pricing
  const service = await getServiceByKey(serviceKey);

  // Build property details
  const propertyDetails: Record<string, unknown> = {};
  if (numStalls) propertyDetails.stalls = numStalls;
  if (frequency && frequency !== "one_time") propertyDetails.frequency = frequency;
  if (description) propertyDetails.description = description;

  // Calculate price (if service found and doesn't require site visit)
  let estimatedAmount = 0;
  let pricingBreakdown = { base: 0, adjustments: [] as Array<{ label: string; amount: number }>, total: 0 };
  const needsSiteVisit = requiresSiteVisit || (service?.requires_site_visit ?? false);

  if (service && !needsSiteVisit) {
    pricingBreakdown = calculateQuote(service, propertyDetails, "standard");
    estimatedAmount = pricingBreakdown.total;
  }

  // Generate quote number
  const today = new Date().toISOString().split("T")[0].replace(/-/g, "");
  const { count } = await supabase
    .from("quotes")
    .select("*", { count: "exact", head: true })
    .like("quote_number", `MHF-Q-${today}%`);
  const seq = String((count ?? 0) + 1).padStart(3, "0");
  const quoteNumber = `MHF-Q-${today}-${seq}`;

  const status = needsSiteVisit ? "pending_site_visit" : "pending";
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();

  // Insert into Supabase
  const { data: quote, error: insertError } = await supabase
    .from("quotes")
    .insert({
      quote_number: quoteNumber,
      status,
      customer_name: customerName,
      customer_email: customerEmail || null,
      customer_phone: customerPhone,
      customer_location: customerLocation,
      service_key: serviceKey,
      property_details: propertyDetails,
      estimated_amount: estimatedAmount,
      pricing_breakdown: pricingBreakdown,
      requires_site_visit: needsSiteVisit,
      source: "form", // DB constraint: form|chatbot|landing_page — phone calls mapped to form
      expires_at: expiresAt,
      service_tier: "standard",
    })
    .select()
    .single();

  if (insertError) {
    console.error("[Vapi] Quote insert error:", insertError.message);
    return NextResponse.json({
      results: [
        {
          toolCallId: "create_quote",
          result: "I've noted down all your details. Jose will follow up with your quote shortly.",
        },
      ],
    });
  }

  // HubSpot: find or create contact, create deal
  let hubspotContactId: string | null = null;
  let hubspotDealId: string | null = null;

  try {
    let contact = customerEmail ? await findContactByEmail(customerEmail) : null;
    if (!contact && customerPhone) {
      contact = await findContactByPhone(customerPhone);
    }
    if (!contact) {
      const nameParts = customerName.split(" ");
      const email = customerEmail || `phone-${normalizePhone(customerPhone)}@placeholder.myhorsefarm.com`;
      contact = await createContact(
        email,
        nameParts[0] || customerName,
        nameParts.slice(1).join(" ") || "",
        customerPhone,
      );
    }
    hubspotContactId = contact.id;

    const existingDeal = await findActiveDealForContact(contact.id);
    let deal;
    if (existingDeal) {
      deal = existingDeal;
      await updateDealStage(existingDeal.id, needsSiteVisit ? STAGE_NEW_LEAD : STAGE_QUOTED);
    } else {
      const serviceName = service?.display_name || serviceKey;
      deal = await createDeal(
        contact.id,
        `${serviceName} – ${customerName} (Phone)`,
        String(estimatedAmount),
        needsSiteVisit ? STAGE_NEW_LEAD : STAGE_QUOTED,
      );
    }
    hubspotDealId = deal.id;

    await createContactNote(
      contact.id,
      `[QUOTE:${quoteNumber}] Quote created via phone AI agent for ${service?.display_name || serviceKey}. Amount: $${estimatedAmount}. ${needsSiteVisit ? "Site visit required." : ""}`,
    );

    // Update quote with HubSpot IDs
    await supabase
      .from("quotes")
      .update({ hubspot_contact_id: hubspotContactId, hubspot_deal_id: hubspotDealId })
      .eq("id", quote.id);
  } catch (err) {
    console.error("[Vapi] HubSpot sync error (non-fatal):", err);
  }

  // Send confirmation email if we have an email
  if (customerEmail) {
    try {
      const unsub = createUnsubscribeUrl(customerEmail);
      if (needsSiteVisit) {
        await sendEmail(
          customerEmail,
          `Site Visit Request – ${quoteNumber}`,
          buildSiteVisitEmailHtml(customerName.split(" ")[0], service?.display_name || serviceKey, quoteNumber),
        );
      } else {
        const vapiQuoteUrl = buildSignedUrl(`/quote/${quote.id}`, "quote", quote.id);
        const template = quoteConfirmationEmail(
          customerName.split(" ")[0],
          quoteNumber,
          service?.display_name || serviceKey,
          pricingBreakdown,
          vapiQuoteUrl,
          unsub,
        );
        await sendEmail(customerEmail, template.subject, template.html);
      }
    } catch (err) {
      console.error("[Vapi] Email send error (non-fatal):", err);
    }
  }

  // Notify Jose about the phone quote
  try {
    await sendEmail(
      EMAIL_SALES,
      `New Phone Quote: ${quoteNumber} – ${customerName}`,
      buildJoseNotificationHtml(
        customerName,
        customerPhone,
        customerEmail,
        customerLocation,
        service?.display_name || serviceKey,
        quoteNumber,
        estimatedAmount,
        needsSiteVisit,
        description,
      ),
    );
  } catch (err) {
    console.error("[Vapi] Jose notification email error (non-fatal):", err);
  }

  // Build response for the voice agent
  if (needsSiteVisit) {
    return NextResponse.json({
      results: [
        {
          toolCallId: "create_quote",
          result: `Quote ${quoteNumber} created. This service requires a site visit. Jose will reach out to schedule a free site visit at the property.`,
        },
      ],
    });
  }

  return NextResponse.json({
    results: [
      {
        toolCallId: "create_quote",
        result: `Quote ${quoteNumber} created for $${estimatedAmount}. ${customerEmail ? "A confirmation email has been sent." : "Jose will follow up with the details."}`,
      },
    ],
  });
}

// ---------------------------------------------------------------------------
// Function: schedule_callback
// ---------------------------------------------------------------------------

async function handleScheduleCallback(
  params: Record<string, unknown>,
): Promise<NextResponse> {
  const customerName = (params.customer_name as string) || "Caller";
  const customerPhone = (params.customer_phone as string) || "";
  const preferredTime = (params.preferred_time as string) || "as soon as possible";
  const reason = (params.reason as string) || "General inquiry";

  // Notify Jose via email
  try {
    await sendEmail(
      EMAIL_SALES,
      `Callback Requested: ${customerName} – ${customerPhone}`,
      buildCallbackEmailHtml(customerName, customerPhone, reason, "", ""),
    );
  } catch (err) {
    console.error("[Vapi] Callback email error (non-fatal):", err);
  }

  // Create/update HubSpot contact and add note
  try {
    let contact = customerPhone ? await findContactByPhone(customerPhone) : null;
    if (!contact) {
      const nameParts = customerName.split(" ");
      const email = `phone-${normalizePhone(customerPhone)}@placeholder.myhorsefarm.com`;
      contact = await createContact(
        email,
        nameParts[0] || customerName,
        nameParts.slice(1).join(" ") || "",
        customerPhone,
      );
    }

    await createContactNote(
      contact.id,
      `[PHONE:CALLBACK] Callback requested via AI phone agent.
Name: ${customerName}
Phone: ${customerPhone}
Preferred Time: ${preferredTime}
Reason: ${reason}`,
    );
  } catch (err) {
    console.error("[Vapi] HubSpot callback note error (non-fatal):", err);
  }

  // Log to Supabase
  try {
    await supabase.from("phone_callbacks").insert({
      caller_name: customerName,
      caller_phone: customerPhone,
      preferred_time: preferredTime,
      reason,
      status: "pending",
    });
  } catch (err) {
    // Table may not exist yet — non-fatal
    console.error("[Vapi] Supabase callback insert error (non-fatal):", err);
  }

  return NextResponse.json({
    results: [
      {
        toolCallId: "schedule_callback",
        result: `Callback scheduled. Jose will call ${customerName} back ${preferredTime}. He usually gets back within 10 minutes during business hours.`,
      },
    ],
  });
}

// ---------------------------------------------------------------------------
// Function: transfer_to_jose
// ---------------------------------------------------------------------------

async function handleTransferToJose(
  params: Record<string, unknown>,
  callerPhone: string,
): Promise<NextResponse> {
  const customerName = (params.customer_name as string) || "";
  const reason = (params.reason as string) || "Caller requested transfer";

  // Log the transfer
  console.info(`[Vapi] Transfer to Jose: ${customerName || callerPhone} – ${reason}`);

  // Add HubSpot note if we can find the contact
  try {
    if (callerPhone) {
      const contact = await findContactByPhone(callerPhone);
      if (contact) {
        await createContactNote(
          contact.id,
          `[PHONE:TRANSFER] Call transferred to Jose from AI phone agent.
Caller: ${customerName || callerPhone}
Reason: ${reason}`,
        );
      }
    }
  } catch (err) {
    console.error("[Vapi] Transfer note error (non-fatal):", err);
  }

  // Vapi handles the actual call transfer via the response
  // Return Jose's number for Vapi to transfer to
  return NextResponse.json({
    results: [
      {
        toolCallId: "transfer_to_jose",
        result: "Transferring to Jose now.",
      },
    ],
    // Vapi transfer destination
    destination: {
      type: "number",
      number: "+15615767667",
      message: `Transferring a call from ${customerName || "a caller"}. Reason: ${reason}`,
    },
  });
}

// ---------------------------------------------------------------------------
// Email templates (simple HTML — keeps this file self-contained)
// ---------------------------------------------------------------------------

function buildCallbackEmailHtml(
  name: string,
  phone: string,
  reason: string,
  summary: string,
  duration: string,
): string {
  return `<!DOCTYPE html>
<html><head><meta charset="utf-8"></head>
<body style="font-family:Arial,sans-serif;margin:0;padding:20px;background:#f4f4f4;">
<div style="max-width:600px;margin:0 auto;background:#fff;border-radius:8px;padding:24px;">
<h2 style="color:#2d5016;margin-top:0;">Callback Requested</h2>
<table style="width:100%;border-collapse:collapse;">
<tr><td style="padding:8px 0;font-weight:bold;width:140px;">Name:</td><td>${escapeHtml(name)}</td></tr>
<tr><td style="padding:8px 0;font-weight:bold;">Phone:</td><td><a href="tel:${escapeHtml(phone)}">${escapeHtml(phone)}</a></td></tr>
<tr><td style="padding:8px 0;font-weight:bold;">Reason:</td><td>${escapeHtml(reason)}</td></tr>
${duration ? `<tr><td style="padding:8px 0;font-weight:bold;">Call Duration:</td><td>${escapeHtml(duration)}</td></tr>` : ""}
</table>
${summary ? `<div style="margin-top:16px;padding:12px;background:#f9f9f9;border-radius:4px;"><strong>Call Summary:</strong><br>${escapeHtml(summary)}</div>` : ""}
<p style="margin-top:20px;color:#666;font-size:13px;">This callback was requested via the My Horse Farm AI phone agent.</p>
</div></body></html>`;
}

function buildJoseNotificationHtml(
  name: string,
  phone: string,
  email: string,
  location: string,
  service: string,
  quoteNumber: string,
  amount: number,
  needsSiteVisit: boolean,
  description: string,
): string {
  return `<!DOCTYPE html>
<html><head><meta charset="utf-8"></head>
<body style="font-family:Arial,sans-serif;margin:0;padding:20px;background:#f4f4f4;">
<div style="max-width:600px;margin:0 auto;background:#fff;border-radius:8px;padding:24px;">
<h2 style="color:#2d5016;margin-top:0;">New Phone Quote: ${escapeHtml(quoteNumber)}</h2>
<table style="width:100%;border-collapse:collapse;">
<tr><td style="padding:8px 0;font-weight:bold;width:140px;">Customer:</td><td>${escapeHtml(name)}</td></tr>
<tr><td style="padding:8px 0;font-weight:bold;">Phone:</td><td><a href="tel:${escapeHtml(phone)}">${escapeHtml(phone)}</a></td></tr>
<tr><td style="padding:8px 0;font-weight:bold;">Email:</td><td>${escapeHtml(email || "Not provided")}</td></tr>
<tr><td style="padding:8px 0;font-weight:bold;">Location:</td><td>${escapeHtml(location)}</td></tr>
<tr><td style="padding:8px 0;font-weight:bold;">Service:</td><td>${escapeHtml(service)}</td></tr>
<tr><td style="padding:8px 0;font-weight:bold;">Amount:</td><td>$${amount.toFixed(2)}</td></tr>
${needsSiteVisit ? `<tr><td style="padding:8px 0;font-weight:bold;">Site Visit:</td><td style="color:#d97706;font-weight:bold;">Required</td></tr>` : ""}
${description ? `<tr><td style="padding:8px 0;font-weight:bold;">Notes:</td><td>${escapeHtml(description)}</td></tr>` : ""}
</table>
<p style="margin-top:20px;color:#666;font-size:13px;">This quote was created by the My Horse Farm AI phone agent.</p>
</div></body></html>`;
}

function buildSiteVisitEmailHtml(
  firstName: string,
  serviceName: string,
  quoteNumber: string,
): string {
  return `<!DOCTYPE html>
<html><head><meta charset="utf-8"></head>
<body style="font-family:Arial,sans-serif;margin:0;padding:20px;background:#f4f4f4;">
<div style="max-width:600px;margin:0 auto;background:#fff;border-radius:8px;padding:24px;">
<h2 style="color:#2d5016;margin-top:0;">Thanks for calling My Horse Farm!</h2>
<p>Hi ${escapeHtml(firstName)},</p>
<p>Thanks for reaching out about <strong>${escapeHtml(serviceName)}</strong>. Your request reference is <strong>${escapeHtml(quoteNumber)}</strong>.</p>
<p>This service requires a quick site visit so we can give you an accurate quote. Jose will be in touch shortly to schedule a time that works for you.</p>
<p>If you need anything in the meantime, call us at <a href="tel:+15615767667">(561) 576-7667</a>.</p>
<p style="margin-top:24px;">Thanks,<br><strong>Jose Gomez</strong><br>My Horse Farm<br>(561) 576-7667</p>
</div></body></html>`;
}

// ---------------------------------------------------------------------------
// Utility
// ---------------------------------------------------------------------------

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;");
}
