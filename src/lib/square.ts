import { createHmac, randomUUID } from "crypto";
import { SquareClient, SquareEnvironment } from "square";

// ---------------------------------------------------------------------------
// Client
// ---------------------------------------------------------------------------

const client = new SquareClient({
  token: process.env.SQUARE_ACCESS_TOKEN,
  environment:
    process.env.SQUARE_ENVIRONMENT === "sandbox"
      ? SquareEnvironment.Sandbox
      : SquareEnvironment.Production,
});

// ---------------------------------------------------------------------------
// Webhook signature verification
// ---------------------------------------------------------------------------

export function verifyWebhookSignature(
  body: string,
  signatureHeader: string,
  notificationUrl: string,
): boolean {
  const payload = notificationUrl + body;
  const expected = createHmac("sha256", process.env.SQUARE_WEBHOOK_SIGNATURE_KEY!)
    .update(payload, "utf8")
    .digest("base64");
  return expected === signatureHeader;
}

// ---------------------------------------------------------------------------
// Payment details
// ---------------------------------------------------------------------------

export interface PaymentDetails {
  id: string;
  status: string;
  amountCents: number;
  currency: string;
  customerId: string | null;
  orderId: string | null;
  receiptUrl: string | null;
  note: string | null;
  createdAt: string;
}

export async function getPaymentDetails(
  paymentId: string,
): Promise<PaymentDetails> {
  const { payment } = await client.payments.get({ paymentId });
  if (!payment) throw new Error(`Payment ${paymentId} not found`);

  return {
    id: payment.id ?? paymentId,
    status: payment.status ?? "UNKNOWN",
    amountCents: Number(payment.totalMoney?.amount ?? 0),
    currency: payment.totalMoney?.currency ?? "USD",
    customerId: payment.customerId ?? null,
    orderId: payment.orderId ?? null,
    receiptUrl: payment.receiptUrl ?? null,
    note: payment.note ?? null,
    createdAt: payment.createdAt ?? new Date().toISOString(),
  };
}

// ---------------------------------------------------------------------------
// Customer details
// ---------------------------------------------------------------------------

export interface CustomerDetails {
  id: string;
  email: string | null;
  firstName: string | null;
  lastName: string | null;
  phone: string | null;
}

export async function getCustomerDetails(
  customerId: string,
): Promise<CustomerDetails> {
  const { customer } = await client.customers.get({ customerId });
  if (!customer) throw new Error(`Customer ${customerId} not found`);

  return {
    id: customer.id ?? customerId,
    email: customer.emailAddress ?? null,
    firstName: customer.givenName ?? null,
    lastName: customer.familyName ?? null,
    phone: customer.phoneNumber ?? null,
  };
}

// ---------------------------------------------------------------------------
// Order details (line items / services performed)
// ---------------------------------------------------------------------------

export interface OrderDetails {
  id: string;
  lineItems: { name: string; quantity: string; amountCents: number }[];
}

export async function getOrderDetails(
  orderId: string,
): Promise<OrderDetails> {
  const { order } = await client.orders.get({ orderId });
  if (!order) throw new Error(`Order ${orderId} not found`);

  const lineItems = (order.lineItems ?? []).map((item) => ({
    name: item.name ?? "Service",
    quantity: item.quantity ?? "1",
    amountCents: Number(item.totalMoney?.amount ?? 0),
  }));

  return { id: order.id ?? orderId, lineItems };
}

// ---------------------------------------------------------------------------
// Refund details
// ---------------------------------------------------------------------------

export interface RefundDetails {
  id: string;
  status: string;
  paymentId: string;
  amountCents: number;
  currency: string;
  reason: string | null;
  createdAt: string;
}

export async function getRefundDetails(
  refundId: string,
): Promise<RefundDetails> {
  const { refund } = await client.refunds.get({ refundId });
  if (!refund) throw new Error(`Refund ${refundId} not found`);

  return {
    id: refund.id ?? refundId,
    status: refund.status ?? "UNKNOWN",
    paymentId: refund.paymentId ?? "",
    amountCents: Number(refund.amountMoney?.amount ?? 0),
    currency: refund.amountMoney?.currency ?? "USD",
    reason: refund.reason ?? null,
    createdAt: refund.createdAt ?? new Date().toISOString(),
  };
}

// ---------------------------------------------------------------------------
// Card on file — list stored cards for a customer
// ---------------------------------------------------------------------------

export interface StoredCard {
  id: string;
  cardBrand: string | null;
  last4: string | null;
  expMonth: number | null;
  expYear: number | null;
}

export async function listCustomerCards(
  customerId: string,
): Promise<StoredCard[]> {
  const page = await client.cards.list({ customerId, sortOrder: "DESC" });
  const cards = page.data ?? [];

  return cards
    .filter((c) => c.enabled)
    .map((c) => ({
      id: c.id ?? "",
      cardBrand: c.cardBrand ?? null,
      last4: c.last4 ?? null,
      expMonth: c.expMonth ? Number(c.expMonth) : null,
      expYear: c.expYear ? Number(c.expYear) : null,
    }));
}

// ---------------------------------------------------------------------------
// Card on file — charge a customer's stored card
// ---------------------------------------------------------------------------

export interface ChargeResult {
  paymentId: string;
  status: string;
  receiptUrl: string | null;
}

export async function chargeCard(
  customerId: string,
  amountCents: number,
  note: string,
  idempotencyKey?: string,
  cardId?: string,
): Promise<ChargeResult> {
  // If no card ID provided, use the customer's first card on file
  let sourceId = cardId;
  if (!sourceId) {
    const cards = await listCustomerCards(customerId);
    if (cards.length === 0) {
      throw new Error(`No cards on file for customer ${customerId}`);
    }
    sourceId = cards[0].id;
  }

  const { payment } = await client.payments.create({
    sourceId,
    customerId,
    amountMoney: { amount: BigInt(amountCents), currency: "USD" },
    note,
    autocomplete: true,
    idempotencyKey: idempotencyKey ?? randomUUID(),
  });

  if (!payment) throw new Error("Square payment creation returned no payment");

  return {
    paymentId: payment.id ?? "",
    status: payment.status ?? "UNKNOWN",
    receiptUrl: payment.receiptUrl ?? null,
  };
}
