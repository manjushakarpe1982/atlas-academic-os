-- ============================================================================
-- Atlas — Grades table
-- Run in Supabase SQL Editor
-- ============================================================================

create table if not exists public.grades (
    id            uuid primary key default gen_random_uuid(),
    user_id       uuid not null references public.users (id) on delete cascade,
    class_id      uuid not null references public.classes (id) on delete cascade,
    assessment_id uuid references public.assessments (id) on delete set null,
    category      text not null,        -- matches grade_weights.category e.g. "Exams"
    title         text,                 -- e.g. "Exam 1", "Homework 3"
    score         numeric not null,     -- e.g. 88
    max_score     numeric not null,     -- e.g. 100
    recorded_at   timestamptz not null default now(),
    source        text not null default 'manual',  -- manual | photo
    notes         text,
    created_at    timestamptz not null default now()
);

create index if not exists idx_grades_user_id   on public.grades (user_id);
create index if not exists idx_grades_class_id  on public.grades (class_id);
create index if not exists idx_grades_category  on public.grades (category);
create index if not exists idx_grades_recorded  on public.grades (recorded_at desc);

alter table public.grades enable row level security;

drop policy if exists "grades_self_all" on public.grades;
create policy "grades_self_all" on public.grades
    for all
    using  (auth.uid() = user_id)
    with check (auth.uid() = user_id);
