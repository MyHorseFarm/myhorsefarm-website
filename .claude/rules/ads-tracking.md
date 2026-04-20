---
description: Ad tracking, analytics, Meta Pixel, Google Ads, GTM, social posting
globs: src/app/layout.tsx, src/lib/analytics.ts, src/lib/meta-capi.ts, src/lib/social-posts.ts, src/app/api/cron/social-post/**, src/app/api/admin/social/**, src/components/ConversionTracker.tsx, src/components/UtmCapture.tsx, src/components/AudienceSignals.tsx
---

# Ads & Tracking

## GTM
- GTM ID: GTM-TWDPWRQV (loaded in layout.tsx)
- GA4, Facebook Pixel, Google Ads configured

## Google Ads
- Customer ID: 1907045243 ("My horse Farm")
- Login customer ID: 1907045243 (no MCC context needed for reads)
- Conversion tracking ID: AW-385210685
- Active conversion labels (live as of Apr 2026): `C4b1CK33n4ccEL2y17cB` (Lead), `3_vRCKKvqYccEL2y17cB` (Phone Click)
- Budget: $80/day after MHF-19
- Geo targeting: PRESENCE only (updated 2026-04-20)

## Meta / Facebook Pixel
- Dataset/Pixel ID: **1494655975623250** (my horse farm facebook pix)
- Set in `.env` as `META_PIXEL_ID` AND in GTM tag `Facebook Pixel - Base` (updated 2026-04-20, Version 9)
- Browser pixel fires PageView on all pages, Lead on `CE - generate_lead`, InitiateCheckout, Purchase
- Server-side CAPI in `src/lib/meta-capi.ts` (deduped with event IDs)
- CAPI access token in .env.local as META_CAPI_ACCESS_TOKEN
- Business account: My Horse Farm (`109623...`)
- Old pixel ID `1247574672351702` is retired — do not reintroduce

## Analytics (src/lib/analytics.ts)
- trackConversion() fires Google Ads + Meta Pixel events with shared event IDs
- generateEventId() for browser/server dedup
- Enhanced conversions with user data (email, phone, name)

## Social Posting
- 32 post templates in `src/lib/social-posts.ts`
- Cron posts to Facebook: Tue/Thu/Sat at 10 AM EST
- Admin API: `/api/admin/social`
- Facebook Page Access Token in .env.local as FACEBOOK_PAGE_ACCESS_TOKEN (permanent)
