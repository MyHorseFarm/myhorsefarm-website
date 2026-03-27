-- Referrals table for the referral program leaderboard
-- Run this in the Supabase SQL Editor

create table referrals (
  id uuid primary key default uuid_generate_v4(),
  referrer_name text not null,
  referrer_email text,
  referrer_phone text,
  referred_name text not null,
  referred_email text,
  referred_phone text,
  status text not null default 'pending'
    check (status in ('pending','completed','expired','cancelled')),
  service_key text,
  booking_id uuid references bookings(id),
  reward_amount numeric(10,2),
  reward_applied boolean not null default false,
  notes text,
  created_at timestamptz not null default now(),
  completed_at timestamptz
);

-- RLS: deny public access (service_role key bypasses RLS)
alter table referrals enable row level security;

-- Indexes
create index idx_referrals_referrer_name on referrals(referrer_name);
create index idx_referrals_referrer_email on referrals(referrer_email);
create index idx_referrals_status on referrals(status);
create index idx_referrals_created on referrals(created_at);
