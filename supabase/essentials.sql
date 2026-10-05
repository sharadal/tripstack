-- Run this once in the Supabase SQL Editor (Dashboard -> SQL Editor -> New query)
-- to set up "My Travel Essentials": packing lists each user owns.
--
-- Safe to re-run: every statement either checks for existing objects or
-- replaces them.
--
-- Owner-only for now: users can see, create, edit and delete only their own
-- lists. Signed-out visitors get no access at all.


-- ---------------------------------------------------------------------------
-- 1. Table
-- ---------------------------------------------------------------------------

create table if not exists public.essentials_lists (
  id uuid primary key default gen_random_uuid(),
  -- Filled in from the signed-in user, so the app never sends it. The list
  -- is removed with the user.
  user_id uuid not null default auth.uid()
    references auth.users (id) on delete cascade,
  title text not null check (char_length(title) between 1 and 80),
  -- Each item's length (max 60) is checked in the Server Action.
  items text[] not null default '{}' check (cardinality(items) <= 50),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists essentials_lists_user_id_idx
  on public.essentials_lists (user_id);

alter table public.essentials_lists enable row level security;


-- ---------------------------------------------------------------------------
-- 2. RLS: users manage only their own lists
-- ---------------------------------------------------------------------------

drop policy if exists "Users can read their own essentials lists" on public.essentials_lists;
create policy "Users can read their own essentials lists"
  on public.essentials_lists
  for select
  to authenticated
  using ((select auth.uid()) = user_id);

drop policy if exists "Users can create their own essentials lists" on public.essentials_lists;
create policy "Users can create their own essentials lists"
  on public.essentials_lists
  for insert
  to authenticated
  with check ((select auth.uid()) = user_id);

drop policy if exists "Users can update their own essentials lists" on public.essentials_lists;
create policy "Users can update their own essentials lists"
  on public.essentials_lists
  for update
  to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

drop policy if exists "Users can delete their own essentials lists" on public.essentials_lists;
create policy "Users can delete their own essentials lists"
  on public.essentials_lists
  for delete
  to authenticated
  using ((select auth.uid()) = user_id);

-- Belt and braces on top of RLS: signed-out visitors get nothing, and
-- signed-in users can only change the title and items (not the owner or
-- timestamps).
revoke all on public.essentials_lists from anon;
revoke insert, update, delete on public.essentials_lists from authenticated;
grant select, delete on public.essentials_lists to authenticated;
grant insert (title, items) on public.essentials_lists to authenticated;
grant update (title, items) on public.essentials_lists to authenticated;


-- ---------------------------------------------------------------------------
-- 3. Keep updated_at current
-- ---------------------------------------------------------------------------

create or replace function public.set_essentials_lists_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists essentials_lists_set_updated_at on public.essentials_lists;
create trigger essentials_lists_set_updated_at
  before update on public.essentials_lists
  for each row execute function public.set_essentials_lists_updated_at();
