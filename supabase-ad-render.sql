-- Ad Render Jobs table
CREATE TABLE IF NOT EXISTS ad_render_jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  composition_id TEXT NOT NULL DEFAULT 'AdVideo',
  input_props JSONB NOT NULL DEFAULT '{}',
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'rendering', 'completed', 'failed')),
  render_id TEXT,
  output_url TEXT,
  progress NUMERIC DEFAULT 0 CHECK (progress >= 0 AND progress <= 1),
  error_message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_ad_render_jobs_status ON ad_render_jobs(status);
CREATE INDEX IF NOT EXISTS idx_ad_render_jobs_render_id ON ad_render_jobs(render_id);

-- Ad Images storage bucket (run in Supabase dashboard or via API)
-- INSERT INTO storage.buckets (id, name, public) VALUES ('ad-images', 'ad-images', true);
-- CREATE POLICY "Public read access" ON storage.objects FOR SELECT USING (bucket_id = 'ad-images');
-- CREATE POLICY "Auth insert access" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'ad-images');
