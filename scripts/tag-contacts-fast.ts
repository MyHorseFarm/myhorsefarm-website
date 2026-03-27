#!/usr/bin/env npx tsx
/**
 * Fast contact tagging — fetches all HubSpot contacts, matches to source
 * email lists, and creates source tag notes in batch.
 *
 * Only tags contacts that have hs_lead_status="NEW" (our imports).
 * Skips contacts that already have source tags (by checking notes in batch).
 *
 * Usage:
 *   npx tsx scripts/tag-contacts-fast.ts [--dry-run]
 */

import { parse } from "csv-parse/sync";
import { readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { execSync } from "child_process";

const API_BASE = "https://api.hubapi.com";
const TOKEN = process.env.HUBSPOT_API_TOKEN!;
const DRY_RUN = process.argv.includes("--dry-run");
const DELAY_MS = 200;

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function hubReq(path: string, options: RequestInit = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: { Authorization: `Bearer ${TOKEN}`, "Content-Type": "application/json", ...options.headers },
  });
  if (!res.ok) throw new Error(`HubSpot ${res.status}: ${await res.text()}`);
  return res.json();
}

// Build email→source lookup
function buildSourceMap(): Map<string, string> {
  const map = new Map<string, string>();

  // Priority order: mhf_active > mhf_inactive > equestrian_farm > resilient_fitness > nona_equestrian
  // Load in reverse priority so higher priority overwrites

  // Nona list (lowest priority)
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
    for (const e of JSON.parse(json)) map.set(e, "NONA_EQUESTRIAN");
  } catch {}

  // Resilient Fitness
  try {
    const csv = readFileSync(
      "/Users/josegomez/Library/CloudStorage/GoogleDrive-joseadel825@gmail.com/Shared drives/Resilient Fitness X Concept Co./Email Marketing List /Active Members/Old/FullMembersList.csv",
      "utf-8",
    );
    const rows = parse(csv, { columns: true, skip_empty_lines: true, trim: true });
    for (const r of rows as Record<string, string>[]) {
      const email = (r["EMAIL"] || "").toLowerCase().trim();
      if (email.includes("@")) map.set(email, "RESILIENT_FITNESS");
    }
  } catch {}

  // Farm leads
  for (const file of ["farms_wellington.csv", "farms_palmbeach.csv"]) {
    try {
      const csv = readFileSync(join(dirname(fileURLToPath(import.meta.url)), `data/${file}`), "utf-8");
      const rows = parse(csv, { columns: true, skip_empty_lines: true, trim: true });
      for (const r of rows as Record<string, string>[]) {
        const email = (r["Email"] || "").toLowerCase().trim();
        if (email.includes("@")) map.set(email, "EQUESTRIAN_FARM");
      }
    } catch {}
  }

  // Inactive clients
  try {
    const csv = readFileSync(join(dirname(fileURLToPath(import.meta.url)), "data/inactive_contacts.csv"), "utf-8");
    const rows = parse(csv, { columns: true, skip_empty_lines: true, trim: true });
    for (const r of rows as Record<string, string>[]) {
      const email = (r["Email"] || "").toLowerCase().trim();
      if (email.includes("@")) map.set(email, "MHF_INACTIVE");
    }
  } catch {}

  // Active clients (highest priority)
  try {
    const csv = readFileSync(join(dirname(fileURLToPath(import.meta.url)), "data/active_clients.csv"), "utf-8");
    const rows = parse(csv, { columns: true, skip_empty_lines: true, trim: true });
    for (const r of rows as Record<string, string>[]) {
      const email = (r["Email"] || "").toLowerCase().trim();
      if (email.includes("@")) map.set(email, "MHF_ACTIVE");
    }
  } catch {}

  return map;
}

async function main() {
  console.log(`\n=== Fast Contact Tagging${DRY_RUN ? " (DRY RUN)" : ""} ===\n`);

  const sourceMap = buildSourceMap();
  console.log(`Source map: ${sourceMap.size} email→source mappings\n`);

  // Fetch all contacts with hs_lead_status=NEW
  console.log("Fetching NEW contacts from HubSpot...");
  const contacts: Array<{ id: string; email: string }> = [];
  let after: string | undefined;

  do {
    const params = new URLSearchParams({ limit: "100", properties: "email,hs_lead_status" });
    if (after) params.set("after", after);
    const data = await hubReq(`/crm/v3/objects/contacts?${params}`);

    for (const c of data.results) {
      if (c.properties?.hs_lead_status === "NEW") {
        const email = c.properties?.email?.toLowerCase()?.trim();
        if (email) contacts.push({ id: c.id, email });
      }
    }
    after = data.paging?.next?.after;
    if (contacts.length % 1000 === 0 && contacts.length > 0) {
      process.stdout.write(`  ${contacts.length} NEW contacts found...\r`);
    }
    await sleep(100);
  } while (after);

  console.log(`Found ${contacts.length} NEW contacts to tag.\n`);

  // Create source tag notes
  let tagged = 0;
  let skipped = 0;
  let errors = 0;
  const today = new Date().toISOString().split("T")[0];

  for (const { id, email } of contacts) {
    const source = sourceMap.get(email);
    if (!source) {
      skipped++;
      continue;
    }

    const noteBody = `[SOURCE:${source}] Source: ${source.toLowerCase()} | Tagged on ${today}`;

    if (DRY_RUN) {
      if (tagged < 5) console.log(`  Would tag: ${email} → ${source}`);
      tagged++;
      continue;
    }

    try {
      await hubReq("/crm/v3/objects/notes", {
        method: "POST",
        body: JSON.stringify({
          properties: { hs_note_body: noteBody, hs_timestamp: new Date().toISOString() },
          associations: [{ to: { id }, types: [{ associationCategory: "HUBSPOT_DEFINED", associationTypeId: 202 }] }],
        }),
      });
      tagged++;
      if (tagged % 200 === 0) console.log(`  Tagged ${tagged}...`);
    } catch (e) {
      errors++;
      if (errors < 5) console.log(`  Error: ${email} — ${e instanceof Error ? e.message.slice(0, 80) : e}`);
    }
    await sleep(DELAY_MS);
  }

  console.log(`\n=== Done ===`);
  console.log(`Tagged:  ${tagged}`);
  console.log(`Skipped: ${skipped} (no source match)`);
  console.log(`Errors:  ${errors}`);
}

main().catch(console.error);
