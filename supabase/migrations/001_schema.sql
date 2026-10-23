-- Arabic normalization function
create or replace function public.normalize_arabic(input_text text)
returns text language sql immutable as $$
  select lower(trim(
    replace(
    replace(
    replace(
    replace(
    -- Remove tatweel
    regexp_replace(
    -- Remove tashkeel
    regexp_replace(input_text,
      '[ؐ-ًؚ-ٰٟۖ-ۜ۟-۪ۤۧۨ-ۭ]', '', 'g'),
      'ـ', '', 'g'),
    'أ', 'ا'),  -- alef with hamza above
    'إ', 'ا'),  -- alef with hamza below
    'آ', 'ا'),  -- alef with madda
    'ة', 'ه')   -- taa marbuta -> haa
    -- Note: ى -> ي handled below
  ));
$$;

-- Replace final ya normalization (ى -> ي)
create or replace function public.normalize_arabic(input_text text)
returns text language sql immutable as $$
  select replace(
    lower(trim(
      replace(
      replace(
      replace(
      replace(
      regexp_replace(
      regexp_replace(input_text,
        '[ؐ-ًؚ-ٰٟۖ-ۜ۟-۪ۤۧۨ-ۭ]', '', 'g'),
        'ـ', '', 'g'),
      'أ', 'ا'),
      'إ', 'ا'),
      'آ', 'ا'),
      'ة', 'ه')
    )),
    'ى', 'ي')
  ;
$$;

-- Profiles
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  full_name text not null,
  role text not null default 'student' check (role in ('owner', 'admin', 'student')),
  created_at timestamptz not null default now()
);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  insert into public.profiles (id, full_name, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', ''),
    'student'
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Subjects
create table public.subjects (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  name_normalized text not null,
  description text,
  cover_image text,
  status text not null default 'draft' check (status in ('draft', 'published')),
  created_by uuid references public.profiles(id) not null,
  updated_by uuid references public.profiles(id) not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index subjects_name_normalized_idx on public.subjects using gin (name_normalized gin_trgm_ops);
-- Note: requires pg_trgm extension. If not available, fall back to btree:
-- create index subjects_name_normalized_idx on public.subjects (name_normalized);

-- Lessons
create table public.lessons (
  id uuid primary key default gen_random_uuid(),
  subject_id uuid references public.subjects(id) on delete cascade not null,
  title text not null,
  sort_order int not null default 0,
  status text not null default 'draft' check (status in ('draft', 'published')),
  created_by uuid references public.profiles(id) not null,
  updated_by uuid references public.profiles(id) not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Questions
create table public.questions (
  id uuid primary key default gen_random_uuid(),
  lesson_id uuid references public.lessons(id) on delete cascade not null,
  type text not null check (type in ('mcq', 'matching', 'true_false')),
  content jsonb not null,
  explanation text,
  sort_order int not null default 0,
  created_by uuid references public.profiles(id) not null,
  updated_by uuid references public.profiles(id) not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Enrollments
create table public.enrollments (
  student_id uuid references public.profiles(id) on delete cascade not null,
  subject_id uuid references public.subjects(id) on delete cascade not null,
  added_at timestamptz not null default now(),
  primary key (student_id, subject_id)
);

-- Attempts
create table public.attempts (
  id uuid primary key default gen_random_uuid(),
  student_id uuid references public.profiles(id) on delete cascade not null,
  lesson_id uuid references public.lessons(id) on delete cascade not null,
  mode text not null check (mode in ('exam', 'practice')),
  score int,
  total int,
  started_at timestamptz not null default now(),
  finished_at timestamptz
);

-- Answers
create table public.answers (
  id uuid primary key default gen_random_uuid(),
  attempt_id uuid references public.attempts(id) on delete cascade not null,
  question_id uuid references public.questions(id) on delete cascade not null,
  response jsonb not null,
  is_correct boolean,
  answered_at timestamptz not null default now()
);
