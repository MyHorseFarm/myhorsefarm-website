create table if not exists blog_posts (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  description text not null,
  content text not null,  -- full HTML body content
  author text not null default 'My Horse Farm Team',
  category text not null default 'Farm Tips',
  tags text[] default '{}',
  image_url text,  -- optional featured image
  published boolean not null default false,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_blog_posts_published on blog_posts (published, published_at desc);
create index if not exists idx_blog_posts_slug on blog_posts (slug);
