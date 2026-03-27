import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import {
  findContactByEmail,
  createContactNote,
  updateContactProperties,
} from "@/lib/hubspot";

export const runtime = "nodejs";

/**
 * POST /api/webhooks/resend
 * Receives email events from Resend:
 *   - email.sent, email.delivered, email.opened, email.clicked
 *   - email.bounced, email.complained
 *
 * 1. Updates email_ab_sends for A/B test analytics
 * 2. Logs all events to email_events table for daily digest
 * 3. Tags HubSpot contacts on engagement (open, click)
 * 4. Auto-upgrades lead status to WARM after 2+ clicks
 * 5. Auto-suppresses contacts after 2+ bounces
 * 6. Fires Meta CAPI ViewContent on clicks
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, data, created_at } = body as {
      type: string;
      created_at?: string;
      data?: {
        email_id?: string;
        from?: string;
        to?: string | string[];
        subject?: string;
        click?: { link?: string };
      };
    };

    if (!data?.email_id) {
      return NextResponse.json({ ok: true, skipped: "no email_id" });
    }

    const emailId = data.email_id;
    const now = new Date().toISOString();
    const recipientEmail =
      typeof data.to === "string"
        ? data.to
        : Array.isArray(data.to)
          ? data.to[0]
          : null;

    // -----------------------------------------------------------------------
    // 1. Update A/B test tracking (existing logic)
    // -----------------------------------------------------------------------
    if (type === "email.opened") {
      await supabase
        .from("email_ab_sends")
        .update({ opened: true, opened_at: now })
        .eq("resend_email_id", emailId)
        .eq("opened", false)
        .then(() => {});
    } else if (type === "email.clicked") {
      await supabase
        .from("email_ab_sends")
        .update({ clicked: true, clicked_at: now })
        .eq("resend_email_id", emailId)
        .eq("clicked", false)
        .then(() => {});
    }

    // -----------------------------------------------------------------------
    // 2. Log event to email_events table for daily digest
    // -----------------------------------------------------------------------
    try {
      await supabase.from("email_events").insert({
        resend_email_id: emailId,
        event_type: type.replace("email.", ""),
        recipient_email: recipientEmail?.toLowerCase() || null,
        subject: data.subject || null,
        click_url: data.click?.link || null,
        event_at: created_at || now,
      });
    } catch {
      // Table may not exist yet — non-fatal
    }

    // -----------------------------------------------------------------------
    // 3. Tag HubSpot contact + lead scoring + bounce suppression
    // -----------------------------------------------------------------------
    if (recipientEmail) {
      try {
        const contact = await findContactByEmail(recipientEmail);
        if (!contact) return NextResponse.json({ ok: true, type });

        if (type === "email.opened" || type === "email.clicked") {
          const action = type === "email.opened" ? "opened" : "clicked";
          const subject = data.subject ? ` "${data.subject}"` : "";
          const link = data.click?.link ? ` → ${data.click.link}` : "";
          await createContactNote(
            contact.id,
            `[EMAIL:${action.toUpperCase()}] Contact ${action} email${subject}${link} on ${now}`,
          );

          // ---------------------------------------------------------------
          // 4. Auto-upgrade lead status on clicks
          // ---------------------------------------------------------------
          if (type === "email.clicked") {
            // Count total click events for this contact
            try {
              const { count } = await supabase
                .from("email_events")
                .select("*", { count: "exact", head: true })
                .eq("recipient_email", recipientEmail.toLowerCase())
                .eq("event_type", "clicked");

              const clickCount = count || 0;
              const currentStatus = contact.properties.hs_lead_status;

              // 2+ clicks → WARM (only if currently NEW)
              if (clickCount >= 2 && currentStatus === "NEW") {
                await updateContactProperties(contact.id, {
                  hs_lead_status: "WARM",
                });
                await createContactNote(
                  contact.id,
                  `[AUTO:LEAD_SCORE] Upgraded to WARM — ${clickCount} email clicks detected on ${now}`,
                );
              }
              // 5+ clicks → CONNECTED (hot lead)
              else if (clickCount >= 5 && currentStatus === "WARM") {
                await updateContactProperties(contact.id, {
                  hs_lead_status: "CONNECTED",
                });
                await createContactNote(
                  contact.id,
                  `[AUTO:LEAD_SCORE] Upgraded to CONNECTED — ${clickCount} email clicks detected on ${now}`,
                );
              }
            } catch {
              // Lead scoring is non-fatal
            }

            // ---------------------------------------------------------------
            // 6. Fire Meta CAPI ViewContent on clicks
            // ---------------------------------------------------------------
            try {
              const pixelId = process.env.META_PIXEL_ID;
              const accessToken = process.env.META_CAPI_TOKEN;
              if (pixelId && accessToken) {
                await fetch(
                  `https://graph.facebook.com/v21.0/${pixelId}/events`,
                  {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                      data: [
                        {
                          event_name: "ViewContent",
                          event_time: Math.floor(Date.now() / 1000),
                          action_source: "email",
                          user_data: {
                            em: [recipientEmail.toLowerCase()],
                          },
                          custom_data: {
                            content_name: data.subject || "Email Click",
                            content_category: "email_engagement",
                            url: data.click?.link || "",
                          },
                        },
                      ],
                      access_token: accessToken,
                    }),
                  },
                );
              }
            } catch {
              // Meta CAPI is non-fatal
            }
          }
        }

        // ---------------------------------------------------------------
        // 5. Bounce suppression — after 2+ bounces, suppress contact
        // ---------------------------------------------------------------
        if (type === "email.bounced") {
          await createContactNote(
            contact.id,
            `[EMAIL:BOUNCED] Email bounced for ${recipientEmail} on ${now}`,
          );

          try {
            const { count } = await supabase
              .from("email_events")
              .select("*", { count: "exact", head: true })
              .eq("recipient_email", recipientEmail.toLowerCase())
              .eq("event_type", "bounced");

            if ((count || 0) >= 2) {
              // Suppress by setting lead status to UNQUALIFIED
              await updateContactProperties(contact.id, {
                hs_lead_status: "UNQUALIFIED",
              });
              await createContactNote(
                contact.id,
                `[AUTO:SUPPRESSED] Contact suppressed after ${count} bounces on ${now}`,
              );
            }
          } catch {
            // Suppression is non-fatal
          }
        }

        // Complaint handling
        if (type === "email.complained") {
          await createContactNote(
            contact.id,
            `[EMAIL:COMPLAINED] Spam complaint from ${recipientEmail} on ${now}`,
          );
          // Immediately suppress
          await updateContactProperties(contact.id, {
            hs_lead_status: "UNQUALIFIED",
          });
        }
      } catch {
        // HubSpot operations are non-fatal
      }
    }

    return NextResponse.json({ ok: true, type });
  } catch (err) {
    console.error("Resend webhook error:", err);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 },
    );
  }
}
