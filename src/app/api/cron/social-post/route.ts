import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { getPostForDate, SocialPost } from "@/lib/social-posts";
import { withCronMonitor } from "@/lib/cron-monitor";

export const runtime = "nodejs";
export const maxDuration = 300; // Extended for video uploads + Instagram Reel polling

const FB_PAGE_ID = process.env.FACEBOOK_PAGE_ID;
const FB_PAGE_TOKEN = process.env.FACEBOOK_PAGE_ACCESS_TOKEN;
const IG_ACCOUNT_ID = process.env.INSTAGRAM_ACCOUNT_ID || "17841400727440467";
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.myhorsefarm.com";

// Video ads rotate weekly — one per week on Saturday
const VIDEO_ADS = [
  { file: "ad-junk-removal.mp4", caption: "Got junk? We got the truck. Same-day pickup across Palm Beach County. No hidden fees — just honest pricing and a clean property." },
  { file: "ad-manure-removal.mp4", caption: "A single horse produces 50 lbs of manure per day. Let us handle it. Weekly & biweekly removal for Wellington, Loxahatchee, and Palm Beach County." },
  { file: "ad-dumpster-rental.mp4", caption: "Dumpsters delivered to your door. Multiple sizes for any project — farm or home. Serving Wellington, West Palm Beach, Boca Raton, and more." },
  { file: "ad-all-services.mp4", caption: "Your farm. Our problem. Manure removal, junk hauling, dumpsters & more. Call (561) 576-7667 or visit myhorsefarm.com for a free quote." },
];

// ---------------------------------------------------------------------------
// Post photo to Facebook Page
// ---------------------------------------------------------------------------

async function postPhotoToFacebook(
  post: SocialPost,
): Promise<{ postId: string; url: string }> {
  if (!FB_PAGE_ID || !FB_PAGE_TOKEN) {
    throw new Error("Facebook not configured. Set FACEBOOK_PAGE_ID and FACEBOOK_PAGE_ACCESS_TOKEN.");
  }

  const caption = `${post.text}\n\n${post.cta}\n${post.link}`;

  const imageUrl = `${SITE_URL}/images/${post.image}`;
  const imageRes = await fetch(imageUrl);
  if (!imageRes.ok) {
    throw new Error(`Failed to fetch image: ${imageUrl}`);
  }
  const imageBuffer = Buffer.from(await imageRes.arrayBuffer());

  const formData = new FormData();
  formData.append(
    "source",
    new Blob([imageBuffer], { type: "image/jpeg" }),
    post.image,
  );
  formData.append("message", caption);
  formData.append("access_token", FB_PAGE_TOKEN);

  const res = await fetch(
    `https://graph.facebook.com/v21.0/${FB_PAGE_ID}/photos`,
    { method: "POST", body: formData },
  );

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error?.message || "Failed to post photo to Facebook");
  }

  const data = await res.json();
  const fbPostId = data.post_id || data.id;
  return {
    postId: fbPostId,
    url: `https://www.facebook.com/${fbPostId}`,
  };
}

// ---------------------------------------------------------------------------
// Post video to Facebook Page
// ---------------------------------------------------------------------------

async function postVideoToFacebook(
  videoUrl: string,
  caption: string,
): Promise<{ postId: string; url: string }> {
  if (!FB_PAGE_ID || !FB_PAGE_TOKEN) {
    throw new Error("Facebook not configured.");
  }

  const res = await fetch(
    `https://graph.facebook.com/v21.0/${FB_PAGE_ID}/videos`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        file_url: videoUrl,
        description: caption,
        access_token: FB_PAGE_TOKEN,
      }),
    },
  );

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error?.message || "Failed to post video to Facebook");
  }

  const data = await res.json();
  return {
    postId: data.id,
    url: `https://www.facebook.com/${data.id}`,
  };
}

// ---------------------------------------------------------------------------
// Post to Instagram (photo via URL)
// ---------------------------------------------------------------------------

