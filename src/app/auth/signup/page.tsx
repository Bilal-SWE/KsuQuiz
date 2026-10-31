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

export default function SignupPage() {
  const router = useRouter();
  const { t } = useI18n();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (fullName.trim().length < 2) {
      setError(t.auth.errors.nameRequired);
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) {
      setError(t.auth.errors.emailInvalid);
      return;
    }
    if (password.length < 6) {
      setError(t.auth.errors.passwordShort);
      return;
    }

    setLoading(true);
    const supabase = createClient();
    const { data, error: authError } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        data: { full_name: fullName.trim() },
      },
    });

    if (authError) {
      if (authError.message === 'User already registered') {
        setError(t.auth.errors.alreadyRegistered);
      } else {
        setError(t.auth.errors.generic);
      }
      setLoading(false);
      return;
    }

    router.push('/');
    router.refresh();
  };

  return (
    <AuthShell title={t.auth.signupTitle} subtitle={t.auth.signupSubtitle}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          id="full_name"
          label={t.auth.fullName}
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          placeholder={t.auth.fullNamePlaceholder}
        />
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
          placeholder={t.auth.passwordPlaceholder}
          dir="ltr"
          className="text-left"
        />

        {error && <p className="text-sm text-error text-center">{error}</p>}

        <Button type="submit" loading={loading} className="w-full">
          {t.auth.signupButton}
        </Button>
      </form>

      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-border" /></div>
        <div className="relative flex justify-center text-xs"><span className="bg-surface px-3 text-muted">{t.auth.orContinueWith}</span></div>
      </div>

      <GoogleButton />

      <p className="text-sm text-muted text-center mt-6">
        {t.auth.haveAccount}{' '}
        <Link href="/auth/login" className="text-primary-ink hover:underline">
          {t.auth.loginButton}
        </Link>
      </p>
    </AuthShell>
  );
}
