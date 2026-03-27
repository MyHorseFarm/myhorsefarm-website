// ---------------------------------------------------------------------------
// WhatsApp Business Cloud API client
// ---------------------------------------------------------------------------

const API_VERSION = "v21.0";
const API_BASE = `https://graph.facebook.com/${API_VERSION}`;

function getPhoneNumberId(): string {
  const id = process.env.WHATSAPP_PHONE_NUMBER_ID;
  if (!id) throw new Error("WHATSAPP_PHONE_NUMBER_ID is not set");
  return id;
}

function getAccessToken(): string {
  const token = process.env.WHATSAPP_ACCESS_TOKEN;
  if (!token) throw new Error("WHATSAPP_ACCESS_TOKEN is not set");
  return token;
}

// ---------------------------------------------------------------------------
// Phone number normalization
// ---------------------------------------------------------------------------

/**
 * Normalize a phone number to WhatsApp format (E.164 without the +).
 * WhatsApp expects country code + number, e.g. "15615767667" for US numbers.
 *
 * Handles:
 * - "+1 (561) 576-7667" → "15615767667"
 * - "(561) 576-7667"    → "15615767667"
 * - "5615767667"         → "15615767667"
 * - "15615767667"        → "15615767667"
 */
export function normalizePhoneForWhatsApp(phone: string): string {
  const digits = phone.replace(/\D/g, "");

  // Already has US country code
  if (digits.length === 11 && digits.startsWith("1")) {
    return digits;
  }

  // 10-digit US number — prepend country code
  if (digits.length === 10) {
    return `1${digits}`;
  }

  // For international numbers or other formats, return as-is
  return digits;
}

// ---------------------------------------------------------------------------
// Core API request
// ---------------------------------------------------------------------------

interface WhatsAppApiResponse {
  messaging_product: string;
  contacts?: Array<{ input: string; wa_id: string }>;
  messages?: Array<{ id: string }>;
  error?: {
    message: string;
    type: string;
    code: number;
    fbtrace_id: string;
  };
}

async function whatsappRequest(
  path: string,
  body: Record<string, unknown>,
): Promise<WhatsAppApiResponse> {
  const response = await fetch(`${API_BASE}${path}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${getAccessToken()}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  const data = (await response.json()) as WhatsAppApiResponse;

  if (!response.ok || data.error) {
    const msg = data.error?.message ?? `HTTP ${response.status}`;
    throw new Error(`WhatsApp API error: ${msg}`);
  }

  return data;
}

// ---------------------------------------------------------------------------
// Send messages
// ---------------------------------------------------------------------------

/**
 * Send a plain text message to a WhatsApp number.
 * @param to Phone number (any format — will be normalized)
 * @param text Message body
 * @returns The WhatsApp message ID
 */
export async function sendWhatsAppMessage(
  to: string,
  text: string,
): Promise<string | undefined> {
  const phoneNumberId = getPhoneNumberId();
  const normalized = normalizePhoneForWhatsApp(to);

  const data = await whatsappRequest(`/${phoneNumberId}/messages`, {
    messaging_product: "whatsapp",
    recipient_type: "individual",
    to: normalized,
    type: "text",
    text: { preview_url: false, body: text },
  });

  return data.messages?.[0]?.id;
}

/**
 * Send a template message to a WhatsApp number.
 * @param to Phone number (any format — will be normalized)
 * @param templateName The approved template name
 * @param parameters Array of parameter values for the template body
 * @param languageCode Language code (default "en_US")
 * @returns The WhatsApp message ID
 */
export async function sendWhatsAppTemplate(
  to: string,
  templateName: string,
  parameters: string[] = [],
  languageCode = "en_US",
): Promise<string | undefined> {
  const phoneNumberId = getPhoneNumberId();
  const normalized = normalizePhoneForWhatsApp(to);

  const components: Array<Record<string, unknown>> = [];
  if (parameters.length > 0) {
    components.push({
      type: "body",
      parameters: parameters.map((value) => ({
        type: "text",
        text: value,
      })),
    });
  }

  const data = await whatsappRequest(`/${phoneNumberId}/messages`, {
    messaging_product: "whatsapp",
    to: normalized,
    type: "template",
    template: {
      name: templateName,
      language: { code: languageCode },
      ...(components.length > 0 ? { components } : {}),
    },
  });

  return data.messages?.[0]?.id;
}
