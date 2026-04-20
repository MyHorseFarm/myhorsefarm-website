declare global {
  interface Window {
    dataLayer: Record<string, unknown>[];
  }
}

export function trackEvent(event: string, params?: Record<string, unknown>) {
  if (typeof window !== "undefined" && window.dataLayer) {
    window.dataLayer.push({ event, ...params });
  }
}

/** Generate a unique event ID for dedup between browser pixel and server CAPI */
export function generateEventId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
}

export interface EnhancedUserData {
  email?: string;
  phone?: string;
  first_name?: string;
  last_name?: string;
  city?: string;
  state?: string;
  country?: string;
}

// GA4's ecommerce whitelist. Events on this list can carry `currency` + `value`
// at the top level of a dataLayer push. Events NOT on this list get rejected
// by GTM's ecommerce validator with "Invalid Ecommerce event name" and are
// silently dropped before reaching GA4 — even though the push itself succeeds.
const GA4_ECOMMERCE_EVENTS = new Set([
  "add_to_cart",
  "begin_checkout",
  "purchase",
  "refund",
  "view_item",
  "select_item",
  "view_item_list",
  "add_shipping_info",
  "add_payment_info",
  "view_cart",
  "remove_from_cart",
  "select_promotion",
  "view_promotion",
]);

/**
 * Push conversion event with enhanced conversion data for Google Ads.
 * Includes event_id for Meta pixel dedup.
 */
export function trackConversion(
  event: string,
  params: Record<string, unknown>,
  userData: EnhancedUserData,
  eventId: string,
) {
  if (typeof window === "undefined" || !window.dataLayer) return;

  // Push enhanced_conversions object for Google Ads tag to pick up
  const enhanced: Record<string, string> = {};
  if (userData.email) enhanced.email = userData.email.toLowerCase().trim();
  if (userData.phone) enhanced.phone_number = userData.phone.replace(/[^\d+]/g, "");
  if (userData.first_name) enhanced.first_name = userData.first_name.toLowerCase().trim();
  if (userData.last_name) enhanced.last_name = userData.last_name.toLowerCase().trim();
  if (userData.city) enhanced.city = userData.city.toLowerCase().trim();
  if (userData.state) enhanced.state = userData.state.toLowerCase().trim();
  if (userData.country) enhanced.country = (userData.country || "US").toLowerCase().trim();

  const payload: Record<string, unknown> = {
    event,
    event_id: eventId,
    enhanced_conversions: enhanced,
    ...params,
  };

  // Sidestep GTM's ecommerce validator for non-whitelisted events (e.g.,
  // generate_lead). Moving the monetary fields to differently-named keys
  // keeps the data accessible to GTM variables while the event itself passes
  // through GA4's non-ecommerce path.
  if (!GA4_ECOMMERCE_EVENTS.has(event)) {
    if (payload.value !== undefined) {
      payload.conversion_value = payload.value;
      delete payload.value;
    }
    if (payload.currency !== undefined) {
      payload.conversion_currency = payload.currency;
      delete payload.currency;
    }
  }

  // Push to dataLayer — GTM handles all Google Ads + Meta Pixel conversion tags
  window.dataLayer.push(payload);
}
