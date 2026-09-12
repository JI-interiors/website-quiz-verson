-- Linva Interiors CRM: recommended RLS baseline.
-- Run this in Supabase SQL Editor after reviewing your existing policies.
-- IMPORTANT: public lead capture requires INSERT for anon/authenticated.
-- CRM reads/updates require an authenticated Supabase user.

alter table public.leads enable row level security;

-- Remove broad policies by these expected names if they exist.
drop policy if exists "Allow anonymous read leads" on public.leads;
drop policy if exists "Public read leads" on public.leads;
drop policy if exists "Allow public select leads" on public.leads;
drop policy if exists "Allow anonymous update leads" on public.leads;
drop policy if exists "Public update leads" on public.leads;

create policy "Public can submit leads"
on public.leads
for insert
to anon, authenticated
with check (true);

create policy "Authenticated CRM can read leads"
on public.leads
for select
to authenticated
using (auth.uid() is not null);

create policy "Authenticated CRM can update leads"
on public.leads
for update
to authenticated
using (auth.uid() is not null)
with check (auth.uid() is not null);

-- No DELETE policy is intentionally created.
-- Keep service_role/server-side administration separate from browser code.


-- V89: allow authenticated CRM users to permanently delete leads.
-- Run this only if you want the Delete button in the CRM to perform a hard delete.
create policy "authenticated_delete_leads"
on public.leads
for delete
to authenticated
using (true);
