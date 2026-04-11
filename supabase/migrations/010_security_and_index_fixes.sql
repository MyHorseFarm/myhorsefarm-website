-- 010_security_and_index_fixes.sql
-- Align production DB with runtime expectations and linter guidance.

create or replace function public.check_rate_limit(
  p_key text,
  p_limit integer,
  p_window_start timestamptz
) returns integer
language plpgsql
set search_path = public
as $$
declare
  v_count integer;
begin
  insert into rate_limits (key, count, window_start)
  values (p_key, 1, now())
  on conflict (key) do update set
    count = case
      when rate_limits.window_start < p_window_start then 1
      else rate_limits.count + 1
    end,
    window_start = case
      when rate_limits.window_start < p_window_start then now()
      else rate_limits.window_start
    end
  returning count into v_count;

  return v_count;
end;
$$;

create index if not exists idx_bookings_assigned_crew on public.bookings(assigned_crew);
create index if not exists idx_bookings_quote_id on public.bookings(quote_id);
create index if not exists idx_bookings_recurring_customer_id on public.bookings(recurring_customer_id);
create index if not exists idx_chat_sessions_quote_id on public.chat_sessions(quote_id);
create index if not exists idx_email_ab_sends_test_id on public.email_ab_sends(test_id);
create index if not exists idx_invoices_customer_id on public.invoices(customer_id);
create index if not exists idx_invoices_service_log_id on public.invoices(service_log_id);
create index if not exists idx_portal_tokens_customer_id on public.portal_tokens(customer_id);
create index if not exists idx_quotes_recurring_customer_id on public.quotes(recurring_customer_id);
create index if not exists idx_quotes_service_key on public.quotes(service_key);
create index if not exists idx_referrals_referee_quote_id on public.referrals(referee_quote_id);
create index if not exists idx_referrals_referrer_customer_id on public.referrals(referrer_customer_id);
create index if not exists idx_service_logs_assigned_crew on public.service_logs(assigned_crew);

create table if not exists public.email_suppression_list (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  reason text not null default 'bounced',
  created_at timestamptz not null default now()
);

create table if not exists public.email_send_log (
  id uuid primary key default gen_random_uuid(),
  to_email text not null,
  subject text not null,
  template_name text,
  priority text not null default 'MEDIUM' check (priority in ('CRITICAL','HIGH','MEDIUM','LOW')),
  status text not null default 'sent' check (status in ('sent','skipped','failed','suppressed')),
  error_message text,
  resend_id text,
  created_at timestamptz not null default now()
);

create index if not exists idx_email_send_log_created_at on public.email_send_log(created_at);
create index if not exists idx_email_send_log_to_email on public.email_send_log(to_email);
create index if not exists idx_email_send_log_status on public.email_send_log(status);
create index if not exists idx_email_suppression_list_email on public.email_suppression_list(email);

alter table public.email_send_log enable row level security;
alter table public.email_suppression_list enable row level security;