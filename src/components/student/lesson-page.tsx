'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  ArrowRight,
  BookOpenCheck,
  CircleCheck,
  CircleX,
  ClipboardList,
  Clock,
  Flag,
  Lightbulb,
  Trophy,
  Users,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { startAttempt, submitAnswer, finishAttempt } from '@/app/actions/quiz';
import { McqQuestion } from '@/components/student/questions/mcq';
import { TrueFalseQuestion } from '@/components/student/questions/true-false';
import { MatchingQuestion } from '@/components/student/questions/matching';
import { FillBlanksQuestion } from '@/components/student/questions/fill-blanks';
import { ExamResults } from '@/components/student/exam-results';
import { ImageZoom } from '@/components/ui/image-zoom';
import { LeaderboardTable, Podium, type LeaderboardRow } from '@/components/student/leaderboard-table';
import { formatDuration } from '@/lib/format';
import { useI18n } from '@/i18n/client';
import { fmt } from '@/i18n/format';

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
  unfinishedAttempt: { id: string; mode: string; started_at?: string } | null;
  existingAnswers: { question_id: string; response: any; is_correct: boolean | null }[];
  leaderboard: LeaderboardRow[];
  currentUserId: string;
};

function ElapsedTimer({ since }: { since: number }) {
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => {
    setNow(Date.now());
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);
  if (now === null) return null;
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-surface-hover px-2.5 py-1 text-xs font-medium text-muted tabular-nums" dir="ltr">
      <Clock className="h-3.5 w-3.5" />
      {formatDuration((now - since) / 1000)}
    </span>
  );
}

