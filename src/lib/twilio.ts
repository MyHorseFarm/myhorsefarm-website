/**
 * Twilio SMS integration for My Horse Farm.
 * Sends SMS notifications for quotes, bookings, and follow-ups.
 *
 * Env vars: TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_PHONE_NUMBER
 */

const ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID;
const AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;
const FROM_NUMBER = process.env.TWILIO_PHONE_NUMBER;

export async function sendSMS(to: string, body: string): Promise<void> {
  if (!ACCOUNT_SID || !AUTH_TOKEN || !FROM_NUMBER) {
    console.warn("Twilio not configured — skipping SMS");
    return;
  }

  // Normalize phone number
  const normalized = normalizePhone(to);
  if (!normalized) {
    console.warn(`Invalid phone number: ${to}`);
    return;
  }

  const url = `https://api.twilio.com/2010-04-01/Accounts/${ACCOUNT_SID}/Messages.json`;
  const auth = Buffer.from(`${ACCOUNT_SID}:${AUTH_TOKEN}`).toString("base64");

  const params = new URLSearchParams({
    To: normalized,
    From: FROM_NUMBER,
    Body: body,
  });

  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: params.toString(),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(`Twilio SMS error: ${err.message || res.status}`);
  }
}

/**
 * Normalize a phone number to E.164 format (+1XXXXXXXXXX).
 * Returns null if the number can't be parsed.
 */
function normalizePhone(phone: string): string | null {
  const digits = phone.replace(/\D/g, "");
  if (digits.length === 10) return `+1${digits}`;
  if (digits.length === 11 && digits.startsWith("1")) return `+${digits}`;
  if (digits.length > 10 && digits.startsWith("+")) return phone.replace(/[^\d+]/g, "");
  return null;
}

// ---------------------------------------------------------------------------
// SMS templates
// ---------------------------------------------------------------------------

export function quoteReadySMS(
  customerName: string,
  amount: number,
  serviceName: string,
  quoteUrl: string,
): string {
  const first = customerName.split(" ")[0];
  return `Hi ${first}! Your My Horse Farm quote is ready: $${amount.toFixed(2)} for ${serviceName}. View & schedule: ${quoteUrl}\n\nReply STOP to opt out.`;
}

export function bookingConfirmedSMS(
  customerName: string,
  date: string,
  timeSlot: string,
): string {
  const first = customerName.split(" ")[0];
  const slot = timeSlot === "morning" ? "8AM-12PM" : "12PM-5PM";
  return `Hi ${first}! Your service is confirmed for ${date} (${slot}). Our crew will be there. Questions? Call (561) 576-7667.\n\nReply STOP to opt out.`;
}

export function quoteFollowupSMS(
  customerName: string,
  quoteUrl: string,
): string {
  const first = customerName.split(" ")[0];
  return `Hi ${first}, just checking in on your My Horse Farm quote. We'd love to help get your property taken care of. View: ${quoteUrl}\n\nReply STOP to opt out.`;
}

export function newLeadAlertSMS(
  customerName: string,
  amount: number,
  serviceName: string,
  phone: string,
  location: string,
  source: string,
): string {
  const isPaid = source === "google_ads" || source === "facebook";
  const tag = isPaid ? " [PAID AD]" : "";
  return `🚨 NEW LEAD${tag}\n${customerName} - ${phone}\n${serviceName} - $${amount.toFixed(2)}\n📍 ${location}\n\nCall them NOW!`;
}

export function paymentFailedSMS(
  customerName: string,
): string {
  const first = customerName.split(" ")[0];
  return `Hi ${first}, we couldn't process your payment for My Horse Farm service. Please update your payment method or call us at (561) 576-7667 to resolve this.\n\nReply STOP to opt out.`;
}

export function quoteExpiringSMS(
  customerName: string,
  daysLeft: number,
  quoteUrl: string,
): string {
  const first = customerName.split(" ")[0];
  return `Hi ${first}, your My Horse Farm quote expires in ${daysLeft} day${daysLeft !== 1 ? "s" : ""}. Lock in your price: ${quoteUrl}\n\nReply STOP to opt out.`;
}
