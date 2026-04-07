import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import {
  updateDealStage,
  createContactNote,
  findContactByEmail,
  isSubscribed,
  STAGE_QUOTED,
  STAGE_SCHEDULED,
  STAGE_LOST,
} from "@/lib/hubspot";
import { sendEmail } from "@/lib/emails";
import { withCronMonitor } from "@/lib/cron-monitor";

export const runtime = "nodejs";
export const maxDuration = 120;

/**
 * Deal Cleanup Cron — runs daily at 11:00 AM ET
 *
 * 1. Moves expired quotes (14+ days past expiry) to Lost stage
 * 2. Moves stale scheduled deals (7+ days past service date, no payment) to Lost
 * 3. Sends a final win-back email before marking Lost
 */
export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return withCronMonitor("deal-cleanup", async () => {
    const results: string[] = [];
    const errors: string[] = [];
    const siteUrl =
      process.env.NEXT_PUBLIC_SITE_URL || "https://www.myhorsefarm.com";

    // -----------------------------------------------------------------
    // 1. Expired quotes: 14+ days past expiry, still in "expired" status
    // -----------------------------------------------------------------
    const expiryCutoff = new Date(
      Date.now() - 14 * 24 * 60 * 60 * 1000,
    ).toISOString();

    const { data: staleQuotes } = await supabase
      .from("quotes")
      .select("*")
      .eq("status", "expired")
      .lte("expires_at", expiryCutoff)
      .not("hubspot_deal_id", "is", null);

    for (const quote of staleQuotes ?? []) {
      try {
        // Send final win-back email if subscribed and not already sent
        try {
          if (await isSubscribed(quote.customer_email)) {
            const firstName = quote.customer_name.split(" ")[0];
            const html = `
              <p>Hi ${firstName},</p>
              <p>We noticed you requested a quote for ${quote.service_key.replace(/_/g, " ")} a while back but never got a chance to schedule.</p>
              <p>If your needs have changed or you have questions, we're here to help. We'd love to earn your business.</p>
              <p><a href="${siteUrl}/quote" style="display:inline-block;padding:12px 24px;background:#2d5016;color:#fff;text-decoration:none;border-radius:6px;">Get a New Quote</a></p>
              <p>Or call us anytime at <a href="tel:+15615767667">(561) 576-7667</a>.</p>
              <p>Best,<br/>Jose Gomez<br/>My Horse Farm</p>
            `;
            await sendEmail(
              quote.customer_email,
              "Still need help with your property?",
              html,
            );
          }
        } catch { /* email non-fatal */ }

        // Move deal to Lost
        await updateDealStage(quote.hubspot_deal_id, STAGE_LOST);

        // Tag the contact
        const contactId =
          quote.hubspot_contact_id ||
          (await findContactByEmail(quote.customer_email))?.id;
        if (contactId) {
          await createContactNote(
            contactId,
            `[AUTO:DEAL_LOST] Quote ${quote.quote_number} expired 14+ days ago. Deal moved to Lost.`,
          );
        }

        // Mark quote as expired in Supabase (already expired, ensures consistency)
        await supabase
          .from("quotes")
          .update({ status: "expired" })
          .eq("id", quote.id);

        results.push(`lost_quote → ${quote.customer_email} (${quote.quote_number})`);
      } catch (err) {
        errors.push(`lost_quote FAIL ${quote.quote_number}: ${err}`);
      }
    }

    // -----------------------------------------------------------------
    // 2. Stale bookings: 7+ days past service date, still "confirmed"
    // -----------------------------------------------------------------
    const bookingCutoff = new Date(
      Date.now() - 7 * 24 * 60 * 60 * 1000,
    ).toISOString().split("T")[0];

    const { data: staleBookings } = await supabase
      .from("bookings")
      .select("*")
      .eq("status", "confirmed")
      .lte("scheduled_date", bookingCutoff);

    for (const booking of staleBookings ?? []) {
      try {
        // Look up recurring_customer by email to get the uuid for service_logs
        const { data: recurringCustomer } = await supabase
          .from("recurring_customers")
          .select("id")
          .eq("email", booking.customer_email)
          .single();

        // Check if there's a completed service log or payment
        let logs: { id: string }[] | null = null;
        if (recurringCustomer) {
          const { data } = await supabase
            .from("service_logs")
            .select("id")
            .eq("customer_id", recurringCustomer.id)
            .eq("service_date", booking.scheduled_date)
            .eq("status", "charged")
            .limit(1);
          logs = data;
        }

        if (logs && logs.length > 0) {
          // Service was completed — mark booking as completed
          await supabase
            .from("bookings")
            .update({ status: "completed" })
            .eq("id", booking.id);
          results.push(`completed_booking → ${booking.customer_email} (${booking.booking_number})`);
          continue;
        }

        // No payment found — move deal to Lost
        if (booking.hubspot_deal_id) {
          await updateDealStage(booking.hubspot_deal_id, STAGE_LOST);
        }

        const contactId =
          booking.hubspot_contact_id ||
          (await findContactByEmail(booking.customer_email))?.id;
        if (contactId) {
          await createContactNote(
            contactId,
            `[AUTO:DEAL_LOST] Booking ${booking.booking_number} was 7+ days past service date with no payment. Deal moved to Lost.`,
          );
        }

        await supabase
          .from("bookings")
          .update({ status: "cancelled" })
          .eq("id", booking.id);

        results.push(`lost_booking → ${booking.customer_email} (${booking.booking_number})`);
      } catch (err) {
        errors.push(`lost_booking FAIL ${booking.booking_number}: ${err}`);
      }
    }

    return {
      processed: results.length,
      results,
      errors: errors.length > 0 ? errors : undefined,
    };
  });
}
