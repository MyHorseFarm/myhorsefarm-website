// ---------------------------------------------------------------------------
// Meta / Facebook Conversions API (Server-Side)
// ---------------------------------------------------------------------------

import { createHash } from "crypto";

const PIXEL_ID = process.env.META_PIXEL_ID;
const ACCESS_TOKEN = process.env.META_CAPI_ACCESS_TOKEN;
const API_VERSION = "v21.0";

function sha256(value: string): string {
  return createHash("sha256")
    .update(value.toLowerCase().trim())
    .digest("hex");
}

interface MetaEventParams {
  event_name: string;
  event_id?: string;
  event_time?: number;
  action_source?: string;
  event_source_url?: string;
  user_data?: {
    email?: string;
    phone?: string;
    first_name?: string;
    last_name?: string;
    city?: string;
    state?: string;
    country?: string;
    fbc?: string;
    fbp?: string;
    client_ip_address?: string;
    client_user_agent?: string;
  };
  custom_data?: Record<string, unknown>;
}

/**
 * Send a server-side conversion event to Meta Conversions API.
 * Non-fatal — logs errors but doesn't throw.
 */
export async function sendMetaEvent(params: MetaEventParams): Promise<void> {
  if (!PIXEL_ID || !ACCESS_TOKEN) {
    console.log("Meta CAPI: skipped (no PIXEL_ID or ACCESS_TOKEN)");
    return;
  }

  const userData: Record<string, unknown> = {};
  if (params.user_data) {
    const ud = params.user_data;
    if (ud.email) userData.em = [sha256(ud.email)];
    if (ud.phone) userData.ph = [sha256(ud.phone.replace(/[^\d]/g, ""))];
    if (ud.first_name) userData.fn = [sha256(ud.first_name)];
    if (ud.last_name) userData.ln = [sha256(ud.last_name)];
    if (ud.city) userData.ct = [sha256(ud.city)];
    if (ud.state) userData.st = [sha256(ud.state)];
    if (ud.country) userData.country = [sha256(ud.country || "us")];
    if (ud.fbc) userData.fbc = ud.fbc;
    if (ud.fbp) userData.fbp = ud.fbp;
    if (ud.client_ip_address) userData.client_ip_address = ud.client_ip_address;
    if (ud.client_user_agent) userData.client_user_agent = ud.client_user_agent;
  }

  const event = {
    event_name: params.event_name,
    event_time: params.event_time || Math.floor(Date.now() / 1000),
    event_id: params.event_id,
    action_source: params.action_source || "website",
    event_source_url: params.event_source_url,
    user_data: userData,
    custom_data: params.custom_data,
  };

  try {
    const url = `https://graph.facebook.com/${API_VERSION}/${PIXEL_ID}/events`;
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        data: [event],
        access_token: ACCESS_TOKEN,
      }),
    });

    if (!res.ok) {
      const body = await res.text();
      console.error("Meta CAPI error:", res.status, body);
    }
  } catch (err) {
    console.error("Meta CAPI fetch error:", err);
  }
}
