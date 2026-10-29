import type { SupabaseClient } from '@supabase/supabase-js';

// Questions per subject, counted over published lessons. Uses the database function from
// migration 018; until that runs, it counts from the lesson and question lists instead.
export async function getQuestionCounts(supabase: SupabaseClient<any>): Promise<Record<string, number>> {
  const counts: Record<string, number> = {};
  const { data, error } = await supabase.rpc('subject_question_counts');
  if (!error) {
    for (const r of (data as { subject_id: string; question_count: number }[]) ?? []) {
      counts[r.subject_id] = Number(r.question_count);
    }
    return counts;
  }

  const [{ data: lessons }, { data: questions }] = await Promise.all([
    supabase.from('lessons').select('id, subject_id').eq('status', 'published'),
    supabase.from('questions').select('lesson_id'),
  ]);
  const subjectOf = new Map((lessons ?? []).map((l: any) => [l.id, l.subject_id]));
  for (const q of (questions as { lesson_id: string }[]) ?? []) {
    const subject = subjectOf.get(q.lesson_id);
    if (subject) counts[subject] = (counts[subject] ?? 0) + 1;
  }
  return counts;
}
