-- Run this once in the Supabase SQL Editor (Dashboard -> SQL Editor -> New query)
-- to set up the newsletter subscribers table.

create extension if not exists pgcrypto;

create table if not exists public.subscribers (
  id uuid primary key default gen_random_uuid(),
  first_name text not null,
  email text not null unique,
  created_at timestamptz not null default now()
);

alter table public.subscribers enable row level security;

-- The app uses the public anon key from the browser, so anonymous visitors
-- need insert access. There is no select/update/delete policy for anon,
-- so the subscriber list itself stays private to the dashboard.
create policy "Allow anonymous inserts"
  on public.subscribers
  for insert
  to anon
  with check (true);
