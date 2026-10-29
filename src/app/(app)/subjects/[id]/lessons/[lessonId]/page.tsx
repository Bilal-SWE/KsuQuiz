import { createClient } from '@/lib/supabase/server';
import { redirect, notFound } from 'next/navigation';
import { LessonPage } from '@/components/student/lesson-page';
import { LockedLesson } from '@/components/student/locked-lesson';
import { canAccessLesson } from '@/lib/access';
import type { LeaderboardRow } from '@/components/student/leaderboard-table';

// Seeded shuffle: the same seed always gives the same order, so a student who leaves and
// comes back mid-attempt sees the questions (and options) where they left them.
function seededRandom(seed: string) {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) h = Math.imul(h ^ seed.charCodeAt(i), 16777619);
  return () => {
    h = Math.imul(h ^ (h >>> 15), h | 1);
    h ^= h + Math.imul(h ^ (h >>> 7), h | 61);
    return ((h ^ (h >>> 14)) >>> 0) / 4294967296;
  };
}

function shuffleArray<T>(arr: T[], seed: string): T[] {
  const random = seededRandom(seed);
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
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
      .select('*')
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
    rank: r.rank != null ? Number(r.rank) : 0,
    student_id: r.student_id,
    full_name: r.full_name,
    score: r.score ?? 0,
    total: r.total ?? 0,
    seconds: r.duration_seconds ?? 0,
    attempts: Number(r.attempt_count ?? 0),
  }));

  if (!lesson || lesson.subject_id !== subjectId) notFound();

  // Locked lessons never send their questions to the browser.
  if (!(await canAccessLesson(supabase, lessonId))) {
    return <LockedLesson subjectId={subjectId} lessonTitle={lesson.title} />;
  }

  // The order stays fixed until the student finishes an attempt, then changes for the next one.
  const { count: finishedAttempts } = await supabase
    .from('attempts')
    .select('id', { count: 'exact', head: true })
    .eq('student_id', session.user.id)
    .eq('lesson_id', lessonId)
    .not('finished_at', 'is', null);
  const seed = `${session.user.id}:${lessonId}:${finishedAttempts ?? 0}`;

  const shouldShuffleQuestions = (lesson as any).shuffle_questions ?? false;
  const shouldShuffleOptions = (lesson as any).shuffle_options ?? false;

  let questions = (rawQuestions ?? []).map((q) => {
    const content = q.content as Record<string, any>;
    const stripped = { ...content };
    delete stripped.correct;
    delete stripped.pairs;
    delete stripped.distractors;
    if (stripped.items) {
      stripped.items = stripped.items.map(({ raw, ...item }: Record<string, any>) => item);
    }
    if (stripped.words) {
      stripped.words = shuffleArray(stripped.words, `${seed}:${q.id}:words`);
    }
    if (stripped.options) {
      stripped.options = stripped.options.map(({ explanation, ...o }: Record<string, any>) => o);
    }
    if (shouldShuffleOptions && stripped.options) {
      stripped.options = shuffleArray(stripped.options, `${seed}:${q.id}:options`);
    }
    if (shouldShuffleOptions && stripped.right) {
      stripped.right = shuffleArray(stripped.right, `${seed}:${q.id}:right`);
    }
    return { ...q, content: stripped };
  });
  if (shouldShuffleQuestions) {
    questions = shuffleArray(questions, `${seed}:questions`);
  }

  let existingAnswers: any[] = [];
  if (unfinishedAttempt) {
    const { data } = await supabase
      .from('answers')
      .select('question_id, response, is_correct')
      .eq('attempt_id', unfinishedAttempt.id);
    existingAnswers = data ?? [];
  }

  // Practice shows right/wrong and the explanation after each answer. When a practice is
  // resumed, rebuild that feedback for the questions already answered (and only those).
  const existingFeedback: Record<string, any> = {};
  if (unfinishedAttempt?.mode === 'practice') {
    for (const a of existingAnswers) {
      const q = (rawQuestions ?? []).find((x) => x.id === a.question_id);
      if (!q) continue;
      const content = q.content as Record<string, any>;
      const option = q.type === 'mcq' ? content.options?.find((o: any) => o.id === a.response) : null;
      existingFeedback[a.question_id] = {
        is_correct: !!a.is_correct,
        correct_answer: content.correct ?? null,
        explanation: q.explanation,
        option_explanation: option?.explanation ?? null,
      };
    }
  }

  // Subject name and the lesson's position among the subject's visible lessons, for the ranking card.
  const [{ data: subject }, { data: siblings }] = await Promise.all([
    supabase.from('subjects').select('name').eq('id', subjectId).single(),
    supabase
      .from('lessons')
      .select('id')
      .eq('subject_id', subjectId)
      .in('status', ['published', 'soon'])
      .order('sort_order'),
  ]);
  const lessonNumber = Math.max(1, (siblings ?? []).findIndex((l) => l.id === lessonId) + 1);

  return (
    <LessonPage
      subjectId={subjectId}
      lesson={lesson}
      subjectName={subject?.name ?? ''}
      lessonNumber={lessonNumber}
      questions={questions}
      unfinishedAttempt={unfinishedAttempt}
      existingAnswers={existingAnswers}
      existingFeedback={existingFeedback}
      leaderboard={leaderboard}
      currentUserId={session.user.id}
    />
  );
}
