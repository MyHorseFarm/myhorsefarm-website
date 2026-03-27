#!/usr/bin/env npx tsx
/**
 * Import Resilient Fitness members into HubSpot as marketing leads.
 *
 * Usage:
 *   npx tsx scripts/import-resilient-fitness.ts [--dry-run]
 *
 * Uses HubSpot batch create API (100 contacts at a time) for speed.
 * Skips contacts that already exist (dedup by email).
 */

import { parse } from "csv-parse/sync";
import { readFileSync } from "fs";

const CSV_PATH =
  "/Users/josegomez/Library/CloudStorage/GoogleDrive-joseadel825@gmail.com/Shared drives/Resilient Fitness X Concept Co./Email Marketing List /Active Members/Old/FullMembersList.csv";

const API_BASE = "https://api.hubapi.com";
const TOKEN = process.env.HUBSPOT_API_TOKEN;
const DRY_RUN = process.argv.includes("--dry-run");
const BATCH_SIZE = 100;
const DELAY_MS = 1200; // Stay well within rate limits

if (!TOKEN) {
  console.error("Missing HUBSPOT_API_TOKEN env var.");
  process.exit(1);
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function hubspotRequest(path: string, options: RequestInit = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      "Content-Type": "application/json",
      ...options.headers,
    },
  });
  if (!response.ok) {
    const error = await response.text();
    throw new Error(`HubSpot ${response.status}: ${error}`);
  }
  return response.json();
}

async function getExistingEmails(): Promise<Set<string>> {
  console.log("Fetching existing HubSpot contacts to dedup...");
  const emails = new Set<string>();
  let after: string | undefined;

  do {
    const body: Record<string, unknown> = {
      filterGroups: [],
      properties: ["email"],
      limit: 100,
    };
    if (after) body.after = after;

    const data = await hubspotRequest("/crm/v3/objects/contacts/search", {
      method: "POST",
      body: JSON.stringify(body),
    });

    for (const contact of data.results) {
      const email = contact.properties?.email?.toLowerCase()?.trim();
      if (email) emails.add(email);
    }
    after = data.paging?.next?.after;
    await sleep(150);
  } while (after);

  console.log(`Found ${emails.size} existing contacts in HubSpot.\n`);
  return emails;
}

interface ContactProps {
  email: string;
  firstname: string;
  lastname: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
  hs_lead_status: string;
}

function loadCSV(): ContactProps[] {
  const csv = readFileSync(CSV_PATH, "utf-8");
  const rows = parse(csv, { columns: true, skip_empty_lines: true, trim: true });
  const seen = new Set<string>();
  const contacts: ContactProps[] = [];

  for (const r of rows) {
    const email = (r["EMAIL"] || "").toLowerCase().trim();
    if (!email || !email.includes("@") || seen.has(email)) continue;
    seen.add(email);

    const phone = r["MOBILE"] || r["HOME"] || r["WORK"] || "";
    const props: ContactProps = {
      email,
      firstname: r["FIRST_NAME"] || "",
      lastname: r["LAST_NAME"] || "",
      hs_lead_status: "NEW",
    };
    if (phone) props.phone = phone;
    if (r["ADDRESS_1"]) props.address = [r["ADDRESS_1"], r["ADDRESS_2"]].filter(Boolean).join(" ");
    if (r["CITY"]) props.city = r["CITY"];
    if (r["STATE"]) props.state = r["STATE"];
    if (r["POSTAL_CODE"]) props.zip = r["POSTAL_CODE"];

    contacts.push(props);
  }

  return contacts;
}

async function batchCreate(contacts: ContactProps[]): Promise<{ created: number; errors: number }> {
  const inputs = contacts.map((c) => ({ properties: c }));

  try {
    const result = await hubspotRequest("/crm/v3/objects/contacts/batch/create", {
      method: "POST",
      body: JSON.stringify({ inputs }),
    });
    return { created: result.results?.length || 0, errors: 0 };
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    // If batch fails, fall back to individual creates
    if (msg.includes("409") || msg.includes("CONFLICT") || msg.includes("400") || msg.includes("INVALID_EMAIL")) {
      let created = 0;
      let errors = 0;
      for (const c of contacts) {
        try {
          await hubspotRequest("/crm/v3/objects/contacts", {
            method: "POST",
            body: JSON.stringify({ properties: c }),
          });
          created++;
        } catch {
          errors++;
        }
        await sleep(150);
      }
      return { created, errors };
    }
    console.error(`  Batch error: ${msg}`);
    return { created: 0, errors: contacts.length };
  }
}

async function main() {
  console.log(`\n=== Resilient Fitness → HubSpot Import${DRY_RUN ? " (DRY RUN)" : ""} ===\n`);

  const allContacts = loadCSV();
  console.log(`Loaded ${allContacts.length} unique contacts from CSV.\n`);

  // Get existing emails to dedup
  const existingEmails = await getExistingEmails();

  // Filter out already-existing contacts
  const newContacts = allContacts.filter((c) => !existingEmails.has(c.email));
  const skipped = allContacts.length - newContacts.length;

  console.log(`Skipping: ${skipped} (already in HubSpot)`);
  console.log(`To create: ${newContacts.length}\n`);

  if (newContacts.length === 0) {
    console.log("Nothing to import — all contacts already exist.");
    return;
  }

  if (DRY_RUN) {
    console.log("DRY RUN — first 20 contacts that would be created:");
    for (const c of newContacts.slice(0, 20)) {
      console.log(`  ${c.firstname} ${c.lastname} <${c.email}> ${c.city || ""} ${c.state || ""}`);
    }
    console.log(`  ... and ${Math.max(0, newContacts.length - 20)} more.`);
    return;
  }

  // Batch create in chunks of 100
  let totalCreated = 0;
  let totalErrors = 0;
  const batches = Math.ceil(newContacts.length / BATCH_SIZE);

  for (let i = 0; i < batches; i++) {
    const chunk = newContacts.slice(i * BATCH_SIZE, (i + 1) * BATCH_SIZE);
    process.stdout.write(`  Batch ${i + 1}/${batches} (${chunk.length} contacts)...`);

    const { created, errors } = await batchCreate(chunk);
    totalCreated += created;
    totalErrors += errors;

    console.log(` created: ${created}, errors: ${errors}`);
    await sleep(DELAY_MS);
  }

  console.log(`\n=== Import Complete ===`);
  console.log(`Created:  ${totalCreated}`);
  console.log(`Skipped:  ${skipped} (already in HubSpot)`);
  console.log(`Errors:   ${totalErrors}`);
  console.log();
}

main().catch(console.error);
