-- Phase 3: Email A/B testing tables
CREATE TABLE email_ab_tests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email_template text NOT NULL,
  variant_a jsonb NOT NULL,
  variant_b jsonb NOT NULL,
  traffic_split numeric(3,2) DEFAULT 0.5,
  active boolean DEFAULT true,
  winner text,
  created_at timestamptz DEFAULT now(),
  ended_at timestamptz
);

CREATE TABLE email_ab_sends (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  test_id uuid REFERENCES email_ab_tests(id),
  resend_email_id text,
  recipient_email text NOT NULL,
  variant text NOT NULL CHECK (variant IN ('a','b')),
  opened boolean DEFAULT false,
  clicked boolean DEFAULT false,
  opened_at timestamptz,
  clicked_at timestamptz,
  sent_at timestamptz DEFAULT now()
);
