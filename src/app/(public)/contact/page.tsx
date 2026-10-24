import type { Metadata } from 'next';
import { Clock, Mail, MessageCircle } from 'lucide-react';
import { LegalPage } from '@/components/shell/legal-page';
import { ContactForm } from '@/components/shell/contact-form';
import { APP_NAME, CONTACT_EMAIL } from '@/lib/constants';

export const metadata: Metadata = { title: `اتصل بنا | ${APP_NAME}` };

export default function ContactPage() {
  return (
    <LegalPage title="اتصل بنا" subtitle="نسعد بأسئلتك واقتراحاتك وملاحظاتك" icon={MessageCircle}>
      <div className="not-prose mb-6 grid gap-3 sm:grid-cols-2">
        {CONTACT_EMAIL && (
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="flex items-center gap-3 rounded-2xl bg-surface-hover p-4 no-underline! hover:bg-primary-light transition-colors"
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-light text-primary">
              <Mail className="h-5 w-5" />
            </span>
            <span>
              <span className="block text-xs text-muted">البريد الإلكتروني</span>
              <span className="block font-bold text-foreground" dir="ltr">
                {CONTACT_EMAIL}
              </span>
            </span>
          </a>
        )}
        <div className="flex items-center gap-3 rounded-2xl bg-surface-hover p-4">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent-light text-accent">
            <Clock className="h-5 w-5" />
          </span>
          <span>
            <span className="block text-xs text-muted">مدة الرد</span>
            <span className="block font-bold text-foreground">خلال 3 أيام عمل</span>
          </span>
        </div>
      </div>

      <h2>أرسل لنا رسالة</h2>
      <ContactForm />
    </LegalPage>
  );
}
