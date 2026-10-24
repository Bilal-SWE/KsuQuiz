'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/lib/supabase/auth-context';
import { useI18n } from '@/i18n/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function ProfilePage() {
  const { user, profile } = useAuth();
  const P = useI18n().t.profile;
  const [fullName, setFullName] = useState('');
  const [nameStatus, setNameStatus] = useState<{ ok: boolean; msg: string } | null>(null);
  const [savingName, setSavingName] = useState(false);

  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [pwStatus, setPwStatus] = useState<{ ok: boolean; msg: string } | null>(null);
  const [savingPw, setSavingPw] = useState(false);

  useEffect(() => {
    if (profile) setFullName(profile.full_name ?? '');
  }, [profile]);

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

  const initials = (profile?.full_name || user?.email || '?').trim().charAt(0);

  return (
    <div className="mx-auto max-w-xl space-y-6 animate-fade-up">
      <div className="card flex items-center gap-4 p-5">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-accent text-2xl font-bold text-white">
          {initials}
        </div>
        <div className="min-w-0">
          <h1 className="text-xl font-bold truncate">{profile?.full_name || P.fallbackTitle}</h1>
          <p className="text-sm text-muted truncate" dir="ltr">
            {user?.email}
          </p>
          {profile && (
            <span className="mt-1 inline-block rounded-full bg-primary-light px-2.5 py-0.5 text-xs font-medium text-primary">
              {P.roles[profile.role] ?? profile.role}
            </span>
          )}
        </div>
      </div>

      <section className="card p-5 space-y-4">
        <h2 className="font-bold">{P.personalData}</h2>
        <Input id="full_name" label={P.fullName} value={fullName} onChange={(e) => setFullName(e.target.value)} />
        <Input id="email" label={P.email} value={user?.email ?? ''} disabled dir="ltr" className="opacity-70" />
        <div className="flex items-center gap-3">
          <Button onClick={saveName} loading={savingName}>
            {P.save}
          </Button>
          {nameStatus && <p className={`text-sm ${nameStatus.ok ? 'text-success' : 'text-error'}`}>{nameStatus.msg}</p>}
        </div>
      </section>

      <section className="card p-5 space-y-4">
        <h2 className="font-bold">{P.changePassword}</h2>
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
          {pwStatus && <p className={`text-sm ${pwStatus.ok ? 'text-success' : 'text-error'}`}>{pwStatus.msg}</p>}
        </div>
      </section>
    </div>
  );
}
