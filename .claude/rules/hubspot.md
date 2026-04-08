---
description: HubSpot CRM integration — portal IDs, API constraints, contact/deal helpers
globs: src/lib/hubspot.ts, src/app/api/**/route.ts, src/lib/emails.ts
---

# HubSpot Integration

- **Portal ID**: 243452157 | **Form ID**: 2980030d-1b91-4afd-af28-9fb1445cf00d
- **Plan**: Starter (no `automation` or `marketing-email` API scopes)
- **Token**: `.env.local` as `HUBSPOT_API_TOKEN`
- **Subscription ID**: 1087420534 (Marketing Information)
- **Office Location ID**: 229593568989

## Deal Pipeline
- "Farm Services Pipeline" (ID: 2057861855)
- Stages: New Lead → Quoted → Scheduled → In Progress → Completed (3248645833) → Lost
- Stage constants in `hubspot.ts`: STAGE_NEW_LEAD, STAGE_QUOTED, STAGE_SCHEDULED, STAGE_IN_PROGRESS, STAGE_COMPLETED, STAGE_LOST

## Key Constraints
- Notes-based dedup instead of custom properties (scope `crm.schemas.contacts.write` unavailable)
- Time-windowed contact queries + note checks prevent double-sends
- Welcome sequence only applies to contacts created AFTER automation deployment
- Newsletter sent manually from HubSpot UI (content changes monthly)

## Helpers in hubspot.ts
- findContactByEmail, createContact, findActiveDealForContact
- createDeal, updateDealStage, updateDealAmount
