import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { getPostForDate, SocialPost } from "@/lib/social-posts";
import { withCronMonitor } from "@/lib/cron-monitor";

export const runtime = "nodejs";
export const maxDuration = 60;

const FB_PAGE_ID = process.env.FACEBOOK_PAGE_ID;
const FB_PAGE_TOKEN = process.env.FACEBOOK_PAGE_ACCESS_TOKEN;
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.myhorsefarm.com";

// ---------------------------------------------------------------------------
// Post to Facebook Page (photo or text)
// ---------------------------------------------------------------------------

async function postToFacebook(
  post: SocialPost,
): Promise<{ postId: string; url: string }> {
  if (!FB_PAGE_ID || !FB_PAGE_TOKEN) {
    throw new Error(
      "Facebook not configured. Set FACEBOOK_PAGE_ID and FACEBOOK_PAGE_ACCESS_TOKEN.",
    );
  }

  const caption = `${post.text}\n\n${post.cta}\n${post.link}`;

  // If the image is a video file, post as text with link instead
  if (post.image.endsWith(".mp4")) {
    const params: Record<string, string> = {
      message: caption,
      link: post.link,
      access_token: FB_PAGE_TOKEN,
    };

    const res = await fetch(
      `https://graph.facebook.com/v21.0/${FB_PAGE_ID}/feed`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(params),
      },
    );

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error?.message || "Failed to post to Facebook");
    }

    const data = await res.json();
    return {
      postId: data.id,
      url: `https://www.facebook.com/${data.id}`,
    };
  }

  // Photo post — fetch image from our site and upload to Facebook
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
  post: SocialPost,
  platform: string,
  facebookPostId: string | null,
  status: string,
  errorMsg?: string,
) {
  await supabase.from("social_posts").insert({
    post_id: post.id,
    platform,
    theme: post.theme,
    service: post.service,
    text_content: post.text,
    image: post.image,
    facebook_post_id: facebookPostId,
    status,
    error_message: errorMsg || null,
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
    const post = getPostForDate(today);

    // Check dedup
    const alreadyPosted = await alreadyPostedToday(post.id, "facebook");
    if (alreadyPosted) {
      return {
        processed: 0,
        skipped: true,
        message: `Post "${post.id}" already posted to Facebook today.`,
      };
    }

    // Post to Facebook
    let fbResult: { postId: string; url: string } | null = null;
    try {
      fbResult = await postToFacebook(post);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Unknown error";
      console.error("Facebook post failed:", errorMsg);
      await logPost(post, "facebook", null, "failed", errorMsg);
      return {
        processed: 1,
        errors: [errorMsg],
        post: post.id,
      };
    }

    // Log success
    await logPost(post, "facebook", fbResult.postId, "posted");

    return {
      processed: 1,
      sent: 1,
      post: post.id,
      theme: post.theme,
      service: post.service,
      facebookPostId: fbResult.postId,
      facebookUrl: fbResult.url,
    };
  });
}
