create extension if not exists pgcrypto;

create table if not exists public.user_wallets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users(id) on delete cascade,
  balance_cents integer not null default 0,
  lifetime_earnings_cents integer not null default 0,
  currency text not null default 'USD',
  updated_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create table if not exists public.event_attendance (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  event_id uuid,
  attended_at timestamptz not null default now(),
  check_in_source text not null default 'app',
  points_earned integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.referrals (
  id uuid primary key default gen_random_uuid(),
  referrer_id uuid not null references auth.users(id) on delete cascade,
  referred_user_id uuid references auth.users(id) on delete set null,
  referral_code text not null,
  status text not null default 'pending',
  reward_cents integer not null default 0,
  converted_at timestamptz,
  created_at timestamptz not null default now()
);

alter table public.events add column if not exists vertical text not null default 'GCE Connect';
create index if not exists events_vertical_idx on public.events(vertical);
