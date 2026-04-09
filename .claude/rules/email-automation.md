---
description: Email automation — Resend sending, cron schedules, unsubscribe flow
paths:
  - src/app/api/cron/**
  - src/lib/emails.ts
  - src/app/api/unsubscribe/**
---

# Email Automation

- **Sending**: Resend SDK (HubSpot can't send via API on Starter plan)
- **State tracking**: HubSpot Notes with `[AUTO:TAG]` prefixes
- **Scheduling**: Vercel Cron Jobs (vercel.json)
- **Unsubscribe**: `/api/unsubscribe` with HMAC-signed email links

## Cron Routes
- `/api/cron/welcome-sequence` — new contact drip emails
- `/api/cron/review-request` — post-service review asks
- `/api/cron/pre-season` — seasonal marketing emails
- `/api/cron/social-post` — Facebook organic posting (Tue/Thu/Sat 10 AM EST)

## Email Templates (in src/lib/emails.ts)
- quoteConfirmationEmail, bookingConfirmationEmail
- siteVisitRequestEmail, chatHandoffEmail
- paymentReceivedEmail, jobCompleteSummaryEmail

## Note Tags for Dedup
- `[AUTO:WELCOME-1]`, `[AUTO:WELCOME-2]`, etc.
- `[AUTO:REVIEW-REQUEST]`
- `[AUTO:PRE-SEASON]`
- Removed `output: "export"` from next.config.ts to enable API routes
