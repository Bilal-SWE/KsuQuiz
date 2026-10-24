import { createClient } from '@/lib/supabase/server';
import { redirect, notFound } from 'next/navigation';
import { LessonPage } from '@/components/student/lesson-page';

export default async function LessonRoute({
  params,
}: {
  params: Promise<{ id: string; lessonId: string }>;
}) {
  const { id: subjectId, lessonId } = await params;
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) redirect('/auth/login');

  const [{ data: lesson }, { data: rawQuestions }, { data: unfinishedAttempt }] = await Promise.all([
    supabase
      .from('lessons')
      .select('id, title, subject_id')
      .eq('id', lessonId)
      .eq('status', 'published')
      .single(),
    supabase
      .from('questions')
      .select('id, type, content, explanation, sort_order')
      .eq('lesson_id', lessonId)
      .order('sort_order'),
    supabase
      .from('attempts')
      .select('id, mode, started_at')
      .eq('student_id', session.user.id)
      .eq('lesson_id', lessonId)
      .is('finished_at', null)
      .order('started_at', { ascending: false })
      .limit(1)
      .maybeSingle(),
  ]);

  if (!lesson || lesson.subject_id !== subjectId) notFound();

  const questions = (rawQuestions ?? []).map((q) => {
    const content = q.content as Record<string, any>;
    const stripped = { ...content };
    delete stripped.correct;
    delete stripped.pairs;
    return { ...q, content: stripped };
  });

  let existingAnswers: any[] = [];
  if (unfinishedAttempt) {
    const { data } = await supabase
      .from('answers')
      .select('question_id, response, is_correct')
      .eq('attempt_id', unfinishedAttempt.id);
    existingAnswers = data ?? [];
  }

  return (
    <LessonPage
      subjectId={subjectId}
      lesson={lesson}
      questions={questions}
      unfinishedAttempt={unfinishedAttempt}
      existingAnswers={existingAnswers}
    />
  );
}
