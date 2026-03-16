-- Migration: Service tier pricing
-- Run in Supabase SQL Editor

-- Add tier columns to service_pricing
ALTER TABLE service_pricing
  ADD COLUMN IF NOT EXISTS premium_rate_multiplier numeric(4,2) DEFAULT 1.5,
  ADD COLUMN IF NOT EXISTS premium_description text DEFAULT 'Priority scheduling, dedicated crew, same-day availability';

-- Add tier to quotes
ALTER TABLE quotes ADD COLUMN IF NOT EXISTS service_tier text DEFAULT 'standard'
  CHECK (service_tier IN ('standard', 'premium'));
