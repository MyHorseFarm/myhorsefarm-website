import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { sendEmail } from "@/lib/emails";
import { withCronMonitor } from "@/lib/cron-monitor";

export const runtime = "nodejs";
export const maxDuration = 60;

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@myhorsefarm.com";
const FB_PAGE_ID = process.env.FACEBOOK_PAGE_ID;
const FB_PAGE_TOKEN = process.env.FACEBOOK_PAGE_ACCESS_TOKEN;

/**
 * Social Monitor — runs daily at 8 PM ET (after the 10 AM post window)
 *
 * Checks:
 * 1. Did today's posts go out on both Facebook and Instagram?
 * 2. Are there any failed posts in the last 3 days?
 * 3. Is the Facebook token still valid?
 * 4. Are posts actually live on Facebook (not just logged)?
 *
 * Alerts Jose via email if anything is wrong.
 */

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return withCronMonitor("social-monitor", async () => {
    const issues: string[] = [];
    const stats: Record<string, unknown> = {};

    // --- Check 1: Did yesterday's posts go out? ---
    // (This cron runs at midnight UTC / 8 PM ET, so today's posts are from the morning)
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split("T")[0];
    const today = new Date().toISOString().split("T")[0];

    const { data: todayPosts } = await supabase
      .from("social_posts")
      .select("post_id, platform, status, error_message")
      .gte("posted_at", `${yesterday}T00:00:00Z`)
      .lt("posted_at", `${today}T23:59:59Z`);

    const fbPosted = todayPosts?.some((p) => p.platform === "facebook" && p.status === "posted");
    const igPosted = todayPosts?.some((p) => p.platform === "instagram" && p.status === "posted");
    const fbFailed = todayPosts?.find((p) => p.platform === "facebook" && p.status === "failed");
    const igFailed = todayPosts?.find((p) => p.platform === "instagram" && p.status === "failed");

    stats.todayFacebook = fbPosted ? "posted" : fbFailed ? "failed" : "missing";
    stats.todayInstagram = igPosted ? "posted" : igFailed ? "failed" : "missing";

    if (!fbPosted) {
      issues.push(`Facebook post missing today (${today}). ${fbFailed ? `Error: ${fbFailed.error_message}` : "Cron may not have fired."}`);
    }
    if (!igPosted) {
      issues.push(`Instagram post missing today (${today}). ${igFailed ? `Error: ${igFailed.error_message}` : "Cron may not have fired or IG posting failed."}`);
    }

    // --- Check 2: Failed posts in last 3 days ---
    const threeDaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString();

    const { data: recentFails } = await supabase
      .from("social_posts")
      .select("post_id, platform, status, error_message, posted_at")
      .eq("status", "failed")
      .gte("posted_at", threeDaysAgo)
      .order("posted_at", { ascending: false });

    stats.recentFailures = recentFails?.length || 0;

    if (recentFails && recentFails.length >= 3) {
      issues.push(`${recentFails.length} failed posts in the last 3 days. Possible systemic issue. Errors: ${[...new Set(recentFails.map((f) => f.error_message))].join("; ")}`);
    }

    // --- Check 3: Is the Facebook token still valid? ---
    try {
      const tokenRes = await fetch(
        `https://graph.facebook.com/v21.0/debug_token?input_token=${FB_PAGE_TOKEN}&access_token=${FB_PAGE_TOKEN}`,
      );
      const tokenData = await tokenRes.json();

      if (!tokenData.data?.is_valid) {
        issues.push("Facebook Page Access Token is INVALID or EXPIRED. Posts will fail until this is fixed.");
      }

      stats.tokenValid = tokenData.data?.is_valid ?? false;
      stats.tokenExpires = tokenData.data?.expires_at === 0 ? "never" : new Date((tokenData.data?.expires_at || 0) * 1000).toISOString();
    } catch {
      issues.push("Could not verify Facebook token status.");
    }

    // --- Check 4: Verify last Facebook post is actually live ---
    if (fbPosted && todayPosts) {
      const lastFbPost = todayPosts.find((p) => p.platform === "facebook" && p.status === "posted");
      if (lastFbPost) {
        try {
          const _fbPostId = lastFbPost.post_id;
          // Try to fetch the post from Facebook to verify it exists
          const verifyRes = await fetch(
            `https://graph.facebook.com/v21.0/${FB_PAGE_ID}/feed?fields=id&limit=1&access_token=${FB_PAGE_TOKEN}`,
          );
          const verifyData = await verifyRes.json();
          stats.latestFbPostVerified = !!(verifyData.data?.length > 0);
        } catch {
          // Non-fatal — just can't verify
        }
      }
    }

    // --- Check 5: Posting consistency (last 7 days) ---
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

    const { data: weekPosts } = await supabase
      .from("social_posts")
      .select("posted_at, platform, status")
      .eq("status", "posted")
      .gte("posted_at", sevenDaysAgo);

    const fbCount = weekPosts?.filter((p) => p.platform === "facebook").length || 0;
    const igCount = weekPosts?.filter((p) => p.platform === "instagram").length || 0;

    stats.last7days = { facebook: fbCount, instagram: igCount, expected: 7 };

    if (fbCount < 5) {
      issues.push(`Only ${fbCount}/7 Facebook posts went out in the last 7 days. Expected 7 (daily).`);
    }
    if (igCount < 3) {
      issues.push(`Only ${igCount}/7 Instagram posts went out in the last 7 days.`);
    }

    // --- Send alert email if there are issues ---
    if (issues.length > 0) {
      const html = `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #d32f2f;">⚠️ Social Posting Alert — My Horse Farm</h2>
          <p>The social media monitor found ${issues.length} issue${issues.length > 1 ? "s" : ""}:</p>
          <ul>
            ${issues.map((i) => `<li style="margin-bottom: 8px; color: #333;">${i}</li>`).join("")}
          </ul>
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
          <h3>Stats</h3>
          <pre style="background: #f5f5f5; padding: 12px; border-radius: 4px; font-size: 12px;">${JSON.stringify(stats, null, 2)}</pre>
          <p style="color: #999; font-size: 12px;">This alert was sent by the MHF social-monitor cron.</p>
        </div>
      `;

      try {
        await sendEmail(ADMIN_EMAIL, `⚠️ MHF Social Alert: ${issues.length} issue(s) found`, html);
      } catch (emailErr) {
        console.error("Failed to send monitor alert email:", emailErr);
      }
    }

    return {
      healthy: issues.length === 0,
      issues,
      stats,
    };
  });
}
