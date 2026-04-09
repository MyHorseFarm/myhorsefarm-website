/**
 * Tests for POST /api/booking
 */
import { NextRequest } from "next/server";

// ---------------------------------------------------------------------------
// Mocks
// ---------------------------------------------------------------------------

const mockSupabaseFrom = jest.fn();
jest.mock("@/lib/supabase", () => ({
  supabase: { from: (...args: unknown[]) => mockSupabaseFrom(...args) },
}));

jest.mock("@/lib/availability", () => ({
  hasCapacity: jest.fn(),
}));

jest.mock("@/lib/hubspot", () => ({
  findContactByEmail: jest.fn().mockResolvedValue({ id: "hub-1" }),
  createContact: jest.fn().mockResolvedValue({ id: "hub-1" }),
  createDeal: jest.fn().mockResolvedValue({ id: "deal-1" }),
  findActiveDealForContact: jest.fn().mockResolvedValue(null),
  updateDealStage: jest.fn(),
  createContactNote: jest.fn(),
  STAGE_SCHEDULED: "456",
}));

jest.mock("@/lib/emails", () => ({
  sendEmail: jest.fn().mockResolvedValue(undefined),
  createUnsubscribeUrl: jest.fn().mockReturnValue("https://unsub"),
  bookingConfirmationEmail: jest.fn().mockReturnValue({ subject: "s", html: "h" }),
}));

jest.mock("@/lib/meta-capi", () => ({
  sendMetaEvent: jest.fn().mockResolvedValue(undefined),
}));

jest.mock("@/lib/google-calendar", () => ({
  createCalendarEvent: jest.fn().mockResolvedValue("event-123"),
}));

// ---------------------------------------------------------------------------
// Imports
// ---------------------------------------------------------------------------

import { POST } from "@/app/api/booking/route";
import { hasCapacity } from "@/lib/availability";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function makeRequest(body: Record<string, unknown>): NextRequest {
  return new NextRequest("https://localhost/api/booking", {
    method: "POST",
    body: JSON.stringify(body),
    headers: { "content-type": "application/json" },
  });
}

// Use a future date to avoid the past-date check
const futureDate = "2027-06-15";

const validBody = {
  customer_name: "Jane Doe",
  customer_email: "jane@example.com",
  customer_phone: "5551234567",
  customer_location: "Wellington, FL",
  service_key: "manure-removal",
  scheduled_date: futureDate,
  time_slot: "morning",
};

function setupSupabaseMocks() {
  mockSupabaseFrom.mockImplementation((table: string) => {
    if (table === "bookings") {
      return {
        select: jest.fn().mockReturnValue({
          like: jest.fn().mockResolvedValue({ count: 0 }),
        }),
        insert: jest.fn().mockReturnValue({
          select: jest.fn().mockReturnValue({
            single: jest.fn().mockResolvedValue({
              data: { id: "b-1", booking_number: "MHF-B-20270615-001" },
              error: null,
            }),
          }),
        }),
        update: jest.fn().mockReturnValue({
          eq: jest.fn().mockResolvedValue({ error: null }),
        }),
      };
    }
    if (table === "service_pricing") {
      return {
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            single: jest.fn().mockResolvedValue({
              data: { display_name: "Manure Removal" },
            }),
          }),
        }),
      };
    }
    return {};
  });
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe("POST /api/booking", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns 400 when required fields are missing", async () => {
    const res = await POST(makeRequest({ customer_name: "Jane" }));
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.error).toMatch(/missing required fields/i);
  });

  it("returns 400 for a past date", async () => {
    const body = { ...validBody, scheduled_date: "2020-01-01" };
    const res = await POST(makeRequest(body));
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.error).toMatch(/past/i);
  });

  it("returns 409 when date has no capacity", async () => {
    (hasCapacity as jest.Mock).mockResolvedValueOnce(false);

    const res = await POST(makeRequest(validBody));
    expect(res.status).toBe(409);
    const json = await res.json();
    expect(json.error).toMatch(/no availability/i);
  });

  it("returns 200 with booking data on success", async () => {
    (hasCapacity as jest.Mock).mockResolvedValueOnce(true);
    setupSupabaseMocks();

    const res = await POST(makeRequest(validBody));
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.ok).toBe(true);
    expect(json.booking).toBeDefined();
    expect(json.booking.scheduled_date).toBe(futureDate);
    expect(json.booking.time_slot).toBe("morning");
  });

  it("returns 500 when supabase insert fails", async () => {
    (hasCapacity as jest.Mock).mockResolvedValueOnce(true);

    mockSupabaseFrom.mockImplementation((table: string) => {
      if (table === "bookings") {
        return {
          select: jest.fn().mockReturnValue({
            like: jest.fn().mockResolvedValue({ count: 0 }),
          }),
          insert: jest.fn().mockReturnValue({
            select: jest.fn().mockReturnValue({
              single: jest.fn().mockResolvedValue({
                data: null,
                error: { message: "insert failed" },
              }),
            }),
          }),
        };
      }
      if (table === "service_pricing") {
        return {
          select: jest.fn().mockReturnValue({
            eq: jest.fn().mockReturnValue({
              single: jest.fn().mockResolvedValue({
                data: { display_name: "Manure Removal" },
              }),
            }),
          }),
        };
      }
      return {};
    });

    const res = await POST(makeRequest(validBody));
    expect(res.status).toBe(500);
  });
});
