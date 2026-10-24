import { createClient } from '@/lib/supabase/server';
import { redirect, notFound } from 'next/navigation';
import { LessonPage } from '@/components/student/lesson-page';
import type { LeaderboardRow } from '@/components/student/leaderboard-table';

function shuffleArray<T>(arr: T[]): T[] {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export default async function LessonRoute({
  params,
}: {
  params: Promise<{ id: string; lessonId: string }>;
}) {
  const { id: subjectId, lessonId } = await params;
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) redirect('/auth/login');

  const [
    { data: lesson },
    { data: rawQuestions },
    { data: unfinishedAttempt },
    { data: leaderboardData },
  ] = await Promise.all([
    supabase
      .from('lessons')
      .select('*')
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
    supabase.rpc('get_lesson_leaderboard', { p_lesson_id: lessonId }),
  ]);

  const leaderboard: LeaderboardRow[] = ((leaderboardData as any[]) ?? []).map((r) => ({
    rank: Number(r.rank),
    student_id: r.student_id,
    full_name: r.full_name,
    score: r.score,
    total: r.total,
    seconds: r.duration_seconds,
  }));

  if (!lesson || lesson.subject_id !== subjectId) notFound();

  const shouldShuffleQuestions = (lesson as any).shuffle_questions ?? false;
  const shouldShuffleOptions = (lesson as any).shuffle_options ?? false;

  let questions = (rawQuestions ?? []).map((q) => {
    const content = q.content as Record<string, any>;
    const stripped = { ...content };
    delete stripped.correct;
    delete stripped.pairs;
    if (stripped.options) {
      stripped.options = stripped.options.map(({ explanation, ...o }: Record<string, any>) => o);
    }
    if (shouldShuffleOptions && stripped.options) {
      stripped.options = shuffleArray(stripped.options);
    }
    if (shouldShuffleOptions && stripped.right) {
      stripped.right = shuffleArray(stripped.right);
    }
    return { ...q, content: stripped };
  });
  if (shouldShuffleQuestions) {
    questions = shuffleArray(questions);
  }

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
      leaderboard={leaderboard}
      currentUserId={session.user.id}
    />
  );
}
