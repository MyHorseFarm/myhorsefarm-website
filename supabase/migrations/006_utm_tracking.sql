-- Phase 1: UTM tracking columns
ALTER TABLE quotes ADD COLUMN IF NOT EXISTS utm_params jsonb;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS utm_params jsonb;
ALTER TABLE recurring_customers ADD COLUMN IF NOT EXISTS utm_params jsonb;
