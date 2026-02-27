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
  const data = await hubspotRequest("/crm/v3/objects/deals/search", {
    method: "POST",
    body: JSON.stringify({ filterGroups, properties, limit: 100 }),
  });
  return data.results;
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

const PIPELINE_ID = "2057861855";

export async function findContactByEmail(
  email: string,
): Promise<Contact | null> {
  const results = await searchContacts(
    [
      {
        filters: [
          { propertyName: "email", operator: "EQ", value: email },
        ],
      },
    ],
    ["email", "firstname", "lastname", "phone"],
  );
  return results[0] ?? null;
}

export async function findContactByPhone(
  phone: string,
): Promise<Contact | null> {
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
  return results[0] ?? null;
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

  const COMPLETED_STAGE = "3248645833";
  // Find a deal in the Farm Services Pipeline that isn't completed
  const activeDeal = batchData.results.find(
    (d: Deal) =>
      d.properties.pipeline === PIPELINE_ID &&
      d.properties.dealstage !== COMPLETED_STAGE,
  );

  return activeDeal ?? null;
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
  await hubspotRequest(`/crm/v3/objects/deals/${dealId}`, {
    method: "PATCH",
    body: JSON.stringify({
      properties: { dealstage: stageId, closedate: new Date().toISOString() },
    }),
  });
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
    return marketing?.status === "SUBSCRIBED";
  } catch {
    return false;
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
