import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export const runtime = "nodejs";

/**
 * POST /api/referral — Generate a referral code for a customer.
 * Body: { name, email, customer_id? }
 * Returns: { referral_code, referral_url }
 */
export async function POST(request: NextRequest) {
  try {
    const { name, email, customer_id } = await request.json();

    if (!name || !email) {
      return NextResponse.json(
        { error: "Name and email required" },
        { status: 400 },
      );
    }

    // Check if customer already has a referral code
    const { data: existing } = await supabase
      .from("referrals")
      .select("referral_code")
      .eq("referrer_email", email)
      .eq("status", "pending")
      .limit(1)
      .maybeSingle();

    if (existing) {
      const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.myhorsefarm.com";
      return NextResponse.json({
        referral_code: existing.referral_code,
        referral_url: `${siteUrl}/refer/${existing.referral_code}`,
      });
    }

    // Generate code: FIRSTNAME-X7 (first name + random 2-char suffix)
    const firstName = name.split(" ")[0].toUpperCase().replace(/[^A-Z]/g, "");
    const suffix = Math.random().toString(36).substring(2, 4).toUpperCase();
    const code = `${firstName}-${suffix}`;

    const { error: insertError } = await supabase
      .from("referrals")
      .insert({
        referrer_name: name,
        referrer_email: email,
        referrer_customer_id: customer_id || null,
        referral_code: code,
      });

    if (insertError) {
      // If code collision, try with longer suffix
      const suffix2 = Math.random().toString(36).substring(2, 5).toUpperCase();
      const code2 = `${firstName}-${suffix2}`;
      const { error: retryError } = await supabase
        .from("referrals")
        .insert({
          referrer_name: name,
          referrer_email: email,
          referrer_customer_id: customer_id || null,
          referral_code: code2,
        });
      if (retryError) throw retryError;

      const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.myhorsefarm.com";
      return NextResponse.json({
        referral_code: code2,
        referral_url: `${siteUrl}/refer/${code2}`,
      });
    }

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.myhorsefarm.com";
    return NextResponse.json({
      referral_code: code,
      referral_url: `${siteUrl}/refer/${code}`,
    });
  } catch (err) {
    console.error("Referral creation error:", err);
    return NextResponse.json(
      { error: "Failed to create referral" },
      { status: 500 },
    );
  }
}
