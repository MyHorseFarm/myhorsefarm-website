const API_BASE = "https://api.hubapi.com";

async function hubspotRequest(path: string, options: RequestInit = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${process.env.HUBSPOT_API_TOKEN}`,
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

export interface Contact {
  id: string;
  properties: Record<string, string | null>;
}

export interface Deal {
  id: string;
  properties: Record<string, string | null>;
}

// ---------------------------------------------------------------------------
// Contacts
// ---------------------------------------------------------------------------

export async function searchContacts(
  filterGroups: unknown[],
  properties: string[],
  maxResults = 10000,
): Promise<Contact[]> {
  const results: Contact[] = [];
  let after: string | undefined;

  do {
    const body: Record<string, unknown> = {
      filterGroups,
      properties,
      limit: 100,
    };
    if (after) body.after = after;

    const data = await hubspotRequest("/crm/v3/objects/contacts/search", {
      method: "POST",
      body: JSON.stringify(body),
    });

    results.push(...data.results);
    after = data.paging?.next?.after;

    // Cap results to avoid exhausting API rate limits
    if (results.length >= maxResults) break;

    // Brief pause between pages to stay under HubSpot rate limits
    if (after) await new Promise((r) => setTimeout(r, 120));
  } while (after);

  return results;
}

export async function getContactById(
  id: string,
  properties: string[],
): Promise<Contact> {
  const params = properties.map((p) => `properties=${p}`).join("&");
  return hubspotRequest(`/crm/v3/objects/contacts/${id}?${params}`);
}

// ---------------------------------------------------------------------------
// Deals
// ---------------------------------------------------------------------------

export async function searchDeals(
  filterGroups: unknown[],
  properties: string[],
): Promise<Deal[]> {
  const results: Deal[] = [];
  let after: string | undefined;

  do {
    const body: Record<string, unknown> = {
      filterGroups,
      properties,
      limit: 100,
    };
    if (after) body.after = after;

    const data = await hubspotRequest("/crm/v3/objects/deals/search", {
      method: "POST",
      body: JSON.stringify(body),
    });

    results.push(...data.results);
    after = data.paging?.next?.after;
  } while (after);

  return results;
}

export async function getDealContacts(dealId: string): Promise<string[]> {
  const data = await hubspotRequest(
    `/crm/v3/objects/deals/${dealId}/associations/contacts`,
  );
  return data.results.map((r: Record<string, string>) => r.toObjectId ?? r.id);
}

// ---------------------------------------------------------------------------
// Notes – used for automation state tracking
// ---------------------------------------------------------------------------

async function getAssociatedNoteBodies(
  objectType: string,
  objectId: string,
): Promise<string[]> {
  try {
    const assocData = await hubspotRequest(
      `/crm/v3/objects/${objectType}/${objectId}/associations/notes`,
    );

    const noteIds: string[] = assocData.results.map(
      (r: Record<string, string>) => r.toObjectId ?? r.id,
    );
    if (noteIds.length === 0) return [];

    const batchData = await hubspotRequest("/crm/v3/objects/notes/batch/read", {
      method: "POST",
      body: JSON.stringify({
        properties: ["hs_note_body"],
        inputs: noteIds.map((id) => ({ id })),
      }),
    });

    return batchData.results
      .map((n: { properties?: { hs_note_body?: string } }) => n.properties?.hs_note_body)
      .filter(Boolean) as string[];
  } catch {
    return [];
  }
}

export async function hasAutomationTag(
  objectType: string,
  objectId: string,
  tag: string,
): Promise<boolean> {
  const bodies = await getAssociatedNoteBodies(objectType, objectId);
  return bodies.some((b) => b.includes(tag));
}

export async function countAutomationTags(
  objectType: string,
  objectId: string,
  tagPrefix: string,
): Promise<number> {
  const bodies = await getAssociatedNoteBodies(objectType, objectId);
  return bodies.filter((b) => b.includes(tagPrefix)).length;
}

export async function createContactNote(
  contactId: string,
  body: string,
): Promise<void> {
  await hubspotRequest("/crm/v3/objects/notes", {
    method: "POST",
    body: JSON.stringify({
      properties: {
        hs_note_body: body,
        hs_timestamp: new Date().toISOString(),
      },
      associations: [
        {
          to: { id: contactId },
          types: [
            { associationCategory: "HUBSPOT_DEFINED", associationTypeId: 202 },
          ],
        },
      ],
    }),
  });
}

export async function createDealNote(
  dealId: string,
  body: string,
): Promise<void> {
  await hubspotRequest("/crm/v3/objects/notes", {
    method: "POST",
    body: JSON.stringify({
      properties: {
        hs_note_body: body,
        hs_timestamp: new Date().toISOString(),
      },
      associations: [
        {
          to: { id: dealId },
          types: [
            { associationCategory: "HUBSPOT_DEFINED", associationTypeId: 214 },
          ],
        },
      ],
    }),
  });
}

// ---------------------------------------------------------------------------
// Contact management
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// Pipeline & Stage IDs
// ---------------------------------------------------------------------------

const PIPELINE_ID = "2057861855";
export const HUBSPOT_PIPELINE_ID = PIPELINE_ID;

// Stage IDs for the Farm Services Pipeline
// New Lead → Quoted → Scheduled → In Progress → Completed → Lost
export const STAGE_NEW_LEAD = "3248645829";
export const STAGE_QUOTED = "3248645830";
export const STAGE_SCHEDULED = "3248645831";
export const STAGE_IN_PROGRESS = "3248645832";
export const STAGE_COMPLETED = "3248645833";
export const STAGE_LOST = "3248645834";

export async function findContactByEmail(
  email: string,
): Promise<Contact | null> {
  const results = await searchContacts(
    [
      {
        filters: [
          { propertyName: "email", operator: "EQ", value: email.toLowerCase().trim() },
        ],
      },
    ],
    ["email", "firstname", "lastname", "phone"],
  );
  return results[0] ?? null;
}

/**
 * Strip a phone number to digits only, removing country code prefix if present.
 * "(561) 576-7667" → "5615767667"
 * "+1 (561) 576-7667" → "5615767667"
 * "15615767667" → "5615767667"
 */
export function normalizePhone(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  // Strip leading "1" country code if 11 digits
  if (digits.length === 11 && digits.startsWith("1")) return digits.slice(1);
  return digits;
}

export async function findContactByPhone(
  phone: string,
): Promise<Contact | null> {
  // HubSpot stores phone in various formats, so we search with the raw value
  // first, then try the normalized 10-digit version if no match.
  const results = await searchContacts(
    [
      {
        filters: [
          { propertyName: "phone", operator: "EQ", value: phone },
        ],
      },
    ],
    ["email", "firstname", "lastname", "phone"],
  );
  if (results[0]) return results[0];

  // Try normalized digits (e.g. "5615767667")
  const normalized = normalizePhone(phone);
  if (normalized && normalized !== phone) {
    const results2 = await searchContacts(
      [
        {
          filters: [
            { propertyName: "phone", operator: "CONTAINS_TOKEN", value: normalized },
          ],
        },
      ],
      ["email", "firstname", "lastname", "phone"],
    );
    if (results2[0]) return results2[0];
  }

  return null;
}

export async function createContact(
  email: string,
  firstname: string,
  lastname: string,
  phone: string | null,
): Promise<Contact> {
  const properties: Record<string, string> = { email, firstname, lastname };
  if (phone) properties.phone = phone;

  return hubspotRequest("/crm/v3/objects/contacts", {
    method: "POST",
    body: JSON.stringify({ properties }),
  });
}

export async function updateContactProperties(
  contactId: string,
  properties: Record<string, string>,
): Promise<void> {
  await hubspotRequest(`/crm/v3/objects/contacts/${contactId}`, {
    method: "PATCH",
    body: JSON.stringify({ properties }),
  });
}

// ---------------------------------------------------------------------------
// Deal management
// ---------------------------------------------------------------------------

export async function findActiveDealForContact(
  contactId: string,
): Promise<Deal | null> {
  // Get deals associated with the contact
  const assocData = await hubspotRequest(
    `/crm/v3/objects/contacts/${contactId}/associations/deals`,
  );

  const dealIds: string[] = assocData.results.map(
    (r: Record<string, string>) => r.toObjectId ?? r.id,
  );
  if (dealIds.length === 0) return null;

  // Batch-read the deals to find one that isn't in Completed or Lost stage
  const batchData = await hubspotRequest("/crm/v3/objects/deals/batch/read", {
    method: "POST",
    body: JSON.stringify({
      properties: ["dealname", "dealstage", "amount", "pipeline"],
      inputs: dealIds.map((id) => ({ id })),
    }),
  });

  // Find a deal in the Farm Services Pipeline that isn't completed or lost
  const activeDeal = batchData.results.find(
    (d: Deal) =>
      d.properties.pipeline === PIPELINE_ID &&
      d.properties.dealstage !== STAGE_COMPLETED &&
      d.properties.dealstage !== STAGE_LOST,
  );

  return activeDeal ?? null;
}

export interface ContactDealSummary {
  hasActiveDeal: boolean;
  mostRecentCloseDate: string | null;
  dealStages: string[];
}

/**
 * Get a summary of all deals for a contact: whether any are active,
 * the most recent close date, and all deal stages present.
 */
export async function getContactDealSummary(
  contactId: string,
): Promise<ContactDealSummary> {
  const assocData = await hubspotRequest(
    `/crm/v3/objects/contacts/${contactId}/associations/deals`,
  );

  const dealIds: string[] = assocData.results.map(
    (r: Record<string, string>) => r.toObjectId ?? r.id,
  );

  if (dealIds.length === 0) {
    return { hasActiveDeal: false, mostRecentCloseDate: null, dealStages: [] };
  }

  const batchData = await hubspotRequest("/crm/v3/objects/deals/batch/read", {
    method: "POST",
    body: JSON.stringify({
      properties: ["dealstage", "pipeline", "closedate"],
      inputs: dealIds.map((id) => ({ id })),
    }),
  });

  let hasActiveDeal = false;
  let mostRecentCloseDate: string | null = null;
  const dealStages: string[] = [];

  for (const deal of batchData.results as Deal[]) {
    if (deal.properties.pipeline !== PIPELINE_ID) continue;
    const stage = deal.properties.dealstage ?? "";
    dealStages.push(stage);

    if (stage !== STAGE_COMPLETED && stage !== STAGE_LOST) {
      hasActiveDeal = true;
    }

    const close = deal.properties.closedate;
    if (close && (!mostRecentCloseDate || close > mostRecentCloseDate)) {
      mostRecentCloseDate = close;
    }
  }

  return { hasActiveDeal, mostRecentCloseDate, dealStages };
}

export async function createDeal(
  contactId: string,
  dealname: string,
  amount: string,
  stageId: string,
): Promise<Deal> {
  return hubspotRequest("/crm/v3/objects/deals", {
    method: "POST",
    body: JSON.stringify({
      properties: {
        dealname,
        amount,
        dealstage: stageId,
        pipeline: PIPELINE_ID,
        closedate: new Date().toISOString(),
      },
      associations: [
        {
          to: { id: contactId },
          types: [
            { associationCategory: "HUBSPOT_DEFINED", associationTypeId: 3 },
          ],
        },
      ],
    }),
  });
}

export async function updateDealStage(
  dealId: string,
  stageId: string,
): Promise<void> {
  const properties: Record<string, string> = { dealstage: stageId };
  // Only set closedate when deal reaches a terminal stage
  if (stageId === STAGE_COMPLETED || stageId === STAGE_LOST) {
    properties.closedate = new Date().toISOString();
  }
  await hubspotRequest(`/crm/v3/objects/deals/${dealId}`, {
    method: "PATCH",
    body: JSON.stringify({ properties }),
  });
}

export async function findDealByNoteContent(
  contactId: string,
  searchText: string,
): Promise<Deal | null> {
  const assocData = await hubspotRequest(
    `/crm/v3/objects/contacts/${contactId}/associations/deals`,
  );

  const dealIds: string[] = assocData.results.map(
    (r: Record<string, string>) => r.toObjectId ?? r.id,
  );
  if (dealIds.length === 0) return null;

  // Batch-read deals
  const batchData = await hubspotRequest("/crm/v3/objects/deals/batch/read", {
    method: "POST",
    body: JSON.stringify({
      properties: ["dealname", "dealstage", "amount", "pipeline"],
      inputs: dealIds.map((id) => ({ id })),
    }),
  });

  // Check each deal's notes for the search text
  for (const deal of batchData.results as Deal[]) {
    const hasNote = await hasAutomationTag("deals", deal.id, searchText);
    if (hasNote) return deal;
  }

  return null;
}

export async function updateDealAmount(
  dealId: string,
  amount: string,
): Promise<void> {
  await hubspotRequest(`/crm/v3/objects/deals/${dealId}`, {
    method: "PATCH",
    body: JSON.stringify({ properties: { amount } }),
  });
}

// ---------------------------------------------------------------------------
// Subscription status
// ---------------------------------------------------------------------------

export async function isSubscribed(email: string): Promise<boolean> {
  try {
    const data = await hubspotRequest(
      `/communication-preferences/v3/status/email/${encodeURIComponent(email)}`,
    );
    const marketing = data.subscriptionStatuses?.find(
      (s: { id: string; status: string }) => s.id === "1087420534",
    );
    // If explicitly unsubscribed, block. Otherwise allow (imported contacts
    // won't have a subscription status — treat as opt-in).
    if (marketing?.status === "NOT_SUBSCRIBED") return false;
    return true;
  } catch {
    // API error or contact not found — allow send (fail open for imports)
    return true;
  }
}

export async function unsubscribeContact(email: string): Promise<void> {
  await hubspotRequest("/communication-preferences/v3/unsubscribe", {
    method: "POST",
    body: JSON.stringify({
      emailAddress: email,
      subscriptionId: "1087420534",
      legalBasis: "LEGITIMATE_INTEREST_CLIENT",
      legalBasisExplanation: "Unsubscribe request via email link",
    }),
  });
}
