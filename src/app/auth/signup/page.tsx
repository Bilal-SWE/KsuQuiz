'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { signupSchema } from '@/lib/schemas';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AuthShell } from '@/components/shell/auth-shell';

export default function SignupPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const result = signupSchema.safeParse({ full_name: fullName, email, password });
    if (!result.success) {
      setError(result.error.issues[0].message);
      return;
    }

    setLoading(true);
    const supabase = createClient();
    const { error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName } },
    });

    if (authError) {
      if (authError.message === 'User already registered') {
        setError('هذا البريد الإلكتروني مسجل بالفعل');
      } else if (authError.message.includes('email') && authError.message.includes('confirm')) {
        setError('تم إنشاء الحساب. يرجى تأكيد بريدك الإلكتروني');
      } else {
        setError(authError.message);
      }
      setLoading(false);
      return;
    }

    router.push('/');
    router.refresh();
  };

  return (
    <AuthShell title="أنشئ حسابك" subtitle="دقيقة واحدة وتبدأ التدريب">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            id="full_name"
            label="الاسم الكامل"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="أحمد محمد"
          />
          <Input
            id="email"
            label="البريد الإلكتروني"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="example@email.com"
            dir="ltr"
            className="text-left"
          />
          <Input
            id="password"
            label="كلمة المرور"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="6 أحرف على الأقل"
            dir="ltr"
            className="text-left"
          />

          {error && <p className="text-sm text-error text-center">{error}</p>}

          <Button type="submit" loading={loading} className="w-full">
            إنشاء حساب
          </Button>
        </form>

        <p className="text-sm text-muted text-center mt-6">
          لديك حساب بالفعل؟{' '}
          <Link href="/auth/login" className="text-primary hover:underline">
            تسجيل الدخول
          </Link>
        </p>
    </AuthShell>
  );
}
