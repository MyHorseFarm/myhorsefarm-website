import { createHmac } from "crypto";
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
