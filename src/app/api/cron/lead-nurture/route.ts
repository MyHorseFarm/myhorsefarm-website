import { NextRequest, NextResponse } from "next/server";
import {
  searchContacts,
  createContactNote,
  isSubscribed,
} from "@/lib/hubspot";
import { supabase } from "@/lib/supabase";
import {
  getActiveTest,
  pickVariant,
  getVariantSubject,
  recordSend,
} from "@/lib/ab-testing";
import { withCronMonitor } from "@/lib/cron-monitor";
import {
  sendEmail,
  createUnsubscribeUrl,
  nurtureEquestrian1,
  nurtureEquestrian2,
  nurtureEquestrian3,
  nurtureEquestrian4,
  nurtureEquestrian5,
  nurtureFitness1,
  nurtureFitness2,
  nurtureFitness3,
  nurtureFitness4,
  nurtureFitness5,
  nurtureMHF1,
  nurtureMHF2,
  nurtureMHF3,
  nurtureMHF4,
  nurtureMHF5,
} from "@/lib/emails";

export const runtime = "nodejs";
export const maxDuration = 300;

/**
 * Lead Nurture Cron — runs daily at 10:00 AM
 *
 * Strategy: Instead of scanning all 18,900 contacts each run, we use
 * HubSpot's hs_lead_status to find contacts that haven't been nurtured yet.
 * We process them in batches of MAX_PER_RUN, tag them with nurture step notes,
 * and advance one step per run day.
 *
 * Drip schedule (days between emails):
 *   Step 1: Day 0 (first contact)
 *   Step 2: Day 3
 *   Step 3: Day 7
 *   Step 4: Day 14
 *   Step 5: Day 21
 */

const MAX_PER_RUN = 80; // Stay within Resend free tier (100/day, leave room for other crons)
const MAX_RESENDS = 20; // Bonus budget for step-1 non-opener re-sends
const DRIP_DAYS = [0, 3, 7, 14, 21]; // Days after step 1 for each step

const API_BASE = "https://api.hubapi.com";

type Segment = "equestrian" | "fitness" | "mhf";

const RESEND_SUBJECTS: Record<Segment, string> = {
  equestrian: "Did you see this? $50 off farm services",
  fitness: "Your Wellington neighbor perk — $50 off",
  mhf: "$50 still waiting for you",
};
type EmailFn = (firstname: string, unsubscribeUrl: string) => { subject: string; html: string };

const EMAIL_MAP: Record<Segment, EmailFn[]> = {
  equestrian: [nurtureEquestrian1, nurtureEquestrian2, nurtureEquestrian3, nurtureEquestrian4, nurtureEquestrian5],
  fitness: [nurtureFitness1, nurtureFitness2, nurtureFitness3, nurtureFitness4, nurtureFitness5],
  mhf: [nurtureMHF1, nurtureMHF2, nurtureMHF3, nurtureMHF4, nurtureMHF5],
};

