import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import {
  clientId,
  clientSecret,
  OAUTH_TX_COOKIE,
  railsBaseUrl,
  redirectUri,
} from '@/lib/oauth/config';

export const dynamic = 'force-dynamic';

interface OAuthTransaction {
  verifier: string;
  state: string;
  returnTo?: string;
  tenant?: string;
}

interface TokenResponse {
  access_token?: string;
  refresh_token?: string;
  expires_in?: number | string;
  token_type?: string;
  error?: string;
  error_description?: string;
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const origin = url.origin;

  const fail = (code: string) =>
    new NextResponse(null, {
      status: 307,
      headers: { Location: `/login?error=${code}` },
    });

  // The provider can bounce back with an error instead of a code.
  if (url.searchParams.get('error')) return fail('token_exchange_failed');

  const code = url.searchParams.get('code');
  const state = url.searchParams.get('state');

  const cookieStore = await cookies();
  const rawTx = cookieStore.get(OAUTH_TX_COOKIE)?.value;

  let tx: OAuthTransaction | null = null;
  if (rawTx) {
    try {
      tx = JSON.parse(rawTx) as OAuthTransaction;
    } catch {
      tx = null;
    }
  }

  if (!tx?.verifier || !state || !tx.state || state !== tx.state) {
    return fail('invalid_state');
  }

  if (!code) return fail('token_exchange_failed');

  // Exchange the authorization code for tokens (form-encoded).
  const form = new URLSearchParams();
  form.set('grant_type', 'authorization_code');
  form.set('code', code);
  form.set('redirect_uri', redirectUri(origin));
  form.set('client_id', clientId());
  form.set('code_verifier', tx.verifier);
  const secret = clientSecret();
  if (secret) form.set('client_secret', secret);

  let token: TokenResponse;
  try {
    const tokenRes = await fetch(`${railsBaseUrl()}/oauth/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Accept: 'application/json',
      },
      body: form.toString(),
      cache: 'no-store',
    });
    if (!tokenRes.ok) return fail('token_exchange_failed');
    token = (await tokenRes.json()) as TokenResponse;
  } catch {
    return fail('token_exchange_failed');
  }

  if (!token.access_token) return fail('token_exchange_failed');

  // Resolve the authenticated user.
  let user: unknown;
  try {
    const userRes = await fetch(`${railsBaseUrl()}/api/user/me`, {
      headers: {
        Authorization: `Bearer ${token.access_token}`,
        Accept: 'application/json',
      },
      cache: 'no-store',
    });
    if (!userRes.ok) return fail('user_unavailable');
    user = await userRes.json();
  } catch {
    return fail('user_unavailable');
  }

  const expiresIn = Number(token.expires_in) || 0;
  const session = {
    access_token: token.access_token,
    refresh_token: token.refresh_token || '',
    expired_at: Date.now() + expiresIn * 1000,
    user,
    provider: 'oauth',
    // The POS reads this to refresh via the OAuth provider (same client) rather
    // than the legacy endpoint.
    auth_provider: 'oauth',
    ...(tx.tenant ? { tenant: tx.tenant } : {}),
  };

  const encoded = Buffer.from(JSON.stringify(session), 'utf8').toString('base64url');

  // Relative Location so the browser stays on its current host (the dev proxy
  // rewrites Host to the bind address, which would break an absolute redirect).
  const response = new NextResponse(null, {
    status: 307,
    headers: { Location: `/login#oauth=${encoded}` },
  });
  // Clear the one-time transaction cookie.
  response.cookies.set(OAUTH_TX_COOKIE, '', {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 0,
  });
  return response;
}
