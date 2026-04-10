import { NextRequest, NextResponse } from "next/server";
import {
  listInvoices,
  searchInvoices,
  createInvoice,
  publishInvoice,
  cancelInvoice,
} from "@/lib/square";

export const runtime = "nodejs";

function checkAuth(request: NextRequest): boolean {
  const auth = request.headers.get("authorization");
  return auth === `Bearer ${process.env.ADMIN_SECRET}`;
}

// GET: List or search invoices
export async function GET(request: NextRequest) {
  if (!checkAuth(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const locationId = process.env.NEXT_PUBLIC_SQUARE_LOCATION_ID;
  if (!locationId) {
    return NextResponse.json(
      { error: "NEXT_PUBLIC_SQUARE_LOCATION_ID not configured" },
      { status: 500 },
    );
  }

  const params = request.nextUrl.searchParams;
  const status = params.get("status") || undefined;
  const customerId = params.get("customerId") || undefined;
  const cursor = params.get("cursor") || undefined;

  try {
    // If we have filters, use search; otherwise list all
    if (status || customerId) {
      const filters: {
        customerIds?: string[];
        status?: string;
        dateFrom?: string;
        dateTo?: string;
      } = {};
      if (status) filters.status = status;
      if (customerId) filters.customerIds = [customerId];
      const dateFrom = params.get("dateFrom") || undefined;
      const dateTo = params.get("dateTo") || undefined;
      if (dateFrom) filters.dateFrom = dateFrom;
      if (dateTo) filters.dateTo = dateTo;

      const result = await searchInvoices(locationId, filters);
      return NextResponse.json(result);
    }

    const result = await listInvoices(locationId, cursor);
    return NextResponse.json(result);
  } catch (err) {
    console.error("Invoice list error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to fetch invoices" },
      { status: 500 },
    );
  }
}

// POST: Create a new draft invoice
export async function POST(request: NextRequest) {
  if (!checkAuth(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const locationId = process.env.NEXT_PUBLIC_SQUARE_LOCATION_ID;
  if (!locationId) {
    return NextResponse.json(
      { error: "NEXT_PUBLIC_SQUARE_LOCATION_ID not configured" },
      { status: 500 },
    );
  }

  try {
    const body = await request.json();
    const { customerId, lineItems, dueDate, note } = body;

    if (!customerId || !lineItems?.length || !dueDate) {
      return NextResponse.json(
        { error: "customerId, lineItems, and dueDate are required" },
        { status: 400 },
      );
    }

    const invoice = await createInvoice(locationId, {
      customerId,
      lineItems,
      dueDate,
      note,
    });

    return NextResponse.json({ invoice }, { status: 201 });
  } catch (err) {
    console.error("Invoice create error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to create invoice" },
      { status: 500 },
    );
  }
}

// PUT: Publish or cancel an invoice
export async function PUT(request: NextRequest) {
  if (!checkAuth(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { invoiceId, version, action } = body;

    if (!invoiceId || version === undefined || !action) {
      return NextResponse.json(
        { error: "invoiceId, version, and action are required" },
        { status: 400 },
      );
    }

    let invoice;
    if (action === "publish") {
      invoice = await publishInvoice(invoiceId, version);
    } else if (action === "cancel") {
      invoice = await cancelInvoice(invoiceId, version);
    } else {
      return NextResponse.json(
        { error: "action must be 'publish' or 'cancel'" },
        { status: 400 },
      );
    }

    return NextResponse.json({ invoice });
  } catch (err) {
    console.error("Invoice action error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to update invoice" },
      { status: 500 },
    );
  }
}
