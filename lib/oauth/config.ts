// Server-only OAuth (Doorkeeper) configuration.
//
// This module must never be imported from a client component: it reads
// server-side secrets (`OAUTH_CLIENT_SECRET`) and the private Rails base URL.
// The landing page talks to the Rails OAuth 2.0 provider using Authorization
// Code + PKCE; the provider UI is where the user actually authenticates.

/** HttpOnly cookie carrying the PKCE verifier + state between the two legs. */
export const OAUTH_TX_COOKIE = 'waiteitx';

const trimTrailingSlash = (value: string): string => value.replace(/\/+$/, '');

/**
 * Browser-facing Rails origin, used to build the `/oauth/authorize` URL the
 * user is redirected to. Falls back to `API_HOST` when unset.
 */
export function railsPublicUrl(): string {
  return trimTrailingSlash(process.env.NEXT_PUBLIC_API_HOST || process.env.API_HOST || '');
}

/**
 * Server-to-server Rails origin, used for the token exchange and `/api/user/me`.
 * Falls back to `NEXT_PUBLIC_API_HOST` when unset.
 */
export function railsBaseUrl(): string {
  return trimTrailingSlash(process.env.API_HOST || process.env.NEXT_PUBLIC_API_HOST || '');
}

export function clientId(): string {
  return process.env.OAUTH_CLIENT_ID || '';
}

export function clientSecret(): string {
  return process.env.OAUTH_CLIENT_SECRET || '';
}

export function scopes(): string {
  return process.env.OAUTH_SCOPES || '';
}

/**
 * The redirect URI registered with the Rails OAuth application. When
 * `OAUTH_REDIRECT_URI` is unset it defaults to `<origin>/api/auth/oauth/callback`
 * for the given request origin.
 */
export function redirectUri(origin: string): string {
  const configured = process.env.OAUTH_REDIRECT_URI;
  if (configured) return configured;
  return `${trimTrailingSlash(origin)}/api/auth/oauth/callback`;
}

/** True when the OAuth client has been configured enough to start a flow. */
export function isOAuthConfigured(): boolean {
  return Boolean(clientId() && railsPublicUrl());
}
