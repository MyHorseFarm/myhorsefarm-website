const ADMIN_TOKEN_KEY = "mhf_admin_token";
const CREW_PIN_KEY = "mhf_crew_pin";

export function getAdminToken(): string {
  if (typeof window === "undefined") return "";
  return sessionStorage.getItem(ADMIN_TOKEN_KEY) || "";
}

export function setAdminToken(token: string): void {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(ADMIN_TOKEN_KEY, token);
}

export function getCrewPin(): string {
  if (typeof window === "undefined") return "";
  return sessionStorage.getItem(CREW_PIN_KEY) || "";
}

export function setCrewPin(pin: string): void {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(CREW_PIN_KEY, pin);
}

export function adminHeaders(token?: string): Record<string, string> {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token || getAdminToken()}`,
  };
}

export function crewHeaders(pin?: string): Record<string, string> {
  return {
    "Content-Type": "application/json",
    "x-crew-pin": pin || getCrewPin(),
  };
}

export function clearAdminSession(): void {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(ADMIN_TOKEN_KEY);
}

export function clearCrewSession(): void {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(CREW_PIN_KEY);
}
