/**
 * Tests for POST /api/webhooks/square
 */
import { NextRequest } from "next/server";

// ---------------------------------------------------------------------------
// Mocks
// ---------------------------------------------------------------------------

jest.mock("@/lib/square", () => ({
  verifyWebhookSignature: jest.fn(),
  getPaymentDetails: jest.fn(),
  getCustomerDetails: jest.fn(),
  getOrderDetails: jest.fn(),
  getRefundDetails: jest.fn(),
}));

jest.mock("@/lib/hubspot", () => ({
  findContactByEmail: jest.fn().mockResolvedValue({ id: "hub-1" }),
  findContactByPhone: jest.fn().mockResolvedValue(null),
  createContact: jest.fn().mockResolvedValue({ id: "hub-1" }),
  findActiveDealForContact: jest.fn().mockResolvedValue(null),
  createDeal: jest.fn().mockResolvedValue({ id: "deal-1" }),
  updateDealStage: jest.fn(),
  updateDealAmount: jest.fn(),
  createDealNote: jest.fn(),
  createContactNote: jest.fn(),
  hasAutomationTag: jest.fn().mockResolvedValue(false),
  countAutomationTags: jest.fn().mockResolvedValue(1),
  findDealByNoteContent: jest.fn().mockResolvedValue(null),
  isSubscribed: jest.fn().mockResolvedValue(true),
}));

jest.mock("@/lib/emails", () => ({
  sendEmail: jest.fn().mockResolvedValue(undefined),
  createUnsubscribeUrl: jest.fn().mockReturnValue("https://unsub"),
  firstPaymentWelcomeEmail: jest.fn().mockReturnValue({ subject: "s", html: "h" }),
  paymentReceivedEmail: jest.fn().mockReturnValue({ subject: "s", html: "h" }),
}));

jest.mock("@/lib/meta-capi", () => ({
  sendMetaEvent: jest.fn().mockResolvedValue(undefined),
}));

// ---------------------------------------------------------------------------
// Imports
// ---------------------------------------------------------------------------

import { POST } from "@/app/api/webhooks/square/route";
import { verifyWebhookSignature, getPaymentDetails, getCustomerDetails } from "@/lib/square";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function makeRequest(body: string, signature = "valid-sig"): NextRequest {
  const headers: Record<string, string> = {
    "content-type": "application/json",
  };
  if (signature) {
    headers["x-square-hmacsha256-signature"] = signature;
  }
  return new NextRequest("https://localhost/api/webhooks/square", {
    method: "POST",
    body,
    headers,
  });
}

const paymentEvent = {
  type: "payment.updated",
  data: {
    object: {
      payment: { id: "pay_123", status: "COMPLETED" },
    },
  },
};

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe("POST /api/webhooks/square", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns 401 when signature header is missing", async () => {
    const req = new NextRequest("https://localhost/api/webhooks/square", {
      method: "POST",
      body: JSON.stringify(paymentEvent),
      headers: { "content-type": "application/json" },
    });
    const res = await POST(req);
    expect(res.status).toBe(401);
    const json = await res.json();
    expect(json.error).toMatch(/missing signature/i);
  });

  it("returns 401 when signature is invalid", async () => {
    (verifyWebhookSignature as jest.Mock).mockReturnValueOnce(false);

    const res = await POST(makeRequest(JSON.stringify(paymentEvent)));
    expect(res.status).toBe(401);
    const json = await res.json();
    expect(json.error).toMatch(/invalid signature/i);
  });

  it("returns 400 for malformed JSON body", async () => {
    (verifyWebhookSignature as jest.Mock).mockReturnValueOnce(true);

    const res = await POST(makeRequest("not json at all"));
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.error).toMatch(/invalid json/i);
  });

  it("skips non-COMPLETED payment events", async () => {
    (verifyWebhookSignature as jest.Mock).mockReturnValueOnce(true);

    const event = {
      type: "payment.updated",
      data: { object: { payment: { id: "pay_123", status: "PENDING" } } },
    };
    const res = await POST(makeRequest(JSON.stringify(event)));
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.skipped).toBe("not COMPLETED");
  });

  it("skips unhandled event types", async () => {
    (verifyWebhookSignature as jest.Mock).mockReturnValueOnce(true);

    const event = { type: "invoice.created" };
    const res = await POST(makeRequest(JSON.stringify(event)));
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.skipped).toMatch(/unhandled event/);
  });

  it("processes a completed payment successfully", async () => {
    (verifyWebhookSignature as jest.Mock).mockReturnValueOnce(true);
    (getPaymentDetails as jest.Mock).mockResolvedValueOnce({
      id: "pay_123",
      amountCents: 25000,
      createdAt: "2026-04-01T10:00:00Z",
      customerId: "cust_1",
      orderId: null,
    });
    (getCustomerDetails as jest.Mock).mockResolvedValueOnce({
      email: "jane@example.com",
      phone: "5551234567",
      firstName: "Jane",
      lastName: "Doe",
    });

    const res = await POST(makeRequest(JSON.stringify(paymentEvent)));
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.ok).toBe(true);
    expect(json.amount).toBe("250.00");
    expect(json.emailSent).toBe(true);
  });

  it("returns ok with error when payment has no customer", async () => {
    (verifyWebhookSignature as jest.Mock).mockReturnValueOnce(true);
    (getPaymentDetails as jest.Mock).mockResolvedValueOnce({
      id: "pay_123",
      amountCents: 10000,
      createdAt: "2026-04-01T10:00:00Z",
      customerId: null,
      orderId: null,
    });

    const res = await POST(makeRequest(JSON.stringify(paymentEvent)));
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.ok).toBe(false);
    expect(json.error).toMatch(/no customer/i);
  });
});
