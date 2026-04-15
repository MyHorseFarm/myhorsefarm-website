import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { sendEmail } from "@/lib/emails";
import { withCronMonitor } from "@/lib/cron-monitor";

export const runtime = "nodejs";
export const maxDuration = 120;

const ADMIN_EMAIL = process.env.EMAIL_ADMIN_NOTIFICATION || "manureservice@gmail.com";
const _FB_PAGE_ID = process.env.FACEBOOK_PAGE_ID;
const FB_PAGE_TOKEN = process.env.FACEBOOK_PAGE_ACCESS_TOKEN;
const _IG_ACCOUNT_ID = process.env.INSTAGRAM_ACCOUNT_ID || "17841400727440467";

/**
 * Social Analytics — runs weekly on Monday at 9 AM ET
 *
 * Pulls engagement data from Facebook & Instagram for all posts from the last 7 days.
 * Stores metrics in Supabase and sends Jose a weekly performance report.
 * Identifies top/bottom performers to inform content strategy.
 */

interface PostMetrics {
  post_id: string;
  platform: string;
  external_post_id: string;
  impressions: number;
  reach: number;
  likes: number;
  comments: number;
  shares: number;
  clicks: number;
  engagement_rate: number;
  video_views?: number;
}

async function getFacebookPostMetrics(postId: string): Promise<Partial<PostMetrics> | null> {
  try {
    const res = await fetch(
      `https://graph.facebook.com/v21.0/${postId}?fields=insights.metric(post_impressions,post_engaged_users,post_clicks,post_reactions_like_total),likes.summary(true),comments.summary(true),shares&access_token=${FB_PAGE_TOKEN}`,
    );

    if (!res.ok) return null;
    const data = await res.json();

    const insights = data.insights?.data || [];
    const getMetric = (name: string) =>
      insights.find((i: { name: string }) => i.name === name)?.values?.[0]?.value || 0;

    const impressions = getMetric("post_impressions");
    const engaged = getMetric("post_engaged_users");
    const clicks = getMetric("post_clicks");
    const likes = data.likes?.summary?.total_count || 0;
    const comments = data.comments?.summary?.total_count || 0;
    const shares = data.shares?.count || 0;

    return {
      impressions,
      reach: impressions, // Facebook insights post_impressions is unique reach
      likes,
      comments,
      shares,
      clicks,
      engagement_rate: impressions > 0 ? ((engaged / impressions) * 100) : 0,
    };
  } catch {
    return null;
  }
}

async function getFacebookVideoMetrics(videoId: string): Promise<number> {
  try {
    const res = await fetch(
      `https://graph.facebook.com/v21.0/${videoId}?fields=views&access_token=${FB_PAGE_TOKEN}`,
    );
    if (!res.ok) return 0;
    const data = await res.json();
    return data.views || 0;
  } catch {
    return 0;
  }
}

