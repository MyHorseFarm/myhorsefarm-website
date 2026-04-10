#!/usr/bin/env npx tsx
/**
 * Import deduplicated_valid_emails.xlsx (Nona Garson list) into HubSpot.
 *
 * Usage:
 *   npx tsx scripts/import-nona-emails.ts [--dry-run]
 *
 * ~14,810 new contacts. Uses batch API (100 at a time).
 * Falls back to individual creates on batch errors (bad emails).
 */

// import { readFileSync } from "fs";

const XLSX_PATH = "/Users/josegomez/Downloads/deduplicated_valid_emails.xlsx";
const API_BASE = "https://api.hubapi.com";
const TOKEN = process.env.HUBSPOT_API_TOKEN;
const DRY_RUN = process.argv.includes("--dry-run");
const BATCH_SIZE = 100;
const DELAY_MS = 1200;

if (!TOKEN) {
  console.error("Missing HUBSPOT_API_TOKEN env var.");
  process.exit(1);
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function hubReq(path: string, options: RequestInit = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      "Content-Type": "application/json",
      ...options.headers,
    },
  });
  if (!res.ok) throw new Error(`HubSpot ${res.status}: ${await res.text()}`);
  return res.json();
}

async function getExistingEmails(): Promise<Set<string>> {
  console.log("Fetching existing HubSpot contacts to dedup...");
  const emails = new Set<string>();
  let after: string | undefined;
  let pages = 0;

  do {
    const body: Record<string, unknown> = {
      filterGroups: [],
      properties: ["email"],
      limit: 100,
    };
    if (after) body.after = after;

    const data = await hubReq("/crm/v3/objects/contacts/search", {
      method: "POST",
      body: JSON.stringify(body),
    });

    for (const contact of data.results) {
      const email = contact.properties?.email?.toLowerCase()?.trim();
      if (email) emails.add(email);
    }
    after = data.paging?.next?.after;
    pages++;
    if (pages % 20 === 0) process.stdout.write(`  ${emails.size} contacts fetched...\r`);
    await sleep(120);
  } while (after);

  console.log(`Found ${emails.size} existing contacts in HubSpot.\n`);
  return emails;
}

interface ContactRow {
  email: string;
  firstname: string;
  lastname: string;
}

async function loadXLSX(): Promise<ContactRow[]> {
  // Dynamic import since openpyxl isn't available — use a simple xlsx parser
  // We'll shell out to python to convert to JSON
  const { execSync } = await import("child_process");
  const json = execSync(
    `python3 -c "
import openpyxl, json
wb = openpyxl.load_workbook('${XLSX_PATH}', read_only=True)
ws = wb.active
rows = []
for row in ws.iter_rows(min_row=2, values_only=True):
    if len(row) >= 3 and row[2] and '@' in str(row[2]):
        rows.append({'firstname': str(row[0] or '').strip(), 'lastname': str(row[1] or '').strip(), 'email': str(row[2]).lower().strip()})
print(json.dumps(rows))
"`,
    { maxBuffer: 50 * 1024 * 1024 },
  ).toString();

  const contacts: ContactRow[] = JSON.parse(json);

  // Deduplicate by email
  const seen = new Set<string>();
  return contacts.filter((c) => {
    if (seen.has(c.email)) return false;
    seen.add(c.email);
    return true;
  });
}

async function batchCreate(
  contacts: ContactRow[],
): Promise<{ created: number; errors: number; badEmails: string[] }> {
  const inputs = contacts.map((c) => ({
    properties: {
      email: c.email,
      firstname: c.firstname,
      lastname: c.lastname,
      hs_lead_status: "NEW",
    },
  }));

  try {
    const result = await hubReq("/crm/v3/objects/contacts/batch/create", {
      method: "POST",
      body: JSON.stringify({ inputs }),
    });
    return { created: result.results?.length || 0, errors: 0, badEmails: [] };
  } catch (err) {
    const _msg = err instanceof Error ? err.message : String(err);

    // Batch failed — fall back to individual creates to salvage good contacts
    let created = 0;
    let errors = 0;
    const badEmails: string[] = [];

    for (const c of contacts) {
      try {
        await hubReq("/crm/v3/objects/contacts", {
          method: "POST",
          body: JSON.stringify({
            properties: {
              email: c.email,
              firstname: c.firstname,
              lastname: c.lastname,
              hs_lead_status: "NEW",
            },
          }),
        });
        created++;
      } catch (e2) {
        const m = e2 instanceof Error ? e2.message : "";
        if (m.includes("INVALID_EMAIL")) {
          badEmails.push(c.email);
        }
        errors++;
      }
      await sleep(120);
    }
    return { created, errors, badEmails };
  }
}

async function main() {
  console.log(
    `\n=== Nona Garson Email List → HubSpot Import${DRY_RUN ? " (DRY RUN)" : ""} ===\n`,
  );

  const allContacts = await loadXLSX();
  console.log(`Loaded ${allContacts.length} unique contacts from XLSX.\n`);

  const existingEmails = await getExistingEmails();

  const newContacts = allContacts.filter((c) => !existingEmails.has(c.email));
  const skipped = allContacts.length - newContacts.length;

  console.log(`Skipping: ${skipped} (already in HubSpot)`);
  console.log(`To create: ${newContacts.length}\n`);

  if (newContacts.length === 0) {
    console.log("Nothing to import.");
    return;
  }

  if (DRY_RUN) {
    console.log("DRY RUN — first 20:");
    for (const c of newContacts.slice(0, 20)) {
      console.log(`  ${c.firstname} ${c.lastname} <${c.email}>`);
    }
    console.log(`  ... and ${Math.max(0, newContacts.length - 20)} more.`);
    return;
  }

  const batches = Math.ceil(newContacts.length / BATCH_SIZE);
  let totalCreated = 0;
  let totalErrors = 0;
  const allBadEmails: string[] = [];
  const startTime = Date.now();

  for (let i = 0; i < batches; i++) {
    const chunk = newContacts.slice(i * BATCH_SIZE, (i + 1) * BATCH_SIZE);
    const elapsed = ((Date.now() - startTime) / 1000).toFixed(0);
    const pct = (((i + 1) / batches) * 100).toFixed(1);
    process.stdout.write(
      `  Batch ${i + 1}/${batches} (${pct}%, ${elapsed}s)...`,
    );

    const { created, errors, badEmails } = await batchCreate(chunk);
    totalCreated += created;
    totalErrors += errors;
    allBadEmails.push(...badEmails);

    if (errors > 0) {
      console.log(` created: ${created}, errors: ${errors}`);
    } else {
      console.log(` ${created} created`);
    }
    await sleep(DELAY_MS);
  }

  const totalTime = ((Date.now() - startTime) / 1000 / 60).toFixed(1);

  console.log(`\n=== Import Complete (${totalTime} min) ===`);
  console.log(`Created:  ${totalCreated}`);
  console.log(`Skipped:  ${skipped} (already in HubSpot)`);
  console.log(`Errors:   ${totalErrors}`);
  if (allBadEmails.length > 0) {
    console.log(`Bad emails: ${allBadEmails.join(", ")}`);
  }
  console.log();
}

main().catch(console.error);
