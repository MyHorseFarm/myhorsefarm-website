#!/usr/bin/env npx tsx
/**
 * Import contacts from ChatGPT export CSVs into HubSpot.
 *
 * Usage:
 *   npx tsx scripts/import-contacts-to-hubspot.ts [--dry-run]
 *
 * Reads CSVs from scripts/data/ and creates contacts in HubSpot,
 * skipping any that already exist (dedup by email).
 */

import { parse } from "csv-parse/sync";
import { readFileSync } from "fs";
import { join } from "path";

const API_BASE = "https://api.hubapi.com";
const TOKEN = process.env.HUBSPOT_API_TOKEN;
const DRY_RUN = process.argv.includes("--dry-run");

if (!TOKEN) {
  console.error("Missing HUBSPOT_API_TOKEN env var. Load .env.local first.");
  process.exit(1);
}

// Rate limit: HubSpot allows 100 requests per 10 seconds on Starter
const DELAY_MS = 150;
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

async function findContactByEmail(email: string) {
  try {
    const data = await hubspotRequest("/crm/v3/objects/contacts/search", {
      method: "POST",
      body: JSON.stringify({
        filterGroups: [
          {
            filters: [
              { propertyName: "email", operator: "EQ", value: email.toLowerCase().trim() },
            ],
          },
        ],
        properties: ["email", "firstname", "lastname"],
        limit: 1,
      }),
    });
    return data.results?.[0] ?? null;
  } catch {
    return null;
  }
}

async function createContact(props: Record<string, string>) {
  return hubspotRequest("/crm/v3/objects/contacts", {
    method: "POST",
    body: JSON.stringify({ properties: props }),
  });
}

interface ContactRow {
  email: string;
  firstname: string;
  lastname: string;
  phone: string;
  address: string;
  source: string;
}

function normalizePhone(raw: string): string {
  const digits = raw.replace(/\D/g, "");
  if (digits.length === 10) return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
  if (digits.length === 11 && digits.startsWith("1")) {
    const d = digits.slice(1);
    return `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6)}`;
  }
  return raw.trim();
}

function loadActiveClients(): ContactRow[] {
  const csv = readFileSync(join(__dirname, "data/active_clients.csv"), "utf-8");
  const rows = parse(csv, { columns: true, skip_empty_lines: true, trim: true });
  return rows
    .filter((r: Record<string, string>) => r["Email"]?.includes("@"))
    .map((r: Record<string, string>) => ({
      email: r["Email"].toLowerCase().trim(),
      firstname: r["First Name"] || r["Customer Name"]?.split(" ")[0] || "",
      lastname: r["Last Name"] || r["Customer Name"]?.split(" ").slice(1).join(" ") || "",
      phone: normalizePhone(r["Phone"] || ""),
      address: r["Bill Address"] || r["Ship Address"] || "",
      source: "active_client",
    }));
}

function loadInactiveContacts(): ContactRow[] {
  const csv = readFileSync(join(__dirname, "data/inactive_contacts.csv"), "utf-8");
  const rows = parse(csv, { columns: true, skip_empty_lines: true, trim: true });
  return rows
    .filter((r: Record<string, string>) => r["Email"]?.includes("@"))
    .map((r: Record<string, string>) => ({
      email: r["Email"].toLowerCase().trim(),
      firstname: r["First Name"] || r["Customer Name"]?.split(" ")[0] || "",
      lastname: r["Last Name"] || r["Customer Name"]?.split(" ").slice(1).join(" ") || "",
      phone: normalizePhone(r["Phone"] || ""),
      address: r["Bill Address"] || r["Ship Address"] || "",
      source: "inactive_client",
    }));
}

function loadFarms(file: string): ContactRow[] {
  const csv = readFileSync(join(__dirname, `data/${file}`), "utf-8");
  const rows = parse(csv, { columns: true, skip_empty_lines: true, trim: true });
  return rows
    .filter((r: Record<string, string>) => r["Email"]?.includes("@"))
    .map((r: Record<string, string>) => {
      const name = r["Name"] || r["Business"] || "";
      return {
        email: r["Email"].toLowerCase().trim(),
        firstname: name.split(" ")[0] || "",
        lastname: name.split(" ").slice(1).join(" ") || "",
        phone: normalizePhone((r["Phone"] || "").split("/")[0].trim()),
        address: r["Address"] || r["Location"] || "",
        source: "equestrian_farm_lead",
      };
    });
}

async function main() {
  console.log(`\n=== HubSpot Contact Import${DRY_RUN ? " (DRY RUN)" : ""} ===\n`);

  // Load all contacts
  const active = loadActiveClients();
  const inactive = loadInactiveContacts();
  const farmsWellington = loadFarms("farms_wellington.csv");
  const farmsPB = loadFarms("farms_palmbeach.csv");

  console.log(`Active clients:       ${active.length}`);
  console.log(`Inactive contacts:    ${inactive.length}`);
  console.log(`Farms (Wellington):   ${farmsWellington.length}`);
  console.log(`Farms (Palm Beach):   ${farmsPB.length}`);

  // Deduplicate by email across all lists (active takes priority)
  const seen = new Set<string>();
  const allContacts: ContactRow[] = [];

  for (const list of [active, inactive, farmsWellington, farmsPB]) {
    for (const c of list) {
      if (!seen.has(c.email)) {
        seen.add(c.email);
        allContacts.push(c);
      }
    }
  }

  console.log(`\nTotal unique contacts: ${allContacts.length}\n`);

  let created = 0;
  let skipped = 0;
  let errors = 0;

  for (const contact of allContacts) {
    try {
      // Check if contact already exists in HubSpot
      const existing = await findContactByEmail(contact.email);
      if (existing) {
        console.log(`  SKIP (exists): ${contact.email}`);
        skipped++;
        await sleep(DELAY_MS);
        continue;
      }

      const properties: Record<string, string> = {
        email: contact.email,
        firstname: contact.firstname,
        lastname: contact.lastname,
      };
      if (contact.phone) properties.phone = contact.phone;
      if (contact.address) properties.address = contact.address;

      // Tag the lead source
      if (contact.source === "active_client") {
        properties.hs_lead_status = "CONNECTED";
      } else if (contact.source === "inactive_client") {
        properties.hs_lead_status = "OPEN";
      } else if (contact.source === "equestrian_farm_lead") {
        properties.hs_lead_status = "NEW";
      }

      if (DRY_RUN) {
        console.log(`  DRY RUN: Would create ${contact.firstname} ${contact.lastname} <${contact.email}> [${contact.source}]`);
        created++;
      } else {
        await createContact(properties);
        console.log(`  CREATED: ${contact.firstname} ${contact.lastname} <${contact.email}> [${contact.source}]`);
        created++;
      }

      await sleep(DELAY_MS);
    } catch (err) {
      console.error(`  ERROR: ${contact.email} — ${err instanceof Error ? err.message : err}`);
      errors++;
      await sleep(DELAY_MS);
    }
  }

  console.log(`\n=== Import Complete ===`);
  console.log(`Created:  ${created}`);
  console.log(`Skipped:  ${skipped} (already in HubSpot)`);
  console.log(`Errors:   ${errors}`);
  console.log();
}

main().catch(console.error);
