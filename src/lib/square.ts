import { createHmac, randomUUID, timingSafeEqual } from "crypto";
import { SquareClient, SquareEnvironment } from "square";

// ---------------------------------------------------------------------------
// Client
// ---------------------------------------------------------------------------

let _client: SquareClient | null = null;

function getClient(): SquareClient {
  if (!_client) {
    _client = new SquareClient({
      token: process.env.SQUARE_ACCESS_TOKEN,
      environment:
        process.env.SQUARE_ENVIRONMENT === "sandbox"
          ? SquareEnvironment.Sandbox
          : SquareEnvironment.Production,
    });
  }
  return _client;
}

// Cache the main location ID (fetched dynamically from Square)
let _locationId: string | null = null;

export async function getLocationId(): Promise<string> {
  if (_locationId) return _locationId;
  try {
    const { locations } = await getClient().locations.list();
    const main = locations?.find((l) => l.status === "ACTIVE") ?? locations?.[0];
    if (main?.id) {
      _locationId = main.id;
      return main.id;
    }
  } catch (e) {
    console.error("Failed to fetch Square location:", e);
  }
  // Fallback to env var
  return process.env.NEXT_PUBLIC_SQUARE_LOCATION_ID || "";
}

// ---------------------------------------------------------------------------
// Webhook signature verification
// ---------------------------------------------------------------------------

