#!/usr/bin/env npx tsx
/**
 * Tag all HubSpot contacts with their import source via notes.
 * This enables the lead-nurture cron to segment contacts.
 *
 * Usage:
 *   npx tsx scripts/tag-contacts-by-source.ts [--dry-run]
 */

import { parse } from "csv-parse/sync";
import { readFileSync } from "fs";
import { join } from "path";
import { execSync } from "child_process";

const API_BASE = "https://api.hubapi.com";
const TOKEN = process.env.HUBSPOT_API_TOKEN!;
const DRY_RUN = process.argv.includes("--dry-run");
const DELAY_MS = 150;
const _BATCH_SIZE = 100;

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function hubReq(path: string, options: RequestInit = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: { Authorization: `Bearer ${TOKEN}`, "Content-Type": "application/json", ...options.headers },
  });
  if (!res.ok) throw new Error(`HubSpot ${res.status}: ${await res.text()}`);
  return res.json();
}

// Load email sets from each source
function loadCSVEmails(path: string, emailCol: string): Set<string> {
  try {
    const csv = readFileSync(path, "utf-8");
    const rows = parse(csv, { columns: true, skip_empty_lines: true, trim: true });
    const emails = new Set<string>();
    for (const r of rows as Record<string, string>[]) {
      const email = (r[emailCol] || "").toLowerCase().trim();
      if (email.includes("@")) emails.add(email);
    }
    return emails;
  } catch {
    return new Set();
  }
}

function loadXLSXEmails(): Set<string> {
  try {
    const json = execSync(
      `python3 -c "
import openpyxl, json
wb = openpyxl.load_workbook('/Users/josegomez/Downloads/deduplicated_valid_emails.xlsx', read_only=True)
ws = wb.active
emails = []
for row in ws.iter_rows(min_row=2, values_only=True):
    if len(row) >= 3 and row[2] and '@' in str(row[2]):
        emails.append(str(row[2]).lower().strip())
print(json.dumps(emails))
"`,
      { maxBuffer: 20 * 1024 * 1024 },
    ).toString();
    return new Set(JSON.parse(json));
  } catch {
    return new Set();
  }
}

async function main() {
  console.log(`\n=== Tag Contacts by Source${DRY_RUN ? " (DRY RUN)" : ""} ===\n`);

  // Load source email sets
  const activeEmails = loadCSVEmails(join(__dirname, "data/active_clients.csv"), "Email");
  const inactiveEmails = loadCSVEmails(join(__dirname, "data/inactive_contacts.csv"), "Email");
  const rfEmails = loadCSVEmails(
    "/Users/josegomez/Library/CloudStorage/GoogleDrive-joseadel825@gmail.com/Shared drives/Resilient Fitness X Concept Co./Email Marketing List /Active Members/Old/FullMembersList.csv",
    "EMAIL",
  );
  const nonaEmails = loadXLSXEmails();
  const farmEmails = new Set([
    ...loadCSVEmails(join(__dirname, "data/farms_wellington.csv"), "Email"),
    ...loadCSVEmails(join(__dirname, "data/farms_palmbeach.csv"), "Email"),
  ]);

  console.log(`Active clients: ${activeEmails.size}`);
  console.log(`Inactive clients: ${inactiveEmails.size}`);
  console.log(`Resilient Fitness: ${rfEmails.size}`);
  console.log(`Nona equestrian list: ${nonaEmails.size}`);
  console.log(`Farm leads: ${farmEmails.size}\n`);

  // Determine source for each email (priority: active > inactive > farm > RF > nona)
  function getSource(email: string): string {
    if (activeEmails.has(email)) return "mhf_active";
    if (inactiveEmails.has(email)) return "mhf_inactive";
    if (farmEmails.has(email)) return "equestrian_farm";
    if (rfEmails.has(email)) return "resilient_fitness";
    if (nonaEmails.has(email)) return "nona_equestrian";
    return "unknown";
  }

  // Fetch all HubSpot contacts
  console.log("Fetching all HubSpot contacts...");
  const contacts: Array<{ id: string; email: string }> = [];
  let after: string | undefined;
  do {
    // Use list endpoint instead of search (search requires filters)
    const params = new URLSearchParams({ limit: "100", properties: "email" });
    if (after) params.set("after", after);
    const data = await hubReq(`/crm/v3/objects/contacts?${params}`);
    for (const c of data.results) {
      const email = c.properties?.email?.toLowerCase()?.trim();
      if (email) contacts.push({ id: c.id, email });
    }
    after = data.paging?.next?.after;
    await sleep(100);
  } while (after);
  console.log(`Found ${contacts.length} contacts.\n`);

  // Tag each contact with a source note (check for existing tag first)
  const TAG_PREFIX = "[SOURCE:";
  let tagged = 0;
  let skipped = 0;
  let errors = 0;
  const sourceCounts: Record<string, number> = {};

  for (let i = 0; i < contacts.length; i++) {
    const { id, email } = contacts[i];
    const source = getSource(email);
    sourceCounts[source] = (sourceCounts[source] || 0) + 1;

    if (source === "unknown") {
      skipped++;
      continue;
    }

    try {
      // Check if already tagged
      const notesData = await hubReq(
        `/crm/v3/objects/contacts/${id}/associations/notes`,
      ).catch(() => ({ results: [] }));

      if (notesData.results?.length > 0) {
        const noteIds = notesData.results.map((r: { id: string }) => r.id);
        const batchBody = { inputs: noteIds.slice(0, 50).map((nid: string) => ({ id: nid })), properties: ["hs_note_body"] };
        const notesBatch = await hubReq("/crm/v3/objects/notes/batch/read", {
          method: "POST",
          body: JSON.stringify(batchBody),
        }).catch(() => ({ results: [] }));

        const alreadyTagged = notesBatch.results?.some((n: { properties: Record<string, string> }) =>
          n.properties?.hs_note_body?.includes(TAG_PREFIX),
        );
        if (alreadyTagged) {
          skipped++;
          if (i % 500 === 0) process.stdout.write(`  Progress: ${i}/${contacts.length} (tagged: ${tagged}, skipped: ${skipped})\r`);
          await sleep(DELAY_MS);
          continue;
        }
      }

      const tag = `${TAG_PREFIX}${source.toUpperCase()}]`;
      const noteBody = `${tag} Source: ${source} | Tagged on ${new Date().toISOString().split("T")[0]}`;

      if (DRY_RUN) {
        if (tagged < 10) console.log(`  Would tag ${email} → ${source}`);
        tagged++;
      } else {
        await hubReq("/crm/v3/objects/notes", {
          method: "POST",
          body: JSON.stringify({
            properties: { hs_note_body: noteBody, hs_timestamp: new Date().toISOString() },
            associations: [{ to: { id }, types: [{ associationCategory: "HUBSPOT_DEFINED", associationTypeId: 202 }] }],
          }),
        });
        tagged++;
        if (tagged % 100 === 0) console.log(`  Tagged ${tagged} contacts...`);
      }
    } catch (_e) {
      errors++;
    }
    await sleep(DELAY_MS);
  }

  console.log(`\n=== Tagging Complete ===`);
  console.log(`Tagged:   ${tagged}`);
  console.log(`Skipped:  ${skipped}`);
  console.log(`Errors:   ${errors}`);
  console.log(`\nBreakdown by source:`);
  for (const [src, count] of Object.entries(sourceCounts).sort((a, b) => b[1] - a[1])) {
    console.log(`  ${src}: ${count}`);
  }
}

main().catch(console.error);
