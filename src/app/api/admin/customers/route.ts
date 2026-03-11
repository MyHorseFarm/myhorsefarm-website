import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { listAllSquareCustomers } from "@/lib/square";

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
      .select("id, email, square_customer_id");
    if (fetchErr) throw new Error(fetchErr.message);

    const knownSquareIds = new Set(
      (existing ?? []).filter((r) => r.square_customer_id).map((r) => r.square_customer_id),
    );
    const emailToRow = new Map(
      (existing ?? []).filter((r) => r.email).map((r) => [r.email!.toLowerCase(), r]),
    );

    let imported = 0;
    let updated = 0;
    let skipped = 0;

    for (const sc of squareCustomers) {
      // Already linked by Square ID → skip
      if (knownSquareIds.has(sc.id)) {
        skipped++;
        continue;
      }

      const name = [sc.givenName, sc.familyName].filter(Boolean).join(" ") || "Unknown";

      // Email matches existing row missing Square ID → update
      if (sc.email) {
        const match = emailToRow.get(sc.email.toLowerCase());
        if (match) {
          const updates: Record<string, unknown> = { square_customer_id: sc.id };
          if (!match.email && sc.email) updates.email = sc.email;
          if (sc.phone) updates.phone = sc.phone;
          if (sc.address) updates.address = sc.address;

          await supabase
            .from("recurring_customers")
            .update(updates)
            .eq("id", match.id);
          updated++;
          knownSquareIds.add(sc.id);
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
      knownSquareIds.add(sc.id);
    }

    return NextResponse.json({ imported, updated, skipped });
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

  if (!body.id) {
    return NextResponse.json({ error: "Missing customer id" }, { status: 400 });
  }

  const { id, ...updates } = body;

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
