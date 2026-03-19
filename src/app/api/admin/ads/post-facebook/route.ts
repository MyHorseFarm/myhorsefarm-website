import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

const ADMIN_SECRET = process.env.ADMIN_SECRET;
const FB_PAGE_ID = process.env.FACEBOOK_PAGE_ID;
const FB_PAGE_TOKEN = process.env.FACEBOOK_PAGE_ACCESS_TOKEN;

export async function POST(request: NextRequest) {
  const auth = request.headers.get("authorization");
  if (!ADMIN_SECRET || auth !== `Bearer ${ADMIN_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!FB_PAGE_ID || !FB_PAGE_TOKEN) {
    return NextResponse.json(
      {
        error:
          "Facebook not configured. Set FACEBOOK_PAGE_ID and FACEBOOK_PAGE_ACCESS_TOKEN in .env.local",
      },
      { status: 500 },
    );
  }

  try {
    const { message, imageBase64, link, videoUrl } = await request.json();

    if (!message) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 },
      );
    }

    let postId: string;

    if (videoUrl) {
      // Post with video — download from S3 then upload to FB
      const videoRes = await fetch(videoUrl);
      if (!videoRes.ok) {
        return NextResponse.json(
          { error: "Failed to download video from S3" },
          { status: 500 },
        );
      }
      const videoBuffer = Buffer.from(await videoRes.arrayBuffer());

      const formData = new FormData();
      formData.append(
        "source",
        new Blob([videoBuffer], { type: "video/mp4" }),
        "ad-video.mp4",
      );
      formData.append("description", message);
      formData.append("access_token", FB_PAGE_TOKEN);

      const res = await fetch(
        `https://graph.facebook.com/v21.0/${FB_PAGE_ID}/videos`,
        { method: "POST", body: formData },
      );

      if (!res.ok) {
        const err = await res.json();
        console.error("Facebook video post error:", err);
        return NextResponse.json(
          { error: err.error?.message || "Failed to post video to Facebook" },
          { status: res.status },
        );
      }

      const data = await res.json();
      postId = data.id;
    } else if (imageBase64) {
      // Post with photo
      const imageBuffer = Buffer.from(
        imageBase64.replace(/^data:image\/\w+;base64,/, ""),
        "base64",
      );

      const formData = new FormData();
      formData.append(
        "source",
        new Blob([imageBuffer], { type: "image/jpeg" }),
        "ad-image.jpg",
      );
      formData.append("message", message);
      formData.append("access_token", FB_PAGE_TOKEN);

      const res = await fetch(
        `https://graph.facebook.com/v21.0/${FB_PAGE_ID}/photos`,
        { method: "POST", body: formData },
      );

      if (!res.ok) {
        const err = await res.json();
        console.error("Facebook photo post error:", err);
        return NextResponse.json(
          { error: err.error?.message || "Failed to post photo to Facebook" },
          { status: res.status },
        );
      }

      const data = await res.json();
      postId = data.post_id || data.id;
    } else {
      // Text-only post (with optional link)
      const params: Record<string, string> = {
        message,
        access_token: FB_PAGE_TOKEN,
      };
      if (link) params.link = link;

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
        console.error("Facebook post error:", err);
        return NextResponse.json(
          { error: err.error?.message || "Failed to post to Facebook" },
          { status: res.status },
        );
      }

      const data = await res.json();
      postId = data.id;
    }

    return NextResponse.json({
      success: true,
      postId,
      url: `https://www.facebook.com/${postId}`,
    });
  } catch (err) {
    console.error("Facebook post error:", err);
    return NextResponse.json(
      { error: "Failed to post to Facebook" },
      { status: 500 },
    );
  }
}
