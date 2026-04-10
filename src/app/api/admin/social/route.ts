import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { google } from "googleapis";
import {
  getPostForDate,
  getUpcomingPosts,
  POST_TEMPLATES,
  SocialPost,
} from "@/lib/social-posts";

export const runtime = "nodejs";

const ADMIN_SECRET = process.env.ADMIN_SECRET;
const FB_PAGE_ID = process.env.FACEBOOK_PAGE_ID;
const FB_PAGE_TOKEN = process.env.FACEBOOK_PAGE_ACCESS_TOKEN;
const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://www.myhorsefarm.com";

// ---------------------------------------------------------------------------
// Auth helper
// ---------------------------------------------------------------------------

function isAuthorized(request: NextRequest): boolean {
  const auth = request.headers.get("authorization");
  return !!ADMIN_SECRET && auth === `Bearer ${ADMIN_SECRET}`;
}

// ---------------------------------------------------------------------------
// GET — Preview upcoming posts
// ---------------------------------------------------------------------------

export async function GET(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const url = new URL(request.url);
  const count = parseInt(url.searchParams.get("count") || "10", 10);

  // Get upcoming scheduled posts
  const upcoming = getUpcomingPosts(new Date(), Math.min(count, 30));

  // Get recently posted from Supabase
  const { data: recentPosts } = await supabase
    .from("social_posts")
    .select("*")
    .order("posted_at", { ascending: false })
    .limit(10);

  // Get skipped posts
  const { data: skippedPosts } = await supabase
    .from("social_posts")
    .select("post_id")
    .eq("status", "skipped");

  const skippedIds = new Set(
    (skippedPosts || []).map((s: { post_id: string }) => s.post_id),
  );

  // Mark upcoming posts that are skipped
  const upcomingWithStatus = upcoming.map((post) => ({
    ...post,
    skipped: skippedIds.has(post.id),
  }));

  return NextResponse.json({
    upcoming: upcomingWithStatus,
    recent: recentPosts || [],
    totalTemplates: POST_TEMPLATES.length,
  });
}

// ---------------------------------------------------------------------------
// POST — Manual actions (post-now, skip)
// ---------------------------------------------------------------------------

export async function POST(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { action, postId } = body;

  // --- Post Now ---
  if (action === "post-now") {
    // Determine which post to send
    let post: SocialPost;
    if (postId) {
      const found = POST_TEMPLATES.find((p) => p.id === postId);
      if (!found) {
        return NextResponse.json(
          { error: `Post "${postId}" not found` },
          { status: 404 },
        );
      }
      post = found;
    } else {
      post = getPostForDate(new Date());
    }

    if (!FB_PAGE_ID || !FB_PAGE_TOKEN) {
      return NextResponse.json(
        {
          error:
            "Facebook not configured. Set FACEBOOK_PAGE_ID and FACEBOOK_PAGE_ACCESS_TOKEN.",
        },
        { status: 500 },
      );
    }

    try {
      const caption = `${post.text}\n\n${post.cta}\n${post.link}`;
      let fbPostId: string;

      if (post.image.endsWith(".mp4")) {
        // Text post with link
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
        fbPostId = data.id;
      } else {
        // Photo post
        const imageUrl = `${SITE_URL}/images/${post.image}`;
        const imageRes = await fetch(imageUrl);
        if (!imageRes.ok) throw new Error(`Failed to fetch image: ${imageUrl}`);
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
          throw new Error(
            err.error?.message || "Failed to post photo to Facebook",
          );
        }

        const data = await res.json();
        fbPostId = data.post_id || data.id;
      }

      // Log to Supabase
      await supabase.from("social_posts").insert({
        post_id: post.id,
        platform: "facebook",
        theme: post.theme,
        service: post.service,
        text_content: post.text,
        image: post.image,
        facebook_post_id: fbPostId,
        status: "posted",
      });

      return NextResponse.json({
        success: true,
        post: post.id,
        facebookPostId: fbPostId,
        url: `https://www.facebook.com/${fbPostId}`,
      });
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Unknown error";
      console.error("Manual post failed:", errorMsg);

      await supabase.from("social_posts").insert({
        post_id: post.id,
        platform: "facebook",
        theme: post.theme,
        service: post.service,
        text_content: post.text,
        image: post.image,
        facebook_post_id: null,
        status: "failed",
        error_message: errorMsg,
      });

      return NextResponse.json(
        { error: errorMsg },
        { status: 500 },
      );
    }
  }

  // --- Skip Post ---
  if (action === "skip") {
    if (!postId) {
      return NextResponse.json(
        { error: "postId is required for skip action" },
        { status: 400 },
      );
    }

    const found = POST_TEMPLATES.find((p) => p.id === postId);
    if (!found) {
      return NextResponse.json(
        { error: `Post "${postId}" not found` },
        { status: 404 },
      );
    }

    await supabase.from("social_posts").insert({
      post_id: postId,
      platform: "facebook",
      theme: found.theme,
      service: found.service,
      text_content: found.text,
      image: found.image,
      facebook_post_id: null,
      status: "skipped",
    });

    return NextResponse.json({
      success: true,
      skipped: postId,
    });
  }

  // --- Post to Google Business Profile ---
  if (action === "post-to-gbp") {
    const accountId = process.env.GBP_ACCOUNT_ID;
    const locationId = process.env.GBP_LOCATION_ID;
    const serviceAccountJson = process.env.GOOGLE_SERVICE_ACCOUNT_JSON;

    if (!accountId || !locationId || !serviceAccountJson) {
      return NextResponse.json(
        { error: "GBP not configured. Set GBP_ACCOUNT_ID, GBP_LOCATION_ID, GOOGLE_SERVICE_ACCOUNT_JSON." },
        { status: 500 },
      );
    }

    // Use custom message or fall back to a post template
    const customMessage = body.message as string | undefined;
    const ctaUrl = (body.url as string) || "https://www.myhorsefarm.com/quote";
    const ctaType = (body.ctaType as string) || "CALL";

    let summary: string;
    if (customMessage) {
      summary = customMessage;
    } else if (postId) {
      const found = POST_TEMPLATES.find((p) => p.id === postId);
      if (!found) {
        return NextResponse.json({ error: `Post "${postId}" not found` }, { status: 404 });
      }
      summary = `${found.text}\n\n${found.cta}`;
    } else {
      const todayPost = getPostForDate(new Date());
      summary = `${todayPost.text}\n\n${todayPost.cta}`;
    }

    try {
      const credentials = JSON.parse(serviceAccountJson);
      const auth = new google.auth.GoogleAuth({
        credentials,
        scopes: ["https://www.googleapis.com/auth/business.manage"],
      });
      const authClient = await auth.getClient();

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const response = await (authClient as any).request({
        url: `https://mybusiness.googleapis.com/v4/accounts/${accountId}/locations/${locationId}/localPosts`,
        method: "POST",
        data: {
          languageCode: "en",
          summary,
          callToAction: {
            actionType: ctaType,
            url: ctaUrl,
          },
          topicType: "STANDARD",
        },
      });

      return NextResponse.json({
        success: true,
        platform: "gbp",
        postId: response.data?.name,
        summary: summary.substring(0, 80) + "...",
      });
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Unknown error";
      console.error("GBP post failed:", errorMsg);
      return NextResponse.json({ error: errorMsg }, { status: 500 });
    }
  }

  return NextResponse.json(
    { error: 'Invalid action. Use "post-now", "skip", or "post-to-gbp".' },
    { status: 400 },
  );
}