async function hubReq(path: string, options: RequestInit = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${process.env.HUBSPOT_API_TOKEN}`,
      "Content-Type": "application/json",
      ...options.headers,
    },
  });
  if (!res.ok) throw new Error(`HubSpot ${res.status}: ${await res.text()}`);
  return res.json();
}

async function getContactNotes(contactId: string): Promise<string[]> {
  try {
    const assocData = await hubReq(
      `/crm/v3/objects/contacts/${contactId}/associations/notes`,
    ).catch(() => ({ results: [] }));

    if (!assocData.results?.length) return [];

    const noteIds = assocData.results.slice(0, 50).map((r: { id: string }) => r.id);
    const batch = await hubReq("/crm/v3/objects/notes/batch/read", {
      method: "POST",
      body: JSON.stringify({
        inputs: noteIds.map((id: string) => ({ id })),
        properties: ["hs_note_body"],
      }),
    }).catch(() => ({ results: [] }));

    return (batch.results || []).map(
      (n: { properties: Record<string, string> }) => n.properties?.hs_note_body || "",
    );
  } catch {
    return [];
  }
}

function detectSegment(notes: string[]): Segment | null {
  for (const note of notes) {
    if (note.includes("[SOURCE:NONA_EQUESTRIAN]") || note.includes("[SOURCE:EQUESTRIAN_FARM]"))
      return "equestrian";
    if (note.includes("[SOURCE:RESILIENT_FITNESS]")) return "fitness";
    if (note.includes("[SOURCE:MHF_ACTIVE]") || note.includes("[SOURCE:MHF_INACTIVE]"))
      return "mhf";
  }
  return null;
}

function getLastNurtureStep(notes: string[]): number {
  let maxStep = 0;
  for (const note of notes) {
    const match = note.match(/\[AUTO:NURTURE_(\d)\]/);
    if (match) {
      const step = parseInt(match[1], 10);
      if (step > maxStep) maxStep = step;
    }
  }
  return maxStep;
}

function getStepDate(notes: string[], step: number): Date | null {
  for (const note of notes) {
    if (note.includes(`[AUTO:NURTURE_${step}]`)) {
      const match = note.match(/(\d{4}-\d{2}-\d{2}T[\d:.]+Z)/);
      if (match) return new Date(match[1]);
    }
  }
  return null;
}

function getSourceTagDate(notes: string[]): Date | null {
  for (const note of notes) {
    if (note.includes("[SOURCE:")) {
      const match = note.match(/Tagged on (\d{4}-\d{2}-\d{2})/);
      if (match) return new Date(match[1] + "T00:00:00Z");
    }
  }
  return null;
}

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return withCronMonitor("lead-nurture", async () => {
  const results: string[] = [];
  let emailsSent = 0;
  let resendCount = 0;
  const now = new Date();

  try {
    // Fetch contacts with lead status "NEW" — these are our import targets
    const contacts = await searchContacts(
      [
        {
          filters: [
            { propertyName: "hs_lead_status", operator: "EQ", value: "NEW" },
          ],
        },
      ],
      ["email", "firstname", "lastname", "phone"],
      200, // Cap contacts fetched per run to avoid excessive API calls
    );

    results.push(`Found ${contacts.length} contacts with NEW status`);

    for (const contact of contacts) {
      if (emailsSent >= MAX_PER_RUN) break;

      const email = contact.properties.email;
      const firstname = contact.properties.firstname || "";
      const _phone = contact.properties.phone || "";
      if (!email) continue;

      try {
        const notes = await getContactNotes(contact.id);

        // Must have a source tag
        const segment = detectSegment(notes);
        if (!segment) continue;

        // Check which step they're on
        const lastStep = getLastNurtureStep(notes);

        if (lastStep >= 5) {
          // Nurture complete — update lead status to OPEN
          try {
            await hubReq(`/crm/v3/objects/contacts/${contact.id}`, {
              method: "PATCH",
              body: JSON.stringify({ properties: { hs_lead_status: "OPEN" } }),
            });
          } catch { /* non-fatal */ }
          continue;
        }

        const nextStep = lastStep + 1;

        // Check timing — is it time for the next step?
        if (nextStep > 1) {
          const step1Date = getStepDate(notes, 1) || getSourceTagDate(notes);
          if (!step1Date) continue;

          const daysSinceStart = Math.floor(
            (now.getTime() - step1Date.getTime()) / (1000 * 60 * 60 * 24),
          );

          if (daysSinceStart < DRIP_DAYS[nextStep - 1]) continue; // Not time yet

          // Also check last email was sent at least 2 days ago
          const lastStepDate = getStepDate(notes, lastStep);
          if (lastStepDate) {
            const daysSinceLast = Math.floor(
              (now.getTime() - lastStepDate.getTime()) / (1000 * 60 * 60 * 24),
            );
            if (daysSinceLast < 2) continue;
          }
        }

        // Check subscription
        if (!(await isSubscribed(email))) continue;

        // Get and send the email
        const emailFn = EMAIL_MAP[segment][nextStep - 1];
        if (!emailFn) continue;

        const unsubUrl = createUnsubscribeUrl(email);
        const { subject, html } = emailFn(firstname, unsubUrl);

        // A/B test: override subject if active test exists for this template
        const templateKey = `nurture_${segment}_${nextStep}`;
        let finalSubject = subject;
        let abVariant: "a" | "b" | null = null;
        let abTest: Awaited<ReturnType<typeof getActiveTest>> = null;
        try {
          abTest = await getActiveTest(templateKey);
          if (abTest) {
            abVariant = pickVariant(abTest);
            finalSubject = getVariantSubject(abTest, abVariant);
          }
        } catch { /* A/B test lookup non-fatal */ }

        const emailId = await sendEmail(email, finalSubject, html);

        // Record A/B send if test is active
        if (abTest && abVariant) {
          try {
            await recordSend(abTest.id, email, abVariant, emailId);
          } catch { /* recording non-fatal */ }
        }

        // Tag the contact
        await createContactNote(
          contact.id,
          `[AUTO:NURTURE_${nextStep}] Nurture email ${nextStep}/5 (${segment}) sent to ${email} on ${now.toISOString()}`,
        );

        emailsSent++;
        if (emailsSent % 50 === 0) {
          results.push(`...sent ${emailsSent} so far`);
        }
      } catch (err) {
        results.push(
          `Error ${email}: ${err instanceof Error ? err.message : String(err)}`,
        );
      }
    }

    results.push(`Complete: ${emailsSent} nurture emails sent`);

    // ---------------------------------------------------------------
    // Re-send step 1 to non-openers (bonus budget, doesn't eat into MAX_PER_RUN)
    // ---------------------------------------------------------------
    try {
      const threeDaysAgo = new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString();

      // Find all contacts who received a step-1 nurture email 3+ days ago
      // Match by tag prefix instead of fragile subject-line matching
      const { data: step1Sent } = await supabase
        .from("email_events")
        .select("recipient_email")
        .eq("event_type", "sent")
        .or("subject.ilike.%$50 off%,subject.ilike.%nurture step 1%,tags.cs.{nurture_step_1}")
        .lte("event_at", threeDaysAgo);

      if (step1Sent?.length) {
        // Deduplicate recipient emails
        const candidates = [...new Set(step1Sent.map((e: { recipient_email: string }) => e.recipient_email))];

        // Find which of those have opened ANY email (filter them out)
        const { data: openers } = await supabase
          .from("email_events")
          .select("recipient_email")
          .eq("event_type", "opened")
          .in("recipient_email", candidates);

        const openerSet = new Set((openers || []).map((e: { recipient_email: string }) => e.recipient_email));
        const nonOpeners = candidates.filter((e: string) => !openerSet.has(e));

        results.push(`Step-1 non-openers found: ${nonOpeners.length}`);

        // Cap non-opener processing to avoid HubSpot rate limits
        const cappedNonOpeners = nonOpeners.slice(0, MAX_RESENDS);

        for (const recipientEmail of cappedNonOpeners) {
          if (resendCount >= MAX_RESENDS) break;

          try {
            // Look up contact in HubSpot
            const matches = await searchContacts(
              [{ filters: [{ propertyName: "email", operator: "EQ", value: recipientEmail }] }],
              ["email", "firstname"],
            );
            if (!matches.length) continue;

            const contact = matches[0];
            const notes = await getContactNotes(contact.id);

            // Must have NURTURE_1 tag but NOT NURTURE_1_RESEND tag
            if (!notes.some((n: string) => n.includes("[AUTO:NURTURE_1]"))) continue;
            if (notes.some((n: string) => n.includes("[AUTO:NURTURE_1_RESEND]"))) continue;

            const segment = detectSegment(notes);
            if (!segment) continue;

            if (!(await isSubscribed(recipientEmail))) continue;

            // Re-send step 1 with alternate subject
            const emailFn = EMAIL_MAP[segment][0];
            if (!emailFn) continue;

            const firstname = contact.properties.firstname || "";
            const unsubUrl = createUnsubscribeUrl(recipientEmail);
            const { html } = emailFn(firstname, unsubUrl);
            const resendSubject = RESEND_SUBJECTS[segment];

            await sendEmail(recipientEmail, resendSubject, html);

            await createContactNote(
              contact.id,
              `[AUTO:NURTURE_1_RESEND] Re-sent step 1 (${segment}) to ${recipientEmail} on ${now.toISOString()} — non-opener re-engagement`,
            );

            resendCount++;
          } catch (err) {
            results.push(
              `Resend error ${recipientEmail}: ${err instanceof Error ? err.message : String(err)}`,
            );
          }
        }
      }

      results.push(`Step-1 re-sends: ${resendCount}`);
    } catch (err) {
      results.push(
        `Resend phase error: ${err instanceof Error ? err.message : String(err)}`,
      );
    }
  } catch (err) {
    results.push(
      `Fatal: ${err instanceof Error ? err.message : String(err)}`,
    );
  }

  return {
    processed: results.length,
    sent: emailsSent,
    errors: results.filter((r) => r.toLowerCase().includes("error") || r.toLowerCase().includes("fatal")).length > 0
      ? results.filter((r) => r.toLowerCase().includes("error") || r.toLowerCase().includes("fatal"))
      : undefined,
    emailsSent,
    resendCount,
    results,
  };
  });
}
