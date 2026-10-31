'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AuthShell } from '@/components/shell/auth-shell';
import { GoogleButton } from '@/components/auth/google-button';
import { useI18n } from '@/i18n/client';

export default function LoginPage() {
  const router = useRouter();
  const { t } = useI18n();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!/^\S+@\S+\.\S+$/.test(email.trim())) {
      setError(t.auth.errors.emailInvalid);
      return;
    }
    if (!password) {
      setError(t.auth.errors.passwordRequired);
      return;
    }

    setLoading(true);
    const supabase = createClient();
    const { error: authError } = await supabase.auth.signInWithPassword({ email: email.trim(), password });

    if (authError) {
      if (authError.message === 'Email not confirmed') {
        setError(t.auth.errors.emailNotConfirmed);
      } else {
        setError(t.auth.errors.invalidCredentials);
      }
      setLoading(false);
      return;
    }

    router.push('/');
    router.refresh();
  };

  return (
    <AuthShell title={t.auth.loginTitle} subtitle={t.auth.loginSubtitle}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          id="email"
          label={t.auth.email}
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="example@email.com"
          dir="ltr"
          className="text-left"
        />
        <Input
          id="password"
          label={t.auth.password}
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••"
          dir="ltr"
          className="text-left"
        />

        {error && <p className="text-sm text-error text-center">{error}</p>}

        <Button type="submit" loading={loading} className="w-full">
          {t.auth.loginButton}
        </Button>
      </form>

      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-border" /></div>
        <div className="relative flex justify-center text-xs"><span className="bg-surface px-3 text-muted">{t.auth.orContinueWith}</span></div>
      </div>

      <GoogleButton />

      <p className="text-sm text-muted text-center mt-6">
        {t.auth.noAccount}{' '}
        <Link href="/auth/signup" className="text-primary-ink hover:underline">
          {t.auth.createAccount}
        </Link>
      </p>
    </AuthShell>
  );
}
