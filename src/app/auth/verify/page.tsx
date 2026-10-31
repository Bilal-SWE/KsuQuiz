'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { MailCheck } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/ui/logo';
import { APP_NAME } from '@/lib/constants';
import { useI18n } from '@/i18n/client';

export default function VerifyPage() {
  const { t } = useI18n();
  const V = t.auth.verify;
  const params = useSearchParams();
  const email = params.get('email') ?? '';
  const [resent, setResent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleResend = async () => {
    if (!email) return;
    setLoading(true);
    setError('');
    const supabase = createClient();
    const { error: err } = await supabase.auth.resend({
      type: 'signup',
      email,
      options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
    });
    setLoading(false);
    if (err) {
      setError(V.resendError);
    } else {
      setResent(true);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 py-10">
      <div className="w-full max-w-md animate-fade-up">
        <div className="mb-8 flex justify-center">
          <Link href="/welcome" aria-label={APP_NAME}>
            <Logo markClassName="h-11 w-11" textClassName="text-2xl" />
          </Link>
        </div>

        <div className="card space-y-6 p-7 text-center sm:p-10">
          <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary-light">
            <MailCheck className="h-8 w-8 text-primary-ink" />
          </span>

          <div>
            <h1 className="text-xl font-bold sm:text-2xl">{V.title}</h1>
            <p className="mt-2 text-sm text-muted sm:text-base">{V.subtitle}</p>
          </div>

          {email && (
            <p className="rounded-xl bg-surface-hover px-4 py-3 text-sm font-medium" dir="ltr">
              {email}
            </p>
          )}

          <p className="text-xs text-muted">{V.checkSpam}</p>

          {error && <p className="text-sm text-error">{error}</p>}

          {resent ? (
            <p className="text-sm font-medium text-success-ink">{V.resent}</p>
          ) : (
            <Button variant="secondary" onClick={handleResend} loading={loading} className="w-full">
              {V.resendButton}
            </Button>
          )}

          <Link href="/auth/login" className="block text-sm text-primary-ink hover:underline">
            {V.backToLogin}
          </Link>
        </div>
      </div>
    </div>
  );
}
