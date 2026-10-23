'use server';

import { createClient } from '@/lib/supabase/server';

export async function startAttempt(lessonId: string, mode: 'exam' | 'practice') {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('غير مسجل الدخول');

  const { data, error } = await supabase
    .from('attempts')
    .insert({ student_id: user.id, lesson_id: lessonId, mode })
    .select('id')
    .single();

  if (error) throw new Error('فشل في بدء المحاولة');
  return data;
}

function gradeQuestion(
  type: string,
  content: Record<string, any>,
  response: any,
): boolean {
  switch (type) {
    case 'mcq':
      return response === content.correct;
    case 'true_false':
      return response === content.correct;
    case 'matching': {
      const pairs = content.pairs as Record<string, string>;
      const studentPairs = response as Record<string, string>;
      return Object.entries(pairs).every(
        ([left, right]) => studentPairs[left] === right,
      );
    }
    default:
      return false;
  }
}

export async function submitAnswer(
  attemptId: string,
  questionId: string,
  response: any,
) {
  const supabase = await createClient();

  // Fetch attempt and question in parallel to reduce latency
  const [{ data: attempt }, { data: question }] = await Promise.all([
    supabase
      .from('attempts')
      .select('id, mode, student_id')
      .eq('id', attemptId)
      .single(),
    supabase
      .from('questions')
      .select('type, content, explanation')
      .eq('id', questionId)
      .single(),
  ]);

  if (!attempt) throw new Error('المحاولة غير موجودة');

  // Verify via RLS (the query already filters by what the user can see)
  // but also check student_id for safety
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || attempt.student_id !== user.id) throw new Error('غير مصرح');
  if (!question) throw new Error('السؤال غير موجود');

  const content = question.content as Record<string, any>;
  const isCorrect = gradeQuestion(question.type, content, response);

  // Delete any existing answer then insert the new one
  await supabase
    .from('answers')
    .delete()
    .eq('attempt_id', attemptId)
    .eq('question_id', questionId);

  await supabase.from('answers').insert({
    attempt_id: attemptId,
    question_id: questionId,
    response,
    is_correct: isCorrect,
  });

  // In practice mode, return immediate feedback
  if (attempt.mode === 'practice') {
    return {
      is_correct: isCorrect,
      correct_answer: content.correct ?? content.pairs ?? null,
      explanation: question.explanation,
    };
  }

  // In exam mode, just confirm saved (no correctness)
  return { saved: true };
}

export async function finishAttempt(attemptId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('غير مسجل الدخول');

  // Fetch attempt and answers in parallel
  const [{ data: attempt }, { data: answers }] = await Promise.all([
    supabase
      .from('attempts')
      .select('id, student_id, lesson_id')
      .eq('id', attemptId)
      .single(),
    supabase
      .from('answers')
      .select('question_id, response, is_correct')
      .eq('attempt_id', attemptId),
  ]);

  if (!attempt || attempt.student_id !== user.id) throw new Error('غير مصرح');

  const total = answers?.length ?? 0;
  const score = answers?.filter((a) => a.is_correct).length ?? 0;

  // Update attempt score and get questions for review in parallel
  const questionIds = (answers ?? []).map((a) => a.question_id);
  const [, { data: questions }] = await Promise.all([
    supabase
      .from('attempts')
      .update({ score, total, finished_at: new Date().toISOString() })
      .eq('id', attemptId),
    supabase
      .from('questions')
      .select('id, type, content, explanation')
      .in('id', questionIds),
  ]);

  const review = (answers ?? []).map((answer) => {
    const q = questions?.find((q) => q.id === answer.question_id);
    const content = q?.content as Record<string, any>;
    return {
      question_id: answer.question_id,
      response: answer.response,
      is_correct: answer.is_correct,
      correct_answer: content?.correct ?? content?.pairs ?? null,
      explanation: q?.explanation,
    };
  });

  return { score, total, review };
}