async function getInstagramPostMetrics(postId: string): Promise<Partial<PostMetrics> | null> {
  try {
    const res = await fetch(
      `https://graph.facebook.com/v21.0/${postId}?fields=impressions,reach,like_count,comments_count&access_token=${FB_PAGE_TOKEN}`,
    );

    if (!res.ok) return null;
    const data = await res.json();

    const impressions = data.impressions || 0;
    const reach = data.reach || 0;
    const likes = data.like_count || 0;
    const comments = data.comments_count || 0;
    const engagement = likes + comments;

    return {
      impressions,
      reach,
      likes,
      comments,
      shares: 0, // IG API doesn't expose shares
      clicks: 0,
      engagement_rate: reach > 0 ? ((engagement / reach) * 100) : 0,
    };
  } catch {
    return null;
  }
}

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return withCronMonitor("social-analytics", async () => {
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

    // Get all posted entries from the last 7 days
    const { data: recentPosts } = await supabase
      .from("social_posts")
      .select("*")
      .eq("status", "posted")
      .gte("posted_at", sevenDaysAgo)
      .order("posted_at", { ascending: false });

    if (!recentPosts || recentPosts.length === 0) {
      return { processed: 0, message: "No posts found in the last 7 days" };
    }

    const metrics: PostMetrics[] = [];
    const results: string[] = [];

    for (const post of recentPosts) {
      const externalId = post.facebook_post_id;
      if (!externalId) continue;

      let postMetrics: Partial<PostMetrics> | null = null;

      if (post.platform === "facebook") {
        postMetrics = await getFacebookPostMetrics(externalId);

        // Check for video views if it's a video post
        if (post.image?.endsWith(".mp4") && postMetrics) {
          postMetrics.video_views = await getFacebookVideoMetrics(externalId);
        }
      } else if (post.platform === "instagram") {
        postMetrics = await getInstagramPostMetrics(externalId);
      }

      if (postMetrics) {
        const fullMetrics: PostMetrics = {
          post_id: post.post_id,
          platform: post.platform,
          external_post_id: externalId,
          impressions: postMetrics.impressions || 0,
          reach: postMetrics.reach || 0,
          likes: postMetrics.likes || 0,
          comments: postMetrics.comments || 0,
          shares: postMetrics.shares || 0,
          clicks: postMetrics.clicks || 0,
          engagement_rate: postMetrics.engagement_rate || 0,
          video_views: postMetrics.video_views,
        };

        metrics.push(fullMetrics);

        // Upsert metrics to Supabase
        await supabase.from("social_post_metrics").upsert(
          {
            post_id: post.post_id,
            platform: post.platform,
            external_post_id: externalId,
            impressions: fullMetrics.impressions,
            reach: fullMetrics.reach,
            likes: fullMetrics.likes,
            comments: fullMetrics.comments,
            shares: fullMetrics.shares,
            clicks: fullMetrics.clicks,
            engagement_rate: fullMetrics.engagement_rate,
            video_views: fullMetrics.video_views || 0,
            measured_at: new Date().toISOString(),
          },
          { onConflict: "post_id,platform" },
        ).then(() => {});

        results.push(`${post.platform} ${post.post_id}: ${fullMetrics.reach} reach, ${fullMetrics.likes} likes, ${fullMetrics.engagement_rate.toFixed(1)}% engagement`);
      }
    }

    // --- Build weekly performance report ---
    const totalReach = metrics.reduce((s, m) => s + m.reach, 0);
    const totalLikes = metrics.reduce((s, m) => s + m.likes, 0);
    const totalComments = metrics.reduce((s, m) => s + m.comments, 0);
    const totalShares = metrics.reduce((s, m) => s + m.shares, 0);
    const totalClicks = metrics.reduce((s, m) => s + m.clicks, 0);
    const avgEngagement = metrics.length > 0
      ? metrics.reduce((s, m) => s + m.engagement_rate, 0) / metrics.length
      : 0;

    // Top 3 performers
    const ranked = [...metrics].sort((a, b) => b.engagement_rate - a.engagement_rate);
    const top3 = ranked.slice(0, 3);
    const bottom3 = ranked.slice(-3).reverse();

    // Identify themes that work
    const themePerformance: Record<string, { total: number; count: number }> = {};
    for (const m of metrics) {
      const post = recentPosts.find((p) => p.post_id === m.post_id && p.platform === m.platform);
      const theme = post?.theme || "unknown";
      if (!themePerformance[theme]) themePerformance[theme] = { total: 0, count: 0 };
      themePerformance[theme].total += m.engagement_rate;
      themePerformance[theme].count += 1;
    }

    const themeRanking = Object.entries(themePerformance)
      .map(([theme, data]) => ({ theme, avgEngagement: data.total / data.count }))
      .sort((a, b) => b.avgEngagement - a.avgEngagement);

    // --- Send weekly report email ---
    const html = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #689f38;">📊 Weekly Social Media Report — My Horse Farm</h2>
        <p style="color: #666;">Week of ${new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toLocaleDateString()} — ${new Date().toLocaleDateString()}</p>

        <div style="background: #f5f5f5; padding: 16px; border-radius: 8px; margin: 16px 0;">
          <h3 style="margin-top: 0;">Overall Performance</h3>
          <table style="width: 100%; font-size: 14px;">
            <tr><td>📢 Total Reach</td><td style="text-align: right; font-weight: bold;">${totalReach.toLocaleString()}</td></tr>
            <tr><td>❤️ Total Likes</td><td style="text-align: right; font-weight: bold;">${totalLikes}</td></tr>
            <tr><td>💬 Total Comments</td><td style="text-align: right; font-weight: bold;">${totalComments}</td></tr>
            <tr><td>🔁 Total Shares</td><td style="text-align: right; font-weight: bold;">${totalShares}</td></tr>
            <tr><td>🔗 Total Clicks</td><td style="text-align: right; font-weight: bold;">${totalClicks}</td></tr>
            <tr><td>📈 Avg Engagement Rate</td><td style="text-align: right; font-weight: bold;">${avgEngagement.toFixed(1)}%</td></tr>
            <tr><td>📝 Posts Tracked</td><td style="text-align: right; font-weight: bold;">${metrics.length}</td></tr>
          </table>
        </div>

        <h3>🏆 Top Performers</h3>
        <ol>
          ${top3.map((m) => `<li><strong>${m.post_id}</strong> (${m.platform}) — ${m.engagement_rate.toFixed(1)}% engagement, ${m.reach} reach, ${m.likes} likes</li>`).join("")}
        </ol>

        <h3>📉 Lowest Performers</h3>
        <ol>
          ${bottom3.map((m) => `<li><strong>${m.post_id}</strong> (${m.platform}) — ${m.engagement_rate.toFixed(1)}% engagement, ${m.reach} reach</li>`).join("")}
        </ol>

        <h3>🎯 Best Performing Themes</h3>
        <ol>
          ${themeRanking.slice(0, 5).map((t) => `<li><strong>${t.theme}</strong> — ${t.avgEngagement.toFixed(1)}% avg engagement</li>`).join("")}
        </ol>

        ${themeRanking.length > 0 ? `
        <div style="background: #e8f5e9; padding: 12px; border-radius: 8px; margin-top: 16px;">
          <strong>💡 Recommendation:</strong> Post more "${themeRanking[0].theme}" content — it's your best performing theme at ${themeRanking[0].avgEngagement.toFixed(1)}% engagement.
          ${themeRanking.length > 1 && themeRanking[themeRanking.length - 1].avgEngagement < 1 ? ` Consider replacing "${themeRanking[themeRanking.length - 1].theme}" content — it's underperforming.` : ""}
        </div>
        ` : ""}

        <p style="color: #999; font-size: 12px; margin-top: 20px;">Sent by the MHF social-analytics cron. Metrics are from the Facebook & Instagram Graph APIs.</p>
      </div>
    `;

    try {
      await sendEmail(ADMIN_EMAIL, `📊 MHF Weekly Social Report: ${totalReach.toLocaleString()} reach, ${avgEngagement.toFixed(1)}% engagement`, html);
    } catch (emailErr) {
      console.error("Failed to send analytics email:", emailErr);
    }

    return {
      processed: metrics.length,
      totalReach,
      totalLikes,
      totalComments,
      avgEngagement: avgEngagement.toFixed(1),
      topPerformers: top3.map((m) => ({ post: m.post_id, platform: m.platform, engagement: m.engagement_rate.toFixed(1) })),
      themeRanking: themeRanking.slice(0, 5),
      results,
    };
  });
}
