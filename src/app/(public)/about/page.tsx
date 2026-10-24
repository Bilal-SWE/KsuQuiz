import type { Metadata } from 'next';
import Link from 'next/link';
import { BookOpenCheck, Info, Scale, Smartphone, Target } from 'lucide-react';
import { LegalPage } from '@/components/shell/legal-page';
import { APP_NAME } from '@/lib/constants';

export const metadata: Metadata = { title: `من نحن | ${APP_NAME}` };

const values = [
  { icon: BookOpenCheck, title: 'الفهم قبل الحفظ', desc: 'كل سؤال معه شرح يوضح سبب الإجابة الصحيحة وسبب خطأ غيرها.' },
  { icon: Scale, title: 'منافسة عادلة', desc: 'الترتيب يحسب أول محاولة اختبار فقط، فلا يتقدم أحد بتكرار الأسئلة وحفظها.' },
  { icon: Smartphone, title: 'متاح في أي وقت', desc: 'مصمم ليعمل بسلاسة على الجوال والكمبيوتر.' },
];

export default function AboutPage() {
  return (
    <LegalPage title="من نحن" subtitle={`تعرّف على ${APP_NAME} وما نقدمه`} icon={Info}>
      <h2>ما هو {APP_NAME}؟</h2>
      <p>
        {APP_NAME} منصة إلكترونية لتدريب طلاب الجامعة على أسئلة موادهم الدراسية. يجد الطالب في المنصة دروساً مقسمة
        حسب المواد، ولكل درس أسئلة متنوعة يتدرب عليها بطريقتين: وضع التمرين الذي يعرض الإجابة والشرح بعد كل سؤال،
        ووضع الاختبار الذي يقيس المستوى ويعرض النتيجة في النهاية.
      </p>

      <h2>ماذا نقدم؟</h2>
      <ul>
        <li>أسئلة اختيار من متعدد، وصح أو خطأ، واملأ الفراغات من بنك كلمات.</li>
        <li>شرح لكل إجابة لمساعدة الطالب على فهم أخطائه.</li>
        <li>ترتيب لكل اختبار وترتيب عام يتنافس فيه الطلاب.</li>
        <li>متابعة للتقدم في كل مادة وأفضل نتيجة في كل درس.</li>
      </ul>

      <h2>مبادئنا</h2>
      <div className="not-prose my-4 grid gap-3 sm:grid-cols-3">
        {values.map((v) => (
          <div key={v.title} className="rounded-2xl bg-surface-hover p-4">
            <span className="mb-2 flex h-10 w-10 items-center justify-center rounded-xl bg-primary-light text-primary">
              <v.icon className="h-5 w-5" />
            </span>
            <p className="mb-1! font-bold text-foreground">{v.title}</p>
            <p className="mb-0! text-sm text-muted leading-relaxed">{v.desc}</p>
          </div>
        ))}
      </div>

      <h2>هدفنا</h2>
      <p className="flex gap-2">
        <Target className="mt-1.5 h-5 w-5 shrink-0 text-primary" />
        <span>أن تصبح المذاكرة عادة يومية ممتعة، وأن يدخل الطالب اختباره وهو واثق من فهمه للمادة.</span>
      </p>

      <h2>تواصل معنا</h2>
      <p>
        لديك اقتراح أو ملاحظة؟ يسعدنا سماعك عبر <Link href="/contact">صفحة اتصل بنا</Link>.
      </p>
    </LegalPage>
  );
}
