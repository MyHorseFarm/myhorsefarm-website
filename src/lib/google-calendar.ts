const TOKEN_URL = "https://oauth2.googleapis.com/token";
const CALENDAR_API = "https://www.googleapis.com/calendar/v3";
const TIMEZONE = "America/New_York";

let cachedToken: { token: string; expiresAt: number } | null = null;

async function getAccessToken(): Promise<string> {
  if (cachedToken && Date.now() < cachedToken.expiresAt) {
    return cachedToken.token;
  }

  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const refreshToken = process.env.GOOGLE_REFRESH_TOKEN;

  if (!clientId || !clientSecret || !refreshToken) {
    throw new Error("Google Calendar credentials not configured");
  }

  const res = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      refresh_token: refreshToken,
      grant_type: "refresh_token",
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Google token refresh failed ${res.status}: ${err}`);
  }

  const data = await res.json();
  cachedToken = {
    token: data.access_token,
    expiresAt: Date.now() + (data.expires_in - 300) * 1000, // refresh 5 min early
  };

  return cachedToken.token;
}

interface CalendarEventInput {
  summary: string;
  description: string;
  location: string;
  startDate: string; // "2026-03-15"
  timeSlot: "morning" | "afternoon";
}

/**
 * Create a Google Calendar event on the business calendar (the business calendar).
 * Returns the event ID.
 */
export async function createCalendarEvent(event: CalendarEventInput): Promise<string | null> {
  const token = await getAccessToken();
  const calendarId = process.env.GOOGLE_CALENDAR_ID || "primary";

  const startHour = event.timeSlot === "morning" ? "08:00:00" : "12:00:00";
  const endHour = event.timeSlot === "morning" ? "12:00:00" : "17:00:00";

  const body = {
    summary: event.summary,
    description: event.description,
    location: event.location,
    start: {
      dateTime: `${event.startDate}T${startHour}`,
      timeZone: TIMEZONE,
    },
    end: {
      dateTime: `${event.startDate}T${endHour}`,
      timeZone: TIMEZONE,
    },
    reminders: { useDefault: true },
  };

  const res = await fetch(`${CALENDAR_API}/calendars/${encodeURIComponent(calendarId)}/events`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Google Calendar ${res.status}: ${err}`);
  }

  const data = await res.json();
  return data.id ?? null;
}