export function verifyWebhookSignature(
  body: string,
  signatureHeader: string,
  notificationUrl: string,
): boolean {
  if (!process.env.SQUARE_WEBHOOK_SIGNATURE_KEY) return false;
  const payload = notificationUrl + body;
  const expected = createHmac("sha256", process.env.SQUARE_WEBHOOK_SIGNATURE_KEY)
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
  const { payment } = await getClient().payments.get({ paymentId });
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
  const { customer } = await getClient().customers.get({ customerId });
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
  const { order } = await getClient().orders.get({ orderId });
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
  const { refund } = await getClient().refunds.get({ refundId });
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
  const page = await getClient().cards.list({ customerId, sortOrder: "DESC" });
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
  const { customer } = await getClient().customers.create({
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
  const { card } = await getClient().cards.create({
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

  for await (const c of await getClient().customers.list({ limit: 100, sortField: "DEFAULT", sortOrder: "ASC" })) {
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

  const result = await getClient().orders.search({
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

  const { payment } = await getClient().payments.create({
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

// ---------------------------------------------------------------------------
// List payments (paginated, filtered)
// ---------------------------------------------------------------------------

export interface ListPaymentsParams {
  beginTime?: string;
  endTime?: string;
  status?: string;
  cursor?: string;
  locationId?: string;
  limit?: number;
}

export interface PaymentSummary {
  id: string;
  status: string;
  amountCents: number;
  currency: string;
  customerId: string | null;
  orderId: string | null;
  receiptUrl: string | null;
  note: string | null;
  createdAt: string;
  refundedAmountCents: number;
  sourceType: string | null;
  last4: string | null;
  cardBrand: string | null;
}

export async function listPayments(
  params: ListPaymentsParams = {},
): Promise<{ payments: PaymentSummary[]; cursor: string | null }> {
  const client = getClient();
  const locationId =
    params.locationId || undefined;

  const result = await client.payments.list({
    beginTime: params.beginTime,
    endTime: params.endTime,
    locationId,
    cursor: params.cursor,
    limit: params.limit || 100,
    sortOrder: "DESC",
  });

  const payments: PaymentSummary[] = [];
  // SDK v44 list returns an async iterable; we collect from the first page
  // Actually, we need to handle paginated results. Let's collect up to limit.
  const limit = params.limit || 100;
  let count = 0;
  let nextCursor: string | null = null;

  for await (const p of result) {
    if (params.status && p.status !== params.status) continue;
    payments.push({
      id: p.id ?? "",
      status: p.status ?? "UNKNOWN",
      amountCents: Number(p.totalMoney?.amount ?? 0),
      currency: p.totalMoney?.currency ?? "USD",
      customerId: p.customerId ?? null,
      orderId: p.orderId ?? null,
      receiptUrl: p.receiptUrl ?? null,
      note: p.note ?? null,
      createdAt: p.createdAt ?? new Date().toISOString(),
      refundedAmountCents: Number(p.refundedMoney?.amount ?? 0),
      sourceType: p.sourceType ?? null,
      last4: p.cardDetails?.card?.last4 ?? null,
      cardBrand: p.cardDetails?.card?.cardBrand ?? null,
    });
    count++;
    if (count >= limit) break;
  }

  return { payments, cursor: nextCursor };
}

// ---------------------------------------------------------------------------
// Refund a payment (full or partial)
// ---------------------------------------------------------------------------

export interface RefundResult {
  refundId: string;
  status: string;
  amountCents: number;
}

export async function refundPayment(
  paymentId: string,
  amountCents: number,
  reason?: string,
): Promise<RefundResult> {
  const { refund } = await getClient().refunds.refundPayment({
    paymentId,
    amountMoney: { amount: BigInt(amountCents), currency: "USD" },
    reason: reason || "Admin refund",
    idempotencyKey: randomUUID(),
  });

  if (!refund) throw new Error("Refund creation returned no refund");

  return {
    refundId: refund.id ?? "",
    status: refund.status ?? "UNKNOWN",
    amountCents: Number(refund.amountMoney?.amount ?? 0),
  };
}

// ---------------------------------------------------------------------------
// Get payment receipt URL
// ---------------------------------------------------------------------------

export async function getPaymentReceipt(
  paymentId: string,
): Promise<string | null> {
  const { payment } = await getClient().payments.get({ paymentId });
  return payment?.receiptUrl ?? null;
}

// ---------------------------------------------------------------------------
// Invoice functions
// ---------------------------------------------------------------------------

export interface InvoiceSummary {
  id: string;
  version: number;
  invoiceNumber: string | null;
  status: string;
  title: string | null;
  description: string | null;
  scheduledAt: string | null;
  publicUrl: string | null;
  orderId: string | null;
  locationId: string;
  primaryRecipient: {
    customerId: string | null;
    givenName: string | null;
    familyName: string | null;
    emailAddress: string | null;
    companyName: string | null;
  } | null;
  paymentRequests: {
    uid: string | null;
    requestType: string | null;
    dueDate: string | null;
    totalMoney: { amount: number; currency: string } | null;
    computedAmountMoney: { amount: number; currency: string } | null;
  }[];
  createdAt: string;
  updatedAt: string;
}

function mapInvoice(inv: Record<string, unknown>): InvoiceSummary {
  const i = inv as any; // eslint-disable-line @typescript-eslint/no-explicit-any
  const recipient = i.primaryRecipient;
  return {
    id: i.id ?? "",
    version: Number(i.version ?? 0),
    invoiceNumber: i.invoiceNumber ?? null,
    status: i.status ?? "UNKNOWN",
    title: i.title ?? null,
    description: i.description ?? null,
    scheduledAt: i.scheduledAt ?? null,
    publicUrl: i.publicUrl ?? null,
    orderId: i.orderId ?? null,
    locationId: i.locationId ?? "",
    primaryRecipient: recipient
      ? {
          customerId: recipient.customerId ?? null,
          givenName: recipient.givenName ?? null,
          familyName: recipient.familyName ?? null,
          emailAddress: recipient.emailAddress ?? null,
          companyName: recipient.companyName ?? null,
        }
      : null,
    paymentRequests: (i.paymentRequests ?? []).map((pr: any) => ({ // eslint-disable-line @typescript-eslint/no-explicit-any
      uid: pr.uid ?? null,
      requestType: pr.requestType ?? null,
      dueDate: pr.dueDate ?? null,
      totalMoney: pr.totalMoney
        ? { amount: Number(pr.totalMoney.amount ?? 0), currency: pr.totalMoney.currency ?? "USD" }
        : null,
      computedAmountMoney: pr.computedAmountMoney
        ? { amount: Number(pr.computedAmountMoney.amount ?? 0), currency: pr.computedAmountMoney.currency ?? "USD" }
        : null,
    })),
    createdAt: i.createdAt ?? new Date().toISOString(),
    updatedAt: i.updatedAt ?? new Date().toISOString(),
  };
}

export async function listInvoices(
  locationId: string,
  cursor?: string,
): Promise<{ invoices: InvoiceSummary[]; cursor: string | null }> {
  const params: Record<string, unknown> = { locationId, limit: 50 };
  if (cursor) params.cursor = cursor;
  const result = await getClient().invoices.list(params as any); // eslint-disable-line @typescript-eslint/no-explicit-any
  const invoices: InvoiceSummary[] = [];
  for await (const inv of result) {
    invoices.push(mapInvoice(inv as any)); // eslint-disable-line @typescript-eslint/no-explicit-any
  }
  return { invoices, cursor: null };
}

export async function searchInvoices(
  locationId: string,
  filters: {
    customerIds?: string[];
    status?: string;
    dateFrom?: string;
    dateTo?: string;
  },
): Promise<{ invoices: InvoiceSummary[]; cursor: string | null }> {
  const queryFilter: Record<string, unknown> = {
    locationIds: [locationId],
  };

  if (filters.customerIds?.length) {
    queryFilter.customerIds = filters.customerIds;
  }

  const invoiceFilter: Record<string, unknown> = {};
  if (filters.status) {
    invoiceFilter.status = [filters.status];
  }

  const query: Record<string, unknown> = {
    filter: {
      locationIds: [locationId],
      ...(filters.customerIds?.length ? { customerIds: filters.customerIds } : {}),
      ...(filters.status ? { status: [filters.status] } : {}),
    },
    sort: { field: "INVOICE_SORT_DATE", order: "DESC" },
  };

  const result = await (getClient().invoices as any).search({ query }); // eslint-disable-line @typescript-eslint/no-explicit-any
  const invoices = (result.invoices ?? []).map((inv: any) => mapInvoice(inv)); // eslint-disable-line @typescript-eslint/no-explicit-any
  return { invoices, cursor: result.cursor ?? null };
}

export async function createInvoice(
  locationId: string,
  invoice: {
    customerId: string;
    lineItems: { description: string; amount: number; quantity: number }[];
    dueDate: string; // YYYY-MM-DD
    note?: string;
  },
): Promise<InvoiceSummary> {
  // First create an order with the line items
  const orderLineItems = invoice.lineItems.map((item) => ({
    name: item.description,
    quantity: String(item.quantity),
    basePriceMoney: {
      amount: BigInt(Math.round(item.amount * 100)),
      currency: "USD" as const,
    },
  }));

  const { order } = await getClient().orders.create({
    order: {
      locationId,
      customerId: invoice.customerId,
      lineItems: orderLineItems,
    },
    idempotencyKey: randomUUID(),
  });

  if (!order?.id) throw new Error("Failed to create order for invoice");

  // Create the invoice
  const { invoice: created } = await (getClient().invoices as any).create({ // eslint-disable-line @typescript-eslint/no-explicit-any
    invoice: {
      locationId,
      orderId: order.id,
      primaryRecipient: { customerId: invoice.customerId },
      paymentRequests: [
        {
          requestType: "BALANCE",
          dueDate: invoice.dueDate,
        },
      ],
      deliveryMethod: "EMAIL",
      title: invoice.note || "Invoice from My Horse Farm",
    },
    idempotencyKey: randomUUID(),
  });

  if (!created) throw new Error("Failed to create invoice");
  return mapInvoice(created as any); // eslint-disable-line @typescript-eslint/no-explicit-any
}

export async function getInvoice(invoiceId: string): Promise<InvoiceSummary> {
  const { invoice } = await (getClient().invoices as any).get({ invoiceId }); // eslint-disable-line @typescript-eslint/no-explicit-any
  if (!invoice) throw new Error(`Invoice ${invoiceId} not found`);
  return mapInvoice(invoice as any); // eslint-disable-line @typescript-eslint/no-explicit-any
}

export async function publishInvoice(
  invoiceId: string,
  version: number,
): Promise<InvoiceSummary> {
  const { invoice } = await (getClient().invoices as any).publish({ // eslint-disable-line @typescript-eslint/no-explicit-any
    invoiceId,
    version,
    idempotencyKey: randomUUID(),
  });
  if (!invoice) throw new Error("Failed to publish invoice");
  return mapInvoice(invoice as any); // eslint-disable-line @typescript-eslint/no-explicit-any
}

export async function cancelInvoice(
  invoiceId: string,
  version: number,
): Promise<InvoiceSummary> {
  const { invoice } = await (getClient().invoices as any).cancel({ // eslint-disable-line @typescript-eslint/no-explicit-any
    invoiceId,
    version,
  });
  if (!invoice) throw new Error("Failed to cancel invoice");
  return mapInvoice(invoice as any); // eslint-disable-line @typescript-eslint/no-explicit-any
}

export async function createInvoiceAttachment(
  invoiceId: string,
  file: { filename: string; mimeType: string; data: Buffer },
): Promise<{ attachmentId: string; url: string }> {
  const blob = new Blob([new Uint8Array(file.data)], { type: file.mimeType });
  const formData = new FormData();
  formData.append("file", blob, file.filename);

  const result = await (getClient().invoices as any).createAttachment({ // eslint-disable-line @typescript-eslint/no-explicit-any
    invoiceId,
    imageFile: blob,
    idempotencyKey: randomUUID(),
  });

  return {
    attachmentId: result.attachment?.id ?? "",
    url: result.attachment?.fileUrl ?? "",
  };
}

// ---------------------------------------------------------------------------
// Customer payment history & lifetime value
// ---------------------------------------------------------------------------

export interface CustomerPaymentHistoryResult {
  payments: PaymentSummary[];
  lifetimeValue: number;       // total cents
  averagePayment: number;      // cents
  firstPaymentDate: string | null;
  lastPaymentDate: string | null;
  totalPayments: number;
}

export async function getCustomerPaymentHistory(
  customerId: string,
): Promise<CustomerPaymentHistoryResult> {
  const allPayments: PaymentSummary[] = [];

  for await (const p of await getClient().payments.list({
    locationId: process.env.NEXT_PUBLIC_SQUARE_LOCATION_ID || undefined,
    sortOrder: "DESC",
    limit: 100,
  })) {
    if (p.customerId !== customerId) continue;
    if (p.status !== "COMPLETED") continue;
    allPayments.push({
      id: p.id ?? "",
      status: p.status ?? "UNKNOWN",
      amountCents: Number(p.totalMoney?.amount ?? 0),
      currency: p.totalMoney?.currency ?? "USD",
      customerId: p.customerId ?? null,
      orderId: p.orderId ?? null,
      receiptUrl: p.receiptUrl ?? null,
      note: p.note ?? null,
      createdAt: p.createdAt ?? new Date().toISOString(),
      refundedAmountCents: Number(p.refundedMoney?.amount ?? 0),
      sourceType: p.sourceType ?? null,
      last4: p.cardDetails?.card?.last4 ?? null,
      cardBrand: p.cardDetails?.card?.cardBrand ?? null,
    });
  }

  const totalCents = allPayments.reduce((sum, p) => sum + (p.amountCents - p.refundedAmountCents), 0);
  const avgCents = allPayments.length > 0 ? Math.round(totalCents / allPayments.length) : 0;

  // Sort by date ascending for first/last
  const sorted = [...allPayments].sort((a, b) =>
    new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
  );

  return {
    payments: allPayments,
    lifetimeValue: totalCents,
    averagePayment: avgCents,
    firstPaymentDate: sorted.length > 0 ? sorted[0].createdAt : null,
    lastPaymentDate: sorted.length > 0 ? sorted[sorted.length - 1].createdAt : null,
    totalPayments: allPayments.length,
  };
}

// ---------------------------------------------------------------------------
// Update a Square customer
// ---------------------------------------------------------------------------

export async function updateSquareCustomer(
  customerId: string,
  updates: {
    givenName?: string;
    familyName?: string;
    emailAddress?: string;
    phoneNumber?: string;
    note?: string;
  },
): Promise<CustomerDetails> {
  const { customer } = await getClient().customers.update({
    customerId,
    ...updates,
  });
  if (!customer) throw new Error(`Failed to update customer ${customerId}`);

  return {
    id: customer.id ?? customerId,
    email: customer.emailAddress ?? null,
    firstName: customer.givenName ?? null,
    lastName: customer.familyName ?? null,
    phone: customer.phoneNumber ?? null,
  };
}

// ---------------------------------------------------------------------------
// Customer groups
// ---------------------------------------------------------------------------

export interface CustomerGroup {
  id: string;
  name: string;
}

export async function createCustomerGroup(
  name: string,
): Promise<CustomerGroup> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const client = getClient() as any;
  const { group } = await client.customerGroups.create({
    group: { name },
    idempotencyKey: randomUUID(),
  });
  if (!group?.id) throw new Error("Failed to create customer group");
  return { id: group.id, name: group.name ?? name };
}

export async function addCustomerToGroup(
  customerId: string,
  groupId: string,
): Promise<void> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const client = getClient() as any;
  await client.customerGroups.addMembers({
    groupId,
    customerIds: [customerId],
  });
}

export async function listCustomerGroups(): Promise<CustomerGroup[]> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const client = getClient() as any;
  const result = await client.customerGroups.list();
  const groups: CustomerGroup[] = [];
  if (result && Symbol.asyncIterator in result) {
    for await (const g of result) {
      groups.push({ id: g.id ?? "", name: g.name ?? "" });
    }
  } else if (Array.isArray(result?.groups)) {
    for (const g of result.groups) {
      groups.push({ id: g.id ?? "", name: g.name ?? "" });
    }
  }
  return groups;
}
