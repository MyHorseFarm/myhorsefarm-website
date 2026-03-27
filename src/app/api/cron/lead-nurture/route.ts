import { NextRequest, NextResponse } from "next/server";
import {
  searchContacts,
  createContactNote,
  isSubscribed,
} from "@/lib/hubspot";
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

const MAX_PER_RUN = 150; // Stay within Resend daily limits
const DRIP_DAYS = [0, 3, 7, 14, 21]; // Days after step 1 for each step

const API_BASE = "https://api.hubapi.com";

type Segment = "equestrian" | "fitness" | "mhf";
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

  const results: string[] = [];
  let emailsSent = 0;
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
      ["email", "firstname", "lastname"],
    );

    results.push(`Found ${contacts.length} contacts with NEW status`);

    for (const contact of contacts) {
      if (emailsSent >= MAX_PER_RUN) break;

      const email = contact.properties.email;
      const firstname = contact.properties.firstname || "";
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

        await sendEmail(email, subject, html);

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
  } catch (err) {
    results.push(
      `Fatal: ${err instanceof Error ? err.message : String(err)}`,
    );
  }

  return NextResponse.json({ ok: true, emailsSent, results });
}
