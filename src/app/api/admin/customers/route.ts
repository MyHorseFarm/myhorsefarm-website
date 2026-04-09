import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { listAllSquareCustomers, searchOrdersByCustomer, inferServiceFromOrders } from "@/lib/square";

export const runtime = "nodejs";

function checkAuth(request: NextRequest): boolean {
  const auth = request.headers.get("authorization");
  return auth === `Bearer ${process.env.ADMIN_SECRET}`;
}

export async function GET(request: NextRequest) {
  if (!checkAuth(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const activeOnly = request.nextUrl.searchParams.get("active") === "true";

  let query = supabase
    .from("recurring_customers")
    .select("*")
    .order("name");

  if (activeOnly) {
    query = query.eq("active", true);
  }

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ customers: data });
}

export async function POST(request: NextRequest) {
  if (!checkAuth(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();

  if (!body.name) {
    return NextResponse.json({ error: "Name is required" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("recurring_customers")
    .insert({
      name: body.name,
      email: body.email || null,
      phone: body.phone || null,
      address: body.address || null,
      square_customer_id: body.square_customer_id || null,
      default_bin_rate: body.default_bin_rate ?? 25.0,
      notes: body.notes || null,
      active: body.active ?? true,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ customer: data }, { status: 201 });
}

export async function PATCH(request: NextRequest) {
  if (!checkAuth(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // 1. Fetch all Square customers
    const squareCustomers = await listAllSquareCustomers();

    // 2. Load all existing recurring_customers
    const { data: existing, error: fetchErr } = await supabase
      .from("recurring_customers")
      .select("id, name, email, phone, address, square_customer_id");
    if (fetchErr) throw new Error(fetchErr.message);

    const squareIdToRow = new Map(
      (existing ?? []).filter((r) => r.square_customer_id).map((r) => [r.square_customer_id, r]),
    );
    const emailToRow = new Map(
      (existing ?? []).filter((r) => r.email).map((r) => [r.email!.toLowerCase(), r]),
    );

    let imported = 0;
    let updated = 0;
    let skipped = 0;

    for (const sc of squareCustomers) {
      const name = [sc.givenName, sc.familyName].filter(Boolean).join(" ") || "Unknown";

      // Already linked by Square ID → sync fields
      const linkedRow = squareIdToRow.get(sc.id);
      if (linkedRow) {
        const updates: Record<string, unknown> = {};
        if (sc.email && sc.email !== linkedRow.email) updates.email = sc.email;
        if (sc.phone && sc.phone !== linkedRow.phone) updates.phone = sc.phone;
        if (sc.address && sc.address !== linkedRow.address) updates.address = sc.address;
        if (name !== "Unknown" && name !== linkedRow.name) updates.name = name;

        if (Object.keys(updates).length === 0) {
          skipped++;
        } else {
          await supabase.from("recurring_customers").update(updates).eq("id", linkedRow.id);
          updated++;
        }
        continue;
      }

      // Email matches existing row missing Square ID → link + sync
      if (sc.email) {
        const match = emailToRow.get(sc.email.toLowerCase());
        if (match) {
          const updates: Record<string, unknown> = { square_customer_id: sc.id };
          if (sc.phone && sc.phone !== match.phone) updates.phone = sc.phone;
          if (sc.address && sc.address !== match.address) updates.address = sc.address;

          await supabase.from("recurring_customers").update(updates).eq("id", match.id);
          updated++;
          squareIdToRow.set(sc.id, match);
          continue;
        }
      }

      // New customer → insert
      const { error: insertErr } = await supabase.from("recurring_customers").insert({
        name,
        email: sc.email || null,
        phone: sc.phone || null,
        address: sc.address || null,
        square_customer_id: sc.id,
        default_bin_rate: 25.0,
        notes: sc.note || null,
        active: true,
      });
      if (insertErr) {
        console.error(`Failed to import Square customer ${sc.id}:`, insertErr.message);
        skipped++;
        continue;
      }
      imported++;
      squareIdToRow.set(sc.id, { id: sc.id, name, email: sc.email, phone: sc.phone, address: sc.address, square_customer_id: sc.id });
    }

    // Second pass: look up order history for customers with Square IDs
    // and infer default_service + default_bin_rate from line items
    const { data: allCustomers } = await supabase
      .from("recurring_customers")
      .select("id, square_customer_id, default_service")
      .not("square_customer_id", "is", null);

    let serviceUpdated = 0;
    for (const cust of allCustomers ?? []) {
      try {
        const orders = await searchOrdersByCustomer(cust.square_customer_id!);
        const inferred = inferServiceFromOrders(orders);
        if (!inferred) continue;

        const serviceUpdates: Record<string, unknown> = {
          default_service: inferred.serviceKey,
        };
        if (inferred.rate > 0) {
          serviceUpdates.default_bin_rate = inferred.rate;
        }

        await supabase
          .from("recurring_customers")
          .update(serviceUpdates)
          .eq("id", cust.id);
        serviceUpdated++;
      } catch (orderErr) {
        console.error(`Order lookup failed for customer ${cust.id}:`, orderErr);
      }
    }

    return NextResponse.json({ imported, updated, skipped, serviceUpdated });
  } catch (err) {
    console.error("Square import error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Import failed" },
      { status: 500 },
    );
  }
}

export async function PUT(request: NextRequest) {
  if (!checkAuth(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();

  // Bulk update: { ids: [...], updates: { ... } }
  if (Array.isArray(body.ids)) {
    const { ids, updates } = body;
    if (!ids.length || !updates || typeof updates !== "object") {
      return NextResponse.json({ error: "ids and updates required" }, { status: 400 });
    }
    const { error } = await supabase
      .from("recurring_customers")
      .update(updates)
      .in("id", ids);
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ updated: ids.length });
  }

  // Single update: { id, ...fields }
  if (!body.id) {
    return NextResponse.json({ error: "Missing customer id" }, { status: 400 });
  }

  const { id, ...rawUpdates } = body;

  // Allowlist of updatable fields to prevent mass assignment
  const ALLOWED_FIELDS = [
    "name", "email", "phone", "address", "notes", "active",
    "default_service", "default_bins", "auto_charge", "auto_renew",
    "contract_type", "contract_start_date", "contract_end_date",
    "contract_discount_pct", "sms_opted_in", "preferred_day",
    "preferred_time_slot", "billing_address",
  ];
  const updates: Record<string, unknown> = {};
  for (const key of ALLOWED_FIELDS) {
    if (key in rawUpdates) updates[key] = rawUpdates[key];
  }

  const { data, error } = await supabase
    .from("recurring_customers")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ customer: data });
}
