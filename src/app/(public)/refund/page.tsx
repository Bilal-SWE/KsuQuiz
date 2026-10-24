import type { Metadata } from 'next';
import Link from 'next/link';
import { ReceiptText } from 'lucide-react';
import { LegalPage } from '@/components/shell/legal-page';
import { getI18n } from '@/i18n/server';
import { APP_NAME, CONTACT_EMAIL } from '@/lib/constants';

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getI18n();
  return { title: `${t.legal.refundTitle} | ${APP_NAME}` };
}

function ArabicPolicy() {
  return (
    <>
      <h2>1. الاشتراك</h2>
      <p>
        يتيح {APP_NAME} مزايا مجانية لجميع المستخدمين، ويوفّر اشتراكاً شهرياً مدفوعاً يفتح جميع مزايا المنصة. يتجدد
        الاشتراك تلقائياً في بداية كل شهر حتى تلغيه.
      </p>

      <h2>2. إلغاء الاشتراك</h2>
      <ul>
        <li>يمكنك إلغاء اشتراكك في أي وقت.</li>
        <li>بعد الإلغاء تستمر مزايا الاشتراك حتى نهاية الشهر المدفوع، ولا يتم أي خصم بعد ذلك.</li>
        <li>يبقى حسابك ومحاولاتك ونتائجك محفوظة، وتستمر في الوصول إلى المزايا المجانية.</li>
      </ul>

      <h2>3. استرداد المبلغ</h2>
      <ul>
        <li>يمكنك طلب استرداد كامل لقيمة أول اشتراك خلال 7 أيام من تاريخ الدفع.</li>
        <li>لا تُسترد مبالغ التجديد الشهري بعد بدء الشهر الجديد، إلا في الحالات المذكورة في البند التالي.</li>
        <li>لا يُسترد المبلغ عن الأجزاء غير المستخدمة من الشهر عند الإلغاء.</li>
      </ul>

      <h2>4. حالات الاسترداد الاستثنائية</h2>
      <p>نسترد المبلغ في أي وقت في الحالات التالية:</p>
      <ul>
        <li>الخصم المكرر لنفس الفترة.</li>
        <li>الخصم بعد إلغاء الاشتراك بشكل صحيح.</li>
        <li>خلل تقني من طرفنا منعك من الوصول إلى مزايا الاشتراك ولم نتمكن من إصلاحه.</li>
      </ul>

      <h2>5. كيفية طلب الاسترداد</h2>
      <p>
        راسلنا عبر <Link href="/contact">صفحة اتصل بنا</Link>
        {CONTACT_EMAIL ? (
          <>
            {' '}أو على البريد <a href={`mailto:${CONTACT_EMAIL}`} dir="ltr">{CONTACT_EMAIL}</a>
          </>
        ) : null}{' '}
        واختر موضوع &quot;استرداد مبلغ&quot;، مع ذكر البريد الإلكتروني المسجل في حسابك وتاريخ الدفع. نرد على الطلبات خلال
        3 أيام عمل.
      </p>

      <h2>6. مدة وصول المبلغ</h2>
      <p>
        تتم عمليات الدفع والاسترداد عبر مزود الدفع، ويُعاد المبلغ إلى وسيلة الدفع نفسها. قد يستغرق ظهور المبلغ في حسابك من
        5 إلى 10 أيام عمل حسب البنك أو مصدر البطاقة.
      </p>

      <h2>7. التعديلات على السياسة</h2>
      <p>
        قد نحدّث هذه السياسة من وقت لآخر، وتسري التعديلات على المدفوعات التي تتم بعد تاريخ التحديث المعروض في أعلى
        الصفحة.
      </p>
    </>
  );
}

function EnglishPolicy() {
  return (
    <>
      <h2>1. Subscription</h2>
      <p>
        {APP_NAME} offers free features to every user, plus a paid monthly subscription that unlocks every feature of the
        platform. The subscription renews automatically at the start of each month until you cancel it.
      </p>

      <h2>2. Cancelling your subscription</h2>
      <ul>
        <li>You can cancel your subscription at any time.</li>
        <li>After you cancel, subscription features stay active until the end of the paid month, and you will not be charged again.</li>
        <li>Your account, attempts, and scores are kept, and you keep access to the free features.</li>
      </ul>

      <h2>3. Refunds</h2>
      <ul>
        <li>You can request a full refund of your first subscription payment within 7 days of the payment date.</li>
        <li>Monthly renewal payments are not refundable once the new month has started, except in the cases listed below.</li>
        <li>We do not refund unused parts of a month when you cancel.</li>
      </ul>

      <h2>4. Exceptional refunds</h2>
      <p>We will refund a payment at any time in these cases:</p>
      <ul>
        <li>You were charged twice for the same period.</li>
        <li>You were charged after correctly cancelling your subscription.</li>
        <li>A technical problem on our side prevented you from using subscription features and we could not fix it.</li>
      </ul>

      <h2>5. How to request a refund</h2>
      <p>
        Write to us through our <Link href="/contact">contact page</Link>
        {CONTACT_EMAIL ? (
          <>
            {' '}or by email at <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
          </>
        ) : null}{' '}
        and choose the &quot;Refund request&quot; subject, including the email address on your account and the payment date.
        We reply to requests within 3 business days.
      </p>

      <h2>6. When you receive the money</h2>
      <p>
        Payments and refunds are processed by our payment provider, and refunds go back to the original payment method. It
        may take 5 to 10 business days for the amount to appear, depending on your bank or card issuer.
      </p>

      <h2>7. Changes to this policy</h2>
      <p>
        We may update this policy from time to time. Changes apply to payments made after the update date shown at the top
        of this page.
      </p>
    </>
  );
}

export default async function RefundPage() {
  const { locale, t } = await getI18n();
  return (
    <LegalPage title={t.legal.refundTitle} subtitle={t.legal.refundSubtitle} updated={t.legal.updatedDate} icon={ReceiptText}>
      {locale === 'en' ? <EnglishPolicy /> : <ArabicPolicy />}
    </LegalPage>
  );
}
