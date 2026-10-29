'use client';

import { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  BookOpenCheck,
  CircleCheck,
  CircleX,
  ClipboardList,
  Clock,
  Flag,
  ListChecks,
  Trophy,
  Users,
  X,
  RotateCcw,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { startAttempt, submitAnswer, finishAttempt, type LessonRank } from '@/app/actions/quiz';
import { McqQuestion } from '@/components/student/questions/mcq';
import { TrueFalseQuestion } from '@/components/student/questions/true-false';
import { FillBlanksQuestion } from '@/components/student/questions/fill-blanks';
import { ExamResults } from '@/components/student/exam-results';
import { ImageZoom } from '@/components/ui/image-zoom';
import { RankingList, type LeaderboardRow } from '@/components/student/leaderboard-table';
import { formatDuration } from '@/lib/format';
import { useI18n } from '@/i18n/client';
import { fmt } from '@/i18n/format';

type Question = {
  id: string;
  type: string;
  content: Record<string, any>;
  explanation: string | null;
  sort_order: number;
  in_practice?: boolean;
  in_exam?: boolean;
};

type Props = {
  subjectId: string;
  lesson: { id: string; title: string; question_seconds?: number };
  subjectName: string;
  lessonNumber: number;
  questions: Question[];
  unfinishedAttempt: { id: string; mode: string; started_at?: string } | null;
  existingAnswers: { question_id: string; response: any; is_correct: boolean | null }[];
  // Right/wrong and explanations for questions already answered in a resumed practice.
  existingFeedback?: Record<string, any>;
  leaderboard: LeaderboardRow[];
  currentUserId: string;
};

// Countdown for the question on screen: a pill with the seconds left over a shrinking bar.
function QuestionTimer({ left, total, label }: { left: number; total: number; label: string }) {
  const secs = Math.ceil(left / 1000);
  const urgent = secs <= 10;
  const pct = Math.max(0, Math.min(100, (left / (total * 1000)) * 100));
  return (
    <div className="flex w-full max-w-xs flex-col items-center gap-1.5" role="timer" aria-label={label}>
      <span
        className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-sm font-extrabold tabular-nums transition-colors ${
          secs === 0 ? 'bg-error text-white' : urgent ? 'bg-error-light text-error animate-pulse' : 'bg-accent-light text-ink'
        }`}
        dir="ltr"
      >
        <Clock className="h-4 w-4" />
        {formatDuration(secs)}
      </span>
      <span className="h-1.5 w-full overflow-hidden rounded-full bg-border" aria-hidden="true">
        <span
          className={`block h-full rounded-full transition-[width] duration-300 ease-linear ${urgent ? 'bg-error' : 'bg-accent'}`}
          style={{ width: `${pct}%` }}
        />
      </span>
    </div>
  );
}

const DEFAULT_QUESTION_SECONDS = 60;

export function LessonPage({
  subjectId,
  lesson,
  subjectName,
  lessonNumber,
  questions: allQuestions,
  unfinishedAttempt,
  existingAnswers,
  existingFeedback = {},
  leaderboard,
  currentUserId,
}: Props) {
  const router = useRouter();
  const { t } = useI18n();
  const L = t.lesson;
  const emptyPractice = unfinishedAttempt?.mode === 'practice' && existingAnswers.length === 0;
  const [mode, setMode] = useState<'select' | 'resume' | 'exam' | 'practice'>('select');
  const [attemptId, setAttemptId] = useState<string | null>(emptyPractice ? null : (unfinishedAttempt?.id ?? null));
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
  const [feedback, setFeedback] = useState<Record<string, any>>(existingFeedback);
  const [examResult, setExamResult] = useState<{ score: number; total: number; review: any[]; rank?: LessonRank | null } | null>(null);
  const [showRank, setShowRank] = useState(false);

  // Auto-finish an exam when leaving the page (navigation or browser close).
  const modeRef = useRef(mode);
  const attemptIdRef = useRef(attemptId);
  modeRef.current = mode;
  attemptIdRef.current = attemptId;

  useEffect(() => {
    const autoFinish = () => {
      if (modeRef.current === 'exam' && attemptIdRef.current) {
        navigator.sendBeacon(
          '/api/attempts/finish',
          new Blob([JSON.stringify({ attemptId: attemptIdRef.current })], { type: 'application/json' }),
        );
      }
    };
    window.addEventListener('beforeunload', autoFinish);
    return () => {
      window.removeEventListener('beforeunload', autoFinish);
      if (modeRef.current === 'exam' && attemptIdRef.current) {
        finishAttempt(attemptIdRef.current).catch(() => {});
      }
    };
  }, []);

  // Practice and exam are separate sets chosen by the admin; each mode only sees its own.
  const practiceQuestions = useMemo(() => allQuestions.filter((q) => q.in_practice !== false), [allQuestions]);
  const examQuestions = useMemo(() => allQuestions.filter((q) => q.in_exam !== false), [allQuestions]);
  const questions = mode === 'exam' ? examQuestions : practiceQuestions;
  const pendingSaves = useRef(new Set<Promise<void>>());
  const handleFinishRef = useRef<() => void>(() => {});
  // Answers still being checked by the server; in practice mode navigation waits for them.
  const [savingCount, setSavingCount] = useState(0);

  // Exam mode: total timer for the entire exam (question_seconds × number of exam questions).
  const questionSeconds = lesson.question_seconds ?? DEFAULT_QUESTION_SECONDS;
  const [examDeadline, setExamDeadline] = useState<number | null>(null);
  const [now, setNow] = useState(() => Date.now());

  // Set the exam deadline when entering exam mode.
  useEffect(() => {
    if (mode !== 'exam' || !attemptId) return;
    const key = `exam-deadline-${attemptId}`;
    try {
      const stored = localStorage.getItem(key);
      if (stored) {
        setExamDeadline(Number(stored));
        return;
      }
    } catch {}
    const dl = Date.now() + questionSeconds * 1000;
    setExamDeadline(dl);
    try { localStorage.setItem(key, String(dl)); } catch {}
  }, [mode, attemptId, questionSeconds, examQuestions.length]);

  useEffect(() => {
    if (mode !== 'exam') return;
    const t = setInterval(() => setNow(Date.now()), 250);
    return () => clearInterval(t);
  }, [mode]);

  const examTimeUp = mode === 'exam' && !!examDeadline && now >= examDeadline;

  // Auto-finish the exam when total time runs out.
  useEffect(() => {
    if (!examTimeUp || !attemptId) return;
    handleFinishRef.current();
  }, [examTimeUp, attemptId]);

  const handleStart = async (selectedMode: 'exam' | 'practice') => {
    const hasAnswered = practiceQuestions.some((q) => answers[q.id]);
    if (selectedMode === 'practice' && unfinishedAttempt?.mode === 'practice' && hasAnswered) {
      setMode('resume');
      return;
    }
    // Finish any lingering unfinished exam before starting a new attempt.
    if (unfinishedAttempt?.mode === 'exam' && attemptId) {
      finishAttempt(attemptId).catch(() => {});
    }
    setLoading(selectedMode);
    const attempt = await startAttempt(lesson.id, selectedMode);
    setAttemptId(attempt.id);
    setStartedAt(Date.now());
    setAnswers({});
    setFeedback({});
    setCurrentIndex(0);
    setMode(selectedMode);
    setLoading(false);
  };

  const handleContinue = () => {
    const firstUnanswered = questions.findIndex((q) => !answers[q.id]);
    setCurrentIndex(firstUnanswered === -1 ? questions.length - 1 : firstUnanswered);
    setMode('practice');
  };

  const handleRestart = async () => {
    setMode('select');
    setAnswers({});
    setFeedback({});
    setCurrentIndex(0);
    setLoading('practice');
    const attempt = await startAttempt(lesson.id, 'practice');
    setAttemptId(attempt.id);
    setStartedAt(Date.now());
    setMode('practice');
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
        setSavingCount((n) => n - 1);
      });
    pendingSaves.current.add(save);
    setSavingCount((n) => n + 1);
  }, [attemptId, L.saveFailed]);

  const handleFinish = async () => {
    if (!attemptId) return;
    setLoading('finish');
    await Promise.all(pendingSaves.current);
    const result = await finishAttempt(attemptId);
    setExamResult(result);
    setLoading(false);
  };
  handleFinishRef.current = handleFinish;

  if (examResult) {
    return (
      <ExamResults
        lessonTitle={[subjectName, fmt(L.lessonN, { n: lessonNumber })].filter(Boolean).join(" · ")}
        result={examResult}
        questions={questions}
        onBack={() => router.push(`/subjects/${subjectId}`)}
        onRetry={handleRetry}
      />
    );
  }

  const myRow = leaderboard.find((r) => r.student_id === currentUserId);

  if (mode === 'resume') {
    const answered = questions.filter((q) => answers[q.id]).length;
    const correct = questions.filter((q) => answers[q.id]?.is_correct === true).length;
    const wrong = questions.filter((q) => answers[q.id]?.is_correct === false).length;
    const ratio = questions.length ? answered / questions.length : 0;
    const R = 52;
    const C = 2 * Math.PI * R;
    return (
      <div className="mx-auto flex max-w-xl flex-col gap-4 animate-fade-up">
        <span dir="auto" className="truncate text-center text-sm font-medium text-muted">
          {lesson.title}
        </span>

        <section className="card flex flex-col items-center gap-4 !rounded-[28px] px-5 py-7 text-center">
          <div className="relative h-32 w-32">
            <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90" aria-hidden="true">
              <circle cx="60" cy="60" r={R} fill="none" strokeWidth="10" className="stroke-border" />
              <circle
                cx="60"
                cy="60"
                r={R}
                fill="none"
                strokeWidth="10"
                strokeLinecap="round"
                strokeDasharray={C}
                strokeDashoffset={C * (1 - ratio)}
                className="stroke-primary transition-[stroke-dashoffset] duration-700"
              />
            </svg>
            <span className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-extrabold tabular-nums" dir="ltr">
                {answered}/{questions.length}
              </span>
            </span>
          </div>

          <div>
            <h1 className="text-xl font-extrabold sm:text-2xl">{L.resumeTitle}</h1>
            <p className="mt-1 text-sm text-muted sm:text-base">{fmt(L.resumeText, { a: answered, n: questions.length })}</p>
          </div>

          {(correct > 0 || wrong > 0) && (
            <div className="flex gap-2 text-sm font-bold">
              <span className="inline-flex items-center gap-1 rounded-full bg-success-light px-3 py-1 text-success-ink">
                <CircleCheck className="h-4 w-4" />
                {fmt(L.resumeCorrect, { n: correct })}
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-error-light px-3 py-1 text-error">
                <CircleX className="h-4 w-4" />
                {fmt(L.resumeWrong, { n: wrong })}
              </span>
            </div>
          )}

          {questions.length > 1 && (
            <div className="flex flex-wrap justify-center gap-1.5" aria-hidden="true">
              {questions.map((q, i) => {
                const a = answers[q.id];
                return (
                  <span
                    key={q.id}
                    className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold ${
                      !a
                        ? 'border-2 border-border bg-surface text-muted'
                        : a.is_correct === false
                          ? 'border-2 border-error bg-error-light text-error'
                          : 'border-2 border-success bg-success-light text-success-ink'
                    }`}
                  >
                    {i + 1}
                  </span>
                );
              })}
            </div>
          )}
        </section>

        <div className="flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={handleRestart}
            disabled={!!loading}
            className="press flex h-11 max-w-44 flex-1 cursor-pointer items-center justify-center gap-2 rounded-full border-2 border-border bg-surface text-base font-bold text-ink hover:border-ink disabled:cursor-not-allowed disabled:opacity-60 sm:h-12"
          >
            {loading === 'practice' ? (
              <span className="h-5 w-5 animate-spin rounded-full border-2 border-ink/30 border-t-ink" />
            ) : (
              <RotateCcw className="h-5 w-5" />
            )}
            {L.resumeRestart}
          </button>
          <Button onClick={handleContinue} disabled={!!loading} className="h-11 max-w-44 flex-1 text-base font-extrabold sm:h-12">
            {L.resumeContinue}
            <ArrowLeft className="h-5 w-5 ltr:-scale-x-100" />
          </Button>
        </div>

        <Link
          href={`/subjects/${subjectId}`}
          className="press mx-auto flex h-9 items-center gap-1.5 rounded-full border-2 border-border bg-surface px-5 text-sm font-bold text-ink hover:border-ink"
        >
          <BookOpen className="h-4 w-4" />
          {L.backToLessons}
        </Link>
      </div>
    );
  }

  if (mode === 'select' && showRank) {
    return (
      <div className="mx-auto flex max-w-xl flex-col gap-4 animate-fade-up">
        <div className="text-center">
          <h1 className="inline-flex items-center gap-2 text-2xl font-extrabold">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent text-ink">
              <Trophy className="h-5 w-5" />
            </span>
            {L.rankTitle}
          </h1>
        </div>

        {myRow && (
          <section className="card flex items-stretch !rounded-3xl p-5">
            <div className="flex min-w-0 flex-1 flex-col justify-center text-start">
              <span dir="auto" className="truncate text-sm font-medium text-muted">
                {subjectName}
              </span>
              <span className="mt-1 text-xl font-extrabold">{fmt(L.lessonN, { n: lessonNumber })}</span>
            </div>
            <span className="mx-4 w-px bg-border" aria-hidden="true" />
            <div className="flex flex-col items-center justify-center text-center">
              <span className="text-xs font-bold text-muted">{L.yourRank}</span>
              <span className="mt-0.5 text-3xl font-extrabold leading-none text-primary-ink tabular-nums" dir="ltr">
                {myRow.rank}
                <span className="text-lg text-muted"> / {leaderboard.length}</span>
              </span>
              <span className="mt-1 text-xs text-muted">{L.students}</span>
            </div>
          </section>
        )}

        <RankingList rows={leaderboard} currentUserId={currentUserId} emptyText={L.rankEmpty} />
        <p className="text-center text-xs text-muted">{L.firstOnly}</p>

        <button
          type="button"
          onClick={() => setShowRank(false)}
          className="press mx-auto flex h-10 cursor-pointer items-center gap-1.5 rounded-full border-2 border-border bg-surface px-6 text-sm font-bold text-ink hover:border-ink"
        >
          <ArrowRight className="h-4 w-4 ltr:-scale-x-100" />
          {L.back}
        </button>
      </div>
    );
  }

  if (mode === 'select') {
    return (
      <div className="max-w-3xl mx-auto space-y-4 sm:space-y-6">
        <section className="relative overflow-hidden rounded-[28px] border border-border bg-gradient-to-b from-primary-light to-surface px-4 pt-6 pb-7 text-center sm:px-8 sm:pt-8 sm:pb-9 animate-fade-up">
          <span className="pointer-events-none absolute -top-16 -start-16 h-48 w-48 rounded-full bg-primary/10" aria-hidden="true" />
          <span className="pointer-events-none absolute -bottom-20 -end-10 h-40 w-40 rounded-full bg-accent/15" aria-hidden="true" />
          <div className="relative">
            <Link
              href={`/subjects/${subjectId}`}
              className="press inline-flex items-center gap-1 rounded-full bg-surface px-3 py-1 text-xs font-bold text-muted shadow-sm hover:text-ink"
            >
              <ArrowRight className="h-3.5 w-3.5 ltr:-scale-x-100" />
              {L.backToLessons}
            </Link>
            <h1 dir="auto" className="mt-3 text-2xl font-extrabold leading-snug sm:text-3xl">
              {lesson.title}
            </h1>
            <div className="mt-3 flex flex-wrap justify-center gap-2 text-sm font-bold">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-surface px-3 py-1 text-ink shadow-sm">
                <ListChecks className="h-4 w-4 text-primary-ink" />
                {fmt(L.questionsCount, { n: practiceQuestions.length })}
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-surface px-3 py-1 text-ink shadow-sm">
                <Users className="h-4 w-4 text-primary-ink" />
                {fmt(L.competitors, { n: leaderboard.length })}
              </span>
            </div>
          </div>
        </section>

        {/* Practice and exam side by side, ranking below. Text and icon are centered
            together, text first. */}
        <div className="grid grid-cols-2 gap-2.5 sm:gap-3 animate-fade-up">
          {[
            {
              key: 'practice' as const,
              icon: BookOpenCheck,
              box: 'border-success/25 bg-success-light hover:border-success/50',
              title: 'text-success-ink',
              tile: 'bg-success text-white',
              label: L.practice,
              count: practiceQuestions.length,
            },
            {
              key: 'exam' as const,
              icon: ClipboardList,
              box: 'border-primary/25 bg-primary-light hover:border-primary/50',
              title: 'text-primary-ink',
              tile: 'bg-primary text-white',
              label: L.exam,
              count: examQuestions.length,
            },
          ].map((m) => (
            <button
              key={m.key}
              type="button"
              onClick={() => handleStart(m.key)}
              disabled={!!loading || m.count === 0}
              className={`press flex cursor-pointer items-center justify-center gap-3 rounded-2xl border p-3 text-start transition-colors disabled:cursor-not-allowed disabled:opacity-50 sm:p-4 ${m.box}`}
            >
              <span className="min-w-0">
                <span className={`block truncate text-sm font-extrabold sm:text-base ${m.title}`}>{m.label}</span>
                <span className="block text-xs text-muted">{fmt(L.questionsCount, { n: m.count })}</span>
              </span>
              <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl sm:h-11 sm:w-11 ${m.tile}`}>
                {loading === m.key ? (
                  <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                ) : (
                  <m.icon className="h-5 w-5" />
                )}
              </span>
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={() => setShowRank(true)}
          className="press flex w-full cursor-pointer items-center justify-center gap-3 rounded-2xl border border-accent/30 bg-accent-light px-4 py-3 text-start text-sm font-extrabold text-accent-ink transition-colors hover:border-accent/60"
        >
          {L.rank}
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent text-ink">
            <Trophy className="h-4 w-4" />
          </span>
        </button>
      </div>
    );
  }

  const currentQ = questions[currentIndex];
  if (!currentQ) return null;

  const doneCount = questions.filter((q) => answers[q.id]).length;
  const hasFeedback = feedback[currentQ.id];
  const hasAnswer = answers[currentQ.id];
  const isLast = currentIndex === questions.length - 1;
  const navLocked = mode === 'practice' && savingCount > 0;
  const locked = (!!hasAnswer && mode === 'practice') || examTimeUp;

  const dotStyle = (q: Question, i: number) => {
    const fb = feedback[q.id];
    const a = answers[q.id];
    const base = i === currentIndex ? 'ring-2 ring-ink ring-offset-2 ring-offset-background ' : '';
    if (mode === 'practice' && fb) return base + (fb.is_correct ? 'bg-success-light text-success-ink border-2 border-success' : 'bg-error-light text-error border-2 border-error');
    if (a) return base + 'bg-primary text-on-primary';
    return base + 'bg-surface text-muted border-2 border-border';
  };

  return (
    <div className="mx-auto flex max-w-xl flex-col gap-2.5 sm:gap-3">
      <div className="flex flex-col items-center gap-1.5">
        <span dir="auto" className="max-w-full truncate text-center text-sm font-medium text-muted">
          {lesson.title}
        </span>
        {mode === 'exam' && examDeadline && (
          <QuestionTimer left={Math.max(0, examDeadline - now)} total={questionSeconds} label={L.timeLeft} />
        )}
      </div>

      {questions.length > 1 && (
        <div className="flex flex-wrap justify-center gap-1.5 sm:gap-2">
          {questions.map((q, i) => (
            <button
              key={q.id}
              onClick={() => setCurrentIndex(i)}
              disabled={navLocked}
              aria-label={fmt(L.questionNumber, { n: i + 1 })}
              className={`press h-7 w-7 cursor-pointer rounded-full text-xs font-bold disabled:cursor-wait disabled:opacity-60 sm:h-10 sm:w-10 sm:text-sm transition ${dotStyle(q, i)}`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}

      <div key={currentQ.id} className="flex flex-col gap-2.5 sm:gap-3">
        <section className="flex flex-col justify-center rounded-2xl bg-ink px-4 py-3 text-background sm:rounded-3xl sm:px-5 sm:py-5 shadow-[0_12px_28px_rgb(11_31_51/0.18)] animate-fade-up">
          <h1 dir="auto" className="text-base font-extrabold leading-relaxed sm:text-xl">
            {currentQ.content.question?.text}
          </h1>
          {currentQ.content.question?.image && (
            <div className="mt-3 overflow-hidden rounded-2xl bg-surface">
              <ImageZoom src={currentQ.content.question.image} />
            </div>
          )}
        </section>

        {currentQ.type === 'mcq' && (
          <McqQuestion
            hideStem
            content={currentQ.content}
            onAnswer={(resp) => handleAnswer(currentQ.id, resp)}
            feedback={hasFeedback}
            disabled={locked}
            selectedOption={hasAnswer?.response}
          />
        )}
        {currentQ.type === 'true_false' && (
          <TrueFalseQuestion
            hideStem
            content={currentQ.content}
            onAnswer={(resp) => handleAnswer(currentQ.id, resp)}
            feedback={hasFeedback}
            disabled={locked}
            selectedValue={hasAnswer?.response}
          />
        )}
        {currentQ.type === 'fill_blanks' && (
          <div className="card p-3 sm:p-5 animate-fade-up">
            <FillBlanksQuestion
              key={currentQ.id}
              content={{ ...currentQ.content, question: undefined }}
              onAnswer={(resp) => handleAnswer(currentQ.id, resp)}
              feedback={hasFeedback}
              disabled={locked}
              savedResponse={hasAnswer?.response}
            />
          </div>
        )}

        {examTimeUp && (
          <p className="flex items-center gap-2 rounded-xl bg-error-light px-3 py-2 text-[13px] font-bold text-error animate-slide-in" role="status">
            <Clock className="h-4 w-4 shrink-0" />
            {L.timeUp}
          </p>
        )}

        {mode === 'practice' && hasAnswer && !hasFeedback && !('is_correct' in hasAnswer) && (
          <p className="flex items-center gap-2 text-sm text-muted">
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary/30 border-t-primary" />
            {L.checking}
          </p>
        )}

        {mode === 'practice' && hasFeedback && (
          <div
            className={`flex gap-2 rounded-xl px-3 py-2 text-[13px] leading-snug animate-slide-in ${
              hasFeedback.is_correct ? 'bg-success-light' : 'bg-error-light'
            }`}
          >
            {hasFeedback.is_correct ? (
              <CircleCheck className="mt-px h-4 w-4 shrink-0 text-success-ink" />
            ) : (
              <CircleX className="mt-px h-4 w-4 shrink-0 text-error" />
            )}
            <p className="text-foreground/85">
              <span className={`font-bold ${hasFeedback.is_correct ? 'text-success-ink' : 'text-error'}`}>
                {hasFeedback.is_correct ? L.correct : L.wrong}
              </span>
              {hasFeedback.option_explanation && <span dir="auto"> {hasFeedback.option_explanation}</span>}
              {hasFeedback.explanation && <span dir="auto"> {hasFeedback.explanation}</span>}
            </p>
          </div>
        )}
      </div>

      <div className="sticky bottom-[4.5rem] z-10 flex items-center justify-center gap-3 py-1 md:bottom-3">
        <button
          type="button"
          onClick={() => setCurrentIndex((i) => Math.max(0, i - 1))}
          disabled={currentIndex === 0 || navLocked}
          className="press flex h-11 max-w-44 flex-1 sm:h-12 cursor-pointer items-center justify-center gap-2 rounded-full border-2 border-border bg-surface text-base font-bold text-ink hover:border-ink disabled:cursor-not-allowed disabled:opacity-40"
        >
          <ArrowRight className="h-5 w-5 ltr:-scale-x-100" />
          {L.previous}
        </button>

        {doneCount === questions.length ? (
          <Button onClick={handleFinish} loading={loading === 'finish'} disabled={navLocked} className="h-11 max-w-44 flex-1 text-base font-extrabold sm:h-12">
            <Flag className="h-5 w-5" />
            {mode === 'exam' ? L.finishExam : L.finishPractice}
          </Button>
        ) : (
          <Button
            onClick={() => setCurrentIndex((i) => Math.min(questions.length - 1, i + 1))}
            disabled={isLast || navLocked}
            className="h-11 max-w-44 flex-1 text-base font-extrabold sm:h-12"
          >
            {L.next}
            <ArrowLeft className="h-5 w-5 ltr:-scale-x-100" />
          </Button>
        )}
      </div>

      <Link
        href={`/subjects/${subjectId}`}
        className="press mx-auto flex h-9 items-center gap-1.5 rounded-full border-2 border-border bg-surface px-5 text-sm font-bold text-ink hover:border-ink"
      >
        <BookOpen className="h-4 w-4" />
        {L.backToLessons}
      </Link>
    </div>
  );
}
