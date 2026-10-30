'use client';

import { useState } from 'react';
import { Crown } from 'lucide-react';
import { useI18n } from '@/i18n/client';
import { startCheckout } from '@/app/actions/billing';
import type { CheckoutPlan } from '@/lib/lemonsqueezy';

// Sends the visitor to the Lemon Squeezy checkout (or to sign-up / their profile).
export function SubscribeButton({
  className = '',
  title,
  children,
  plan,
  buddyEmails,
}: {
  className?: string;
  title?: string;
  children?: React.ReactNode;
  plan?: CheckoutPlan;
  buddyEmails?: string[];
}) {
  const [loading, setLoading] = useState(false);
  const { t } = useI18n();

  const go = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const { url } = await startCheckout(plan, buddyEmails);
      window.location.href = url;
    } catch (err: any) {
      alert(err?.message || t.subscribe.failed);
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={go}
      disabled={loading}
      aria-busy={loading}
      title={title}
      aria-label={title}
      className={`press cursor-pointer disabled:cursor-wait disabled:opacity-80 ${className}`}
    >
      {loading ? (
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-current/30 border-t-current" />
      ) : (
        children ?? (
          <>
            <Crown className="h-4 w-4" />
            {t.subscribe.button}
          </>
        )
      )}
    </button>
  );
}
