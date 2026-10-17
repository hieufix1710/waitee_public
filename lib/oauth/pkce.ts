// Server-only PKCE helpers (RFC 7636) built on `node:crypto`.
//
// Do not import this module from a client component.

import { createHash, randomBytes } from 'node:crypto';

/**
 * Generates a high-entropy code verifier (43 chars base64url = 256 bits),
 * which is within the RFC 7636 range of 43-128 characters.
 */
export function generateVerifier(): string {
  return randomBytes(32).toString('base64url');
}

/** Derives the S256 code challenge for a verifier (base64url, no padding). */
export function challenge(verifier: string): string {
  return createHash('sha256').update(verifier).digest('base64url');
}

/** Generates an opaque, unpredictable `state` value for CSRF protection. */
export function generateState(): string {
  return randomBytes(16).toString('base64url');
}
