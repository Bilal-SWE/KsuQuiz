'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, BookMarked, ChevronDown, CircleCheck, KeyRound, LogOut, Mail, RotateCcw, UserRound } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/lib/supabase/auth-context';
import { useI18n } from '@/i18n/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { SubscriptionCard } from '@/components/student/subscription-card';

type Stats = { subjects: number; lessons: number; attempts: number };

// One settings row that opens in place to show its form.
function SettingRow({
  icon: Icon,
  title,
  value,
  open,
  onToggle,
  children,
}: {
  icon: React.ElementType;
  title: string;
  value?: string;
  open: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <div>
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        className="flex w-full cursor-pointer items-center gap-3 px-4 py-3.5 text-start hover:bg-surface-hover"
      >
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary-light text-primary-ink">
          <Icon className="h-[18px] w-[18px]" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-sm font-bold">{title}</span>
          {value && (
            <span dir="auto" className="block truncate text-xs text-muted">
              {value}
            </span>
          )}
        </span>
        <ChevronDown className={`h-4 w-4 shrink-0 text-muted transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && <div className="space-y-3 px-4 pb-4 animate-fade-up">{children}</div>}
    </div>
  );
}

export default function ProfilePage() {
  const { user, profile } = useAuth();
  const { t } = useI18n();
  const P = t.profile;
  const [openRow, setOpenRow] = useState<'name' | 'password' | null>(null);
  const [stats, setStats] = useState<Stats | null>(null);

  const [fullName, setFullName] = useState('');
  const [nameStatus, setNameStatus] = useState<{ ok: boolean; msg: string } | null>(null);
  const [savingName, setSavingName] = useState(false);

  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [pwStatus, setPwStatus] = useState<{ ok: boolean; msg: string } | null>(null);
  const [savingPw, setSavingPw] = useState(false);

  const isStudent = profile?.role === 'student';

  useEffect(() => {
    if (profile) setFullName(profile.full_name ?? '');
  }, [profile]);

  // Quick numbers for the header: subjects added, lessons finished, and finished attempts.
  useEffect(() => {
    if (!user || !isStudent) return;
    const supabase = createClient();
    Promise.all([
      supabase.from('enrollments').select('subject_id', { count: 'exact', head: true }).eq('student_id', user.id),
      supabase.from('attempts').select('lesson_id').eq('student_id', user.id).not('finished_at', 'is', null),
    ]).then(([enrollments, attempts]) => {
      const finished = attempts.data ?? [];
      setStats({
        subjects: enrollments.count ?? 0,
        lessons: new Set(finished.map((a) => a.lesson_id)).size,
        attempts: finished.length,
      });
    });
  }, [user, isStudent]);

  const saveName = async () => {
    const name = fullName.trim();
    if (name.length < 2) {
      setNameStatus({ ok: false, msg: P.nameShort });
      return;
    }
    if (!user) return;
    setSavingName(true);
    setNameStatus(null);
    const supabase = createClient();
    const { error } = await supabase.from('profiles').update({ full_name: name }).eq('id', user.id);
    if (!error) await supabase.auth.updateUser({ data: { full_name: name } });
    setSavingName(false);
    setNameStatus(error ? { ok: false, msg: P.nameFailed } : { ok: true, msg: P.nameSaved });
  };

  const savePassword = async () => {
    if (password.length < 6) {
      setPwStatus({ ok: false, msg: P.passwordShort });
      return;
    }
    if (password !== confirm) {
      setPwStatus({ ok: false, msg: P.passwordMismatch });
      return;
    }
    setSavingPw(true);
    setPwStatus(null);
    const { error } = await createClient().auth.updateUser({ password });
    setSavingPw(false);
    if (error) {
      setPwStatus({ ok: false, msg: P.passwordFailed });
    } else {
      setPassword('');
      setConfirm('');
      setPwStatus({ ok: true, msg: P.passwordChanged });
    }
  };

  const [loggingOut, setLoggingOut] = useState(false);

  const logout = async () => {
    setLoggingOut(true);
    await createClient().auth.signOut();
    window.location.href = '/welcome';
  };

  const toggle = (row: 'name' | 'password') => setOpenRow((cur) => (cur === row ? null : row));
  const initials = (profile?.full_name || user?.email || '?').trim().charAt(0);
  const statItems = stats
    ? [
        { icon: BookMarked, value: stats.subjects, label: P.statSubjects },
        { icon: CircleCheck, value: stats.lessons, label: P.statLessons },
        { icon: RotateCcw, value: stats.attempts, label: P.statAttempts },
      ]
    : [];

  return (
    <div className="mx-auto max-w-xl space-y-4 animate-fade-up">
      <Link href="/" className="inline-flex items-center gap-1 text-xs text-muted hover:text-primary-ink">
        <ArrowRight className="h-3.5 w-3.5" />
        {t.nav.explore}
      </Link>
      <section className="relative overflow-hidden rounded-[28px] border border-border bg-gradient-to-b from-primary-light to-surface px-5 pt-8 pb-5 text-center">
        <span className="pointer-events-none absolute -top-14 -end-14 h-40 w-40 rounded-full bg-primary/10" aria-hidden="true" />
        <div className="relative">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-primary text-3xl font-extrabold text-on-primary shadow-[0_10px_24px_-10px_rgb(15_157_138/0.7)] ring-4 ring-surface">
            {initials}
          </div>
          <h1 dir="auto" className="mt-3 truncate text-xl font-extrabold sm:text-2xl">
            {profile?.full_name || P.fallbackTitle}
          </h1>
          <p className="truncate text-sm text-muted" dir="ltr">
            {user?.email}
          </p>
          {profile && !isStudent && (
            <span className="mt-2 inline-block rounded-full bg-ink px-3 py-0.5 text-xs font-bold text-background">
              {P.roles[profile.role] ?? profile.role}
            </span>
          )}

          {isStudent && (
            <dl className="mt-5 grid grid-cols-3 gap-2">
              {(stats ? statItems : [0, 1, 2]).map((s, i) =>
                typeof s === 'number' ? (
                  <div key={i} className="h-[74px] animate-pulse rounded-2xl bg-surface/70" />
                ) : (
                  <div key={s.label} className="rounded-2xl bg-surface px-2 py-3 shadow-sm">
                    <dd className="flex items-center justify-center gap-1 text-xl font-extrabold tabular-nums">
                      <s.icon className="h-4 w-4 text-primary-ink" />
                      {s.value}
                    </dd>
                    <dt className="mt-0.5 text-xs text-muted">{s.label}</dt>
                  </div>
                ),
              )}
            </dl>
          )}
        </div>
      </section>

      {user && isStudent && <SubscriptionCard userId={user.id} />}

      {/* Account settings */}
      <section className="card overflow-hidden !rounded-3xl">
        <h2 className="px-4 pt-4 pb-1 text-xs font-bold text-muted">{P.accountSettings}</h2>
        <div className="divide-y divide-border">
          <SettingRow icon={UserRound} title={P.fullName} value={profile?.full_name ?? ''} open={openRow === 'name'} onToggle={() => toggle('name')}>
            <Input id="full_name" value={fullName} onChange={(e) => setFullName(e.target.value)} aria-label={P.fullName} />
            <div className="flex items-center gap-3">
              <Button onClick={saveName} loading={savingName}>
                {P.save}
              </Button>
              {nameStatus && <p className={`text-sm ${nameStatus.ok ? 'text-success-ink' : 'text-error'}`}>{nameStatus.msg}</p>}
            </div>
          </SettingRow>

          <div className="flex items-center gap-3 px-4 py-3.5">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-surface-hover text-muted">
              <Mail className="h-[18px] w-[18px]" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-sm font-bold">{P.email}</span>
              <span className="block truncate text-xs text-muted" dir="ltr">
                {user?.email}
              </span>
            </span>
          </div>

          <SettingRow icon={KeyRound} title={P.changePassword} value="••••••••" open={openRow === 'password'} onToggle={() => toggle('password')}>
            <Input
              id="password"
              type="password"
              label={P.newPassword}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
            />
            <Input
              id="confirm"
              type="password"
              label={P.confirmPassword}
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              autoComplete="new-password"
            />
            <div className="flex items-center gap-3">
              <Button onClick={savePassword} loading={savingPw}>
                {P.changePassword}
              </Button>
              {pwStatus && <p className={`text-sm ${pwStatus.ok ? 'text-success-ink' : 'text-error'}`}>{pwStatus.msg}</p>}
            </div>
          </SettingRow>

          <button
            type="button"
            onClick={logout}
            disabled={loggingOut}
            className="flex w-full cursor-pointer items-center gap-3 px-4 py-3.5 text-start text-error hover:bg-error-light disabled:opacity-60"
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-error-light">
              {loggingOut ? (
                <span className="h-[18px] w-[18px] animate-spin rounded-full border-2 border-error/30 border-t-error" />
              ) : (
                <LogOut className="h-[18px] w-[18px] ltr:-scale-x-100" />
              )}
            </span>
            <span className="text-sm font-bold">{t.common.logout}</span>
          </button>
        </div>
      </section>
    </div>
  );
}
