-- ============================================================
-- SEED DATA
-- Run this AFTER creating the owner account via Supabase Auth.
-- Replace the UUIDs below with actual auth.users IDs.
-- ============================================================

-- Step 1: Create three users in Supabase Auth first (email+password):
--   owner@example.com  / password123
--   admin@example.com  / password123
--   student@example.com / password123
-- The trigger will auto-create their profiles as 'student'.

-- Step 2: Promote the owner. Replace with the real user ID from auth.users:
-- UPDATE public.profiles SET role = 'owner' WHERE id = '<owner-uuid>';
-- UPDATE public.profiles SET role = 'admin' WHERE id = '<admin-uuid>';

-- Step 3: Sample subjects (replace created_by/updated_by with owner/admin ID)
-- INSERT INTO public.subjects (id, name, name_normalized, description, status, created_by, updated_by)
-- VALUES
--   ('11111111-1111-1111-1111-111111111111', 'الرياضيات', 'الرياضيات', 'مادة الرياضيات الأساسية', 'published', '<owner-uuid>', '<owner-uuid>'),
--   ('22222222-2222-2222-2222-222222222222', 'العلوم', 'العلوم', 'مادة العلوم الطبيعية', 'published', '<owner-uuid>', '<owner-uuid>');

-- Step 4: Sample lessons
-- INSERT INTO public.lessons (id, subject_id, title, sort_order, status, created_by, updated_by)
-- VALUES
--   ('aaaa1111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', 'الجبر الأساسي', 1, 'published', '<owner-uuid>', '<owner-uuid>'),
--   ('aaaa2222-2222-2222-2222-222222222222', '11111111-1111-1111-1111-111111111111', 'الهندسة', 2, 'published', '<owner-uuid>', '<owner-uuid>'),
--   ('bbbb1111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222', 'الخلية', 1, 'published', '<owner-uuid>', '<owner-uuid>');

-- Step 5: Sample questions (MCQ, True/False)
-- MCQ
-- INSERT INTO public.questions (lesson_id, type, content, explanation, sort_order, created_by, updated_by)
-- VALUES (
--   'aaaa1111-1111-1111-1111-111111111111',
--   'mcq',
--   '{"question":{"text":"ما ناتج 2 + 3؟","image":null},"options":[{"id":"a","text":"4","image":null},{"id":"b","text":"5","image":null},{"id":"c","text":"6","image":null},{"id":"d","text":"7","image":null}],"correct":"b"}',
--   'الناتج هو 5 لأن 2 + 3 = 5',
--   1,
--   '<owner-uuid>',
--   '<owner-uuid>'
-- );

-- True/False
-- INSERT INTO public.questions (lesson_id, type, content, explanation, sort_order, created_by, updated_by)
-- VALUES (
--   'aaaa1111-1111-1111-1111-111111111111',
--   'true_false',
--   '{"question":{"text":"المثلث له 4 أضلاع","image":null},"correct":false}',
--   'المثلث له 3 أضلاع فقط',
--   2,
--   '<owner-uuid>',
--   '<owner-uuid>'
-- );

