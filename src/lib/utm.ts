// ---------------------------------------------------------------------------
// UTM Parameter Capture & Persistence
// ---------------------------------------------------------------------------

export interface UtmParams {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
  gclid?: string;
  fbclid?: string;
  fbc?: string;
  fbp?: string;
}

const UTM_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
  "gclid",
  "fbclid",
] as const;

const STORAGE_KEY = "mhf_utm";

function getCookie(name: string): string | undefined {
  if (typeof document === "undefined") return undefined;
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : undefined;
}

/** Capture UTM params from current URL + Meta cookies. Call on page load. */
export function captureUtmParams(): void {
  if (typeof window === "undefined") return;

  const url = new URL(window.location.href);
  const params: Record<string, string> = {};

  for (const key of UTM_KEYS) {
    const val = url.searchParams.get(key);
    if (val) params[key] = val;
  }

  // Only overwrite stored params if we have new ones from URL
  if (Object.keys(params).length > 0) {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(params));
    } catch {
      // sessionStorage unavailable
    }
  }
}

/** Retrieve stored UTM params + Meta cookies for inclusion in API calls. */
export function getUtmParams(): UtmParams | undefined {
  if (typeof window === "undefined") return undefined;

  let stored: Record<string, string> = {};
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (raw) stored = JSON.parse(raw);
  } catch {
    // sessionStorage unavailable
  }

  // Always read Meta cookies fresh
  const fbc = getCookie("_fbc");
  const fbp = getCookie("_fbp");

  if (fbc) stored.fbc = fbc;
  if (fbp) stored.fbp = fbp;

  return Object.keys(stored).length > 0 ? (stored as UtmParams) : undefined;
}
