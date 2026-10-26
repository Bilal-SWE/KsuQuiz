'use server';

import { createClient } from '@/lib/supabase/server';
import { gradeFillBlanks } from '@/lib/fill-blanks';
import { canAccessLesson } from '@/lib/access';

export async function startAttempt(lessonId: string, mode: 'exam' | 'practice') {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) throw new Error('غير مسجل الدخول');
  if (!(await canAccessLesson(supabase, lessonId))) throw new Error('هذا الدرس للمشتركين');

  const { data, error } = await supabase
    .from('attempts')
    .insert({ student_id: session.user.id, lesson_id: lessonId, mode })
    .select('id')
    .single();

  if (error) throw new Error('فشل في بدء المحاولة');
  return data;
}

// Practice and exam have separate question sets (columns from migration 014; missing means both).
function inMode(question: Record<string, any>, mode: string) {
  return mode === 'exam' ? question.in_exam !== false : question.in_practice !== false;
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
    case 'fill_blanks':
      return gradeFillBlanks(content as any, response);
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

  // Fetch attempt and question in parallel — RLS ensures student owns the attempt
  const [{ data: attempt }, { data: question }] = await Promise.all([
    supabase
      .from('attempts')
      .select('id, mode')
      .eq('id', attemptId)
      .single(),
    supabase
      .from('questions')
      .select('*')
      .eq('id', questionId)
      .single(),
  ]);

  if (!attempt) throw new Error('المحاولة غير موجودة');
  if (!question) throw new Error('السؤال غير موجود');
  if (!inMode(question, attempt.mode)) throw new Error('السؤال ليس ضمن هذا الوضع');

  const content = question.content as Record<string, any>;
  const isCorrect = gradeQuestion(question.type, content, response);

  // Save answer — upsert if unique constraint exists, else plain insert
  const answerRow = {
    attempt_id: attemptId,
    question_id: questionId,
    response,
    is_correct: isCorrect,
    answered_at: new Date().toISOString(),
  };
  const { error: saveErr } = await supabase
    .from('answers')
    .upsert(answerRow, { onConflict: 'attempt_id,question_id' });
  if (saveErr) {
    await supabase.from('answers').insert(answerRow);
  }

  if (attempt.mode === 'practice') {
    let optionExplanation: string | null = null;
    if (question.type === 'mcq' && content.options) {
      const selectedOption = content.options.find((o: any) => o.id === response);
      if (selectedOption?.explanation) optionExplanation = selectedOption.explanation;
    }
    return {
      is_correct: isCorrect,
      correct_answer: content.correct ?? content.pairs ?? null,
      explanation: question.explanation,
      option_explanation: optionExplanation,
    };
  }

  return { saved: true };
}

export async function finishAttempt(attemptId: string) {
  const supabase = await createClient();

  // Fetch attempt and answers in parallel — RLS ensures student owns the attempt
  const [{ data: attempt }, { data: answers }] = await Promise.all([
    supabase
      .from('attempts')
      .select('id, student_id, lesson_id, mode')
      .eq('id', attemptId)
      .single(),
    supabase
      .from('answers')
      .select('question_id, response, is_correct')
      .eq('attempt_id', attemptId),
  ]);

  if (!attempt) throw new Error('المحاولة غير موجودة');

  // Every question in the lesson counts toward the total; ones left unanswered
  // (for example when the exam timer ran out) count as wrong.
  const { data: lessonQuestions } = await supabase
    .from('questions')
    .select('*')
    .eq('lesson_id', attempt.lesson_id)
    .order('sort_order');
  const questions = (lessonQuestions ?? []).filter((q) => inMode(q, attempt.mode));

  const answerFor = new Map((answers ?? []).map((a) => [a.question_id, a]));
  const all = (questions ?? []).map(
    (q) => answerFor.get(q.id) ?? { question_id: q.id, response: null, is_correct: false },
  );
  const total = all.length;
  const score = all.filter((a) => a.is_correct).length;

  await supabase
    .from('attempts')
    .update({ score, total, finished_at: new Date().toISOString() })
    .eq('id', attemptId);

  const review = all.map((answer) => {
    const q = questions?.find((q) => q.id === answer.question_id);
    const content = q?.content as Record<string, any>;
    let optionExplanation: string | null = null;
    if (q?.type === 'mcq' && content?.options) {
      const selectedOption = content.options.find((o: any) => o.id === answer.response);
      if (selectedOption?.explanation) optionExplanation = selectedOption.explanation;
    }
    return {
      question_id: answer.question_id,
      response: answer.response,
      is_correct: answer.is_correct,
      correct_answer: content?.correct ?? content?.pairs ?? null,
      explanation: q?.explanation,
      option_explanation: optionExplanation,
    };
  });

  return { score, total, review };
}
