import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { findContactByEmail } from "@/lib/hubspot";
import { Resend } from "resend";
import { withCronMonitor } from "@/lib/cron-monitor";

export const runtime = "nodejs";
export const maxDuration = 60;

const DIGEST_TO = process.env.ADMIN_EMAIL || "admin@myhorsefarm.com";

interface LeadStats {
  email: string;
  opens: number;
  clicks: number;
  firstname: string;
  lastname: string;
  phone: string;
}

/**
 * Hot Leads Morning Email — runs daily at 8:00 AM ET
 *
 * Queries email_events for clicks in the last 24 hours, enriches with
 * HubSpot contact data, and sends Jose an actionable list of people to call.
 */
export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return withCronMonitor("hot-leads", async () => {
  const resend = new Resend(process.env.RESEND_API_KEY);
  const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "America/New_York",
  });
    // -----------------------------------------------------------------
    // 1. Fetch all open + click events from the last 24 hours
    // -----------------------------------------------------------------
    const { data: events, error: dbError } = await supabase
      .from("email_events")
      .select("event_type, recipient_email")
      .in("event_type", ["opened", "clicked"])
      .gte("event_at", since);

    if (dbError) throw new Error(`Supabase: ${dbError.message}`);

    // -----------------------------------------------------------------
    // 2. Aggregate opens and clicks per recipient
    // -----------------------------------------------------------------
    const statsMap: Record<string, { opens: number; clicks: number }> = {};

    for (const e of events || []) {
      const email = e.recipient_email?.toLowerCase().trim();
      if (!email) continue;

      if (!statsMap[email]) statsMap[email] = { opens: 0, clicks: 0 };

      if (e.event_type === "opened") statsMap[email].opens++;
      if (e.event_type === "clicked") statsMap[email].clicks++;
    }

    // -----------------------------------------------------------------
    // 3. Filter to only people who clicked (not just opened)
    // -----------------------------------------------------------------
    const clickedEmails = Object.entries(statsMap)
      .filter(([, s]) => s.clicks > 0)
      .sort((a, b) => b[1].clicks - a[1].clicks);

    // -----------------------------------------------------------------
    // 4. Enrich with HubSpot contact info
    // -----------------------------------------------------------------
    const leads: LeadStats[] = [];

    for (const [email, stats] of clickedEmails) {
      let firstname = "";
      let lastname = "";
      let phone = "";

      try {
        const contact = await findContactByEmail(email);
        if (contact) {
          firstname = contact.properties.firstname || "";
          lastname = contact.properties.lastname || "";
          phone = contact.properties.phone || "";
        }
      } catch {
        // HubSpot lookup failed — still include the lead with email only
      }

      leads.push({
        email,
        opens: stats.opens,
        clicks: stats.clicks,
        firstname,
        lastname,
        phone,
      });
    }

    // -----------------------------------------------------------------
    // 5. Build and send the email
    // -----------------------------------------------------------------
    const count = leads.length;
    const subject = count > 0
      ? `MHF Hot Leads: ${count} ${count === 1 ? "person" : "people"} clicked your emails yesterday`
      : "MHF Hot Leads: No hot leads today";

    let html: string;

    if (count > 0) {
      const rows = leads
        .map(
          (l) =>
            `<tr>
              <td style="padding:10px 12px;border-bottom:1px solid #eee;font-size:14px;">${l.firstname || l.lastname ? `${l.firstname} ${l.lastname}`.trim() : "<em>Unknown</em>"}</td>
              <td style="padding:10px 12px;border-bottom:1px solid #eee;font-size:14px;"><a href="mailto:${l.email}" style="color:#2d5016;">${l.email}</a></td>
              <td style="padding:10px 12px;border-bottom:1px solid #eee;font-size:14px;">${l.phone ? `<a href="tel:${l.phone}" style="color:#2d5016;">${l.phone}</a>` : "—"}</td>
              <td style="padding:10px 12px;border-bottom:1px solid #eee;font-size:14px;text-align:center;">${l.opens}</td>
              <td style="padding:10px 12px;border-bottom:1px solid #eee;font-size:14px;text-align:center;font-weight:bold;color:#2d5016;">${l.clicks}</td>
            </tr>`,
        )
        .join("");

      html = `<!DOCTYPE html>
<html><head><meta charset="utf-8"></head>
<body style="font-family:Arial,sans-serif;max-width:700px;margin:0 auto;color:#333;padding:20px;">
<div style="background:#2d5016;color:#fff;padding:20px;border-radius:8px 8px 0 0;text-align:center;">
  <h1 style="margin:0;font-size:20px;">My Horse Farm — Hot Leads</h1>
  <p style="margin:8px 0 0;color:#d4a843;font-size:14px;">${today}</p>
</div>

<div style="background:#fff;border:1px solid #e5e7eb;padding:25px;border-radius:0 0 8px 8px;">
  <p style="font-size:15px;margin:0 0 5px;">
    <strong>${count} ${count === 1 ? "person" : "people"}</strong> clicked links in your emails in the last 24 hours.
  </p>
  <p style="font-size:14px;color:#666;margin:0 0 20px;">These are your warmest leads — pick up the phone and call them.</p>

  <table style="width:100%;border-collapse:collapse;">
    <thead>
      <tr style="background:#f9f7f2;">
        <th style="padding:10px 12px;text-align:left;font-size:13px;font-weight:600;border-bottom:2px solid #d4a843;">Name</th>
        <th style="padding:10px 12px;text-align:left;font-size:13px;font-weight:600;border-bottom:2px solid #d4a843;">Email</th>
        <th style="padding:10px 12px;text-align:left;font-size:13px;font-weight:600;border-bottom:2px solid #d4a843;">Phone</th>
        <th style="padding:10px 12px;text-align:center;font-size:13px;font-weight:600;border-bottom:2px solid #d4a843;">Opens</th>
        <th style="padding:10px 12px;text-align:center;font-size:13px;font-weight:600;border-bottom:2px solid #d4a843;">Clicks</th>
      </tr>
    </thead>
    <tbody>
      ${rows}
    </tbody>
  </table>

  <div style="margin-top:25px;padding-top:15px;border-top:1px solid #eee;text-align:center;">
    <p style="font-size:12px;color:#999;">This report is sent daily at 8:00 AM ET.<br/>
    <a href="https://app-na2.hubspot.com/contacts/243452157" style="color:#2d5016;">Open HubSpot</a> |
    <a href="https://www.myhorsefarm.com/admin" style="color:#2d5016;">Admin Dashboard</a></p>
  </div>
</div>
</body></html>`;
    } else {
      html = `<!DOCTYPE html>
<html><head><meta charset="utf-8"></head>
<body style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;color:#333;padding:20px;">
<div style="background:#2d5016;color:#fff;padding:20px;border-radius:8px 8px 0 0;text-align:center;">
  <h1 style="margin:0;font-size:20px;">My Horse Farm — Hot Leads</h1>
  <p style="margin:8px 0 0;color:#d4a843;font-size:14px;">${today}</p>
</div>

<div style="background:#fff;border:1px solid #e5e7eb;padding:25px;border-radius:0 0 8px 8px;">
  <p style="font-size:15px;color:#666;text-align:center;padding:30px 0;">No one clicked your emails in the last 24 hours. Check back tomorrow.</p>

  <div style="margin-top:15px;padding-top:15px;border-top:1px solid #eee;text-align:center;">
    <p style="font-size:12px;color:#999;">This report is sent daily at 8:00 AM ET.<br/>
    <a href="https://app-na2.hubspot.com/contacts/243452157" style="color:#2d5016;">Open HubSpot</a> |
    <a href="https://www.myhorsefarm.com/admin" style="color:#2d5016;">Admin Dashboard</a></p>
  </div>
</div>
</body></html>`;
    }

    const { error: sendError } = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || "My Horse Farm <onboarding@resend.dev>",
      to: DIGEST_TO,
      subject,
      html,
    });

    if (sendError) throw new Error(`Resend: ${JSON.stringify(sendError)}`);

    return {
      processed: count,
      sent: 1,
      hotLeads: count,
      leads: leads.map((l) => ({ email: l.email, clicks: l.clicks })),
    };
  });
}
