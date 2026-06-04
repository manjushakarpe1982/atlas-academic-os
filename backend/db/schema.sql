-- ============================================================================
-- Atlas — Academic OS · Database schema
-- Run this in the Supabase SQL editor (Dashboard → SQL → New query).
-- Safe to run multiple times (uses IF NOT EXISTS / idempotent guards).
-- ============================================================================

-- ── 1. USERS PROFILE TABLE ─────────────────────────────────────────────────
-- One row per auth user. `id` matches auth.users.id.
create table if not exists public.users (
    id          uuid primary key references auth.users (id) on delete cascade,
    email       text,
    first_name  text,
    last_name   text default '',
    full_name   text,
    -- Set to true once the user finishes (or skips) onboarding.
    onboarding_completed boolean not null default false,
    created_at  timestamptz not null default now(),
    updated_at  timestamptz not null default now()
);

-- In case the table already existed without this column:
alter table public.users
    add column if not exists onboarding_completed boolean not null default false;

-- ── 2. ONBOARDING TABLE ────────────────────────────────────────────────────
-- One row per user holding everything collected during the 5-step wizard.
create table if not exists public.onboarding (
    user_id        uuid primary key references public.users (id) on delete cascade,

    -- Step 1 — Welcome / role
    role           text,                       -- high_school | college | graduate | self_learner

    -- Step 2 — Academic profile
    institution    text,
    field_of_study text,
    year_level     text,
    target_gpa     numeric(3, 2),

    -- Step 3 — Goals & interests
    goals          jsonb not null default '[]'::jsonb,  -- array of goal labels
    top_priority   text,

    -- Step 4 — Preferences
    study_time     text,                       -- Morning | Afternoon | Evening | Late night
    session_length text,
    weekday_hours  numeric(4, 1),
    weekend_hours  numeric(4, 1),
    sleep_start    text,
    sleep_end      text,
    fixed_events   jsonb not null default '[]'::jsonb,  -- [{label, days[], time, emoji}]

    -- Meta
    completed      boolean not null default false,
    created_at     timestamptz not null default now(),
    updated_at     timestamptz not null default now()
);

-- ── 3. updated_at trigger ──────────────────────────────────────────────────
create or replace function public.set_updated_at()
returns trigger as $$
begin
    new.updated_at = now();
    return new;
end;
$$ language plpgsql;

drop trigger if exists trg_users_updated_at on public.users;
create trigger trg_users_updated_at
    before update on public.users
    for each row execute function public.set_updated_at();

drop trigger if exists trg_onboarding_updated_at on public.onboarding;
create trigger trg_onboarding_updated_at
    before update on public.onboarding
    for each row execute function public.set_updated_at();

-- ── 4. ROW LEVEL SECURITY ──────────────────────────────────────────────────
-- The backend uses the SERVICE key (which bypasses RLS), but enabling RLS
-- protects the tables from any client that ever uses the anon key directly.
alter table public.users      enable row level security;
alter table public.onboarding enable row level security;

drop policy if exists "users_self_select" on public.users;
create policy "users_self_select" on public.users
    for select using (auth.uid() = id);

drop policy if exists "users_self_update" on public.users;
create policy "users_self_update" on public.users
    for update using (auth.uid() = id);

drop policy if exists "onboarding_self_all" on public.onboarding;
create policy "onboarding_self_all" on public.onboarding
    for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
