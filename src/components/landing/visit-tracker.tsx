'use client';

import { useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';

const KEY = 'ksuquiz-visit-day';

// Counts this browser as a visitor once per day.
export function VisitTracker() {
  useEffect(() => {
    const today = new Date().toISOString().slice(0, 10);
    try {
      if (localStorage.getItem(KEY) === today) return;
      localStorage.setItem(KEY, today);
    } catch {
      return;
    }
    createClient().rpc('record_visit' as any).then(() => {});
  }, []);
  return null;
}
