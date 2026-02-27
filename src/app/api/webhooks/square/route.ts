import { NextRequest, NextResponse } from "next/server";
import {
  verifyWebhookSignature,
  getPaymentDetails,
  getCustomerDetails,
  getOrderDetails,
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
  isSubscribed,
} from "@/lib/hubspot";
import {
  sendEmail,
  createUnsubscribeUrl,
  paymentReceivedEmail,
} from "@/lib/emails";

export const runtime = "nodejs";
export const maxDuration = 60;

const COMPLETED_STAGE_ID = "3248645833";
const TAG_PREFIX = "[SQUARE:PAYMENT]";

function formatAmount(cents: number): string {
  return (cents / 100).toFixed(2);
}

export async function POST(request: NextRequest) {
  // -----------------------------------------------------------------------
  // 1. Read raw body & verify signature
  // -----------------------------------------------------------------------
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

  // -----------------------------------------------------------------------
  // 2. Parse event
  // -----------------------------------------------------------------------
  let event: {
    type: string;
    data?: { object?: { payment?: { id?: string; status?: string } } };
  };
  try {
    event = JSON.parse(body);
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  // Only process payment.updated with COMPLETED status
  if (event.type !== "payment.updated") {
    return NextResponse.json({ ok: true, skipped: "not payment.updated" });
  }

  const paymentId = event.data?.object?.payment?.id;
  const paymentStatus = event.data?.object?.payment?.status;

  if (!paymentId || paymentStatus !== "COMPLETED") {
    return NextResponse.json({ ok: true, skipped: "not COMPLETED" });
  }

  try {
    // -----------------------------------------------------------------------
    // 3. Fetch full payment details from Square
    // -----------------------------------------------------------------------
    const payment = await getPaymentDetails(paymentId);
    const amount = formatAmount(payment.amountCents);
    const paymentTag = `${TAG_PREFIX} $${amount} on ${payment.createdAt.slice(0, 10)} - Payment ID: ${payment.id}`;

    // -----------------------------------------------------------------------
    // 4. Fetch customer details from Square
    // -----------------------------------------------------------------------
    if (!payment.customerId) {
      return NextResponse.json(
        { ok: false, error: "Payment has no customer ID" },
        { status: 200 },
      );
    }

    const customer = await getCustomerDetails(payment.customerId);
    if (!customer.email && !customer.phone) {
      return NextResponse.json(
        { ok: false, error: "Customer has no email or phone" },
        { status: 200 },
      );
    }

    // -----------------------------------------------------------------------
    // 5. Fetch order line items (services performed)
    // -----------------------------------------------------------------------
    let services: string[] = [];
    if (payment.orderId) {
      try {
        const order = await getOrderDetails(payment.orderId);
        services = order.lineItems.map((li) => li.name);
      } catch {
        // Order details are nice-to-have, not critical
      }
    }

    // -----------------------------------------------------------------------
    // 6. Find or create HubSpot contact (by email, fallback to phone)
    // -----------------------------------------------------------------------
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

    // -----------------------------------------------------------------------
    // 7. Dedup check — skip if this payment was already processed
    // -----------------------------------------------------------------------
    const alreadyProcessed = await hasAutomationTag(
      "contacts",
      contact.id,
      `Payment ID: ${payment.id}`,
    );
    if (alreadyProcessed) {
      return NextResponse.json({ ok: true, skipped: "duplicate" });
    }

    // -----------------------------------------------------------------------
    // 8. Find active deal or create a new one
    // -----------------------------------------------------------------------
    let deal = await findActiveDealForContact(contact.id);

    if (deal) {
      // Move existing deal to Completed and set amount
      await updateDealStage(deal.id, COMPLETED_STAGE_ID);
      await updateDealAmount(deal.id, amount);
    } else {
      // Create a new deal already in Completed stage
      const dealName = services.length > 0
        ? `${services[0]}${services.length > 1 ? ` +${services.length - 1} more` : ""}`
        : "Square Payment";
      deal = await createDeal(
        contact.id,
        dealName,
        amount,
        COMPLETED_STAGE_ID,
      );
    }

    // -----------------------------------------------------------------------
    // 9. Add tracking notes
    // -----------------------------------------------------------------------
    await createDealNote(deal.id, paymentTag);
    await createContactNote(
      contact.id,
      paymentTag,
    );

    // -----------------------------------------------------------------------
    // 10. Send thank-you / receipt email (only if contact has email)
    // -----------------------------------------------------------------------
    let emailSent = false;
    if (customer.email) {
      const subscribed = await isSubscribed(customer.email);
      if (subscribed) {
        const unsub = createUnsubscribeUrl(customer.email);
        const template = paymentReceivedEmail(
          customer.firstName ?? "",
          amount,
          services,
          unsub,
        );
        await sendEmail(customer.email, template.subject, template.html);
        emailSent = true;
      }
    }

    return NextResponse.json({
      ok: true,
      paymentId: payment.id,
      contactId: contact.id,
      dealId: deal.id,
      emailSent,
      amount,
      services,
    });
  } catch (err) {
    return NextResponse.json(
      { error: String(err) },
      { status: 500 },
    );
  }
}
