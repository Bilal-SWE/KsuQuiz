'use client';

import { Button } from '@/components/ui/button';

type ReviewItem = {
  question_id: string;
  response: any;
  is_correct: boolean | null;
  correct_answer: any;
  explanation: string | null;
  option_explanation: string | null;
};

type Question = {
  id: string;
  type: string;
  content: Record<string, any>;
};

export function ExamResults({
  lessonTitle,
  result,
  questions,
  onBack,
  onRetry,
}: {
  lessonTitle: string;
  result: { score: number; total: number; review: ReviewItem[] };
  questions: Question[];
  onBack: () => void;
  onRetry: () => void;
}) {
  const pct = result.total > 0 ? Math.round((result.score / result.total) * 100) : 0;

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center py-8">
        <h1 className="text-xl font-bold mb-2">{lessonTitle}</h1>
        <div
          className={`inline-flex items-center justify-center w-24 h-24 rounded-full text-2xl font-bold ${
            pct >= 70 ? 'bg-green-100 text-green-700' : pct >= 50 ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
          }`}
        >
          {pct}%
        </div>
        <p className="text-muted mt-2">
          {result.score} / {result.total} إجابة صحيحة
        </p>
      </div>

      <h2 className="font-bold text-lg mb-4">مراجعة الإجابات</h2>

      <div className="space-y-4">
        {result.review.map((item, index) => {
          const q = questions.find((q) => q.id === item.question_id);
          if (!q) return null;
          return (
            <div
              key={item.question_id}
              className={`rounded-xl border p-4 ${item.is_correct ? 'border-green-200 bg-green-50/50' : 'border-red-200 bg-red-50/50'}`}
            >
              <div className="flex items-start gap-2 mb-2">
                <span className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white ${item.is_correct ? 'bg-green-500' : 'bg-red-500'}`}>
                  {index + 1}
                </span>
                <p className="text-sm font-medium">{q.content.question?.text}</p>
              </div>

              {q.type === 'mcq' && (
                <div className="text-sm text-muted ms-8">
                  <p>إجابتك: {q.content.options?.find((o: any) => o.id === item.response)?.text ?? item.response}</p>
                  {!item.is_correct && (
                    <p className="text-green-700">الإجابة الصحيحة: {q.content.options?.find((o: any) => o.id === item.correct_answer)?.text ?? item.correct_answer}</p>
                  )}
                </div>
              )}

              {q.type === 'true_false' && (
                <div className="text-sm text-muted ms-8">
                  <p>إجابتك: {item.response ? 'صح' : 'خطأ'}</p>
                  {!item.is_correct && (
                    <p className="text-green-700">الإجابة الصحيحة: {item.correct_answer ? 'صح' : 'خطأ'}</p>
                  )}
                </div>
              )}

              {q.type === 'matching' && !item.is_correct && (
                <p className="text-sm text-green-700 ms-8">بعض المطابقات كانت خاطئة</p>
              )}

              {(item.explanation || item.option_explanation) && (
                <div className="text-sm text-muted mt-2 ms-8 border-t border-border/50 pt-2 space-y-1">
                  {item.option_explanation && <p>{item.option_explanation}</p>}
                  {item.explanation && <p>{item.explanation}</p>}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-6 flex justify-center gap-3">
        <Button onClick={onRetry}>إعادة المحاولة</Button>
        <Button variant="secondary" onClick={onBack}>العودة للدروس</Button>
      </div>
    </div>
  );
}
