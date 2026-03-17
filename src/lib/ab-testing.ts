// ---------------------------------------------------------------------------
// Email A/B Testing Framework
// ---------------------------------------------------------------------------

import { supabase } from "@/lib/supabase";

export interface ABTest {
  id: string;
  name: string;
  email_template: string;
  variant_a: { subject: string };
  variant_b: { subject: string };
  traffic_split: number;
  active: boolean;
  winner: string | null;
  created_at: string;
  ended_at: string | null;
}

export interface ABTestResult extends ABTest {
  total_sends: number;
  variant_a_sends: number;
  variant_b_sends: number;
  variant_a_opens: number;
  variant_b_opens: number;
  variant_a_clicks: number;
  variant_b_clicks: number;
}

/** Find an active test for a given email template key */
export async function getActiveTest(
  emailTemplate: string,
): Promise<ABTest | null> {
  const { data } = await supabase
    .from("email_ab_tests")
    .select("*")
    .eq("email_template", emailTemplate)
    .eq("active", true)
    .limit(1)
    .maybeSingle();

  return data as ABTest | null;
}

/** Pick a variant based on the test's traffic split */
export function pickVariant(test: ABTest): "a" | "b" {
  return Math.random() < test.traffic_split ? "a" : "b";
}

/** Get the subject line for a given variant */
export function getVariantSubject(
  test: ABTest,
  variant: "a" | "b",
): string {
  return variant === "a" ? test.variant_a.subject : test.variant_b.subject;
}

/** Record a send in the tracking table */
export async function recordSend(
  testId: string,
  recipientEmail: string,
  variant: "a" | "b",
  resendEmailId?: string,
): Promise<void> {
  await supabase.from("email_ab_sends").insert({
    test_id: testId,
    recipient_email: recipientEmail,
    variant,
    resend_email_id: resendEmailId || null,
  });
}

/** Get test results with aggregated stats */
export async function getTestResults(
  testId?: string,
): Promise<ABTestResult[]> {
  let query = supabase.from("email_ab_tests").select("*");
  if (testId) query = query.eq("id", testId);
  query = query.order("created_at", { ascending: false });

  const { data: tests } = await query;
  if (!tests || tests.length === 0) return [];

  const results: ABTestResult[] = [];

  for (const test of tests) {
    const { data: sends } = await supabase
      .from("email_ab_sends")
      .select("variant, opened, clicked")
      .eq("test_id", test.id);

    const allSends = sends || [];
    const aSends = allSends.filter((s) => s.variant === "a");
    const bSends = allSends.filter((s) => s.variant === "b");

    results.push({
      ...(test as ABTest),
      total_sends: allSends.length,
      variant_a_sends: aSends.length,
      variant_b_sends: bSends.length,
      variant_a_opens: aSends.filter((s) => s.opened).length,
      variant_b_opens: bSends.filter((s) => s.opened).length,
      variant_a_clicks: aSends.filter((s) => s.clicked).length,
      variant_b_clicks: bSends.filter((s) => s.clicked).length,
    });
  }

  return results;
}
