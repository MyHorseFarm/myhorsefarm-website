import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { Resend } from "resend";
import { withCronMonitor } from "@/lib/cron-monitor";

export const runtime = "nodejs";
export const maxDuration = 60;

const DIGEST_TO = process.env.ADMIN_EMAIL || "admin@myhorsefarm.com";

/**
 * Daily Email Digest — runs at 8:00 PM
 *
 * Sends Jose a summary of all email activity in the last 24 hours:
 * - Emails sent, delivered, opened, clicked
 * - Bounces and complaints
 * - Top clicked links
 * - Most engaged contacts
 * - New quotes and bookings
 */
export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return withCronMonitor("email-digest", async () => {
  const resend = new Resend(process.env.RESEND_API_KEY);
  const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "America/New_York",
  });
    // -----------------------------------------------------------------------
    // 1. Email event counts from Supabase
    // -----------------------------------------------------------------------
    let sent = 0, delivered = 0, opened = 0, clicked = 0, bounced = 0, complained = 0;
    const topClicks: Record<string, number> = {};
    const engagedContacts: Record<string, { opens: number; clicks: number }> = {};

    try {
      const { data: events } = await supabase
        .from("email_events")
        .select("event_type, recipient_email, click_url")
        .gte("event_at", since);

      if (events) {
        for (const e of events) {
          switch (e.event_type) {
            case "sent": sent++; break;
            case "delivered": delivered++; break;
            case "opened":
              opened++;
              if (e.recipient_email) {
                engagedContacts[e.recipient_email] = engagedContacts[e.recipient_email] || { opens: 0, clicks: 0 };
                engagedContacts[e.recipient_email].opens++;
              }
              break;
            case "clicked":
              clicked++;
              if (e.click_url) topClicks[e.click_url] = (topClicks[e.click_url] || 0) + 1;
              if (e.recipient_email) {
                engagedContacts[e.recipient_email] = engagedContacts[e.recipient_email] || { opens: 0, clicks: 0 };
                engagedContacts[e.recipient_email].clicks++;
              }
              break;
            case "bounced": bounced++; break;
            case "complained": complained++; break;
          }
        }
      }
    } catch {
      // email_events table may not exist yet
    }

    // -----------------------------------------------------------------------
    // 2. New quotes from Supabase
    // -----------------------------------------------------------------------
    let newQuotes = 0;
    try {
      const { count } = await supabase
        .from("quotes")
        .select("*", { count: "exact", head: true })
        .gte("created_at", since);
      newQuotes = count || 0;
    } catch {}

    // -----------------------------------------------------------------------
    // 3. New bookings from Supabase
    // -----------------------------------------------------------------------
    let newBookings = 0;
    try {
      const { count } = await supabase
        .from("bookings")
        .select("*", { count: "exact", head: true })
        .gte("created_at", since);
      newBookings = count || 0;
    } catch {}

    // -----------------------------------------------------------------------
    // 4. Build the digest email
    // -----------------------------------------------------------------------
    const openRate = sent > 0 ? ((opened / sent) * 100).toFixed(1) : "0";
    const clickRate = opened > 0 ? ((clicked / opened) * 100).toFixed(1) : "0";

    const topClicksList = Object.entries(topClicks)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);

    const topEngaged = Object.entries(engagedContacts)
      .sort((a, b) => (b[1].opens + b[1].clicks) - (a[1].opens + a[1].clicks))
      .slice(0, 10);

    const html = `<!DOCTYPE html>
<html><head><meta charset="utf-8"></head>
<body style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;color:#333;padding:20px;">
<div style="background:#2d5016;color:#fff;padding:20px;border-radius:8px 8px 0 0;text-align:center;">
<h1 style="margin:0;font-size:20px;">My Horse Farm — Daily Email Digest</h1>
<p style="margin:8px 0 0;color:#d4a843;font-size:14px;">${today}</p>
</div>

<div style="background:#fff;border:1px solid #e5e7eb;padding:25px;border-radius:0 0 8px 8px;">

<!-- Email Stats -->
<h2 style="font-size:16px;color:#2d5016;border-bottom:2px solid #d4a843;padding-bottom:8px;">Email Activity (Last 24 Hours)</h2>
<table style="width:100%;border-collapse:collapse;margin:15px 0;">
<tr>
<td style="padding:10px;background:#f0fdf4;text-align:center;border-radius:8px;"><strong style="font-size:24px;color:#2d5016;">${sent}</strong><br/><span style="font-size:12px;color:#666;">Sent</span></td>
<td style="padding:10px;background:#f0fdf4;text-align:center;border-radius:8px;"><strong style="font-size:24px;color:#2d5016;">${delivered}</strong><br/><span style="font-size:12px;color:#666;">Delivered</span></td>
<td style="padding:10px;background:#f0fdf4;text-align:center;border-radius:8px;"><strong style="font-size:24px;color:#2d5016;">${opened}</strong><br/><span style="font-size:12px;color:#666;">Opened</span></td>
<td style="padding:10px;background:#f0fdf4;text-align:center;border-radius:8px;"><strong style="font-size:24px;color:#2d5016;">${clicked}</strong><br/><span style="font-size:12px;color:#666;">Clicked</span></td>
</tr>
</table>
<p style="font-size:14px;color:#666;">Open rate: <strong>${openRate}%</strong> | Click rate: <strong>${clickRate}%</strong>${bounced > 0 ? ` | <span style="color:#dc2626;">Bounced: ${bounced}</span>` : ""}${complained > 0 ? ` | <span style="color:#dc2626;">Complaints: ${complained}</span>` : ""}</p>

<!-- Business Activity -->
<h2 style="font-size:16px;color:#2d5016;border-bottom:2px solid #d4a843;padding-bottom:8px;margin-top:25px;">Business Activity</h2>
<table style="width:100%;margin:15px 0;">
<tr><td style="padding:8px 0;font-size:15px;">New quotes requested:</td><td style="padding:8px 0;font-size:15px;font-weight:bold;text-align:right;">${newQuotes}</td></tr>
<tr><td style="padding:8px 0;font-size:15px;">New bookings:</td><td style="padding:8px 0;font-size:15px;font-weight:bold;text-align:right;">${newBookings}</td></tr>
</table>

${topClicksList.length > 0 ? `
<!-- Top Clicked Links -->
<h2 style="font-size:16px;color:#2d5016;border-bottom:2px solid #d4a843;padding-bottom:8px;margin-top:25px;">Top Clicked Links</h2>
<table style="width:100%;margin:15px 0;">
${topClicksList.map(([url, count]) => `<tr><td style="padding:6px 0;font-size:13px;word-break:break-all;"><a href="${url}" style="color:#2d5016;">${url.replace("https://www.myhorsefarm.com", "").replace("https://myhorsefarm.com", "") || "/"}</a></td><td style="padding:6px 0;font-size:13px;text-align:right;font-weight:bold;">${count} clicks</td></tr>`).join("")}
</table>
` : ""}

${topEngaged.length > 0 ? `
<!-- Most Engaged Contacts -->
<h2 style="font-size:16px;color:#2d5016;border-bottom:2px solid #d4a843;padding-bottom:8px;margin-top:25px;">Most Engaged Contacts</h2>
<p style="font-size:13px;color:#888;margin-bottom:10px;">These people opened or clicked — they're warm leads. Consider reaching out directly.</p>
<table style="width:100%;border-collapse:collapse;margin:15px 0;">
<tr style="background:#f9f7f2;"><th style="padding:8px;text-align:left;font-size:13px;">Email</th><th style="padding:8px;text-align:center;font-size:13px;">Opens</th><th style="padding:8px;text-align:center;font-size:13px;">Clicks</th></tr>
${topEngaged.map(([email, stats]) => `<tr><td style="padding:8px;font-size:13px;border-bottom:1px solid #eee;">${email}</td><td style="padding:8px;text-align:center;font-size:13px;border-bottom:1px solid #eee;">${stats.opens}</td><td style="padding:8px;text-align:center;font-size:13px;border-bottom:1px solid #eee;font-weight:bold;color:#2d5016;">${stats.clicks}</td></tr>`).join("")}
</table>
` : ""}

${sent === 0 && newQuotes === 0 && newBookings === 0 ? `
<p style="font-size:15px;color:#666;text-align:center;padding:20px 0;">Quiet day — no email activity or new business in the last 24 hours.</p>
` : ""}

<div style="margin-top:25px;padding-top:15px;border-top:1px solid #eee;text-align:center;">
<p style="font-size:12px;color:#999;">This digest is sent daily at 8:00 PM ET.<br/>
<a href="https://app-na2.hubspot.com/contacts/243452157" style="color:#2d5016;">Open HubSpot</a> |
<a href="https://www.myhorsefarm.com/admin" style="color:#2d5016;">Admin Dashboard</a></p>
</div>

</div>
</body></html>`;

    // Send the digest
    try {
      const { error } = await resend.emails.send({
        from: process.env.RESEND_FROM_EMAIL || "My Horse Farm <onboarding@resend.dev>",
        to: DIGEST_TO,
        subject: `MHF Daily Digest: ${sent} sent, ${opened} opened, ${clicked} clicked — ${today}`,
        html,
      });

      if (error) throw new Error(`Resend: ${JSON.stringify(error)}`);
    } catch (sendErr) {
      console.error("[email-digest] Failed to send digest:", sendErr instanceof Error ? sendErr.message : sendErr);
      throw sendErr;
    }

    return {
      processed: 1,
      sent: 1,
      stats: { sent, delivered, opened, clicked, bounced, complained, newQuotes, newBookings },
    };
  });
}
