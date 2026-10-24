import type { Metadata } from 'next';
import Link from 'next/link';
import { ShieldCheck } from 'lucide-react';
import { LegalPage } from '@/components/shell/legal-page';
import { getI18n } from '@/i18n/server';
import { APP_NAME, CONTACT_EMAIL } from '@/lib/constants';

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getI18n();
  return { title: `${t.legal.privacyTitle} | ${APP_NAME}` };
}

function ArabicPolicy() {
  return (
    <>
      <h2>1. مقدمة</h2>
      <p>
        نحترم في {APP_NAME} خصوصيتك. توضح هذه السياسة البيانات التي نجمعها عند استخدامك للمنصة، وكيف نستخدمها، ومع من
        نشاركها، وما الحقوق التي تملكها. باستخدامك للمنصة فإنك توافق على ما ورد في هذه السياسة.
      </p>

      <h2>2. البيانات التي نجمعها</h2>
      <ul>
        <li>
          <strong>بيانات الحساب:</strong> اسمك وبريدك الإلكتروني وكلمة المرور. تُحفظ كلمة المرور مشفّرة لدى مزود خدمة
          المصادقة، ولا يمكننا الاطلاع عليها.
        </li>
        <li>
          <strong>بيانات استخدام المنصة:</strong> المواد التي تضيفها، ومحاولاتك في التمارين والاختبارات، وإجاباتك
          ونتائجك، والوقت المستغرق في الاختبارات.
        </li>
        <li>
          <strong>رسائل التواصل:</strong> الاسم والبريد ونص الرسالة عندما تراسلنا عبر صفحة اتصل بنا.
        </li>
        <li>
          <strong>بيانات الدفع:</strong> عند الاشتراك تتم عملية الدفع لدى مزود دفع خارجي، ولا نحفظ أرقام البطاقات أو
          بيانات الدفع الكاملة على خوادمنا.
        </li>
      </ul>

      <h2>3. كيف نستخدم بياناتك</h2>
      <ul>
        <li>إنشاء حسابك وتسجيل دخولك وحمايته.</li>
        <li>حفظ تقدمك ونتائجك وعرضها لك.</li>
        <li>حساب الترتيب في الاختبارات.</li>
        <li>إدارة اشتراكك والرد على رسائلك واستفساراتك.</li>
        <li>تحسين المنصة ومعالجة الأخطاء التقنية.</li>
      </ul>

      <h2>4. ما يراه المستخدمون الآخرون</h2>
      <p>
        يظهر اسمك في قوائم الترتيب مع عدد إجاباتك الصحيحة والوقت المستغرق في الاختبارات، ويستطيع المستخدمون الآخرون
        رؤية ذلك. لا يظهر بريدك الإلكتروني لأي مستخدم آخر. يمكنك تغيير الاسم الظاهر في أي وقت من صفحة حسابي.
      </p>

      <h2>5. ملفات تعريف الارتباط</h2>
      <p>
        نستخدم ملفات تعريف الارتباط الضرورية فقط لإبقائك مسجلاً الدخول وحفظ لغة الموقع التي اخترتها. لا نستخدم ملفات
        تعريف ارتباط إعلانية.
      </p>

      <h2>6. مشاركة البيانات</h2>
      <p>لا نبيع بياناتك ولا نؤجرها لأي طرف. نستعين بمزودي خدمة موثوقين لتشغيل المنصة فقط، وهم:</p>
      <ul>
        <li>
          <strong>Supabase:</strong> لاستضافة قاعدة البيانات وخدمة تسجيل الدخول.
        </li>
        <li>
          <strong>Vercel:</strong> لاستضافة الموقع.
        </li>
        <li>
          <strong>مزود الدفع:</strong> لمعالجة مدفوعات الاشتراك عند تفعيلها.
        </li>
      </ul>
      <p>قد نفصح عن البيانات إذا طلبت ذلك جهة نظامية مختصة وفق الأنظمة المعمول بها.</p>

      <h2>7. حماية البيانات</h2>
      <p>
        نتخذ إجراءات معقولة لحماية بياناتك، منها الاتصال المشفّر، وتقييد الوصول إلى البيانات بحيث لا يرى كل مستخدم إلا
        بياناته. ومع ذلك لا توجد وسيلة نقل أو تخزين إلكتروني آمنة تماماً.
      </p>

      <h2>8. الاحتفاظ بالبيانات</h2>
      <p>نحتفظ ببياناتك ما دام حسابك قائماً. عند حذف الحساب تُحذف بيانات حسابك ومحاولاتك ونتائجك من المنصة.</p>

      <h2>9. حقوقك</h2>
      <ul>
        <li>تعديل اسمك وكلمة المرور من صفحة حسابي.</li>
        <li>طلب نسخة من بياناتك أو تصحيحها.</li>
        <li>
          طلب حذف حسابك وبياناتك عبر <Link href="/contact">صفحة اتصل بنا</Link>.
        </li>
      </ul>

      <h2>10. التعديلات على السياسة</h2>
      <p>قد نحدّث هذه السياسة من وقت لآخر، وسنعرض تاريخ آخر تحديث في أعلى الصفحة.</p>

      <h2>11. التواصل</h2>
      <p>
        لأي سؤال حول الخصوصية تواصل معنا عبر <Link href="/contact">صفحة اتصل بنا</Link>
        {CONTACT_EMAIL ? (
          <>
            {' '}أو على البريد <a href={`mailto:${CONTACT_EMAIL}`} dir="ltr">{CONTACT_EMAIL}</a>
          </>
        ) : null}
        .
      </p>
    </>
  );
}

