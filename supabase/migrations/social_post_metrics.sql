-- Social post performance metrics (populated by social-analytics cron)
CREATE TABLE IF NOT EXISTS social_post_metrics (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id text NOT NULL,
  platform text NOT NULL,
  external_post_id text,
  impressions integer DEFAULT 0,
  reach integer DEFAULT 0,
  likes integer DEFAULT 0,
  comments integer DEFAULT 0,
  shares integer DEFAULT 0,
  clicks integer DEFAULT 0,
  engagement_rate numeric(5,2) DEFAULT 0,
  video_views integer DEFAULT 0,
  measured_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  UNIQUE(post_id, platform)
);

-- Index for quick lookups by post and date
CREATE INDEX IF NOT EXISTS idx_social_metrics_post ON social_post_metrics(post_id, platform);
CREATE INDEX IF NOT EXISTS idx_social_metrics_measured ON social_post_metrics(measured_at DESC);
