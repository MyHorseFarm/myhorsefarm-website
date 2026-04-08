# My Horse Farm — myhorsefarm.com

## Stack
- Next.js 16, Tailwind CSS 4, TypeScript, deployed on Vercel
- Domain: myhorsefarm.com | Phone: (561) 576-7667

## Build & Run
- `npm run dev` — local dev server
- `npm run build` — production build (must pass before deploy)
- Push to `main` triggers Vercel deploy automatically

## Key Directories
- `src/app/api/` — API routes (webhooks, cron jobs, admin, chat, quote, booking)
- `src/lib/` — Shared libraries (hubspot, square, supabase, emails, pricing, analytics)
- `src/components/` — React components (QuoteForm, ChatWidget, ServiceCalendar, etc.)
- `vercel.json` — Cron job schedules

## Env Vars
- Stored in `.env.local` (never commit)
- Key vars: HUBSPOT_API_TOKEN, SQUARE_ACCESS_TOKEN, SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, ANTHROPIC_API_KEY, ADMIN_SECRET, RESEND_API_KEY, CRON_SECRET

## Conventions
- All cron routes check `CRON_SECRET` header for auth
- HubSpot Notes with `[TAG:ID]` prefixes for dedup (never send duplicate emails/updates)
- Email sent via Resend SDK (not HubSpot — Starter plan can't send via API)
- Supabase for database, HubSpot for CRM, Square for payments
