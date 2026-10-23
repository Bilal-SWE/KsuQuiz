'use client';

import { useState, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { startAttempt, submitAnswer, finishAttempt } from '@/app/actions/quiz';
import { McqQuestion } from '@/components/student/questions/mcq';
import { TrueFalseQuestion } from '@/components/student/questions/true-false';
import { MatchingQuestion } from '@/components/student/questions/matching';
import { ExamResults } from '@/components/student/exam-results';

type Question = {
  id: string;
  type: string;
  content: Record<string, any>;
  explanation: string | null;
  sort_order: number;
};

type Props = {
  subjectId: string;
  lesson: { id: string; title: string };
  questions: Question[];
  unfinishedAttempt: { id: string; mode: string } | null;
  existingAnswers: { question_id: string; response: any; is_correct: boolean | null }[];
};

function shuffleArray<T>(arr: T[]): T[] {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export function LessonPage({ subjectId, lesson, questions, unfinishedAttempt, existingAnswers }: Props) {
  const router = useRouter();
  const [mode, setMode] = useState<'select' | 'exam' | 'practice'>(
    unfinishedAttempt ? (unfinishedAttempt.mode as 'exam' | 'practice') : 'select',
  );
  const [attemptId, setAttemptId] = useState<string | null>(unfinishedAttempt?.id ?? null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [answers, setAnswers] = useState<Record<string, any>>(() => {
    const map: Record<string, any> = {};
    existingAnswers.forEach((a) => { map[a.question_id] = a; });
    return map;
  });
  const [feedback, setFeedback] = useState<Record<string, any>>({});
  const [examResult, setExamResult] = useState<{ score: number; total: number; review: any[] } | null>(null);

  const shuffledQuestions = useMemo(() => {
    const shuffled = shuffleArray(questions);
    return shuffled.map((q) => {
      const content = { ...q.content };
      if (q.type === 'mcq' && content.options) {
        content.options = shuffleArray(content.options);
      }
      if (q.type === 'matching' && content.right) {
        content.right = shuffleArray(content.right);
      }
      return { ...q, content };
    });
  }, [questions]);

  const handleStart = async (selectedMode: 'exam' | 'practice') => {
    setLoading(true);
    const attempt = await startAttempt(lesson.id, selectedMode);
    setAttemptId(attempt.id);
    setMode(selectedMode);
    setLoading(false);
  };

  const handleAnswer = useCallback(async (questionId: string, response: any) => {
    if (!attemptId) return;
    setLoading(true);
    const result = await submitAnswer(attemptId, questionId, response);
    setAnswers((prev) => ({ ...prev, [questionId]: { response, ...result } }));
    if ('is_correct' in result) {
      setFeedback((prev) => ({ ...prev, [questionId]: result }));
    }
    setLoading(false);
  }, [attemptId]);

  const handleFinish = async () => {
    if (!attemptId) return;
    setLoading(true);
    const result = await finishAttempt(attemptId);
    setExamResult(result);
    setLoading(false);
  };

  if (examResult) {
    return (
      <ExamResults
        lessonTitle={lesson.title}
        result={examResult}
        questions={shuffledQuestions}
        onBack={() => router.push(`/subjects/${subjectId}`)}
      />
    );
  }

  if (mode === 'select') {
    return (
      <div className="max-w-md mx-auto text-center py-12">
        <h1 className="text-xl font-bold mb-2">{lesson.title}</h1>
        <p className="text-sm text-muted mb-8">{questions.length} سؤال</p>

        <div className="space-y-3">
          <Button onClick={() => handleStart('practice')} loading={loading} className="w-full py-3">
            وضع التمرين
            <span className="block text-xs opacity-75 font-normal">اعرف الإجابة بعد كل سؤال</span>
          </Button>
          <Button onClick={() => handleStart('exam')} loading={loading} variant="secondary" className="w-full py-3">
            وضع الاختبار
            <span className="block text-xs opacity-75 font-normal">اعرف النتيجة في النهاية</span>
          </Button>
        </div>
      </div>
    );
  }

  const currentQ = shuffledQuestions[currentIndex];
  if (!currentQ) return null;

  const answeredCount = Object.keys(answers).length;
  const hasFeedback = feedback[currentQ.id];
  const hasAnswer = answers[currentQ.id];

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-bold">{lesson.title}</h2>
        <span className="text-sm text-muted">
          {currentIndex + 1} / {shuffledQuestions.length}
        </span>
      </div>

      {/* Progress bar */}
      <div className="h-1.5 bg-gray-200 rounded-full mb-6">
        <div
          className="h-full bg-primary rounded-full transition-all"
          style={{ width: `${((currentIndex + 1) / shuffledQuestions.length) * 100}%` }}
        />
      </div>

      {/* Question */}
      <div className="bg-surface rounded-xl border border-border p-5 mb-4">
        {currentQ.type === 'mcq' && (
          <McqQuestion
            content={currentQ.content}
            onAnswer={(resp) => handleAnswer(currentQ.id, resp)}
            feedback={hasFeedback}
            disabled={!!hasAnswer && mode === 'practice'}
            selectedOption={hasAnswer?.response}
          />
        )}
        {currentQ.type === 'true_false' && (
          <TrueFalseQuestion
            content={currentQ.content}
            onAnswer={(resp) => handleAnswer(currentQ.id, resp)}
            feedback={hasFeedback}
            disabled={!!hasAnswer && mode === 'practice'}
            selectedValue={hasAnswer?.response}
          />
        )}
        {currentQ.type === 'matching' && (
          <MatchingQuestion
            content={currentQ.content}
            onAnswer={(resp) => handleAnswer(currentQ.id, resp)}
            feedback={hasFeedback}
            disabled={!!hasAnswer && mode === 'practice'}
            savedPairs={hasAnswer?.response}
          />
        )}

        {/* Practice mode feedback */}
        {mode === 'practice' && hasFeedback && (
          <div className={`mt-4 p-3 rounded-lg text-sm ${hasFeedback.is_correct ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
            <p className="font-medium">{hasFeedback.is_correct ? 'إجابة صحيحة!' : 'إجابة خاطئة'}</p>
            {hasFeedback.explanation && (
              <p className="mt-1 opacity-80">{hasFeedback.explanation}</p>
            )}
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between gap-3">
        <Button
          variant="secondary"
          onClick={() => setCurrentIndex((i) => Math.max(0, i - 1))}
          disabled={currentIndex === 0}
        >
          السابق
        </Button>

        <div className="flex gap-2">
          {mode === 'exam' && answeredCount === shuffledQuestions.length && (
            <Button onClick={handleFinish} loading={loading}>
              إنهاء الاختبار
            </Button>
          )}
        </div>

        <Button
          variant="secondary"
          onClick={() => setCurrentIndex((i) => Math.min(shuffledQuestions.length - 1, i + 1))}
          disabled={currentIndex === shuffledQuestions.length - 1}
        >
          التالي
        </Button>
      </div>

      {mode === 'exam' && (
        <p className="text-center text-sm text-muted mt-4">
          تمت الإجابة على {answeredCount} من {shuffledQuestions.length}
        </p>
      )}
    </div>
  );
}
