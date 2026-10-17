import { NextResponse } from 'next/server';
import { clientId, OAUTH_TX_COOKIE, railsPublicUrl, redirectUri, scopes } from '@/lib/oauth/config';
import { challenge, generateState, generateVerifier } from '@/lib/oauth/pkce';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const origin = url.origin;

  const returnToParam = url.searchParams.get('returnTo') || '/dashboard';
  const returnTo = returnToParam.startsWith('/') ? returnToParam : '/dashboard';

  // Optional tenant (store) the user wants to open after signing in. Carried
  // through the flow so the session can target it (e.g. jump straight to POS).
  const tenant = (url.searchParams.get('tenant') || '').trim().slice(0, 120);

  if (!clientId()) {
    return new NextResponse(null, {
      status: 307,
      headers: { Location: '/login?error=oauth_not_configured' },
    });
  }

  const verifier = generateVerifier();
  const state = generateState();

  const authorizeUrl = new URL(`${railsPublicUrl()}/oauth/authorize`);
  authorizeUrl.searchParams.set('client_id', clientId());
  authorizeUrl.searchParams.set('redirect_uri', redirectUri(origin));
  authorizeUrl.searchParams.set('response_type', 'code');
  authorizeUrl.searchParams.set('scope', scopes());
  authorizeUrl.searchParams.set('state', state);
  authorizeUrl.searchParams.set('code_challenge', challenge(verifier));
  authorizeUrl.searchParams.set('code_challenge_method', 'S256');

  const response = NextResponse.redirect(authorizeUrl);
  response.cookies.set(OAUTH_TX_COOKIE, JSON.stringify({ verifier, state, returnTo, tenant }), {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 600,
  });
  return response;
}
