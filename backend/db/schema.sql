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
-- ============================================================================
-- Atlas — Files table
-- Append this to backend/db/schema.sql  (or run separately in Supabase SQL editor)
-- Safe to run multiple times (uses IF NOT EXISTS / idempotent guards).
-- ============================================================================

-- ── SEMESTERS (needed as FK target for classes) ────────────────────────────
create table if not exists public.semesters (
    id          uuid primary key default gen_random_uuid(),
    user_id     uuid not null references public.users (id) on delete cascade,
    name        text not null,                    -- e.g. "Fall 2024"
    start_date  date,
    end_date    date,
    is_active   boolean not null default true,
    created_at  timestamptz not null default now(),
    updated_at  timestamptz not null default now()
);

-- ── CLASSES ────────────────────────────────────────────────────────────────
create table if not exists public.classes (
    id              uuid primary key default gen_random_uuid(),
    user_id         uuid not null references public.users (id) on delete cascade,
    semester_id     uuid references public.semesters (id) on delete set null,
    name            text not null,                -- e.g. "Biology 101"
    course_code     text,                         -- e.g. "BIO 101"
    color           text default '#6366f1',       -- hex, for UI display
    created_at      timestamptz not null default now(),
    updated_at      timestamptz not null default now()
);

-- ── FILES ──────────────────────────────────────────────────────────────────
-- One row per uploaded file. Tracks the full processing pipeline state.
create table if not exists public.files (
    id              uuid primary key default gen_random_uuid(),
    user_id         uuid not null references public.users (id) on delete cascade,
    class_id        uuid references public.classes (id) on delete set null,

    -- Original file metadata
    original_name   text not null,                -- original filename from browser
    mime_type       text,                         -- detected MIME
    size_bytes      bigint,                       -- file size
    extension       text,                         -- lowercase: pdf, docx, mp3 …

    -- Classification
    -- Values: syllabus | lecture_slides | lecture_audio | notes |
    --         assignment | quiz | exam | graded_work |
    --         review_sheet | announcement | image | other
    category        text not null default 'other',
    category_source text not null default 'auto', -- 'auto' | 'user_override'

    -- Storage
    storage_path    text,       -- path inside the S3 / Supabase Storage bucket
    storage_bucket  text,       -- bucket name (default 'atlas-files')

    -- Pipeline status
    -- Values: uploading | classifying | parsing | indexing | ready | error
    status          text not null default 'uploading',
    pipeline_step   int  not null default 0,      -- 0-4 matching PIPELINE_STEPS
    error_message   text,

    -- Extracted summary (shown in the file list card)
    extracted_summary text,    -- e.g. "14 deadlines · 4 grade categories"

    -- Timestamps
    created_at      timestamptz not null default now(),
    updated_at      timestamptz not null default now()
);

-- ── INDEXES ────────────────────────────────────────────────────────────────
create index if not exists idx_files_user_id   on public.files (user_id);
create index if not exists idx_files_class_id  on public.files (class_id);
create index if not exists idx_files_status    on public.files (status);
create index if not exists idx_files_category  on public.files (category);

-- ── updated_at triggers ────────────────────────────────────────────────────
drop trigger if exists trg_files_updated_at on public.files;
create trigger trg_files_updated_at
    before update on public.files
    for each row execute function public.set_updated_at();

drop trigger if exists trg_semesters_updated_at on public.semesters;
create trigger trg_semesters_updated_at
    before update on public.semesters
    for each row execute function public.set_updated_at();

drop trigger if exists trg_classes_updated_at on public.classes;
create trigger trg_classes_updated_at
    before update on public.classes
    for each row execute function public.set_updated_at();

-- ── ROW LEVEL SECURITY ─────────────────────────────────────────────────────
alter table public.semesters enable row level security;
alter table public.classes   enable row level security;
alter table public.files     enable row level security;

-- Semesters: each user sees only their own
drop policy if exists "semesters_self_all" on public.semesters;
create policy "semesters_self_all" on public.semesters
    for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Classes: each user sees only their own
drop policy if exists "classes_self_all" on public.classes;
create policy "classes_self_all" on public.classes
    for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Files: each user sees only their own
drop policy if exists "files_self_all" on public.files;
create policy "files_self_all" on public.files
    for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ── CLASSES V2 migration (run if classes table already exists) ─────────────
-- Adds new columns from the V1 spec. Safe to run multiple times.
alter table public.classes
  add column if not exists instructor      text,
  add column if not exists credit_hours    int,
  add column if not exists term            text default 'Fall 2026',
  add column if not exists syllabus_file_id uuid references public.files(id) on delete set null,
  add column if not exists textbook_isbn   text;
