-- Enable RLS on all tables
alter table public.profiles enable row level security;
alter table public.subjects enable row level security;
alter table public.lessons enable row level security;
alter table public.questions enable row level security;
alter table public.enrollments enable row level security;
alter table public.attempts enable row level security;
alter table public.answers enable row level security;

-- Helper: get current user's role
create or replace function public.get_my_role()
returns text language sql stable security definer set search_path = '' as $$
  select role from public.profiles where id = auth.uid();
$$;

-- Helper: check if user is admin or owner
create or replace function public.is_admin_or_owner()
returns boolean language sql stable security definer set search_path = '' as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role in ('admin', 'owner')
  );
$$;

-- =================== PROFILES ===================
-- Everyone can read profiles
create policy "profiles_select" on public.profiles
  for select using (true);

-- Users can update their own name
create policy "profiles_update_own" on public.profiles
  for update using (id = auth.uid())
  with check (id = auth.uid() and role = (select role from public.profiles where id = auth.uid()));

-- Owners can change roles
create policy "profiles_update_role" on public.profiles
  for update using (
    (select role from public.profiles where id = auth.uid()) = 'owner'
  );

-- =================== SUBJECTS ===================
-- Anyone authenticated can see published subjects; admins/owners see all
create policy "subjects_select" on public.subjects
  for select using (
    status = 'published' or public.is_admin_or_owner()
  );

create policy "subjects_insert" on public.subjects
  for insert with check (public.is_admin_or_owner());

create policy "subjects_update" on public.subjects
  for update using (public.is_admin_or_owner());

-- Only owners can delete subjects
create policy "subjects_delete" on public.subjects
  for delete using (
    (select role from public.profiles where id = auth.uid()) = 'owner'
  );

-- =================== LESSONS ===================
create policy "lessons_select" on public.lessons
  for select using (
    status = 'published'
    or public.is_admin_or_owner()
  );

create policy "lessons_insert" on public.lessons
  for insert with check (public.is_admin_or_owner());

create policy "lessons_update" on public.lessons
  for update using (public.is_admin_or_owner());

create policy "lessons_delete" on public.lessons
  for delete using (public.is_admin_or_owner());

-- =================== QUESTIONS ===================
-- Students see questions only from published lessons (answers stripped in app layer)
create policy "questions_select" on public.questions
  for select using (
    public.is_admin_or_owner()
    or exists (
      select 1 from public.lessons l
      where l.id = lesson_id and l.status = 'published'
    )
  );

create policy "questions_insert" on public.questions
  for insert with check (public.is_admin_or_owner());

create policy "questions_update" on public.questions
  for update using (public.is_admin_or_owner());

create policy "questions_delete" on public.questions
  for delete using (public.is_admin_or_owner());

-- =================== ENROLLMENTS ===================
create policy "enrollments_select" on public.enrollments
  for select using (student_id = auth.uid() or public.is_admin_or_owner());

create policy "enrollments_insert" on public.enrollments
  for insert with check (student_id = auth.uid());

create policy "enrollments_delete" on public.enrollments
  for delete using (student_id = auth.uid());

-- =================== ATTEMPTS ===================
create policy "attempts_select" on public.attempts
  for select using (student_id = auth.uid() or public.is_admin_or_owner());

create policy "attempts_insert" on public.attempts
  for insert with check (student_id = auth.uid());

create policy "attempts_update" on public.attempts
  for update using (student_id = auth.uid());

-- =================== ANSWERS ===================
create policy "answers_select" on public.answers
  for select using (
    public.is_admin_or_owner()
    or exists (
      select 1 from public.attempts a
      where a.id = attempt_id and a.student_id = auth.uid()
    )
  );

create policy "answers_insert" on public.answers
  for insert with check (
    exists (
      select 1 from public.attempts a
      where a.id = attempt_id and a.student_id = auth.uid()
    )
  );

create policy "answers_update" on public.answers
  for update using (
    exists (
      select 1 from public.attempts a
      where a.id = attempt_id and a.student_id = auth.uid()
    )
  );
