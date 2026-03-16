-- Migration: Contract management + Google reviews cache + SMS opt-in
-- Run in Supabase SQL Editor

-- ---------------------------------------------------------------------------
-- Contract columns on recurring_customers
-- ---------------------------------------------------------------------------
ALTER TABLE recurring_customers
  ADD COLUMN IF NOT EXISTS contract_type text DEFAULT 'month_to_month'
    CHECK (contract_type IN ('month_to_month', '6_month', 'annual')),
  ADD COLUMN IF NOT EXISTS contract_start_date date,
  ADD COLUMN IF NOT EXISTS contract_end_date date,
  ADD COLUMN IF NOT EXISTS contract_discount_pct numeric(5,2) DEFAULT 0,
  ADD COLUMN IF NOT EXISTS auto_renew boolean DEFAULT true,
  ADD COLUMN IF NOT EXISTS sms_opted_in boolean DEFAULT false;

-- ---------------------------------------------------------------------------
-- Google reviews cache
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS google_reviews_cache (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  author_name text NOT NULL,
  rating integer NOT NULL CHECK (rating BETWEEN 1 AND 5),
  text text,
  time timestamptz NOT NULL,
  profile_photo_url text,
  relative_time_description text,
  cached_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE google_reviews_cache ENABLE ROW LEVEL SECURITY;

-- Store aggregate review data
CREATE TABLE IF NOT EXISTS google_reviews_summary (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  total_reviews integer NOT NULL DEFAULT 0,
  average_rating numeric(3,2) NOT NULL DEFAULT 0,
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE google_reviews_summary ENABLE ROW LEVEL SECURITY;

-- Seed with initial row
INSERT INTO google_reviews_summary (total_reviews, average_rating)
VALUES (0, 0)
ON CONFLICT DO NOTHING;

-- ---------------------------------------------------------------------------
-- SMS opt-in on quotes
-- ---------------------------------------------------------------------------
ALTER TABLE quotes ADD COLUMN IF NOT EXISTS sms_opted_in boolean DEFAULT false;
