import { createClient } from '@supabase/supabase-js';

// Service-role client for trusted server code that runs without a signed-in user
// (the Lemon Squeezy webhook). It bypasses RLS, so never import it in client code.
export function createAdminClient() {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!key) throw new Error('SUPABASE_SERVICE_ROLE_KEY is not set');
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
