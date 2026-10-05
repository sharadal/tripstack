-- Run this once in the Supabase SQL Editor (Dashboard -> SQL Editor -> New query)
-- to set up user profiles and the avatars Storage bucket.
--
-- Safe to re-run: every statement either checks for existing objects or
-- replaces them, and existing profile rows are never overwritten.
--
-- Admin access is NOT part of this: there is deliberately no role column.
-- The app keeps using the ADMIN_EMAILS allowlist (src/lib/admin.ts).


-- ---------------------------------------------------------------------------
-- 1. Profiles table
-- ---------------------------------------------------------------------------

create table if not exists public.profiles (
  -- Same id as the Supabase Auth user; the profile is removed with them.
  id uuid primary key references auth.users (id) on delete cascade,
  first_name text check (char_length(first_name) <= 100),
  last_name text check (char_length(last_name) <= 100),
  bio text check (char_length(bio) <= 500),
  website text check (char_length(website) <= 200),
  instagram text check (char_length(instagram) <= 100),
  tiktok text check (char_length(tiktok) <= 100),
  twitter text check (char_length(twitter) <= 100),
  youtube text check (char_length(youtube) <= 200),
  place text check (char_length(place) <= 100),
  country text check (char_length(country) <= 100),
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

-- Users can read and update only their own row. There is no insert or
-- delete policy: rows are created by the trigger below and removed when the
-- auth user is deleted.
drop policy if exists "Users can read their own profile" on public.profiles;
create policy "Users can read their own profile"
  on public.profiles
  for select
  to authenticated
  using ((select auth.uid()) = id);

drop policy if exists "Users can update their own profile" on public.profiles;
create policy "Users can update their own profile"
  on public.profiles
  for update
  to authenticated
  using ((select auth.uid()) = id)
  with check ((select auth.uid()) = id);

-- Belt and braces on top of RLS: signed-out visitors get no access at all,
-- and signed-in users can only change the editable columns (not id,
-- created_at or updated_at).
revoke all on public.profiles from anon;
revoke insert, update, delete on public.profiles from authenticated;
grant select on public.profiles to authenticated;
grant update (
  first_name, last_name, bio, website, instagram, tiktok, twitter, youtube,
  place, country, avatar_url
) on public.profiles to authenticated;


-- ---------------------------------------------------------------------------
-- 2. Keep updated_at current
-- ---------------------------------------------------------------------------

create or replace function public.set_profiles_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute function public.set_profiles_updated_at();


-- ---------------------------------------------------------------------------
-- 3. Copy name/avatar from the Google sign-in metadata
-- ---------------------------------------------------------------------------
-- Google sign-ins store the name in raw_user_meta_data as full_name/name and
-- sometimes also given_name/family_name; the photo is avatar_url/picture.
-- Prefer the separate given/family names, otherwise split the full name at
-- the first space ("Ada Lovelace King" -> "Ada" + "Lovelace King").

create or replace function public.profile_first_name(meta jsonb)
returns text
language sql
immutable
set search_path = ''
as $$
  select coalesce(
    nullif(trim(meta ->> 'given_name'), ''),
    substring(trim(coalesce(meta ->> 'full_name', meta ->> 'name')) from '^\S+')
  );
$$;

create or replace function public.profile_last_name(meta jsonb)
returns text
language sql
immutable
set search_path = ''
as $$
  select coalesce(
    nullif(trim(meta ->> 'family_name'), ''),
    substring(trim(coalesce(meta ->> 'full_name', meta ->> 'name')) from '^\S+\s+(.*)$')
  );
$$;

create or replace function public.profile_avatar_url(meta jsonb)
returns text
language sql
immutable
set search_path = ''
as $$
  select coalesce(
    nullif(meta ->> 'avatar_url', ''),
    nullif(meta ->> 'picture', '')
  );
$$;

-- Internal helpers only -- not callable through the Supabase API.
revoke execute on function public.profile_first_name(jsonb) from public, anon, authenticated;
revoke execute on function public.profile_last_name(jsonb) from public, anon, authenticated;
revoke execute on function public.profile_avatar_url(jsonb) from public, anon, authenticated;


-- ---------------------------------------------------------------------------
-- 4. Create a profile automatically for every new user
-- ---------------------------------------------------------------------------
-- security definer: runs with the owner's rights so it can insert even
-- though users have no insert permission on profiles.

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, first_name, last_name, avatar_url)
  values (
    new.id,
    public.profile_first_name(new.raw_user_meta_data),
    public.profile_last_name(new.raw_user_meta_data),
    public.profile_avatar_url(new.raw_user_meta_data)
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

revoke execute on function public.handle_new_user() from public, anon, authenticated;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();


-- ---------------------------------------------------------------------------
-- 5. One-time backfill for users who signed up before this script
-- ---------------------------------------------------------------------------
-- Includes the existing admin account. Users who already have a profile are
-- left untouched.

insert into public.profiles (id, first_name, last_name, avatar_url, created_at)
select
  u.id,
  public.profile_first_name(u.raw_user_meta_data),
  public.profile_last_name(u.raw_user_meta_data),
  public.profile_avatar_url(u.raw_user_meta_data),
  u.created_at
from auth.users as u
on conflict (id) do nothing;


-- ---------------------------------------------------------------------------
-- 6. Avatars Storage bucket
-- ---------------------------------------------------------------------------
-- Public so avatars display with a plain <img> URL. Supabase itself rejects
-- files over 2 MB (2 * 1024 * 1024 bytes) or of any other image type.

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'avatars',
  'avatars',
  true,
  2097152,
  array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;


-- ---------------------------------------------------------------------------
-- 7. Storage policies: users manage only files in their own folder
-- ---------------------------------------------------------------------------
-- Files live at avatars/<user id>/<file name>. storage.foldername(name)[1]
-- is that first folder, so it must equal the signed-in user's id.
--
-- The select policy is needed because Supabase checks it when replacing
-- (upsert) or deleting a file. It only covers the user's own folder; public
-- image URLs work regardless because the bucket is public.

drop policy if exists "Users can view their own avatar files" on storage.objects;
create policy "Users can view their own avatar files"
  on storage.objects
  for select
  to authenticated
  using (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = (select auth.uid()::text)
  );

drop policy if exists "Users can upload their own avatar" on storage.objects;
create policy "Users can upload their own avatar"
  on storage.objects
  for insert
  to authenticated
  with check (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = (select auth.uid()::text)
  );

drop policy if exists "Users can update their own avatar" on storage.objects;
create policy "Users can update their own avatar"
  on storage.objects
  for update
  to authenticated
  using (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = (select auth.uid()::text)
  )
  with check (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = (select auth.uid()::text)
  );

drop policy if exists "Users can delete their own avatar" on storage.objects;
create policy "Users can delete their own avatar"
  on storage.objects
  for delete
  to authenticated
  using (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = (select auth.uid()::text)
  );
