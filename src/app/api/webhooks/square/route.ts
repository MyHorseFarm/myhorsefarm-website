import { NextRequest, NextResponse } from "next/server";
import {
  verifyWebhookSignature,
  getPaymentDetails,
  getCustomerDetails,
  getOrderDetails,
  getRefundDetails,
} from "@/lib/square";
import {
  findContactByEmail,
  findContactByPhone,
  createContact,
  findActiveDealForContact,
  createDeal,
  updateDealStage,
  updateDealAmount,
  createDealNote,
  createContactNote,
  hasAutomationTag,
  countAutomationTags,
  findDealByNoteContent,
  isSubscribed,
} from "@/lib/hubspot";
import {
  sendEmail,
  createUnsubscribeUrl,
  firstPaymentWelcomeEmail,
} from "@/lib/emails";

export const runtime = "nodejs";
export const maxDuration = 60;

const COMPLETED_STAGE_ID = "3248645833";
const LOST_STAGE_ID = "3248645834";
const PAYMENT_TAG_PREFIX = "[SQUARE:PAYMENT]";
const REFUND_TAG_PREFIX = "[SQUARE:REFUND]";

function formatAmount(cents: number): string {
  return (cents / 100).toFixed(2);
}

// ---------------------------------------------------------------------------
// Resolve Square customer to HubSpot contact
// ---------------------------------------------------------------------------

async function resolveContact(customerId: string) {
  const customer = await getCustomerDetails(customerId);
  if (!customer.email && !customer.phone) {
    return null;
  }

  let contact = customer.email
    ? await findContactByEmail(customer.email)
    : null;

  if (!contact && customer.phone) {
    contact = await findContactByPhone(customer.phone);
  }

  if (!contact) {
    contact = await createContact(
      customer.email ?? "",
      customer.firstName ?? "",
      customer.lastName ?? "",
      customer.phone,
    );
  }

  return { contact, customer };
}

// ---------------------------------------------------------------------------
// Handle completed payment
// ---------------------------------------------------------------------------

async function handlePaymentCompleted(paymentId: string) {
  const payment = await getPaymentDetails(paymentId);
  const amount = formatAmount(payment.amountCents);
  const paymentTag = `${PAYMENT_TAG_PREFIX} $${amount} on ${payment.createdAt.slice(0, 10)} - Payment ID: ${payment.id}`;

  if (!payment.customerId) {
    return { ok: false, error: "Payment has no customer ID" };
  }

  const resolved = await resolveContact(payment.customerId);
  if (!resolved) {
    return { ok: false, error: "Customer has no email or phone" };
  }

  const { contact, customer } = resolved;

  // Dedup check
  const alreadyProcessed = await hasAutomationTag(
    "contacts",
    contact.id,
    `Payment ID: ${payment.id}`,
  );
  if (alreadyProcessed) {
    return { ok: true, skipped: "duplicate" };
  }

  // Write dedup note IMMEDIATELY to prevent retries from creating duplicates
  await createContactNote(contact.id, paymentTag);

  // Fetch order line items
  let services: string[] = [];
  if (payment.orderId) {
    try {
      const order = await getOrderDetails(payment.orderId);
      services = order.lineItems.map((li) => li.name);
    } catch {
      // Order details are nice-to-have
    }
  }

  // Deal operations wrapped in try/catch — if they fail, dedup note is
  // already written so Square retries won't create duplicate deals
  let dealId: string | undefined;
  try {
    let deal = await findActiveDealForContact(contact.id);

    if (deal) {
      await updateDealStage(deal.id, COMPLETED_STAGE_ID);
      await updateDealAmount(deal.id, amount);
    } else {
      const dealName =
        services.length > 0
          ? `${services[0]}${services.length > 1 ? ` +${services.length - 1} more` : ""}`
          : "Square Payment";
      deal = await createDeal(
        contact.id,
        dealName,
        amount,
        COMPLETED_STAGE_ID,
      );
    }

    dealId = deal.id;
    await createDealNote(deal.id, paymentTag);
  } catch (err) {
    // Deal ops failed but dedup note is saved — return 200 so Square
    // doesn't retry and create duplicates. Log the error for debugging.
    console.error(`Deal operation failed for payment ${payment.id}:`, err);
  }

  // Decide whether to send email: only for first-ever payment
  let emailSent = false;
  if (customer.email) {
    const priorPayments = await countAutomationTags(
      "contacts",
      contact.id,
      PAYMENT_TAG_PREFIX,
    );
    // priorPayments includes the note we just wrote, so 1 means this is the first
    if (priorPayments <= 1) {
      const subscribed = await isSubscribed(customer.email);
      if (subscribed) {
        const unsub = createUnsubscribeUrl(customer.email);
        const template = firstPaymentWelcomeEmail(
          customer.firstName ?? "",
          amount,
          services,
          unsub,
        );
        await sendEmail(customer.email, template.subject, template.html);
        emailSent = true;
      }
    }
  }

  return {
    ok: true,
    paymentId: payment.id,
    contactId: contact.id,
    dealId,
    emailSent,
    amount,
    services,
  };
}

