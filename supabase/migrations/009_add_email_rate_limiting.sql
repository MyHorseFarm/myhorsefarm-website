-- ============================================================
-- Email Rate Limiting Migration
-- Migration: 009_add_email_rate_limiting
-- ============================================================

-- Drop existing constraints and recreate email_send_log with updated schema
-- Drop dependent policies first
DROP POLICY IF EXISTS "Service role full access on email_send_log" ON email_send_log;
DROP POLICY IF EXISTS "service_role_all_email_send_log" ON email_send_log;

-- Drop existing check constraints
ALTER TABLE email_send_log DROP CONSTRAINT IF EXISTS email_send_log_priority_check;
ALTER TABLE email_send_log DROP CONSTRAINT IF EXISTS email_send_log_status_check;

-- Update priority values to uppercase and change 'normal' -> 'MEDIUM', 'marketing' -> 'LOW'
UPDATE email_send_log SET priority = CASE
  WHEN priority = 'critical' THEN 'CRITICAL'
  WHEN priority = 'high' THEN 'HIGH'
  WHEN priority = 'normal' THEN 'MEDIUM'
  WHEN priority = 'low' THEN 'LOW'
  WHEN priority = 'marketing' THEN 'LOW'
  ELSE 'MEDIUM'
END;

-- Update status values: 'pending' -> 'sent', 'bounced' -> 'failed'
UPDATE email_send_log SET status = CASE
  WHEN status = 'pending' THEN 'sent'
  WHEN status = 'bounced' THEN 'failed'
  WHEN status = 'sent' THEN 'sent'
  WHEN status = 'failed' THEN 'failed'
  WHEN status = 'suppressed' THEN 'suppressed'
  ELSE 'sent'
END;

-- Set new default
ALTER TABLE email_send_log ALTER COLUMN priority SET DEFAULT 'MEDIUM';
ALTER TABLE email_send_log ALTER COLUMN status SET DEFAULT 'sent';

-- Add new check constraints
ALTER TABLE email_send_log ADD CONSTRAINT email_send_log_priority_check
  CHECK (priority IN ('CRITICAL','HIGH','MEDIUM','LOW'));
ALTER TABLE email_send_log ADD CONSTRAINT email_send_log_status_check
  CHECK (status IN ('sent','skipped','failed','suppressed'));

-- Recreate email_suppression_list with id column
-- First, drop dependent policies
DROP POLICY IF EXISTS "Service role full access on email_suppression_list" ON email_suppression_list;
DROP POLICY IF EXISTS "service_role_all_email_suppression_list" ON email_suppression_list;

-- Add id column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'email_suppression_list' AND column_name = 'id'
  ) THEN
    ALTER TABLE email_suppression_list ADD COLUMN id uuid DEFAULT gen_random_uuid();
    -- Drop existing primary key on email
    ALTER TABLE email_suppression_list DROP CONSTRAINT IF EXISTS email_suppression_list_pkey;
    -- Add new primary key on id
    ALTER TABLE email_suppression_list ADD PRIMARY KEY (id);
    -- Add unique constraint on email
    ALTER TABLE email_suppression_list ADD CONSTRAINT email_suppression_list_email_key UNIQUE (email);
  END IF;
END $$;

-- Ensure indexes exist
CREATE INDEX IF NOT EXISTS idx_email_send_log_created_at ON email_send_log(created_at);
CREATE INDEX IF NOT EXISTS idx_email_send_log_to_email ON email_send_log(to_email);
CREATE INDEX IF NOT EXISTS idx_email_suppression_list_email ON email_suppression_list(email);

-- Seed suppression list with bounced emails (idempotent)
INSERT INTO email_suppression_list (email, reason) VALUES
  ('bobheil@comcast.net', 'bounced'),
  ('djlub@frontiernet.net', 'bounced'),
  ('tla442@comcast.net', 'bounced'),
  ('avilla@hebkitchen.com', 'bounced'),
  ('info@bgstables.com', 'bounced'),
  ('ctmossgirl@apl.com', 'bounced'),
  ('jland@popeandland.com', 'bounced'),
  ('monopolioshowstables@gmail.com', 'bounced'),
  ('rgwheelerb@hotmail.com', 'bounced'),
  ('equosouth@crescentbayadvisors.com', 'bounced'),
  ('test@test.com', 'bounced'),
  ('jose@test.com', 'bounced'),
  ('test-audit@myhorsefarm.com', 'bounced')
ON CONFLICT (email) DO UPDATE SET reason = 'bounced';

-- ============================================================
-- Function: get_daily_email_count()
-- Returns count of emails sent today (status='sent')
-- ============================================================
CREATE OR REPLACE FUNCTION get_daily_email_count()
RETURNS integer
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT COUNT(*)::integer
  FROM email_send_log
  WHERE status = 'sent'
    AND created_at >= date_trunc('day', now() AT TIME ZONE 'UTC') AT TIME ZONE 'UTC';
$$;

-- ============================================================
-- Function: is_email_suppressed(check_email text)
-- Returns boolean indicating if email is suppressed
-- ============================================================
CREATE OR REPLACE FUNCTION is_email_suppressed(check_email text)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM email_suppression_list WHERE email = lower(check_email)
  );
$$;

-- ============================================================
-- RLS Policies
-- ============================================================

-- Enable RLS
ALTER TABLE email_send_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_suppression_list ENABLE ROW LEVEL SECURITY;

-- Service role full access policies
CREATE POLICY "service_role_all_email_send_log" ON email_send_log
  FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE POLICY "service_role_all_email_suppression_list" ON email_suppression_list
  FOR ALL TO service_role USING (true) WITH CHECK (true);
