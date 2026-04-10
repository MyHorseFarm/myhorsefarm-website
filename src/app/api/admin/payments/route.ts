import { NextRequest, NextResponse } from "next/server";
import {
  listPayments,
  getCustomerDetails,
  getOrderDetails,
  refundPayment,
} from "@/lib/square";

export const runtime = "nodejs";

function checkAuth(request: NextRequest): boolean {
  const auth = request.headers.get("authorization");
  return auth === `Bearer ${process.env.ADMIN_SECRET}`;
}

// GET /api/admin/payments?from=...&to=...&status=...&cursor=...&customerId=...
export async function GET(request: NextRequest) {
  if (!checkAuth(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const sp = request.nextUrl.searchParams;
    const from = sp.get("from") || undefined;
    const to = sp.get("to") || undefined;
    const status = sp.get("status") || undefined;
    const cursor = sp.get("cursor") || undefined;
    const customerId = sp.get("customerId") || undefined;

    const { payments, cursor: nextCursor } = await listPayments({
      beginTime: from,
      endTime: to,
      status,
      cursor,
      limit: 100,
    });

    // Filter by customerId client-side if provided
    const filtered = customerId
      ? payments.filter((p) => p.customerId === customerId)
      : payments;

    // Resolve customer names in parallel (deduplicated)
    const customerIds = [
      ...new Set(filtered.map((p) => p.customerId).filter(Boolean) as string[]),
    ];
    const customerMap = new Map<
      string,
      { firstName: string | null; lastName: string | null }
    >();
    await Promise.all(
      customerIds.map(async (id) => {
        try {
          const c = await getCustomerDetails(id);
          customerMap.set(id, {
            firstName: c.firstName,
            lastName: c.lastName,
          });
        } catch {
          customerMap.set(id, { firstName: null, lastName: null });
        }
      }),
    );

    // Resolve order line items for service names (deduplicated)
    const orderIds = [
      ...new Set(filtered.map((p) => p.orderId).filter(Boolean) as string[]),
    ];
    const orderMap = new Map<string, string>();
    await Promise.all(
      orderIds.map(async (id) => {
        try {
          const o = await getOrderDetails(id);
          const names = o.lineItems.map((li) => li.name).join(", ");
          orderMap.set(id, names || "Service");
        } catch {
          orderMap.set(id, "Service");
        }
      }),
    );

    const enriched = filtered.map((p) => {
      const cust = p.customerId ? customerMap.get(p.customerId) : null;
      const customerName = cust
        ? [cust.firstName, cust.lastName].filter(Boolean).join(" ") || "Unknown"
        : "Walk-in";
      const service = p.orderId
        ? orderMap.get(p.orderId) || "Service"
        : p.note || "Service";

      return {
        ...p,
        customerName,
        service,
      };
    });

    return NextResponse.json({ payments: enriched, cursor: nextCursor });
  } catch (err) {
    console.error("Payments API error:", err);
    return NextResponse.json(
      { error: "Failed to fetch payments" },
      { status: 500 },
    );
  }
}

// POST /api/admin/payments — process refund
export async function POST(request: NextRequest) {
  if (!checkAuth(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { paymentId, amount, reason } = body;

    if (!paymentId || !amount) {
      return NextResponse.json(
        { error: "paymentId and amount are required" },
        { status: 400 },
      );
    }

    const amountCents = Math.round(Number(amount) * 100);
    if (amountCents <= 0) {
      return NextResponse.json(
        { error: "Amount must be positive" },
        { status: 400 },
      );
    }

    const result = await refundPayment(paymentId, amountCents, reason);
    return NextResponse.json(result);
  } catch (err) {
    console.error("Refund error:", err);
    const message =
      err instanceof Error ? err.message : "Failed to process refund";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
