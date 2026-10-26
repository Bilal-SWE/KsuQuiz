import type { Metadata } from 'next';
import Link from 'next/link';
import { BookOpenCheck, Info, Scale, Smartphone, Target, TriangleAlert } from 'lucide-react';
import { LegalPage } from '@/components/shell/legal-page';
import { getI18n } from '@/i18n/server';
import { APP_NAME } from '@/lib/constants';

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getI18n();
  return { title: `${t.legal.aboutTitle} | ${APP_NAME}` };
}

const content = {
  ar: {
    whatTitle: `ما هو ${APP_NAME}؟`,
    what: `${APP_NAME} منصة كويزات تدريبية لطلاب الجامعة، تساعدهم على مراجعة أسئلة موادهم الدراسية. يجد الطالب في المنصة دروساً مقسمة حسب المواد، ولكل درس كويز من أسئلة متنوعة يحله بطريقتين: وضع التمرين الذي يعرض الإجابة والشرح بعد كل سؤال، ووضع الاختبار الذي يقيس المستوى ويعرض النتيجة في النهاية.`,
    noteTitle: 'تنبيه مهم',
    note: 'جميع الأسئلة في المنصة أسئلة تدريبية أُعدّت للمراجعة والتدرّب، وليست أسئلة تجميعات، ولا تغني عن الرجوع إلى المحاضرات والمراجع المعتمدة.',
    offerTitle: 'ماذا نقدم؟',
    offer: [
      'أسئلة اختيار من متعدد، وصح أو خطأ، واملأ الفراغات من بنك كلمات.',
      'شرح لكل إجابة لمساعدة الطالب على فهم أخطائه.',
      'ترتيب لكل اختبار وترتيب عام يتنافس فيه الطلاب.',
      'متابعة للتقدم في كل مادة وأفضل نتيجة في كل درس.',
    ],
    valuesTitle: 'مبادئنا',
    values: [
      { title: 'الفهم قبل الحفظ', desc: 'كل سؤال معه شرح يوضح سبب الإجابة الصحيحة وسبب خطأ غيرها.' },
      { title: 'منافسة عادلة', desc: 'الترتيب يحسب أول محاولة اختبار فقط، فلا يتقدم أحد بتكرار الأسئلة وحفظها.' },
      { title: 'متاح في أي وقت', desc: 'مصمم ليعمل بسلاسة على الجوال والكمبيوتر.' },
    ],
    goalTitle: 'هدفنا',
    goal: 'أن تصبح المذاكرة عادة يومية ممتعة، وأن يدخل الطالب اختباره وهو واثق من فهمه للمادة.',
    contactTitle: 'تواصل معنا',
    contactBefore: 'لديك اقتراح أو ملاحظة؟ يسعدنا سماعك عبر',
    contactLink: 'صفحة اتصل بنا',
  },
  en: {
    whatTitle: `What is ${APP_NAME}?`,
    what: `${APP_NAME} is a practice quiz platform that helps university students revise questions from their courses. Lessons are organized by subject, and each lesson has a quiz of varied questions students can take in two ways: practice mode, which shows the answer and an explanation after each question, and exam mode, which measures their level and shows the score at the end.`,
    noteTitle: 'Please note',
    note: 'All questions on the platform are practice questions written for revision. They are not compiled past-exam questions and do not replace your lectures and approved references.',
    offerTitle: 'What we offer',
    offer: [
      'Multiple choice, true or false, and fill-in-the-blank questions with a word bank.',
      'An explanation for every answer, so students understand their mistakes.',
      'A leaderboard for each exam, plus an overall leaderboard.',
      'Progress tracking for each subject and your best score in each lesson.',
    ],
    valuesTitle: 'Our principles',
    values: [
      { title: 'Understanding over memorizing', desc: 'Every question explains why the right answer is right and why the others are wrong.' },
      { title: 'Fair competition', desc: 'Leaderboards count only your first exam attempt, so nobody gets ahead by memorizing repeated questions.' },
      { title: 'Available anytime', desc: 'Designed to work smoothly on phones and computers.' },
    ],
    goalTitle: 'Our goal',
    goal: 'To make studying an enjoyable daily habit, so students walk into their exams confident they understand the material.',
    contactTitle: 'Get in touch',
    contactBefore: 'Have a suggestion or feedback? We would love to hear from you on our',
    contactLink: 'contact page',
  },
};

const valueIcons = [BookOpenCheck, Scale, Smartphone];

export default async function AboutPage() {
  const { locale, t } = await getI18n();
  const c = content[locale];
  return (
    <LegalPage title={t.legal.aboutTitle} subtitle={t.legal.aboutSubtitle} icon={Info}>
      <h2>{c.whatTitle}</h2>
      <p>{c.what}</p>
      <div className="my-4 flex gap-3 rounded-2xl bg-accent-light p-4">
        <TriangleAlert className="mt-1 h-5 w-5 shrink-0 text-accent-ink" />
        <div>
          <p className="mb-1! font-bold text-foreground">{c.noteTitle}</p>
          <p className="mb-0! text-sm leading-relaxed">{c.note}</p>
        </div>
      </div>

      <h2>{c.offerTitle}</h2>
      <ul>
        {c.offer.map((o) => (
          <li key={o}>{o}</li>
        ))}
      </ul>

      <h2>{c.valuesTitle}</h2>
      <div className="my-4 grid gap-3 sm:grid-cols-3">
        {c.values.map((v, i) => {
          const Icon = valueIcons[i];
          return (
            <div key={v.title} className="rounded-2xl bg-surface-hover p-4">
              <span className="mb-2 flex h-10 w-10 items-center justify-center rounded-xl bg-primary-light text-primary-ink">
                <Icon className="h-5 w-5" />
              </span>
              <p className="mb-1! font-bold text-foreground">{v.title}</p>
              <p className="mb-0! text-sm text-muted leading-relaxed">{v.desc}</p>
            </div>
          );
        })}
      </div>

      <h2>{c.goalTitle}</h2>
      <p className="flex gap-2">
        <Target className="mt-1.5 h-5 w-5 shrink-0 text-primary-ink" />
        <span>{c.goal}</span>
      </p>

      <h2>{c.contactTitle}</h2>
      <p>
        {c.contactBefore} <Link href="/contact">{c.contactLink}</Link>.
      </p>
    </LegalPage>
  );
}