// ---------------------------------------------------------------------------
// Handle completed refund
// ---------------------------------------------------------------------------

async function handleRefundCompleted(refundId: string) {
  const refund = await getRefundDetails(refundId);

  if (!refund.paymentId) {
    return { ok: false, error: "Refund has no associated payment ID" };
  }

  // Get the original payment to find the customer
  const payment = await getPaymentDetails(refund.paymentId);
  if (!payment.customerId) {
    return { ok: false, error: "Original payment has no customer ID" };
  }

  const resolved = await resolveContact(payment.customerId);
  if (!resolved) {
    return { ok: false, error: "Customer has no email or phone" };
  }

  const { contact } = resolved;

  // Dedup check
  const alreadyProcessed = await hasAutomationTag(
    "contacts",
    contact.id,
    `Refund ID: ${refund.id}`,
  );
  if (alreadyProcessed) {
    return { ok: true, skipped: "duplicate" };
  }

  const refundAmount = formatAmount(refund.amountCents);
  const refundTag = `${REFUND_TAG_PREFIX} $${refundAmount} on ${refund.createdAt.slice(0, 10)} - Refund ID: ${refund.id} (Payment: ${refund.paymentId})${refund.reason ? ` Reason: ${refund.reason}` : ""}`;

  // Write dedup note immediately
  await createContactNote(contact.id, refundTag);

  // Find the deal associated with the original payment
  const deal = await findDealByNoteContent(
    contact.id,
    `Payment ID: ${refund.paymentId}`,
  );

  if (!deal) {
    return {
      ok: true,
      refundId: refund.id,
      contactId: contact.id,
      note: "No matching deal found for original payment",
    };
  }

  const originalAmount = parseFloat(
    deal.properties.amount ?? "0",
  );
  const refundAmountNum = refund.amountCents / 100;

  if (refundAmountNum >= originalAmount) {
    // Full refund — move deal to Lost
    await updateDealStage(deal.id, LOST_STAGE_ID);
  } else {
    // Partial refund — subtract from deal amount
    const newAmount = (originalAmount - refundAmountNum).toFixed(2);
    await updateDealAmount(deal.id, newAmount);
  }

  await createDealNote(deal.id, refundTag);

  return {
    ok: true,
    refundId: refund.id,
    contactId: contact.id,
    dealId: deal.id,
    refundAmount,
    type: refundAmountNum >= originalAmount ? "full" : "partial",
  };
}

// ---------------------------------------------------------------------------
// POST handler
// ---------------------------------------------------------------------------

export async function POST(request: NextRequest) {
  // 1. Read raw body & verify signature
  const body = await request.text();
  const signature = request.headers.get("x-square-hmacsha256-signature");

  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 401 });
  }

  const notificationUrl =
    process.env.SQUARE_WEBHOOK_URL ||
    "https://www.myhorsefarm.com/api/webhooks/square";

  const isValid = verifyWebhookSignature(body, signature, notificationUrl);
  if (!isValid) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  // 2. Parse event
  let event: {
    type: string;
    data?: {
      object?: {
        payment?: { id?: string; status?: string };
        refund?: { id?: string; status?: string };
      };
    };
  };
  try {
    event = JSON.parse(body);
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  // 3. Route by event type
  try {
    if (event.type === "payment.updated") {
      const paymentId = event.data?.object?.payment?.id;
      const paymentStatus = event.data?.object?.payment?.status;

      if (!paymentId || paymentStatus !== "COMPLETED") {
        return NextResponse.json({ ok: true, skipped: "not COMPLETED" });
      }

      const result = await handlePaymentCompleted(paymentId);
      return NextResponse.json(result);
    }

    if (event.type === "refund.updated") {
      const refundId = event.data?.object?.refund?.id;
      const refundStatus = event.data?.object?.refund?.status;

      if (!refundId || refundStatus !== "COMPLETED") {
        return NextResponse.json({ ok: true, skipped: "refund not COMPLETED" });
      }

      const result = await handleRefundCompleted(refundId);
      return NextResponse.json(result);
    }

    return NextResponse.json({ ok: true, skipped: `unhandled event: ${event.type}` });
  } catch (err) {
    console.error(`Webhook error for ${event.type}:`, err);
    return NextResponse.json(
      { error: String(err) },
      { status: 500 },
    );
  }
}
