---
description: Ad tracking, analytics, Meta Pixel, Google Ads, GTM, social posting
globs: src/app/layout.tsx, src/lib/analytics.ts, src/lib/meta-capi.ts, src/lib/social-posts.ts, src/app/api/cron/social-post/**, src/app/api/admin/social/**, src/components/ConversionTracker.tsx, src/components/UtmCapture.tsx, src/components/AudienceSignals.tsx
---

# Ads & Tracking

## GTM
- GTM ID: GTM-TWDPWRQV (loaded in layout.tsx)
- GA4, Facebook Pixel, Google Ads configured

## Google Ads
- Conversion ID: AW-385210685
- Conversion Label: vzneCILiqIccEL2y17cB
- $40/day budget, junk removal ad group launched 2026-04-06

## Meta / Facebook Pixel
- Pixel ID: 1247574672351702 (in layout.tsx and .env.local as META_PIXEL_ID)
- Browser pixel fires PageView on all pages, Lead on quote submit, Schedule on booking
- Server-side CAPI in `src/lib/meta-capi.ts` (deduped with event IDs)
- CAPI access token in .env.local as META_CAPI_ACCESS_TOKEN

## Analytics (src/lib/analytics.ts)
- trackConversion() fires Google Ads + Meta Pixel events with shared event IDs
- generateEventId() for browser/server dedup
- Enhanced conversions with user data (email, phone, name)

## Social Posting
- 32 post templates in `src/lib/social-posts.ts`
- Cron posts to Facebook: Tue/Thu/Sat at 10 AM EST
- Admin API: `/api/admin/social`
- Facebook Page Access Token in .env.local as FACEBOOK_PAGE_ACCESS_TOKEN (permanent)
