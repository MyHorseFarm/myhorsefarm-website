import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import {
  findContactByEmail,
  createContactNote,
  hasAutomationTag,
} from "@/lib/hubspot";
import {
  sendEmail,
  createUnsubscribeUrl,
} from "@/lib/emails";

export const runtime = "nodejs";
export const maxDuration = 60;

const TAG_REWARD = "[AUTO:REFERRAL_REWARD]";

/**
 * Check referrals with status='signed_up' whose referee has a completed booking
 * (i.e., the referred customer booked and the service was completed).
 * When found, mark referral as 'completed' and notify the referrer about their reward.
 */
export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const results: string[] = [];

  try {
    // Find referrals where referee has a quote that led to a booking
    const { data: activeReferrals } = await supabase
      .from("referrals")
      .select("*")
      .eq("status", "signed_up");

    for (const ref of activeReferrals ?? []) {
      try {
        if (!ref.referee_quote_id) continue;

        // Check if the referee's quote led to a completed booking
        const { data: booking } = await supabase
          .from("bookings")
          .select("id, status")
          .eq("quote_id", ref.referee_quote_id)
          .in("status", ["confirmed", "completed"])
          .limit(1)
          .maybeSingle();

        if (!booking) continue;

        // Referee booked — mark referral as completed
        await supabase
          .from("referrals")
          .update({
            status: "completed",
            completed_at: new Date().toISOString(),
          })
          .eq("id", ref.id);

        // Notify referrer about their reward
        const contactId = await findContactByEmail(ref.referrer_email)
          .then((c) => c?.id);

        if (contactId) {
          // Check dedup
          if (await hasAutomationTag("contacts", contactId, `${TAG_REWARD}:${ref.referral_code}`)) {
            results.push(`reward SKIP ${ref.referral_code}: already tagged`);
            continue;
          }

          await createContactNote(
            contactId,
            `${TAG_REWARD}:${ref.referral_code} Referral completed. Referee: ${ref.referee_name} (${ref.referee_email}). Reward: $${ref.referrer_reward_amount}`,
          );
        }

        // Send reward notification email to referrer
        const unsub = createUnsubscribeUrl(ref.referrer_email);
        const referrerFirst = ref.referrer_name.split(" ")[0];
        const refereeName = (ref.referee_name || "your referral").split(" ")[0];

        await sendEmail(
          ref.referrer_email,
          `You Earned $${ref.referrer_reward_amount}! Thanks for Referring ${refereeName}`,
          referralRewardHtml(referrerFirst, refereeName, ref.referrer_reward_amount, unsub),
        );

        results.push(`reward → ${ref.referrer_email} ($${ref.referrer_reward_amount} for ${ref.referral_code})`);
      } catch (err) {
        results.push(`reward FAIL ${ref.referral_code}: ${err}`);
      }
    }
  } catch (err) {
    return NextResponse.json(
      { error: String(err), results },
      { status: 500 },
    );
  }

  return NextResponse.json({
    ok: true,
    processed: results.length,
    results,
    timestamp: new Date().toISOString(),
  });
}

function referralRewardHtml(
  referrerName: string,
  refereeName: string,
  amount: number,
  unsubscribeUrl: string,
): string {
  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="margin:0;padding:0;background-color:#f4f4f4;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f4;">
<tr><td align="center" style="padding:20px 0;">
<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;color:#333;background:#fff;">
<div style="text-align:center;padding:25px;background-color:#2d5016;">
<img src="https://www.myhorsefarm.com/logo.png" alt="My Horse Farm" style="width:80px;margin-bottom:10px;" />
<h1 style="color:#ffffff;font-size:22px;margin:0;">Referral Reward Earned!</h1>
<p style="color:#d4a843;font-size:16px;margin:8px 0 0;">$${amount} credit</p>
</div>
<div style="padding:30px 20px;">
<p style="font-size:16px;line-height:1.6;">Hi ${referrerName},</p>
<p style="font-size:16px;line-height:1.6;">Great news! <strong>${refereeName}</strong> booked their first service through your referral. As a thank-you, you've earned a <strong>$${amount} credit</strong> toward your next service.</p>
<div style="background-color:#f0fdf4;padding:20px;border-radius:8px;margin:20px 0;text-align:center;border:2px solid #22c55e;">
<p style="font-size:28px;font-weight:bold;color:#16a34a;margin:0;">$${amount}</p>
<p style="font-size:14px;color:#666;margin:5px 0 0;">Credit applied to your account</p>
</div>
<p style="font-size:16px;line-height:1.6;">Your credit will be applied automatically to your next service charge. Keep referring — there's no limit on rewards!</p>
<p style="font-size:16px;line-height:1.6;">Talk soon,<br/><strong>Jose Gomez</strong><br/>Owner, My Horse Farm<br/><a href="tel:+15615767667" style="color:#2d5016;">(561) 576-7667</a></p>
</div>
</div>
<div style="max-width:600px;margin:0 auto;text-align:center;padding:20px;font-size:12px;color:#999;">
<p style="margin:5px 0;">My Horse Farm &middot; Royal Palm Beach, FL 33411 &middot; (561) 576-7667</p>
<p style="margin:5px 0;"><a href="${unsubscribeUrl}" style="color:#999;">Unsubscribe</a> | <a href="https://www.myhorsefarm.com/privacy-policy" style="color:#999;">Privacy Policy</a></p>
</div>
</td></tr></table>
</body></html>`;
}
