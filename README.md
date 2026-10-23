# منصة التدريب (Practice Questions Platform)

A responsive Arabic RTL web app where admins create practice questions organized by subject → lesson, and students answer them in exam or practice mode.

## Tech Stack

- **Next.js 16** (App Router) + TypeScript
- **Tailwind CSS v4** with RTL support
- **Supabase**: PostgreSQL, Auth (email + password), Storage for images
- **Zod** for validation
- **IBM Plex Sans Arabic** font

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Create a Supabase project

Go to [supabase.com](https://supabase.com) and create a new project.

### 3. Environment variables

```bash
cp .env.local.example .env.local
```

Fill in:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### 4. Run database migrations

In the Supabase SQL Editor, run in order:
1. `supabase/migrations/001_schema.sql`
2. `supabase/migrations/002_rls.sql`
3. `supabase/migrations/003_storage.sql`

### 5. Create the first owner

1. Sign up via the app
2. In Supabase SQL Editor:
```sql
UPDATE public.profiles SET role = 'owner' WHERE id = '<user-uuid>';
```

### 6. Run

```bash
npm run dev
```

## Roles

| Role | Capabilities |
|------|-------------|
| Owner | Everything + user management + delete subjects |
| Admin | CRUD subjects, lessons, questions |
| Student | Browse, enroll, answer questions |

## Security

- RLS on all tables
- Correct answers never sent to client before submission
- Server-side grading only
- Images use random UUID filenames
