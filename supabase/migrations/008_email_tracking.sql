-- ============================================================
-- Email Tracking & Quota System
-- Migration: 008_email_tracking
-- ============================================================

-- 1) email_send_log: tracks every outbound email
CREATE TABLE IF NOT EXISTS email_send_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  to_email text NOT NULL,
  subject text,
  template_name text,
  priority text NOT NULL DEFAULT 'normal' CHECK (priority IN ('critical', 'high', 'normal', 'low', 'marketing')),
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'failed', 'bounced', 'suppressed')),
  resend_id text,
  error_message text,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Indexes for common queries
CREATE INDEX IF NOT EXISTS idx_email_send_log_created_at ON email_send_log (created_at);
CREATE INDEX IF NOT EXISTS idx_email_send_log_to_email ON email_send_log (to_email);
CREATE INDEX IF NOT EXISTS idx_email_send_log_status ON email_send_log (status);
CREATE INDEX IF NOT EXISTS idx_email_send_log_date ON email_send_log ((created_at::date));

-- 2) email_daily_stats: aggregated daily statistics
CREATE TABLE IF NOT EXISTS email_daily_stats (
  date date PRIMARY KEY DEFAULT CURRENT_DATE,
  total_sent integer NOT NULL DEFAULT 0,
  total_bounced integer NOT NULL DEFAULT 0,
  total_suppressed integer NOT NULL DEFAULT 0,
  by_priority jsonb NOT NULL DEFAULT '{}'::jsonb,
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- 3) email_suppression_list: emails that should never receive mail
CREATE TABLE IF NOT EXISTS email_suppression_list (
  email text PRIMARY KEY,
  reason text NOT NULL DEFAULT 'bounced',
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_email_suppression_email ON email_suppression_list (email);

-- 4) email_config: store configurable settings like daily limit
CREATE TABLE IF NOT EXISTS email_config (
  key text PRIMARY KEY,
  value text NOT NULL,
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Set default daily limit (90 = 10% buffer under 100 free tier)
INSERT INTO email_config (key, value) VALUES ('daily_limit', '90')
ON CONFLICT (key) DO NOTHING;

-- ============================================================
-- Seed suppression list with known bounced addresses
-- ============================================================
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
  ('test@test.com', 'test_address'),
  ('jose@test.com', 'test_address'),
  ('sales@myhorsefarm.com', 'internal'),
  ('admin@myhorsefarm.com', 'internal'),
  ('test-audit@myhorsefarm.com', 'test_address')
ON CONFLICT (email) DO NOTHING;

-- ============================================================
-- 5) check_email_quota(): returns remaining sends for today
-- ============================================================
CREATE OR REPLACE FUNCTION check_email_quota()
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_daily_limit integer;
  v_sent_today integer;
  v_remaining integer;
BEGIN
  -- Get configurable daily limit
  SELECT value::integer INTO v_daily_limit
  FROM email_config WHERE key = 'daily_limit';

  IF v_daily_limit IS NULL THEN
    v_daily_limit := 90;
  END IF;

  -- Count emails sent today (only successful sends count)
  SELECT COUNT(*) INTO v_sent_today
  FROM email_send_log
  WHERE created_at::date = CURRENT_DATE
    AND status IN ('sent', 'pending');

  v_remaining := GREATEST(v_daily_limit - v_sent_today, 0);

  RETURN jsonb_build_object(
    'daily_limit', v_daily_limit,
    'sent_today', v_sent_today,
    'remaining', v_remaining,
    'quota_exceeded', v_remaining <= 0,
    'checked_at', now()
  );
END;
$$;

-- ============================================================
-- 6) increment_email_counter(): log a sent email and update stats
-- ============================================================
CREATE OR REPLACE FUNCTION increment_email_counter(
  p_to_email text,
  p_subject text DEFAULT NULL,
  p_template_name text DEFAULT NULL,
  p_priority text DEFAULT 'normal',
  p_status text DEFAULT 'sent',
  p_resend_id text DEFAULT NULL,
  p_error_message text DEFAULT NULL
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_log_id uuid;
  v_quota jsonb;
  v_is_suppressed boolean;
  v_final_status text;
BEGIN
  -- Check if email is suppressed
  SELECT EXISTS(
    SELECT 1 FROM email_suppression_list WHERE email = lower(p_to_email)
  ) INTO v_is_suppressed;

  IF v_is_suppressed THEN
    v_final_status := 'suppressed';
  ELSE
    v_final_status := p_status;
  END IF;

  -- Insert into send log
  INSERT INTO email_send_log (to_email, subject, template_name, priority, status, resend_id, error_message)
  VALUES (lower(p_to_email), p_subject, p_template_name, p_priority, v_final_status, p_resend_id, p_error_message)
  RETURNING id INTO v_log_id;

  -- Upsert daily stats
  INSERT INTO email_daily_stats (date, total_sent, total_bounced, total_suppressed, by_priority)
  VALUES (
    CURRENT_DATE,
    CASE WHEN v_final_status = 'sent' THEN 1 ELSE 0 END,
    CASE WHEN v_final_status = 'bounced' THEN 1 ELSE 0 END,
    CASE WHEN v_final_status = 'suppressed' THEN 1 ELSE 0 END,
    jsonb_build_object(p_priority, 1)
  )
  ON CONFLICT (date) DO UPDATE SET
    total_sent = email_daily_stats.total_sent + CASE WHEN v_final_status = 'sent' THEN 1 ELSE 0 END,
    total_bounced = email_daily_stats.total_bounced + CASE WHEN v_final_status = 'bounced' THEN 1 ELSE 0 END,
    total_suppressed = email_daily_stats.total_suppressed + CASE WHEN v_final_status = 'suppressed' THEN 1 ELSE 0 END,
    by_priority = jsonb_set(
      COALESCE(email_daily_stats.by_priority, '{}'::jsonb),
      ARRAY[p_priority],
      to_jsonb(COALESCE((email_daily_stats.by_priority->>p_priority)::integer, 0) + 1)
    ),
    updated_at = now();

  -- Return current quota status
  v_quota := check_email_quota();

  RETURN jsonb_build_object(
    'log_id', v_log_id,
    'status', v_final_status,
    'was_suppressed', v_is_suppressed,
    'quota', v_quota
  );
END;
$$;

-- ============================================================
-- RLS Policies
-- ============================================================

-- Enable RLS on all tables
ALTER TABLE email_send_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_daily_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_suppression_list ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_config ENABLE ROW LEVEL SECURITY;

-- Service role gets full access (used by API routes with service_role key)
CREATE POLICY "Service role full access on email_send_log"
  ON email_send_log FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "Service role full access on email_daily_stats"
  ON email_daily_stats FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "Service role full access on email_suppression_list"
  ON email_suppression_list FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "Service role full access on email_config"
  ON email_config FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- Anon/authenticated can only read stats (for dashboard)
CREATE POLICY "Authenticated read email_daily_stats"
  ON email_daily_stats FOR SELECT
  USING (auth.role() = 'authenticated');
