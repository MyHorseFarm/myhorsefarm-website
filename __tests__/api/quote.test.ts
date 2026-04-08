/**
 * Tests for POST /api/quote
 */
import { NextRequest } from "next/server";

// ---------------------------------------------------------------------------
// Mocks — must be declared before importing the route handler
// ---------------------------------------------------------------------------

const mockSupabaseFrom = jest.fn();
jest.mock("@/lib/supabase", () => ({
  supabase: { from: (...args: unknown[]) => mockSupabaseFrom(...args) },
}));

jest.mock("@/lib/pricing", () => ({
  getServiceByKey: jest.fn(),
  calculateQuote: jest.fn(),
}));

jest.mock("@/lib/hubspot", () => ({
  findContactByEmail: jest.fn().mockResolvedValue({ id: "hub-1" }),
  createContact: jest.fn().mockResolvedValue({ id: "hub-1" }),
  createDeal: jest.fn().mockResolvedValue({ id: "deal-1" }),
  findActiveDealForContact: jest.fn().mockResolvedValue(null),
  updateDealStage: jest.fn(),
  createContactNote: jest.fn(),
  STAGE_QUOTED: "123",
}));

jest.mock("@/lib/emails", () => ({
  sendEmail: jest.fn().mockResolvedValue(undefined),
  createUnsubscribeUrl: jest.fn().mockReturnValue("https://unsub"),
  quoteConfirmationEmail: jest.fn().mockReturnValue({ subject: "s", html: "h" }),
  siteVisitRequestEmail: jest.fn().mockReturnValue({ subject: "s", html: "h" }),
}));

jest.mock("@/lib/meta-capi", () => ({
  sendMetaEvent: jest.fn().mockResolvedValue(undefined),
}));

jest.mock("@/lib/twilio", () => ({
  sendSMS: jest.fn().mockResolvedValue(undefined),
  quoteReadySMS: jest.fn().mockReturnValue("sms body"),
}));

jest.mock("resend", () => ({
  Resend: jest.fn().mockImplementation(() => ({
    emails: { send: jest.fn().mockResolvedValue({}) },
  })),
}));

// ---------------------------------------------------------------------------
// Imports (after mocks)
// ---------------------------------------------------------------------------

import { POST } from "@/app/api/quote/route";
import { getServiceByKey, calculateQuote } from "@/lib/pricing";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function makeRequest(body: Record<string, unknown>): NextRequest {
  return new NextRequest("https://localhost/api/quote", {
    method: "POST",
    body: JSON.stringify(body),
    headers: { "content-type": "application/json" },
  });
}

const validBody = {
  service_key: "manure-removal",
  customer_name: "Jane Doe",
  customer_email: "jane@example.com",
  customer_phone: "5551234567",
  customer_location: "Royal Palm Beach, FL",
  property_details: { stalls: 5 },
};

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe("POST /api/quote", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns 400 when required fields are missing", async () => {
    const res = await POST(makeRequest({ service_key: "manure-removal" }));
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.error).toMatch(/missing required fields/i);
  });

  it("returns 404 when service_key is unknown", async () => {
    (getServiceByKey as jest.Mock).mockResolvedValueOnce(null);

    const res = await POST(makeRequest(validBody));
    expect(res.status).toBe(404);
    const json = await res.json();
    expect(json.error).toMatch(/service not found/i);
  });

  it("returns 200 with quote data on success", async () => {
    (getServiceByKey as jest.Mock).mockResolvedValueOnce({
      service_key: "manure-removal",
      display_name: "Manure Removal",
      requires_site_visit: false,
    });
    (calculateQuote as jest.Mock).mockReturnValueOnce({
      total: 250,
      adjustments: [],
      line_items: [],
    });

    // Mock supabase chain: quotes.select count, quotes.insert
    mockSupabaseFrom.mockImplementation((table: string) => {
      if (table === "quotes") {
        return {
          select: jest.fn().mockReturnValue({
            like: jest.fn().mockResolvedValue({ count: 0 }),
          }),
          insert: jest.fn().mockReturnValue({
            select: jest.fn().mockReturnValue({
              single: jest.fn().mockResolvedValue({
                data: { id: "q-1", quote_number: "MHF-Q-20260402-001" },
                error: null,
              }),
            }),
          }),
          update: jest.fn().mockReturnValue({
            eq: jest.fn().mockResolvedValue({ error: null }),
          }),
        };
      }
      return {};
    });

    const res = await POST(makeRequest(validBody));
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.ok).toBe(true);
    expect(json.quote).toBeDefined();
    expect(json.quote.estimated_amount).toBe(250);
  });

  it("returns 400 when customer_email is missing", async () => {
    const body = { ...validBody, customer_email: "" };
    const res = await POST(makeRequest(body));
    expect(res.status).toBe(400);
  });

  it("returns 500 when supabase insert fails", async () => {
    (getServiceByKey as jest.Mock).mockResolvedValueOnce({
      service_key: "manure-removal",
      display_name: "Manure Removal",
      requires_site_visit: false,
    });
    (calculateQuote as jest.Mock).mockReturnValueOnce({
      total: 250,
      adjustments: [],
      line_items: [],
    });

    mockSupabaseFrom.mockImplementation((table: string) => {
      if (table === "quotes") {
        return {
          select: jest.fn().mockReturnValue({
            like: jest.fn().mockResolvedValue({ count: 0 }),
          }),
          insert: jest.fn().mockReturnValue({
            select: jest.fn().mockReturnValue({
              single: jest.fn().mockResolvedValue({
                data: null,
                error: { message: "DB error" },
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
