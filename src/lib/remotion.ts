import type { AwsRegion } from "@remotion/lambda/client";
import { supabase } from "./supabase";

const REMOTION_AWS_REGION = (process.env.REMOTION_AWS_REGION ||
  "us-east-1") as AwsRegion;
const REMOTION_FUNCTION_NAME = process.env.REMOTION_FUNCTION_NAME!;
const REMOTION_MHF_SERVE_URL = process.env.REMOTION_MHF_SERVE_URL!;
const REMOTION_WEBHOOK_SECRET = process.env.REMOTION_WEBHOOK_SECRET || "";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "http://localhost:3000");

// Extract bucket name from serve URL: https://{bucket}.s3.{region}.amazonaws.com/...
function getBucketName(): string {
  const match = REMOTION_MHF_SERVE_URL?.match(/https?:\/\/(.+?)\.s3\./);
  return match ? match[1] : "";
}

// Lazy-load heavy Remotion Lambda SDK to avoid cold start timeouts
async function getLambdaClient() {
  const { renderMediaOnLambda, getRenderProgress } = await import(
    "@remotion/lambda/client"
  );
  return { renderMediaOnLambda, getRenderProgress };
}

interface TriggerAdRenderParams {
  inputProps: {
    images: string[];
    headline: string;
    description: string;
    ctaText: string;
    serviceName?: string;
  };
}

/**
 * Create a render job in Supabase and return immediately.
 * The actual Lambda trigger runs in the background via `after()`.
 */
export async function triggerAdRender({ inputProps }: TriggerAdRenderParams) {
  // Create job record
  const { data: job, error: jobError } = await supabase
    .from("ad_render_jobs")
    .insert({
      composition_id: "AdVideo",
      input_props: inputProps,
      status: "pending",
      progress: 0,
    })
    .select()
    .single();

  if (jobError || !job) {
    throw new Error(`Failed to create render job: ${jobError?.message}`);
  }

  return { ...job, status: "pending" };
}

/**
 * Trigger the Lambda render in the background (called via after()).
 * Updates the Supabase job row with render_id on success or error on failure.
 */
export async function triggerLambdaInBackground(jobId: string, inputProps: TriggerAdRenderParams["inputProps"]) {
  try {
    const { renderMediaOnLambda } = await getLambdaClient();

    const renderResult = await renderMediaOnLambda({
      region: REMOTION_AWS_REGION,
      functionName: REMOTION_FUNCTION_NAME,
      serveUrl: REMOTION_MHF_SERVE_URL,
      composition: "AdVideo",
      inputProps,
      codec: "h264",
      maxRetries: 3,
      framesPerLambda: 360,
      webhook: REMOTION_WEBHOOK_SECRET
        ? {
            url: `${SITE_URL}/api/admin/ads/render-webhook`,
            secret: REMOTION_WEBHOOK_SECRET,
            customData: { jobId },
          }
        : undefined,
    });

    await supabase
      .from("ad_render_jobs")
      .update({
        render_id: renderResult.renderId,
        status: "rendering",
        updated_at: new Date().toISOString(),
      })
      .eq("id", jobId);
  } catch (err) {
    console.error("Background Lambda trigger failed:", err);
    await supabase
      .from("ad_render_jobs")
      .update({
        status: "failed",
        error_message: err instanceof Error ? err.message : String(err),
        updated_at: new Date().toISOString(),
      })
      .eq("id", jobId);
  }
}

/**
 * Check render progress from Lambda (polling fallback).
 */
export async function checkAdRenderProgress(renderId: string) {
  const { getRenderProgress } = await getLambdaClient();
  const bucketName = getBucketName();

  if (!bucketName) {
    throw new Error("Cannot determine S3 bucket name from REMOTION_MHF_SERVE_URL");
  }

  const progress = await getRenderProgress({
    renderId,
    bucketName,
    functionName: REMOTION_FUNCTION_NAME,
    region: REMOTION_AWS_REGION,
  });

  return {
    done: progress.done,
    overallProgress: progress.overallProgress,
    outputUrl: progress.outputFile,
    fatalErrorEncountered: progress.fatalErrorEncountered,
    errors: progress.errors,
  };
}

/**
 * Handle successful render completion.
 */
export async function handleAdRenderComplete(
  jobId: string,
  outputUrl: string
) {
  await supabase
    .from("ad_render_jobs")
    .update({
      status: "completed",
      output_url: outputUrl,
      progress: 1,
      updated_at: new Date().toISOString(),
    })
    .eq("id", jobId);
}

/**
 * Handle render failure.
 */
export async function handleAdRenderFailed(
  jobId: string,
  errorMessage: string
) {
  await supabase
    .from("ad_render_jobs")
    .update({
      status: "failed",
      error_message: errorMessage,
      updated_at: new Date().toISOString(),
    })
    .eq("id", jobId);
}
