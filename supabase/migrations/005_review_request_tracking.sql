ALTER TABLE recurring_customers
  ADD COLUMN IF NOT EXISTS last_review_request_at timestamptz;
