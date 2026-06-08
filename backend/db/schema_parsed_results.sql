-- ============================================================================
-- Atlas — Parsed results table
-- Run in Supabase SQL Editor after schema.sql
-- Stores the AI-extracted structured data for each uploaded file.
-- ============================================================================

create table if not exists public.parsed_results (
    id              uuid primary key default gen_random_uuid(),
    file_id         uuid not null references public.files (id) on delete cascade,
    user_id         uuid not null references public.users (id) on delete cascade,

    -- The raw JSON returned by Claude (varies by category)
    raw_result      jsonb not null default '{}'::jsonb,

    -- For syllabi: flattened key fields (denormalised for quick reads)
    course_name     text,
    instructor      text,
    credit_hours    int,
    office_hours    text,

    -- Parse metadata
    model_used      text,           -- e.g. "claude-sonnet-4-20250514"
    parse_duration_ms int,          -- how long the Claude call took
    parse_error     text,           -- null on success

    created_at      timestamptz not null default now()
);

-- One result per file (upsert on file_id)
create unique index if not exists idx_parsed_results_file_id
    on public.parsed_results (file_id);

create index if not exists idx_parsed_results_user_id
    on public.parsed_results (user_id);

-- RLS: users see only their own results
alter table public.parsed_results enable row level security;

drop policy if exists "parsed_results_self_all" on public.parsed_results;
create policy "parsed_results_self_all" on public.parsed_results
    for all
    using (auth.uid() = user_id)
    with check (auth.uid() = user_id);

-- grade_weights: per-file extracted category weights
create table if not exists public.grade_weights (
    id          uuid primary key default gen_random_uuid(),
    file_id     uuid not null references public.files (id) on delete cascade,
    user_id     uuid not null references public.users (id) on delete cascade,
    class_id    uuid references public.classes (id) on delete cascade,
    category    text not null,      -- "Exams", "Homework", etc.
    weight_pct  numeric not null,   -- 40.0
    confidence  text not null default 'medium',  -- high | medium | low
    created_at  timestamptz not null default now()
);

alter table public.grade_weights enable row level security;
drop policy if exists "grade_weights_self_all" on public.grade_weights;
create policy "grade_weights_self_all" on public.grade_weights
    for all
    using (auth.uid() = user_id)
    with check (auth.uid() = user_id);

-- assessments: extracted deadlines / exam dates
create table if not exists public.assessments (
    id          uuid primary key default gen_random_uuid(),
    file_id     uuid references public.files (id) on delete cascade,
    user_id     uuid not null references public.users (id) on delete cascade,
    class_id    uuid references public.classes (id) on delete set null,
    title       text not null,
    category    text,               -- maps to grade_weights.category
    due_date    date,
    source      text not null default 'syllabus',   -- syllabus | ics | manual
    confidence  text not null default 'medium',
    created_at  timestamptz not null default now()
);

create index if not exists idx_assessments_user_id  on public.assessments (user_id);
create index if not exists idx_assessments_class_id on public.assessments (class_id);
create index if not exists idx_assessments_due_date on public.assessments (due_date);

alter table public.assessments enable row level security;
drop policy if exists "assessments_self_all" on public.assessments;
create policy "assessments_self_all" on public.assessments
    for all
    using (auth.uid() = user_id)
    with check (auth.uid() = user_id);

-- topics: extracted course topics
create table if not exists public.topics (
    id          uuid primary key default gen_random_uuid(),
    file_id     uuid references public.files (id) on delete cascade,
    user_id     uuid not null references public.users (id) on delete cascade,
    class_id    uuid references public.classes (id) on delete set null,
    title       text not null,
    source      text not null default 'syllabus',   -- syllabus | textbook_toc
    week_hint   int,
    chapter_ref text,
    confidence  text not null default 'medium',
    created_at  timestamptz not null default now()
);

create index if not exists idx_topics_user_id  on public.topics (user_id);
create index if not exists idx_topics_class_id on public.topics (class_id);

alter table public.topics enable row level security;
drop policy if exists "topics_self_all" on public.topics;
create policy "topics_self_all" on public.topics
    for all
    using (auth.uid() = user_id)
    with check (auth.uid() = user_id);
