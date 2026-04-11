-- 011_email_tables_rls_no_policies.sql
-- Enforce deny-by-default pattern: RLS enabled, no explicit policies.

alter table public.email_send_log enable row level security;
alter table public.email_suppression_list enable row level security;

drop policy if exists service_role_all_email_send_log on public.email_send_log;
drop policy if exists service_role_all_email_suppression_list on public.email_suppression_list;