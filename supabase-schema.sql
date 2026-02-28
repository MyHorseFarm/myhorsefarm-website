-- Supabase Schema for My Horse Farm AI Quoting & Scheduling
-- Run this in the Supabase SQL Editor after creating your project.

-- Enable UUID generation
create extension if not exists "uuid-ossp";

-- ---------------------------------------------------------------------------
-- service_pricing
-- ---------------------------------------------------------------------------
create table service_pricing (
  id uuid primary key default uuid_generate_v4(),
  service_key text unique not null,
  display_name text not null,
  description text not null default '',
  unit text not null check (unit in ('per_load','per_can','per_ton','per_yard','flat','per_sqft')),
  base_rate numeric(10,2) not null,
  minimum_charge numeric(10,2),
  requires_site_visit boolean not null default false,
  is_recurring boolean not null default false,
  frequency_options jsonb,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

-- Seed services with real pricing
insert into service_pricing (service_key, display_name, description, unit, base_rate, minimum_charge, requires_site_visit, is_recurring, frequency_options) values
  ('manure_removal', 'Manure Removal', '$350 per 40-yard load. Leak-proof bins, scheduled pickups, weight tickets on every load.', 'per_load', 350.00, null, false, true, '["daily","weekly","biweekly","monthly"]'),
  ('trash_bin_service', 'Trash Bin Service', 'One-yard trash bin service for smaller cleanups — $25 per can.', 'per_can', 25.00, null, false, true, '["daily","weekly","biweekly","monthly"]'),
  ('junk_removal', 'Junk Removal', 'Old fencing, debris, equipment — we haul it all. $75/ton, up to 10 tons per truck.', 'per_ton', 75.00, null, false, false, null),
  ('sod_installation', 'Sod Installation', 'Professional paddock sod for safe, lush footing.', 'per_sqft', 0.85, 500.00, true, false, null),
  ('fill_dirt', 'Fill Dirt Delivery', 'Screened fill for leveling paddocks and improving drainage.', 'per_yard', 35.00, 350.00, false, false, null),
  ('dumpster_rental', 'Dumpster Rental', '20-yard containers for barn cleanouts and renovations.', 'flat', 450.00, null, false, false, null),
  ('farm_repairs', 'Farm Repairs & Maintenance', 'Fencing, gates, stalls, driveways, and more.', 'flat', 0.00, null, true, false, null),
  ('millings_asphalt', 'Millings Asphalt Delivery', '20-yard loads of recycled asphalt millings.', 'per_yard', 30.00, 300.00, false, false, null);

-- ---------------------------------------------------------------------------
-- schedule_settings (single-row config)
-- ---------------------------------------------------------------------------
create table schedule_settings (
  id uuid primary key default uuid_generate_v4(),
  max_jobs_per_day integer not null default 4,
  work_days integer[] not null default '{1,2,3,4,5}', -- Mon-Fri (0=Sun..6=Sat)
  blocked_dates date[] not null default '{}',
  updated_at timestamptz not null default now()
);

-- Seed default settings
insert into schedule_settings (max_jobs_per_day, work_days) values (4, '{1,2,3,4,5}');

-- ---------------------------------------------------------------------------
-- quotes
-- ---------------------------------------------------------------------------
create table quotes (
  id uuid primary key default uuid_generate_v4(),
  quote_number text unique not null,
  status text not null default 'pending' check (status in ('pending','accepted','expired','declined','pending_site_visit')),
  customer_name text not null,
  customer_email text not null,
  customer_phone text not null,
  customer_location text not null,
  service_key text not null references service_pricing(service_key),
  property_details jsonb not null default '{}',
  estimated_amount numeric(10,2) not null,
  pricing_breakdown jsonb not null default '{}',
  requires_site_visit boolean not null default false,
  source text not null default 'form' check (source in ('form','chatbot')),
  chat_session_id uuid,
  hubspot_contact_id text,
  hubspot_deal_id text,
  expires_at timestamptz not null,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- bookings
-- ---------------------------------------------------------------------------
create table bookings (
  id uuid primary key default uuid_generate_v4(),
  booking_number text unique not null,
  quote_id uuid references quotes(id),
  status text not null default 'confirmed' check (status in ('confirmed','completed','cancelled')),
  customer_name text not null,
  customer_email text not null,
  customer_phone text not null,
  customer_location text not null,
  service_key text not null,
  scheduled_date date not null,
  time_slot text not null check (time_slot in ('morning','afternoon')),
  hubspot_deal_id text,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- chat_sessions
-- ---------------------------------------------------------------------------
create table chat_sessions (
  id uuid primary key default uuid_generate_v4(),
  customer_name text,
  customer_email text,
  customer_phone text,
  messages jsonb not null default '[]',
  status text not null default 'active' check (status in ('active','resolved','handed_off')),
  extracted_service text,
  extracted_location text,
  extracted_details jsonb,
  quote_id uuid references quotes(id),
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- RLS: Deny all public access (service_role key bypasses RLS)
-- ---------------------------------------------------------------------------
alter table service_pricing enable row level security;
alter table schedule_settings enable row level security;
alter table quotes enable row level security;
alter table bookings enable row level security;
alter table chat_sessions enable row level security;

-- No RLS policies = no public access. service_role key bypasses RLS.

-- ---------------------------------------------------------------------------
-- Indexes
-- ---------------------------------------------------------------------------
create index idx_quotes_email on quotes(customer_email);
create index idx_quotes_status on quotes(status);
create index idx_quotes_created on quotes(created_at);
create index idx_bookings_date on bookings(scheduled_date);
create index idx_bookings_location on bookings(customer_location);
create index idx_bookings_status on bookings(status);
create index idx_chat_sessions_status on chat_sessions(status);