export function LessonPage({
  subjectId,
  lesson,
  questions,
  unfinishedAttempt,
  existingAnswers,
  leaderboard,
  currentUserId,
}: Props) {
  const router = useRouter();
  const { t } = useI18n();
  const L = t.lesson;
  const [mode, setMode] = useState<'select' | 'exam' | 'practice'>(
    unfinishedAttempt ? (unfinishedAttempt.mode as 'exam' | 'practice') : 'select',
  );
  const [attemptId, setAttemptId] = useState<string | null>(unfinishedAttempt?.id ?? null);
  const [startedAt, setStartedAt] = useState<number | null>(
    unfinishedAttempt?.started_at ? new Date(unfinishedAttempt.started_at).getTime() : null,
  );
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState<false | 'exam' | 'practice' | 'finish'>(false);
  const [answers, setAnswers] = useState<Record<string, any>>(() => {
    const map: Record<string, any> = {};
    existingAnswers.forEach((a) => { map[a.question_id] = a; });
    return map;
  });
  const [feedback, setFeedback] = useState<Record<string, any>>({});
  const [examResult, setExamResult] = useState<{ score: number; total: number; review: any[] } | null>(null);
  const [showRank, setShowRank] = useState(false);
  const pendingSaves = useRef(new Set<Promise<void>>());

  const handleStart = async (selectedMode: 'exam' | 'practice') => {
    setLoading(selectedMode);
    const attempt = await startAttempt(lesson.id, selectedMode);
    setAttemptId(attempt.id);
    setStartedAt(Date.now());
    setMode(selectedMode);
    setLoading(false);
  };

  const handleRetry = () => {
    setExamResult(null);
    setMode('select');
    setAttemptId(null);
    setStartedAt(null);
    setCurrentIndex(0);
    setAnswers({});
    setFeedback({});
    router.refresh();
  };

  const handleAnswer = useCallback((questionId: string, response: any) => {
    if (!attemptId) return;
    let previous: any;
    setAnswers((prev) => {
      previous = prev[questionId];
      return { ...prev, [questionId]: { response } };
    });

    const save = submitAnswer(attemptId, questionId, response)
      .then((result) => {
        setAnswers((prev) =>
          prev[questionId]?.response === response
            ? { ...prev, [questionId]: { response, ...result } }
            : prev,
        );
        if ('is_correct' in result) {
          setFeedback((prev) => ({ ...prev, [questionId]: result }));
        }
      })
      .catch(() => {
        setAnswers((prev) => {
          if (prev[questionId]?.response !== response) return prev;
          const next = { ...prev };
          if (previous) next[questionId] = previous;
          else delete next[questionId];
          return next;
        });
        alert(L.saveFailed);
      })
      .finally(() => {
        pendingSaves.current.delete(save);
      });
    pendingSaves.current.add(save);
  }, [attemptId, L.saveFailed]);

  const handleFinish = async () => {
    if (!attemptId) return;
    setLoading('finish');
    await Promise.all(pendingSaves.current);
    const result = await finishAttempt(attemptId);
    setExamResult(result);
    setLoading(false);
  };

  if (examResult) {
    return (
      <ExamResults
        lessonTitle={lesson.title}
        result={examResult}
        questions={questions}
        onBack={() => router.push(`/subjects/${subjectId}`)}
        onRetry={handleRetry}
      />
    );
  }

  const myRow = leaderboard.find((r) => r.student_id === currentUserId);

  if (mode === 'select' && showRank) {
    return (
      <div className="max-w-2xl mx-auto space-y-5 animate-fade-up">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Trophy className="h-6 w-6 text-accent" />
              {L.rankTitle}
            </h1>
            <p className="text-sm text-muted">{lesson.title}</p>
          </div>
          <Button variant="secondary" onClick={() => setShowRank(false)}>
            <ArrowRight className="h-4 w-4 ltr:-scale-x-100" />
            {L.back}
          </Button>
        </div>
        {leaderboard.length >= 3 && <Podium rows={leaderboard.slice(0, 3)} currentUserId={currentUserId} />}
        {myRow && (
          <p className="rounded-xl bg-primary-light px-4 py-2.5 text-sm font-medium text-primary">
            {fmt(L.rankSummary, { rank: myRow.rank, total: leaderboard.length, score: myRow.score, questions: myRow.total })}
          </p>
        )}
        <LeaderboardTable rows={leaderboard} currentUserId={currentUserId} emptyText={L.rankEmpty} />
        <p className="text-xs text-muted">{L.firstOnly}</p>
      </div>
    );
  }

  if (mode === 'select') {
    const modes = [
      {
        key: 'practice' as const,
        title: L.practice,
        desc: L.practiceDesc,
        icon: BookOpenCheck,
        tint: 'from-emerald-500 to-teal-500',
        onClick: () => handleStart('practice'),
      },
      {
        key: 'exam' as const,
        title: L.exam,
        desc: L.examDesc,
        icon: ClipboardList,
        tint: 'from-primary to-fuchsia-600',
        onClick: () => handleStart('exam'),
      },
      {
        key: 'rank' as const,
        title: L.rank,
        desc: myRow
          ? fmt(L.rankMine, { rank: myRow.rank, total: leaderboard.length })
          : fmt(L.rankCount, { n: leaderboard.length }),
        icon: Trophy,
        tint: 'from-amber-400 to-orange-500',
        onClick: () => setShowRank(true),
      },
    ];

    return (
      <div className="max-w-3xl mx-auto space-y-6">
        <section className="hero p-6 sm:p-8 animate-fade-up">
          <div className="relative z-10">
            <Link href={`/subjects/${subjectId}`} className="inline-flex items-center gap-1 text-xs text-white/80 hover:text-white">
              <ArrowRight className="h-3.5 w-3.5 ltr:-scale-x-100" />
              {L.backToLessons}
            </Link>
            <h1 dir="auto" className="mt-2 text-2xl sm:text-3xl font-bold">
              {lesson.title}
            </h1>
            <div className="mt-4 flex flex-wrap gap-2 text-sm">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 ring-1 ring-white/25">
                <Flag className="h-4 w-4" />
                {fmt(L.questionsCount, { n: questions.length })}
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 ring-1 ring-white/25">
                <Users className="h-4 w-4" />
                {fmt(L.competitors, { n: leaderboard.length })}
              </span>
            </div>
          </div>
        </section>

        <div className="grid gap-3 sm:grid-cols-3 stagger">
          {modes.map((m) => (
            <button
              key={m.key}
              onClick={m.onClick}
              disabled={!!loading || (m.key !== 'rank' && questions.length === 0)}
              className="card card-hover press group flex flex-col items-start gap-3 p-5 text-start cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <span className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${m.tint} text-white shadow-md transition-transform group-hover:scale-110 group-hover:-rotate-6`}>
                {loading === m.key ? (
                  <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                ) : (
                  <m.icon className="h-6 w-6" />
                )}
              </span>
              <span>
                <span className="block font-bold">{m.title}</span>
                <span className="mt-0.5 block text-xs text-muted">{m.desc}</span>
              </span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  const currentQ = questions[currentIndex];
  if (!currentQ) return null;

  const answeredCount = Object.keys(answers).length;
  const hasFeedback = feedback[currentQ.id];
  const hasAnswer = answers[currentQ.id];
  const isLast = currentIndex === questions.length - 1;
  const progress = Math.round((answeredCount / questions.length) * 100);

  const dotStyle = (q: Question, i: number) => {
    const fb = feedback[q.id];
    const a = answers[q.id];
    const base = i === currentIndex ? 'ring-2 ring-primary ring-offset-2 ring-offset-background ' : '';
    if (mode === 'practice' && fb) return base + (fb.is_correct ? 'bg-success text-white' : 'bg-error text-white');
    if (a) return base + 'bg-primary text-white';
    return base + 'bg-surface text-muted border border-border';
  };

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      <div className="flex items-center gap-3">
        <Link
          href={`/subjects/${subjectId}`}
          aria-label={L.exitLesson}
          className="rounded-xl p-2 text-muted hover:bg-surface-hover hover:text-foreground press"
        >
          <X className="h-5 w-5" />
        </Link>
        <div className="flex-1">
          <div className="h-3 overflow-hidden rounded-full bg-surface-hover">
            <div
              className="h-full rounded-full bg-gradient-to-l from-primary to-fuchsia-500 transition-[width] duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
        {mode === 'exam' && startedAt && <ElapsedTimer since={startedAt} />}
      </div>

      <div className="flex items-center justify-between text-sm">
        <span dir="auto" className="font-bold truncate">
          {lesson.title}
        </span>
        <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${mode === 'exam' ? 'bg-primary-light text-primary' : 'bg-success-light text-success'}`}>
          {mode === 'exam' ? L.examBadge : L.practiceBadge}
        </span>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {questions.map((q, i) => (
          <button
            key={q.id}
            onClick={() => setCurrentIndex(i)}
            aria-label={fmt(L.questionNumber, { n: i + 1 })}
            className={`h-8 w-8 rounded-lg text-xs font-bold transition press cursor-pointer ${dotStyle(q, i)}`}
          >
            {i + 1}
          </button>
        ))}
      </div>

      <div key={currentQ.id} className="space-y-4">
        <section className="hero p-6 sm:p-8 animate-fade-up">
          <div className="relative z-10">
            <span className="inline-flex items-center rounded-full bg-white/15 px-3 py-1 text-xs font-medium ring-1 ring-white/25">
              {fmt(L.questionOf, { i: currentIndex + 1, n: questions.length })}
            </span>
            <h1 dir="auto" className="mt-3 text-xl sm:text-2xl font-bold leading-relaxed">
              {currentQ.content.question?.text}
            </h1>
            {currentQ.content.question?.image && (
              <div className="mt-4 overflow-hidden rounded-2xl bg-white/95 p-2">
                <ImageZoom src={currentQ.content.question.image} />
              </div>
            )}
          </div>
        </section>

        {currentQ.type === 'mcq' && (
          <McqQuestion
            hideStem
            content={currentQ.content}
            onAnswer={(resp) => handleAnswer(currentQ.id, resp)}
            feedback={hasFeedback}
            disabled={!!hasAnswer && mode === 'practice'}
            selectedOption={hasAnswer?.response}
          />
        )}
        {currentQ.type === 'true_false' && (
          <TrueFalseQuestion
            hideStem
            content={currentQ.content}
            onAnswer={(resp) => handleAnswer(currentQ.id, resp)}
            feedback={hasFeedback}
            disabled={!!hasAnswer && mode === 'practice'}
            selectedValue={hasAnswer?.response}
          />
        )}
        {currentQ.type === 'fill_blanks' && (
          <div className="card p-4 sm:p-5 animate-fade-up">
            <FillBlanksQuestion
              key={currentQ.id}
              content={{ ...currentQ.content, question: undefined }}
              onAnswer={(resp) => handleAnswer(currentQ.id, resp)}
              feedback={hasFeedback}
              disabled={!!hasAnswer && mode === 'practice'}
              savedResponse={hasAnswer?.response}
            />
          </div>
        )}
        {currentQ.type === 'matching' && (
          <div className="card p-4 sm:p-5">
            <MatchingQuestion
              key={currentQ.id}
              content={{ ...currentQ.content, question: undefined }}
              onAnswer={(resp) => handleAnswer(currentQ.id, resp)}
              feedback={hasFeedback}
              disabled={!!hasAnswer && mode === 'practice'}
              savedPairs={hasAnswer?.response}
            />
          </div>
        )}

        {mode === 'practice' && hasAnswer && !hasFeedback && !('is_correct' in hasAnswer) && (
          <p className="flex items-center gap-2 text-sm text-muted">
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary/30 border-t-primary" />
            {L.checking}
          </p>
        )}

        {mode === 'practice' && hasFeedback && (
          <div
            className={`card p-4 text-sm animate-slide-in ${
              hasFeedback.is_correct ? 'bg-success-light text-success' : 'bg-error-light text-error'
            }`}
          >
            <p className="flex items-center gap-2 text-base font-bold">
              {hasFeedback.is_correct ? <CircleCheck className="h-5 w-5" /> : <CircleX className="h-5 w-5" />}
              {hasFeedback.is_correct ? L.correct : L.wrong}
            </p>
            {(hasFeedback.option_explanation || hasFeedback.explanation) && (
              <div className="mt-2 flex gap-2 text-foreground/80">
                <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-warning" />
                <div className="space-y-1">
                  {hasFeedback.option_explanation && <p dir="auto">{hasFeedback.option_explanation}</p>}
                  {hasFeedback.explanation && <p dir="auto">{hasFeedback.explanation}</p>}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="flex items-center justify-between gap-3">
        <Button variant="secondary" onClick={() => setCurrentIndex((i) => Math.max(0, i - 1))} disabled={currentIndex === 0}>
          <ArrowRight className="h-4 w-4 ltr:-scale-x-100" />
          {L.previous}
        </Button>

        {answeredCount === questions.length ? (
          <Button onClick={handleFinish} loading={loading === 'finish'} className="px-6">
            <Flag className="h-4 w-4" />
            {mode === 'exam' ? L.finishExam : L.finishPractice}
          </Button>
        ) : (
          <span className="text-xs text-muted">{fmt(L.answeredOf, { a: answeredCount, n: questions.length })}</span>
        )}

        <Button
          variant={hasAnswer && !isLast ? 'primary' : 'secondary'}
          onClick={() => setCurrentIndex((i) => Math.min(questions.length - 1, i + 1))}
          disabled={isLast}
        >
          {L.next}
          <ArrowLeft className="h-4 w-4 ltr:-scale-x-100" />
        </Button>
      </div>
    </div>
  );
}
