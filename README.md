# My Horse Farm — Website

Full-stack marketing and operations site for [myhorsefarm.com](https://myhorsefarm.com), built with **Next.js 16**, **Tailwind CSS v4**, **Supabase**, **Square**, and **Resend**.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router, Turbopack) |
| Styling | Tailwind CSS v4 |
| Database | Supabase (PostgreSQL) |
| Payments | Square |
| Email | Resend |
| AI | Anthropic Claude (claude-sonnet) |
| Video Ads | Remotion + AWS Lambda |
| Error Tracking | Sentry |
| CRM | HubSpot |
| SMS / Voice | Twilio, VAPI |
| Scheduling | Google Calendar |
| Reviews | Google Business Profile, Places API |
| Analytics | Meta CAPI, Google Ads |

## Getting Started

```bash
npm install
cp .env.example .env.local   # fill in secrets
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment Variables

Copy `.env.example` to `.env.local` and fill in the required values. See `.env.example` for the full list.

## Key Directories

```
src/
  app/          # Next.js App Router pages & API routes
    api/cron/   # 20 automated cron jobs (scheduled via vercel.json)
  components/   # Shared React components
  lib/          # Service clients & utilities
  hooks/        # React hooks
remotion/       # Video ad templates
scripts/        # One-off admin scripts
supabase/       # SQL schema migrations
docs/           # Internal documentation
```

## Cron Jobs

All cron schedules are configured in `vercel.json`. Jobs run at UTC times:

| Job | Schedule |
|-----|----------|
| `welcome-sequence` | Daily 2 PM |
| `review-request` | Daily 4 PM |
| `client-engagement` | Daily 3 PM |
| `quote-followup` | Daily 3 PM |
| `auto-charge` | Weekdays 1 PM |
| `crew-dispatch` | Weekdays 12 PM |
| `referral-rewards` | Daily 4 PM |
| `contract-renewal` | Daily 1 PM |
| `chat-recovery` | Daily 5 PM |
| `lead-nurture` | Daily 10 AM |
| `email-digest` | Daily 8 PM |
| `hot-leads` | Daily 12 PM |
| `deal-cleanup` | Daily 11 AM |
| `winback` | Mondays 3 PM |
| `reengagement` | Mondays 2 PM |
| `blog-generate` | Mon & Thu 10 AM |
| `seo-agent` | Mondays 10 AM |
| `gbp-post` | Wednesdays 2 PM |
| `newsletter` | 1st of month 2 PM |
| `pre-season` | Oct 1 2 PM |

## Scripts

```bash
npm run remotion:studio    # Preview video ad templates
npm run remotion:render    # Render a video locally
npm run remotion:deploy    # Deploy Remotion Lambda site
npm run lint               # ESLint
```

## Deployment

Deployed on **Vercel**. Push to `main` triggers automatic deployment. Cron jobs are activated automatically on Vercel Pro/Enterprise.
