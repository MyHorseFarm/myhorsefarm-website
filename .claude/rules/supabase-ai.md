---
description: AI quoting, booking, and chat system — Supabase DB, Claude chatbot, admin APIs
globs: src/lib/supabase.ts, src/lib/pricing.ts, src/lib/availability.ts, src/lib/ai/**, src/lib/types.ts, src/app/api/quote/**, src/app/api/booking/**, src/app/api/chat/**, src/app/api/admin/**, src/components/QuoteForm.tsx, src/components/ServiceCalendar.tsx, src/components/ChatWidget.tsx
---

# AI Quoting & Scheduling System

- **Database**: Supabase (free tier). Schema in `supabase-schema.sql`
- **Env vars**: `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `ANTHROPIC_API_KEY`, `ADMIN_SECRET`
- **Supabase client**: `src/lib/supabase.ts` (lazy-initialized via Proxy)
- **Types**: `src/lib/types.ts` (ServicePricing, Quote, Booking, ChatSession, etc.)

## Key Modules
- **Pricing**: `src/lib/pricing.ts` (calculateQuote, getActiveServices, getServiceByKey)
- **Availability**: `src/lib/availability.ts` (getAvailableDates, hasCapacity)
- **AI chatbot**: `src/lib/ai/` (system-prompt.ts, tools.ts, chat.ts) — Claude Haiku 4.5

## Flows
- **Quote**: `/quote` page → QuoteForm.tsx → POST `/api/quote` → Supabase + HubSpot + email
- **Booking**: ServiceCalendar.tsx → POST `/api/booking` → Supabase + HubSpot + email
- **Chat**: ChatWidget.tsx → `/api/chat/session` + `/api/chat` (SSE streaming)

## Admin APIs
- GET/PUT `/api/admin/pricing` — manage service pricing
- GET/PUT `/api/admin/routes` — manage route config
- Auth: Bearer `ADMIN_SECRET` header

## Note Tags
- `[QUOTE:MHF-Q-xxx]`, `[BOOKING:MHF-B-xxx]`, `[CHAT:HANDOFF]`
