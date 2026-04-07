CREATE TABLE IF NOT EXISTS social_posts (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id text NOT NULL,
  platform text NOT NULL,
  theme text,
  service text,
  text_content text,
  image text,
  facebook_post_id text,
  status text DEFAULT 'posted',
  error_message text,
  posted_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

CREATE INDEX idx_social_posts_date ON social_posts(posted_at DESC);
CREATE UNIQUE INDEX idx_social_posts_dedup ON social_posts(post_id, platform, (posted_at::date));
