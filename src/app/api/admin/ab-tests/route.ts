import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { getTestResults } from "@/lib/ab-testing";

export const runtime = "nodejs";

function checkAuth(request: NextRequest): boolean {
  const auth = request.headers.get("authorization");
  return auth === `Bearer ${process.env.ADMIN_SECRET}`;
}

/**
 * GET /api/admin/ab-tests
 * List all A/B tests with aggregated results.
 */
export async function GET(request: NextRequest) {
  if (!checkAuth(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const results = await getTestResults();
  return NextResponse.json({ tests: results });
}

/**
 * POST /api/admin/ab-tests
 * Create a new A/B test.
 * Body: { name, email_template, variant_a: { subject }, variant_b: { subject }, traffic_split? }
 */
export async function POST(request: NextRequest) {
  if (!checkAuth(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { name, email_template, variant_a, variant_b, traffic_split } = body;

  if (!name || !email_template || !variant_a?.subject || !variant_b?.subject) {
    return NextResponse.json(
      { error: "Missing required fields: name, email_template, variant_a.subject, variant_b.subject" },
      { status: 400 },
    );
  }

  const { data, error } = await supabase
    .from("email_ab_tests")
    .insert({
      name,
      email_template,
      variant_a,
      variant_b,
      traffic_split: traffic_split ?? 0.5,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true, test: data }, { status: 201 });
}

/**
 * PUT /api/admin/ab-tests
 * End a test and declare a winner.
 * Body: { test_id, winner: "a" | "b" }
 */
export async function PUT(request: NextRequest) {
  if (!checkAuth(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { test_id, winner } = body;

  if (!test_id || !["a", "b"].includes(winner)) {
    return NextResponse.json(
      { error: "Missing test_id or invalid winner (must be 'a' or 'b')" },
      { status: 400 },
    );
  }

  const { data, error } = await supabase
    .from("email_ab_tests")
    .update({
      active: false,
      winner,
      ended_at: new Date().toISOString(),
    })
    .eq("id", test_id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true, test: data });
}
