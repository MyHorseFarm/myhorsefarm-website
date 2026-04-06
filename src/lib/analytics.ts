declare global {
  interface Window {
    dataLayer: Record<string, unknown>[];
    gtag?: (...args: unknown[]) => void;
  }
}

const GADS_CONVERSION_ID = "AW-385210685";
const GADS_CONVERSION_LABEL = "vzneCILiqIccEL2y17cB";

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

  window.dataLayer.push({
    event,
    event_id: eventId,
    enhanced_conversions: enhanced,
    ...params,
  });

  // Fire Google Ads conversion for lead events
  if (
    window.gtag &&
    (event === "generate_lead" || event === "purchase" || event === "begin_checkout")
  ) {
    window.gtag("event", "conversion", {
      send_to: `${GADS_CONVERSION_ID}/${GADS_CONVERSION_LABEL}`,
      event_callback: () => {},
    });
  }
}
