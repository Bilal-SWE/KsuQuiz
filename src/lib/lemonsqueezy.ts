// Server code only: reads secret keys from the environment.
import { createHmac, timingSafeEqual } from 'node:crypto';

const API = 'https://api.lemonsqueezy.com/v1';

function env(name: string) {
  const value = process.env[name];
  if (!value) throw new Error(`${name} is not set`);
  return value;
}

// Creates a hosted checkout for the monthly plan. The student's id travels as custom
// data and comes back in every webhook, which is how a payment is tied to an account.
export async function createSubscriptionCheckout(opts: {
  userId: string;
  email?: string | null;
  name?: string | null;
  redirectUrl: string;
}): Promise<string> {
  const res = await fetch(`${API}/checkouts`, {
    method: 'POST',
    headers: {
      Accept: 'application/vnd.api+json',
      'Content-Type': 'application/vnd.api+json',
      Authorization: `Bearer ${env('LEMONSQUEEZY_API_KEY')}`,
    },
    body: JSON.stringify({
      data: {
        type: 'checkouts',
        attributes: {
          checkout_data: {
            email: opts.email ?? undefined,
            name: opts.name ?? undefined,
            custom: { user_id: opts.userId },
          },
          product_options: { redirect_url: opts.redirectUrl },
        },
        relationships: {
          store: { data: { type: 'stores', id: env('LEMONSQUEEZY_STORE_ID') } },
          variant: { data: { type: 'variants', id: env('LEMONSQUEEZY_VARIANT_ID') } },
        },
      },
    }),
    cache: 'no-store',
  });

  if (!res.ok) {
    console.error('Lemon Squeezy checkout failed', res.status, await res.text());
    throw new Error('checkout_failed');
  }
  const json = await res.json();
  return json.data.attributes.url as string;
}

// Lemon Squeezy signs the raw body with HMAC-SHA256 using the webhook secret.
export function verifyWebhookSignature(rawBody: string, signature: string | null): boolean {
  if (!signature) return false;
  const digest = createHmac('sha256', env('LEMONSQUEEZY_WEBHOOK_SECRET')).update(rawBody).digest('hex');
  const a = Buffer.from(digest, 'utf8');
  const b = Buffer.from(signature, 'utf8');
  return a.length === b.length && timingSafeEqual(a, b);
}
