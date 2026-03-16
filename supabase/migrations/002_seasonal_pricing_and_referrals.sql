-- Migration: Add seasonal pricing columns + referrals table
-- Run in Supabase SQL Editor

-- ---------------------------------------------------------------------------
-- Seasonal pricing columns on service_pricing
-- ---------------------------------------------------------------------------
ALTER TABLE service_pricing
  ADD COLUMN IF NOT EXISTS peak_rate numeric(10,2),
  ADD COLUMN IF NOT EXISTS peak_start_month integer CHECK (peak_start_month BETWEEN 1 AND 12),
  ADD COLUMN IF NOT EXISTS peak_end_month integer CHECK (peak_end_month BETWEEN 1 AND 12);

-- Default: WEF season Oct-Apr for recurring services
UPDATE service_pricing
SET peak_start_month = 10, peak_end_month = 4
WHERE is_recurring = true;

-- ---------------------------------------------------------------------------
-- Referrals table
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS referrals (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  referrer_customer_id uuid REFERENCES recurring_customers(id),
  referrer_name text NOT NULL,
  referrer_email text NOT NULL,
  referral_code text UNIQUE NOT NULL,
  referee_name text,
  referee_email text,
  referee_quote_id uuid REFERENCES quotes(id),
  status text NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending','signed_up','completed','rewarded')),
  referrer_reward_amount numeric(10,2) NOT NULL DEFAULT 50.00,
  referee_discount_amount numeric(10,2) NOT NULL DEFAULT 25.00,
  referrer_reward_applied boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  completed_at timestamptz
);

ALTER TABLE referrals ENABLE ROW LEVEL SECURITY;
CREATE INDEX IF NOT EXISTS idx_referrals_code ON referrals(referral_code);
CREATE INDEX IF NOT EXISTS idx_referrals_referrer ON referrals(referrer_email);
CREATE INDEX IF NOT EXISTS idx_referrals_status ON referrals(status);

-- Add referral_code column to quotes for tracking
ALTER TABLE quotes ADD COLUMN IF NOT EXISTS referral_code text;
