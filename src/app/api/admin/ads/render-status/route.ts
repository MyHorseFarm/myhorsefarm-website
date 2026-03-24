import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import {
  checkAdRenderProgress,
  handleAdRenderComplete,
  handleAdRenderFailed,
} from "@/lib/remotion";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  // Auth check
  const auth = req.headers.get("authorization");
  if (auth !== `Bearer ${process.env.ADMIN_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const jobId = req.nextUrl.searchParams.get("jobId");
  if (!jobId) {
    return NextResponse.json({ error: "Missing jobId" }, { status: 400 });
  }

  try {
    // Get job from DB
    const { data: job, error } = await supabase
      .from("ad_render_jobs")
      .select("*")
      .eq("id", jobId)
      .single();

    if (error || !job) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }

    // If already completed or failed, return as-is
    if (job.status === "completed" || job.status === "failed") {
      return NextResponse.json({ job });
    }

    // Poll Lambda for progress
    if (job.render_id) {
      const progress = await checkAdRenderProgress(job.render_id);

      if (progress.done && progress.outputUrl) {
        await handleAdRenderComplete(job.id, progress.outputUrl);
        return NextResponse.json({
          job: {
            ...job,
            status: "completed",
            output_url: progress.outputUrl,
            progress: 1,
          },
        });
      }

      if (progress.fatalErrorEncountered) {
        const errMsg =
          progress.errors?.map((e) => e.message).join("; ") ||
          "Render failed";
        await handleAdRenderFailed(job.id, errMsg);
        return NextResponse.json({
          job: { ...job, status: "failed", error_message: errMsg },
        });
      }

      // Update progress
      await supabase
        .from("ad_render_jobs")
        .update({
          progress: progress.overallProgress,
          updated_at: new Date().toISOString(),
        })
        .eq("id", job.id);

      return NextResponse.json({
        job: { ...job, progress: progress.overallProgress },
      });
    }

    // Job is still pending (Lambda trigger running in background)
    // If it's been pending for more than 3 minutes, mark as failed
    const createdAt = new Date(job.created_at).getTime();
    const now = Date.now();
    if (job.status === "pending" && now - createdAt > 3 * 60 * 1000) {
      const { handleAdRenderFailed } = await import("@/lib/remotion");
      await handleAdRenderFailed(job.id, "Lambda trigger timed out — please try again");
      return NextResponse.json({
        job: { ...job, status: "failed", error_message: "Lambda trigger timed out — please try again" },
      });
    }

    return NextResponse.json({ job });
  } catch (err) {
    console.error("Render status error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to check status" },
      { status: 500 }
    );
  }
}
