import { NextRequest, NextResponse } from "next/server";
import { withCronMonitor } from "@/lib/cron-monitor";
import { google } from "googleapis";

export const maxDuration = 60;

const SERVICE_POSTS = [
  {
    summary:
      "Need manure removal? My Horse Farm offers scheduled pickups with leak-proof bins for Wellington, Loxahatchee & Royal Palm Beach barns. Call (561) 576-7667 for a free quote!",
    cta: "CALL",
    url: "https://www.myhorsefarm.com/manure-removal",
  },
  {
    summary:
      "Post-season farm repairs available now! Fence repair, barn maintenance, arena resurfacing, and driveway grading. Licensed & insured. Call (561) 576-7667.",
    cta: "CALL",
    url: "https://www.myhorsefarm.com/repairs",
  },
  {
    summary:
      "Junk removal with our 40-yard dump trailer, skid steer & full crew. Construction debris, green waste, property cleanouts. Same-day service! Call (561) 576-7667.",
    cta: "CALL",
    url: "https://www.myhorsefarm.com/junk-removal",
  },
  {
    summary:
      "Sod installation for horse paddocks & pastures. Bahia, Bermuda, St. Augustine & Zoysia grass. Professional grading & installation. Call (561) 576-7667.",
    cta: "CALL",
    url: "https://www.myhorsefarm.com/sod-installation",
  },
  {
    summary:
      "Fill dirt delivery for arena bases, paddock leveling & driveway repair. Clean fill, topsoil, sand, limerock available. Call (561) 576-7667 for pricing.",
    cta: "CALL",
    url: "https://www.myhorsefarm.com/fill-dirt",
  },
  {
    summary:
      "Farm repairs & maintenance in Wellington & Loxahatchee. Fence repair, gate fixes, barn maintenance, pressure washing. One call handles everything! (561) 576-7667",
    cta: "CALL",
    url: "https://www.myhorsefarm.com/repairs/wellington",
  },
];

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return withCronMonitor("gbp-post", async () => {
    const accountId = process.env.GBP_ACCOUNT_ID;
    const locationId = process.env.GBP_LOCATION_ID;

    if (!accountId || !locationId || !process.env.GOOGLE_SERVICE_ACCOUNT_JSON) {
      return {
        processed: 0,
        sent: 0,
        message:
          "GBP not configured — set GBP_ACCOUNT_ID, GBP_LOCATION_ID, GOOGLE_SERVICE_ACCOUNT_JSON",
      };
    }

    // Pick a post based on the week number (rotates through services)
    const weekNumber = Math.floor(Date.now() / (7 * 24 * 60 * 60 * 1000));
    const post = SERVICE_POSTS[weekNumber % SERVICE_POSTS.length];

    const credentials = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_JSON);
    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: ["https://www.googleapis.com/auth/business.manage"],
    });
    const authClient = await auth.getClient();

    // Create GBP post via REST API
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const response = await (authClient as any).request({
      url: `https://mybusiness.googleapis.com/v4/accounts/${accountId}/locations/${locationId}/localPosts`,
      method: "POST",
      data: {
        languageCode: "en",
        summary: post.summary,
        callToAction: {
          actionType: post.cta,
          url: post.url,
        },
        topicType: "STANDARD",
      },
    });

    return {
      processed: 1,
      sent: 1,
      message: `Posted to GBP: "${post.summary.substring(0, 50)}..."`,
      postId: response.data?.name,
    };
  });
}
