import { NextRequest, NextResponse } from "next/server";
import { withCronMonitor } from "@/lib/cron-monitor";
import { submitMultipleUrls } from "@/lib/google-indexing";
import { supabase } from "@/lib/supabase";

export const maxDuration = 60;

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return withCronMonitor("seo-agent", async () => {
    // Fetch sitemap
    const sitemapRes = await fetch("https://www.myhorsefarm.com/sitemap.xml");
    const sitemapText = await sitemapRes.text();

    // Parse URLs and lastmod from sitemap XML
    const urlRegex =
      /<url>\s*<loc>(.*?)<\/loc>(?:\s*<lastmod>(.*?)<\/lastmod>)?/g;
    const sitemapUrls: { url: string; lastmod: string }[] = [];
    let match;
    while ((match = urlRegex.exec(sitemapText)) !== null) {
      sitemapUrls.push({ url: match[1], lastmod: match[2] || "" });
    }

    // Check which URLs need submission
    const { data: existingSubmissions } = await supabase
      .from("seo_submissions")
      .select("url, last_submitted, last_modified");

    const submissionMap = new Map(
      (existingSubmissions || []).map((s: { url: string; last_submitted: string; last_modified: string }) => [s.url, s]),
    );

    const urlsToSubmit: string[] = [];
    for (const { url, lastmod } of sitemapUrls) {
      const existing = submissionMap.get(url);
      if (!existing || existing.last_modified !== lastmod) {
        urlsToSubmit.push(url);
      }
    }

    if (urlsToSubmit.length === 0) {
      return { processed: 0, sent: 0, message: "All pages already submitted" };
    }

    // Submit to Google (max 200/day quota, cap at 50 per run)
    const toSubmit = urlsToSubmit.slice(0, 50);
    const results = await submitMultipleUrls(toSubmit);

    // Record submissions
    const now = new Date().toISOString();
    for (const result of results) {
      if (result.status === "success") {
        const sitemapEntry = sitemapUrls.find((s) => s.url === result.url);
        await supabase.from("seo_submissions").upsert(
          {
            url: result.url,
            last_submitted: now,
            last_modified: sitemapEntry?.lastmod || now,
            status: "submitted",
          },
          { onConflict: "url" },
        );
      }
    }

    const successful = results.filter((r) => r.status === "success").length;
    const failed = results.filter((r) => r.status === "error").length;
    const errors = results
      .filter((r) => r.status === "error")
      .map((r) => `${r.url}: ${r.error}`);

    return {
      processed: toSubmit.length,
      sent: successful,
      failed,
      errors: errors.length > 0 ? errors : undefined,
      message: `Submitted ${successful}/${toSubmit.length} URLs to Google Indexing API`,
    };
  });
}
