#!/usr/bin/env npx tsx
import { parse } from "csv-parse/sync";
import { readFileSync } from "fs";

const CSV_PATH =
  "/Users/josegomez/Library/CloudStorage/GoogleDrive-joseadel825@gmail.com/Shared drives/Resilient Fitness X Concept Co./Email Marketing List /Active Members/Old/FullMembersList.csv";

const API_BASE = "https://api.hubapi.com";
const TOKEN = process.env.HUBSPOT_API_TOKEN!;
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function hubReq(path: string, options: RequestInit = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: { Authorization: `Bearer ${TOKEN}`, "Content-Type": "application/json", ...options.headers },
  });
  if (!res.ok) throw new Error(`HubSpot ${res.status}: ${await res.text()}`);
  return res.json();
}

async function exists(email: string): Promise<boolean> {
  try {
    const d = await hubReq("/crm/v3/objects/contacts/search", {
      method: "POST",
      body: JSON.stringify({
        filterGroups: [{ filters: [{ propertyName: "email", operator: "EQ", value: email }] }],
        properties: ["email"],
        limit: 1,
      }),
    });
    return (d.results?.length ?? 0) > 0;
  } catch {
    return false;
  }
}

async function main() {
  const csv = readFileSync(CSV_PATH, "utf-8");
  const rows = parse(csv, { columns: true, skip_empty_lines: true, trim: true });
  const seen = new Set<string>();
  const all: Array<Record<string, string>> = [];
  for (const r of rows as Record<string, string>[]) {
    const email = (r["EMAIL"] || "").toLowerCase().trim();
    if (!email || !email.includes("@") || seen.has(email)) continue;
    seen.add(email);
    all.push(r);
  }

  // Batches 14 and 23 failed (0-indexed 13 and 22)
  const failed = [...all.slice(13 * 100, 14 * 100), ...all.slice(22 * 100, 23 * 100)];
  console.log(`Retrying ${failed.length} contacts individually...\n`);

  let created = 0, skipped = 0, errors = 0;

  for (const r of failed) {
    const email = (r["EMAIL"] || "").toLowerCase().trim();
    try {
      if (await exists(email)) {
        skipped++;
        await sleep(150);
        continue;
      }
      const props: Record<string, string> = {
        email,
        firstname: r["FIRST_NAME"] || "",
        lastname: r["LAST_NAME"] || "",
        hs_lead_status: "NEW",
      };
      const phone = r["MOBILE"] || r["HOME"] || r["WORK"] || "";
      if (phone) props.phone = phone;
      if (r["CITY"]) props.city = r["CITY"];
      if (r["STATE"]) props.state = r["STATE"];
      if (r["POSTAL_CODE"]) props.zip = r["POSTAL_CODE"];
      if (r["ADDRESS_1"]) props.address = [r["ADDRESS_1"], r["ADDRESS_2"]].filter(Boolean).join(" ");

      await hubReq("/crm/v3/objects/contacts", {
        method: "POST",
        body: JSON.stringify({ properties: props }),
      });
      console.log(`  CREATED: ${props.firstname} ${props.lastname} <${email}>`);
      created++;
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      console.log(`  ERROR: ${email} — ${msg.slice(0, 120)}`);
      errors++;
    }
    await sleep(150);
  }

  console.log(`\nRetry complete. Created: ${created}, Skipped: ${skipped}, Errors: ${errors}`);
}

main().catch(console.error);
