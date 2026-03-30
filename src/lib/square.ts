import { createHmac, randomUUID, timingSafeEqual } from "crypto";
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
  const expectedBuf = Buffer.from(expected);
  const actualBuf = Buffer.from(signatureHeader);
  if (expectedBuf.length !== actualBuf.length) return false;
  return timingSafeEqual(expectedBuf, actualBuf);
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
// Create a new Square customer
// ---------------------------------------------------------------------------

export interface CreateCustomerResult {
  customerId: string;
}

export async function createSquareCustomer(
  givenName: string,
  familyName: string,
  email?: string,
  phone?: string,
  note?: string,
): Promise<CreateCustomerResult> {
  const { customer } = await client.customers.create({
    givenName,
    familyName,
    emailAddress: email || undefined,
    phoneNumber: phone || undefined,
    note: note || undefined,
    idempotencyKey: randomUUID(),
  });
  if (!customer?.id) throw new Error("Square customer creation returned no customer");
  return { customerId: customer.id };
}

// ---------------------------------------------------------------------------
// Save a card on file for a customer (from Web Payments SDK nonce)
// ---------------------------------------------------------------------------

export interface SaveCardResult {
  cardId: string;
  last4: string | null;
  cardBrand: string | null;
}

export async function saveCardOnFile(
  nonce: string,
  customerId: string,
  cardholderName?: string,
): Promise<SaveCardResult> {
  const { card } = await client.cards.create({
    sourceId: nonce,
    card: {
      customerId,
      cardholderName: cardholderName || undefined,
    },
    idempotencyKey: randomUUID(),
  });
  if (!card?.id) throw new Error("Square card creation returned no card");
  return {
    cardId: card.id,
    last4: card.last4 ?? null,
    cardBrand: card.cardBrand ?? null,
  };
}

// ---------------------------------------------------------------------------
// List all Square customers (paginated)
// ---------------------------------------------------------------------------

export interface SquareCustomerSummary {
  id: string;
  givenName: string | null;
  familyName: string | null;
  email: string | null;
  phone: string | null;
  address: string | null;
  note: string | null;
}

export async function listAllSquareCustomers(): Promise<SquareCustomerSummary[]> {
  const all: SquareCustomerSummary[] = [];

  for await (const c of await client.customers.list({ limit: 100, sortField: "DEFAULT", sortOrder: "ASC" })) {
    const addr = c.address;
    const addressStr = addr
      ? [addr.addressLine1, addr.addressLine2, addr.locality, addr.administrativeDistrictLevel1, addr.postalCode]
          .filter(Boolean)
          .join(", ")
      : null;

    all.push({
      id: c.id ?? "",
      givenName: c.givenName ?? null,
      familyName: c.familyName ?? null,
      email: c.emailAddress ?? null,
      phone: c.phoneNumber ?? null,
      address: addressStr || null,
      note: c.note ?? null,
    });
  }

  return all;
}

// ---------------------------------------------------------------------------
// Service name mapping — Square line item names → service keys
// ---------------------------------------------------------------------------

const SERVICE_NAME_PATTERNS: { pattern: RegExp; serviceKey: string }[] = [
  { pattern: /manure/i, serviceKey: "manure_removal" },
  { pattern: /trash|bin/i, serviceKey: "trash_bin_service" },
  { pattern: /junk/i, serviceKey: "junk_removal" },
  { pattern: /fill\s*dirt|dirt/i, serviceKey: "fill_dirt" },
  { pattern: /dumpster/i, serviceKey: "dumpster_rental" },
  { pattern: /sod/i, serviceKey: "sod_installation" },
  { pattern: /repair/i, serviceKey: "farm_repairs" },
  { pattern: /millings|asphalt/i, serviceKey: "millings_asphalt" },
];

export function mapLineItemToServiceKey(itemName: string): string | null {
  for (const { pattern, serviceKey } of SERVICE_NAME_PATTERNS) {
    if (pattern.test(itemName)) return serviceKey;
  }
  return null;
}

// ---------------------------------------------------------------------------
// Search orders by customer (for service type inference)
// ---------------------------------------------------------------------------

export interface OrderSummary {
  id: string;
  createdAt: string;
  lineItems: { name: string; quantity: number; amountCents: number }[];
}

export async function searchOrdersByCustomer(
  customerId: string,
): Promise<OrderSummary[]> {
  const locationId = process.env.NEXT_PUBLIC_SQUARE_LOCATION_ID;
  if (!locationId) {
    console.warn("NEXT_PUBLIC_SQUARE_LOCATION_ID not set — skipping order search");
    return [];
  }

  const result = await client.orders.search({
    locationIds: [locationId],
    query: {
      filter: {
        customerFilter: {
          customerIds: [customerId],
        },
      },
      sort: {
        sortField: "CREATED_AT",
        sortOrder: "DESC",
      },
    },
    limit: 10,
  });

  return (result.orders ?? []).map((order) => ({
    id: order.id ?? "",
    createdAt: order.createdAt ?? "",
    lineItems: (order.lineItems ?? []).map((item) => ({
      name: item.name ?? "Service",
      quantity: Number(item.quantity ?? "1"),
      amountCents: Number(item.totalMoney?.amount ?? 0),
    })),
  }));
}

// ---------------------------------------------------------------------------
// Infer service from order history
// ---------------------------------------------------------------------------

export function inferServiceFromOrders(
  orders: OrderSummary[],
): { serviceKey: string; rate: number } | null {
  // Count occurrences of each service key across all line items
  const counts = new Map<string, { count: number; totalCents: number; totalQty: number }>();

  for (const order of orders) {
    for (const item of order.lineItems) {
      const key = mapLineItemToServiceKey(item.name);
      if (!key) continue;
      const prev = counts.get(key) ?? { count: 0, totalCents: 0, totalQty: 0 };
      prev.count += 1;
      prev.totalCents += item.amountCents;
      prev.totalQty += item.quantity;
      counts.set(key, prev);
    }
  }

  if (counts.size === 0) return null;

  // Find the most frequent service
  let bestKey = "";
  let bestCount = 0;
  for (const [key, { count }] of counts) {
    if (count > bestCount) {
      bestKey = key;
      bestCount = count;
    }
  }

  const stats = counts.get(bestKey)!;
  // Average rate = total amount / total quantity
  const rate = stats.totalQty > 0
    ? Math.round(stats.totalCents / stats.totalQty) / 100
    : 0;

  return { serviceKey: bestKey, rate };
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