function EnglishPolicy() {
  return (
    <>
      <h2>1. Introduction</h2>
      <p>
        At {APP_NAME} we respect your privacy. This policy explains what data we collect when you use the platform, how
        we use it, who we share it with, and what rights you have. By using the platform, you agree to this policy.
      </p>

      <h2>2. Data we collect</h2>
      <ul>
        <li>
          <strong>Account data:</strong> your name, email address, and password. Your password is stored encrypted by our
          authentication provider, and we cannot see it.
        </li>
        <li>
          <strong>Platform usage data:</strong> the subjects you add, your practice and exam attempts, your answers and
          scores, and the time you spend on exams.
        </li>
        <li>
          <strong>Contact messages:</strong> your name, email, and message when you write to us through the contact page.
        </li>
        <li>
          <strong>Payment data:</strong> when you subscribe, payment is handled by an external payment provider. We do not
          store card numbers or full payment details on our servers.
        </li>
      </ul>

      <h2>3. How we use your data</h2>
      <ul>
        <li>To create, sign in to, and protect your account.</li>
        <li>To save your progress and scores and show them to you.</li>
        <li>To calculate exam leaderboards.</li>
        <li>To manage your subscription and reply to your messages.</li>
        <li>To improve the platform and fix technical problems.</li>
      </ul>

      <h2>4. What other users can see</h2>
      <p>
        Your name appears on leaderboards together with your number of correct answers and the time you spent on exams,
        and other users can see this. Your email address is never shown to other users. You can change your display name
        at any time from the My account page.
      </p>

      <h2>5. Cookies</h2>
      <p>
        We only use cookies that are necessary to keep you signed in and to remember the language you chose. We do not use
        advertising cookies.
      </p>

      <h2>6. Sharing your data</h2>
      <p>We do not sell or rent your data to anyone. We rely on trusted service providers only to run the platform:</p>
      <ul>
        <li>
          <strong>Supabase:</strong> database hosting and sign-in.
        </li>
        <li>
          <strong>Vercel:</strong> website hosting.
        </li>
        <li>
          <strong>Payment provider:</strong> processing subscription payments once they are enabled.
        </li>
      </ul>
      <p>We may disclose data if required by a competent authority under applicable law.</p>

      <h2>7. Protecting your data</h2>
      <p>
        We take reasonable measures to protect your data, including encrypted connections and access controls so that each
        user can only see their own data. However, no method of transmission or electronic storage is completely secure.
      </p>

      <h2>8. Data retention</h2>
      <p>
        We keep your data for as long as your account exists. When an account is deleted, its account data, attempts, and
        scores are removed from the platform.
      </p>

      <h2>9. Your rights</h2>
      <ul>
        <li>Change your name and password from the My account page.</li>
        <li>Request a copy of your data or ask us to correct it.</li>
        <li>
          Request deletion of your account and data through our <Link href="/contact">contact page</Link>.
        </li>
      </ul>

      <h2>10. Changes to this policy</h2>
      <p>We may update this policy from time to time, and the date of the latest update is shown at the top of this page.</p>

      <h2>11. Contact</h2>
      <p>
        For any privacy question, reach us through our <Link href="/contact">contact page</Link>
        {CONTACT_EMAIL ? (
          <>
            {' '}or by email at <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
          </>
        ) : null}
        .
      </p>
    </>
  );
}

export default async function PrivacyPage() {
  const { locale, t } = await getI18n();
  return (
    <LegalPage title={t.legal.privacyTitle} subtitle={t.legal.privacySubtitle} updated={t.legal.updatedDate} icon={ShieldCheck}>
      {locale === 'en' ? <EnglishPolicy /> : <ArabicPolicy />}
    </LegalPage>
  );
}
