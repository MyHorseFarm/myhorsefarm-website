---
description: Square payment integration — webhook processing, dedup, receipt emails
globs: src/lib/square.ts, src/app/api/webhooks/square/**
---

# Square Integration

- **Webhook route**: `/api/webhooks/square` (receives `payment.updated` events)
- **Library**: `src/lib/square.ts` (SDK client, payment/customer/order helpers)
- **Env vars**: `SQUARE_ACCESS_TOKEN`, `SQUARE_WEBHOOK_SIGNATURE_KEY`, `SQUARE_ENVIRONMENT`
- **Optional env**: `SQUARE_WEBHOOK_URL` (overrides default notification URL for signature verification)

## Flow
Square payment → webhook → HubSpot contact/deal update → receipt email via Resend

## Dedup
Uses `[SQUARE:PAYMENT]` note tag with Payment ID to prevent double-processing

## Email Templates
- `paymentReceivedEmail`, `jobCompleteSummaryEmail` in `src/lib/emails.ts`
