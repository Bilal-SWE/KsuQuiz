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
  Trophy,
  Users,
  X,
  RotateCcw,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { startAttempt, submitAnswer, finishAttempt } from '@/app/actions/quiz';
import { McqQuestion } from '@/components/student/questions/mcq';
import { TrueFalseQuestion } from '@/components/student/questions/true-false';
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
  in_practice?: boolean;
  in_exam?: boolean;
};

type Props = {
  subjectId: string;
  lesson: { id: string; title: string; question_seconds?: number };
  questions: Question[];
  unfinishedAttempt: { id: string; mode: string; started_at?: string } | null;
  existingAnswers: { question_id: string; response: any; is_correct: boolean | null }[];
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
  questions: allQuestions,
  unfinishedAttempt,
  existingAnswers,
  leaderboard,
  currentUserId,
}: Props) {
  const router = useRouter();
  const { t } = useI18n();
  const L = t.lesson;
  // An unfinished exam resumes directly (restarting would reset its timer); an unfinished
  // practice asks whether to continue or start over.
  const [mode, setMode] = useState<'select' | 'resume' | 'exam' | 'practice'>(
    unfinishedAttempt ? (unfinishedAttempt.mode === 'practice' ? 'resume' : 'exam') : 'select',
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

  // Practice and exam are separate sets chosen by the admin; each mode only sees its own.
  const practiceQuestions = useMemo(() => allQuestions.filter((q) => q.in_practice !== false), [allQuestions]);
  const examQuestions = useMemo(() => allQuestions.filter((q) => q.in_exam !== false), [allQuestions]);
  const questions = mode === 'exam' ? examQuestions : practiceQuestions;
  const pendingSaves = useRef(new Set<Promise<void>>());

  // Exam mode: each question gets its own deadline the first time it is shown. The deadlines
  // are kept per attempt in localStorage so a reload doesn't hand out fresh time.
  const questionSeconds = lesson.question_seconds ?? DEFAULT_QUESTION_SECONDS;
  const [deadlines, setDeadlines] = useState<Record<string, number>>({});
  const [now, setNow] = useState(() => Date.now());
  const deadlinesKey = attemptId ? `exam-deadlines-${attemptId}` : null;

  useEffect(() => {
    if (mode !== 'exam' || !deadlinesKey) return;
    try {
      setDeadlines(JSON.parse(localStorage.getItem(deadlinesKey) ?? '{}'));
    } catch {
      setDeadlines({});
    }
  }, [mode, deadlinesKey]);

  useEffect(() => {
    if (mode !== 'exam') return;
    const t = setInterval(() => setNow(Date.now()), 250);
    return () => clearInterval(t);
  }, [mode]);

  const examQuestionId = mode === 'exam' ? questions[currentIndex]?.id : undefined;
  useEffect(() => {
    if (!examQuestionId || !deadlinesKey) return;
    setDeadlines((prev) => {
      if (prev[examQuestionId]) return prev;
      const next = { ...prev, [examQuestionId]: Date.now() + questionSeconds * 1000 };
      try {
        localStorage.setItem(deadlinesKey, JSON.stringify(next));
      } catch {}
      return next;
    });
  }, [examQuestionId, deadlinesKey, questionSeconds]);

  const isExpired = (id: string) => mode === 'exam' && !!deadlines[id] && now >= deadlines[id];

  // When the question on screen runs out of time, move on to the next one that still has time.
  const currentExpired = examQuestionId ? isExpired(examQuestionId) : false;
  useEffect(() => {
    if (!currentExpired) return;
    const t = setTimeout(() => {
      const order = [...questions.slice(currentIndex + 1), ...questions.slice(0, currentIndex)];
      const open = (q: Question) => !(deadlines[q.id] && Date.now() >= deadlines[q.id]);
      const target = order.find((q) => open(q) && !answers[q.id]) ?? order.find(open);
      if (target) setCurrentIndex(questions.indexOf(target));
    }, 1500);
    return () => clearTimeout(t);
  }, [currentExpired, currentIndex, questions, deadlines, answers]);

  const handleStart = async (selectedMode: 'exam' | 'practice') => {
    setLoading(selectedMode);
    const attempt = await startAttempt(lesson.id, selectedMode);
    setAttemptId(attempt.id);
    setStartedAt(Date.now());
    setMode(selectedMode);
    setLoading(false);
  };

  const handleContinue = () => {
    const firstUnanswered = questions.findIndex((q) => !answers[q.id]);
    setCurrentIndex(firstUnanswered === -1 ? questions.length - 1 : firstUnanswered);
    setMode('practice');
  };

  const handleRestart = async () => {
    setAnswers({});
    setFeedback({});
    setCurrentIndex(0);
    await handleStart('practice');
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

  if (mode === 'resume') {
    const answered = questions.filter((q) => answers[q.id]).length;
    const pct = questions.length ? Math.round((answered / questions.length) * 100) : 0;
    return (
      <div className="mx-auto flex max-w-xl flex-col gap-5 animate-fade-up">
        <div className="flex items-center justify-between gap-3">
          <Link
            href={`/subjects/${subjectId}`}
            aria-label={L.exitLesson}
            className="press flex h-11 w-11 items-center justify-center rounded-full bg-surface text-ink shadow-sm hover:bg-surface-hover"
          >
            <X className="h-5 w-5" strokeWidth={2.5} />
          </Link>
          <span dir="auto" className="min-w-0 truncate text-base font-bold text-muted">
            {lesson.title}
          </span>
          <span className="rounded-full bg-pastel-teal px-4 py-2 text-base font-extrabold text-ink">{L.practiceBadge}</span>
        </div>

        <section className="flex flex-col gap-5 rounded-[28px] bg-surface px-6 py-7 shadow-[0_12px_28px_rgb(11_31_51/0.08)]">
          <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-pastel-amber text-ink">
            <RotateCcw className="h-7 w-7" />
          </span>
          <div className="flex flex-col gap-2">
            <h1 className="text-[26px] font-extrabold leading-normal">{L.resumeTitle}</h1>
            <p className="text-lg leading-relaxed text-muted">{fmt(L.resumeText, { a: answered, n: questions.length })}</p>
          </div>
          <div className="h-2.5 overflow-hidden rounded-full bg-border">
            <div className="h-full rounded-full bg-primary" style={{ width: `${pct}%` }} />
          </div>
        </section>

        <div className="flex flex-col gap-3">
          <Button onClick={handleContinue} disabled={!!loading} className="py-4 text-lg font-extrabold">
            {L.resumeContinue}
            <ArrowLeft className="h-5 w-5 ltr:-scale-x-100" />
          </Button>
          <button
            type="button"
            onClick={handleRestart}
            disabled={!!loading}
            className="press flex cursor-pointer items-center justify-center gap-2 rounded-full border-2 border-ink bg-surface px-4 py-3.5 text-lg font-bold text-ink hover:bg-surface-hover disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading === 'practice' ? (
              <span className="h-5 w-5 animate-spin rounded-full border-2 border-ink/30 border-t-ink" />
            ) : (
              <RotateCcw className="h-5 w-5" />
            )}
            {L.resumeRestart}
          </button>
        </div>
      </div>
    );
  }

  if (mode === 'select' && showRank) {
    return (
      <div className="max-w-2xl mx-auto space-y-5 animate-fade-up">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Trophy className="h-6 w-6 text-accent-ink" />
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
          <p className="rounded-xl bg-primary-light px-4 py-2.5 text-sm font-medium text-primary-ink">
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
        tint: 'bg-success text-ink',
        onClick: () => handleStart('practice'),
      },
      {
        key: 'exam' as const,
        title: L.exam,
        desc: fmt(L.examDesc, { s: questionSeconds, n: examQuestions.length }),
        icon: ClipboardList,
        tint: 'bg-primary text-ink',
        onClick: () => handleStart('exam'),
      },
      {
        key: 'rank' as const,
        title: L.rank,
        desc: myRow
          ? fmt(L.rankMine, { rank: myRow.rank, total: leaderboard.length })
          : fmt(L.rankCount, { n: leaderboard.length }),
        icon: Trophy,
        tint: 'bg-accent text-ink',
        onClick: () => setShowRank(true),
      },
    ];

    return (
      <div className="max-w-3xl mx-auto space-y-4 sm:space-y-6">
        <section className="hero p-5 sm:p-8 animate-fade-up">
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
                {fmt(L.questionsCount, { n: practiceQuestions.length })}
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
              disabled={!!loading || (m.key === 'practice' && practiceQuestions.length === 0) || (m.key === 'exam' && examQuestions.length === 0)}
              className="card card-hover press group flex items-center gap-4 p-4 text-start cursor-pointer sm:flex-col sm:items-start sm:gap-3 sm:p-5 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl sm:h-12 sm:w-12 ${m.tint} shadow-md transition-transform group-hover:scale-110 group-hover:-rotate-6`}>
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

  // In an exam, a question whose time ran out counts as done (unanswered).
  const doneCount = questions.filter((q) => answers[q.id] || isExpired(q.id)).length;
  const hasFeedback = feedback[currentQ.id];
  const hasAnswer = answers[currentQ.id];
  const isLast = currentIndex === questions.length - 1;
  const timeUp = isExpired(currentQ.id);
  const locked = (!!hasAnswer && mode === 'practice') || timeUp;
  const deadline = deadlines[currentQ.id];

  const dotStyle = (q: Question, i: number) => {
    const fb = feedback[q.id];
    const a = answers[q.id];
    const base = i === currentIndex ? 'ring-2 ring-ink ring-offset-2 ring-offset-background ' : '';
    if (mode === 'practice' && fb) return base + (fb.is_correct ? 'bg-success-light text-success-ink border-2 border-success' : 'bg-error-light text-error border-2 border-error');
    if (a) return base + 'bg-primary text-on-primary';
    if (isExpired(q.id)) return base + 'bg-surface-hover text-muted/60 border-2 border-dashed border-border line-through';
    return base + 'bg-surface text-muted border-2 border-border';
  };

  return (
    <div className="mx-auto flex max-w-xl flex-col gap-2.5 sm:gap-3">
      <div className="flex flex-col items-center gap-1.5">
        <span dir="auto" className="max-w-full truncate text-center text-sm font-medium text-muted">
          {lesson.title}
        </span>
        {mode === 'exam' && deadline && (
          <QuestionTimer left={Math.max(0, deadline - now)} total={questionSeconds} label={L.timeLeft} />
        )}
      </div>

      {questions.length > 1 && (
        <div className="flex flex-wrap justify-center gap-1.5 sm:gap-2">
          {questions.map((q, i) => (
            <button
              key={q.id}
              onClick={() => setCurrentIndex(i)}
              aria-label={fmt(L.questionNumber, { n: i + 1 })}
              className={`press h-7 w-7 cursor-pointer rounded-full text-xs font-bold sm:h-10 sm:w-10 sm:text-sm transition ${dotStyle(q, i)}`}
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

        {timeUp && (
          <p className="flex items-center gap-2 rounded-xl bg-error-light px-3 py-2 text-[13px] font-bold text-error animate-slide-in" role="status">
            <Clock className="h-4 w-4 shrink-0" />
            {hasAnswer ? L.timeUpAnswered : L.timeUp}
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
          disabled={currentIndex === 0}
          className="press flex h-11 max-w-44 flex-1 sm:h-12 cursor-pointer items-center justify-center gap-2 rounded-full border-2 border-border bg-surface text-base font-bold text-ink hover:border-ink disabled:cursor-not-allowed disabled:opacity-40"
        >
          <ArrowRight className="h-5 w-5 ltr:-scale-x-100" />
          {L.previous}
        </button>

        {doneCount === questions.length ? (
          <Button onClick={handleFinish} loading={loading === 'finish'} className="h-11 max-w-44 flex-1 text-base font-extrabold sm:h-12">
            <Flag className="h-5 w-5" />
            {mode === 'exam' ? L.finishExam : L.finishPractice}
          </Button>
        ) : (
          <Button
            onClick={() => setCurrentIndex((i) => Math.min(questions.length - 1, i + 1))}
            disabled={isLast}
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
