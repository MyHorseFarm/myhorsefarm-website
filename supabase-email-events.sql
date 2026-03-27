-- Email events tracking table for daily digest and engagement analytics
-- Run this in the Supabase SQL editor

CREATE TABLE IF NOT EXISTS email_events (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  resend_email_id text NOT NULL,
  event_type text NOT NULL, -- sent, delivered, opened, clicked, bounced, complained
  recipient_email text,
  subject text,
  click_url text,
  event_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Index for daily digest queries (events by date)
CREATE INDEX IF NOT EXISTS idx_email_events_event_at ON email_events (event_at DESC);

-- Index for per-recipient lookups
CREATE INDEX IF NOT EXISTS idx_email_events_recipient ON email_events (recipient_email, event_type);

-- Index for dedup (same event for same email)
CREATE INDEX IF NOT EXISTS idx_email_events_resend_id ON email_events (resend_email_id, event_type);
