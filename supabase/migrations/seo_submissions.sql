CREATE TABLE IF NOT EXISTS seo_submissions (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  url text UNIQUE NOT NULL,
  last_submitted timestamptz NOT NULL DEFAULT now(),
  last_modified text,
  status text DEFAULT 'submitted',
  created_at timestamptz DEFAULT now()
);

CREATE INDEX idx_seo_submissions_url ON seo_submissions(url);