async function postToInstagram(
  imageUrl: string,
  caption: string,
): Promise<{ postId: string }> {
  if (!FB_PAGE_TOKEN) {
    throw new Error("Instagram not configured.");
  }

  // Step 1: Create media container
  const containerRes = await fetch(
    `https://graph.facebook.com/v21.0/${IG_ACCOUNT_ID}/media`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        image_url: imageUrl,
        caption,
        access_token: FB_PAGE_TOKEN,
      }),
    },
  );

  if (!containerRes.ok) {
    const err = await containerRes.json();
    throw new Error(err.error?.message || "Failed to create IG media container");
  }

  const containerData = await containerRes.json();
  const containerId = containerData.id;

  // Step 2: Publish the container
  const publishRes = await fetch(
    `https://graph.facebook.com/v21.0/${IG_ACCOUNT_ID}/media_publish`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        creation_id: containerId,
        access_token: FB_PAGE_TOKEN,
      }),
    },
  );

  if (!publishRes.ok) {
    const err = await publishRes.json();
    throw new Error(err.error?.message || "Failed to publish IG post");
  }

  const publishData = await publishRes.json();
  return { postId: publishData.id };
}

// ---------------------------------------------------------------------------
// Post video Reel to Instagram
// ---------------------------------------------------------------------------

async function postReelToInstagram(
  videoUrl: string,
  caption: string,
): Promise<{ postId: string }> {
  if (!FB_PAGE_TOKEN) {
    throw new Error("Instagram not configured.");
  }

  // Step 1: Create video container as REELS
  const containerRes = await fetch(
    `https://graph.facebook.com/v21.0/${IG_ACCOUNT_ID}/media`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        video_url: videoUrl,
        caption,
        media_type: "REELS",
        access_token: FB_PAGE_TOKEN,
      }),
    },
  );

  if (!containerRes.ok) {
    const err = await containerRes.json();
    throw new Error(err.error?.message || "Failed to create IG Reel container");
  }

  const containerData = await containerRes.json();
  const containerId = containerData.id;

  // Step 2: Wait for video processing (poll status)
  let ready = false;
  for (let i = 0; i < 10; i++) {
    await new Promise((r) => setTimeout(r, 5000)); // wait 5s between checks
    const statusRes = await fetch(
      `https://graph.facebook.com/v21.0/${containerId}?fields=status_code&access_token=${FB_PAGE_TOKEN}`,
    );
    const statusData = await statusRes.json();
    if (statusData.status_code === "FINISHED") {
      ready = true;
      break;
    }
    if (statusData.status_code === "ERROR") {
      throw new Error("Instagram video processing failed");
    }
  }

  if (!ready) {
    throw new Error("Instagram video processing timed out");
  }

  // Step 3: Publish
  const publishRes = await fetch(
    `https://graph.facebook.com/v21.0/${IG_ACCOUNT_ID}/media_publish`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        creation_id: containerId,
        access_token: FB_PAGE_TOKEN,
      }),
    },
  );

  if (!publishRes.ok) {
    const err = await publishRes.json();
    throw new Error(err.error?.message || "Failed to publish IG Reel");
  }

  const publishData = await publishRes.json();
  return { postId: publishData.id };
}

// ---------------------------------------------------------------------------
// Check if already posted today (dedup)
// ---------------------------------------------------------------------------

async function alreadyPostedToday(
  postId: string,
  platform: string,
): Promise<boolean> {
  const today = new Date().toISOString().split("T")[0];

  const { data } = await supabase
    .from("social_posts")
    .select("id")
    .eq("post_id", postId)
    .eq("platform", platform)
    .gte("posted_at", `${today}T00:00:00Z`)
    .lt("posted_at", `${today}T23:59:59Z`)
    .limit(1);

  return !!(data && data.length > 0);
}

// ---------------------------------------------------------------------------
// Log post to Supabase
// ---------------------------------------------------------------------------

async function logPost(
  postId: string,
  platform: string,
  externalPostId: string | null,
  status: string,
  extra?: { theme?: string; service?: string; text_content?: string; image?: string; error_message?: string },
) {
  await supabase.from("social_posts").insert({
    post_id: postId,
    platform,
    theme: extra?.theme || "video-ad",
    service: extra?.service || "general",
    text_content: extra?.text_content || "",
    image: extra?.image || "",
    facebook_post_id: externalPostId,
    status,
    error_message: extra?.error_message || null,
  });
}

