-- PrismWave Ops Hub -- one-time setup. Run in the Supabase SQL editor of the
-- SAME project as PrismWave Studio, AFTER studio/supabase/schema.sql.
-- Safe to re-run.

-- 1) Realtime: lets the Live Feed receive new events without polling.
do $$
begin
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'interaction_events'
  ) then
    alter publication supabase_realtime add table public.interaction_events;
  end if;
end $$;

-- 2) Operator allow-list.
-- Studio's schema.sql grants read access to ANY authenticated user. If this
-- Supabase project also serves another app with user sign-ups, those users
-- would be able to read your leads. This restricts the dashboard tables to
-- the emails listed here.
create table if not exists public.allowed_operators (
  email text primary key
);

alter table public.allowed_operators enable row level security;
-- No policies on purpose: the table is only read through is_operator() below.

create or replace function public.is_operator()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.allowed_operators
    where lower(email) = lower(coalesce(auth.jwt() ->> 'email', ''))
  );
$$;

revoke all on function public.is_operator() from public;
grant execute on function public.is_operator() to authenticated;

-- >>> Replace with the email you sign in to the Ops Hub with:
insert into public.allowed_operators (email) values ('yoichi_dev@proton.me')
on conflict do nothing;

drop policy if exists "operators can read interaction events" on public.interaction_events;
create policy "operators can read interaction events"
on public.interaction_events for select
to authenticated using (public.is_operator());

drop policy if exists "operators can read leads" on public.leads;
create policy "operators can read leads"
on public.leads for select
to authenticated using (public.is_operator());

drop policy if exists "operators can update leads" on public.leads;
create policy "operators can update leads"
on public.leads for update
to authenticated using (public.is_operator()) with check (public.is_operator());

drop policy if exists "operators can read audits" on public.audits;
create policy "operators can read audits"
on public.audits for select
to authenticated using (public.is_operator());

-- 3) Also in Supabase: Authentication > Providers > Email > turn OFF
-- "Allow new users to sign up", and create your operator user under
-- Authentication > Users (email + password).
