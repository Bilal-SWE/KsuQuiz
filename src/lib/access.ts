import type { SupabaseClient } from '@supabase/supabase-js';

// Number of lessons per subject that free students can open.
export const FREE_LESSONS_PER_SUBJECT = 2;

// Both checks run in the database (migration 015). If that migration has not been run
// yet the functions are missing; everything stays open rather than locking everyone out.

export async function canAccessLesson(supabase: SupabaseClient<any>, lessonId: string) {
  const { data, error } = await supabase.rpc('can_access_lesson', { p_lesson_id: lessonId });
  return error ? true : !!data;
}

// Subscribers and admins see every lesson.
export async function hasFullAccess(supabase: SupabaseClient<any>, userId: string) {
  const [{ data: active, error }, { data: profile }] = await Promise.all([
    supabase.rpc('has_active_subscription', { p_user_id: userId }),
    supabase.from('profiles').select('role').eq('id', userId).single(),
  ]);
  if (error) return true;
  return !!active || profile?.role === 'admin' || profile?.role === 'owner';
}
