import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { crewDispatchEmail, sendEmail } from "@/lib/emails";
import { withCronMonitor } from "@/lib/cron-monitor";

export const runtime = "nodejs";
export const maxDuration = 300;

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return withCronMonitor("crew-dispatch", async () => {
  const today = new Date().toISOString().split("T")[0];
  const results: string[] = [];
    const { data: bookings, error: bookErr } = await supabase
      .from("bookings")
      .select("*, crew_members:assigned_crew(id, name, email)")
      .eq("scheduled_date", today)
      .eq("status", "confirmed")
      .not("assigned_crew", "is", null);

    if (bookErr) throw new Error(bookErr.message);
    if (!bookings || bookings.length === 0) {
      return { processed: 0, sent: 0 };
    }

    // Group bookings by crew member
    const crewJobs = new Map<
      string,
      {
        crewName: string;
        crewEmail: string | null;
        jobs: { customerName: string; address: string; notes: string | null }[];
      }
    >();

    for (const booking of bookings) {
      const crew = booking.crew_members as { id: string; name: string; email: string | null } | null;
      if (!crew) continue;

      if (!crewJobs.has(crew.id)) {
        crewJobs.set(crew.id, {
          crewName: crew.name,
          crewEmail: crew.email,
          jobs: [],
        });
      }

      crewJobs.get(crew.id)!.jobs.push({
        customerName: booking.customer_name,
        address: booking.customer_location,
        notes: null,
      });
    }

    // Send dispatch email to each crew member
    for (const [crewId, data] of crewJobs) {
      if (!data.crewEmail) {
        results.push(`SKIP ${data.crewName}: no email`);
        continue;
      }

      try {
        const template = crewDispatchEmail(data.crewName, today, data.jobs);
        await sendEmail(data.crewEmail, template.subject, template.html);
        results.push(`dispatch → ${data.crewName} (${data.jobs.length} jobs)`);
      } catch (err) {
        results.push(`FAIL ${data.crewName}: ${err}`);
        console.error(`Crew dispatch failed for ${crewId}:`, err);
      }
    }

    return {
      processed: results.length,
      sent: results.filter((r) => r.startsWith("dispatch →")).length,
      errors: results.filter((r) => r.includes("FAIL")).length > 0
        ? results.filter((r) => r.includes("FAIL"))
        : undefined,
      results,
    };
  });
}
