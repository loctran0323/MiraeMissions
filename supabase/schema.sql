-- Mirae Missions — Supabase schema.
-- Run this once in the Supabase dashboard: SQL Editor → New query → paste → Run.
-- Then run `npm run seed` to load missions + the default admin/demo accounts.

create table if not exists users (
  id            bigint generated always as identity primary key,
  name          text not null,
  email         text not null unique,
  password_hash text not null,
  role          text not null default 'intern',
  status        text not null default 'pending',
  created_at    timestamptz not null default now()
);

create table if not exists missions (
  id                bigint generated always as identity primary key,
  slug              text not null unique,
  title             text not null,
  short_description text not null,
  instructions      text not null,
  deliverable_type  text not null,
  sort_order        integer not null
);

create table if not exists submissions (
  id            bigint generated always as identity primary key,
  user_id       bigint not null references users(id) on delete cascade,
  mission_id    bigint not null references missions(id) on delete cascade,
  status        text not null default 'submitted',
  memo          text,
  admin_comment text,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),
  reviewed_at   timestamptz,
  unique (user_id, mission_id)
);

create table if not exists submission_files (
  id            bigint generated always as identity primary key,
  submission_id bigint not null references submissions(id) on delete cascade,
  path          text not null,
  original_name text not null,
  mime_type     text not null,
  kind          text not null default 'other'
);

create index if not exists submissions_user_idx on submissions (user_id);
create index if not exists submission_files_sub_idx on submission_files (submission_id);

-- Private Storage bucket for uploaded proof (photos/videos).
-- The app reads/writes it with the service-role key, so no extra RLS policies
-- are needed. Keep it PRIVATE so files are only served through the guarded
-- /api/files route.
insert into storage.buckets (id, name, public)
values ('uploads', 'uploads', false)
on conflict (id) do nothing;
