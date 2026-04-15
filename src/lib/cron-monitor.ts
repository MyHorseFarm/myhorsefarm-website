import { NextResponse } from "next/server";
import { sendEmail, cronFailureAlertEmail } from "@/lib/emails";

const ALERT_TO = process.env.EMAIL_ADMIN_NOTIFICATION || "manureservice@gmail.com";

export type CronResult = {
  sent?: number;
  processed?: number;
  errors?: string[];
  [key: string]: unknown;
};

/**
 * Wraps a cron job function with error monitoring.
 *
 * On failure: sends an alert email to the admin notification address
 * On success: returns the result as a JSON response
 *
 * Usage:
 *   return withCronMonitor("welcome-sequence", async () => {
 *     // ... your cron logic ...
 *     return { sent: 3, processed: 10, results };
 *   });
 */
export async function withCronMonitor(
  cronName: string,
  fn: () => Promise<CronResult>,
): Promise<NextResponse> {
  const start = Date.now();

  try {
    const result = await fn();
    const durationMs = Date.now() - start;

    // Check for errors in the result
    if (result.errors && result.errors.length > 0) {
      // Partial failure — cron ran but had some errors
      try {
        const template = cronFailureAlertEmail(
          cronName,
          `Cron completed with ${result.errors.length} error(s):\n${result.errors.join("\n")}`,
          new Date().toISOString(),
        );
        await sendEmail(ALERT_TO, template.subject, template.html);
      } catch {
        // Don't let alert failure break the response
        console.error(`[cron-monitor] Failed to send partial-failure alert for ${cronName}`);
      }
    }

    return NextResponse.json({
      ok: true,
      ...result,
      durationMs,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    const durationMs = Date.now() - start;
    const error = err instanceof Error ? err : new Error(String(err));

    console.error(`[cron-monitor] ${cronName} FAILED after ${durationMs}ms: ${error.message}`);
    if (error.stack) console.error(`[cron-monitor] ${cronName} stack:`, error.stack);

    // Send alert email
    try {
      const template = cronFailureAlertEmail(
        cronName,
        error.message,
        new Date().toISOString(),
        error.stack,
      );
      await sendEmail(ALERT_TO, template.subject, template.html);
    } catch (alertErr) {
      // If we can't even send the alert, log it and move on
      console.error(`[cron-monitor] Failed to send alert email for ${cronName}:`, alertErr);
    }

    return NextResponse.json(
      {
        ok: false,
        error: error.message,
        cronName,
        durationMs,
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    );
  }
}