// ---------------------------------------------------------------------------
// Cron Handler
// ---------------------------------------------------------------------------

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return withCronMonitor("social-post", async () => {
    const today = new Date();
    const dayOfWeek = today.getDay(); // 0=Sun, 6=Sat
    const post = getPostForDate(today);
    const results: string[] = [];

    // === Wednesday & Saturday: Post a VIDEO AD to both platforms ===
    if (dayOfWeek === 3 || dayOfWeek === 6) {
      const weekOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 1).getTime()) / (7 * 24 * 60 * 60 * 1000));
      const videoAd = VIDEO_ADS[weekOfYear % VIDEO_ADS.length];
      const videoPostId = `video-${videoAd.file}`;
      const videoUrl = `${SITE_URL}/videos/${videoAd.file}`;
      const caption = `${videoAd.caption}\n\n📞 (561) 576-7667\n🌐 myhorsefarm.com/quote\n\n#myhorsefarm #palmbeach #wellington #southflorida #horsefarm #farmservice`;

      // Facebook video
      if (!(await alreadyPostedToday(videoPostId, "facebook"))) {
        try {
          const fbResult = await postVideoToFacebook(videoUrl, caption);
          await logPost(videoPostId, "facebook", fbResult.postId, "posted", { text_content: caption, image: videoAd.file });
          results.push(`fb-video → ${videoAd.file}`);
        } catch (err) {
          const msg = err instanceof Error ? err.message : "Unknown error";
          await logPost(videoPostId, "facebook", null, "failed", { error_message: msg, image: videoAd.file });
          results.push(`fb-video FAIL: ${msg}`);
        }
      }

      // Instagram Reel
      if (!(await alreadyPostedToday(videoPostId, "instagram"))) {
        try {
          const igResult = await postReelToInstagram(videoUrl, caption);
          await logPost(videoPostId, "instagram", igResult.postId, "posted", { text_content: caption, image: videoAd.file });
          results.push(`ig-reel → ${videoAd.file}`);
        } catch (err) {
          const msg = err instanceof Error ? err.message : "Unknown error";
          await logPost(videoPostId, "instagram", null, "failed", { error_message: msg, image: videoAd.file });
          results.push(`ig-reel FAIL: ${msg}`);
        }
      }
    }

    // === Tue/Thu/Sat: Post the regular image post ===

    // Facebook photo
    if (!(await alreadyPostedToday(post.id, "facebook"))) {
      try {
        const fbResult = await postPhotoToFacebook(post);
        await logPost(post.id, "facebook", fbResult.postId, "posted", {
          theme: post.theme, service: post.service, text_content: post.text, image: post.image,
        });
        results.push(`fb-photo → ${post.id}`);
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Unknown error";
        await logPost(post.id, "facebook", null, "failed", {
          theme: post.theme, service: post.service, error_message: msg, image: post.image,
        });
        results.push(`fb-photo FAIL: ${msg}`);
      }
    }

    // Instagram photo
    if (post.platforms.includes("instagram") && !(await alreadyPostedToday(post.id, "instagram"))) {
      try {
        const imageUrl = `${SITE_URL}/images/${post.image}`;
        const igCaption = `${post.text}\n\n${post.cta}`;
        const igResult = await postToInstagram(imageUrl, igCaption);
        await logPost(post.id, "instagram", igResult.postId, "posted", {
          theme: post.theme, service: post.service, text_content: post.text, image: post.image,
        });
        results.push(`ig-photo → ${post.id}`);
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Unknown error";
        await logPost(post.id, "instagram", null, "failed", {
          theme: post.theme, service: post.service, error_message: msg, image: post.image,
        });
        results.push(`ig-photo FAIL: ${msg}`);
      }
    }

    return {
      processed: results.length,
      sent: results.filter((r) => !r.includes("FAIL")).length,
      errors: results.filter((r) => r.includes("FAIL")).length > 0
        ? results.filter((r) => r.includes("FAIL"))
        : undefined,
      results,
    };
  });
}
