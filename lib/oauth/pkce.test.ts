import { createHash } from 'node:crypto';
import { describe, expect, it } from 'vitest';
import { challenge, generateState, generateVerifier } from './pkce';

describe('generateVerifier', () => {
  it('returns a 43-char base64url string (256 bits)', () => {
    const verifier = generateVerifier();
    expect(verifier).toHaveLength(43);
    expect(verifier).toMatch(/^[A-Za-z0-9_-]+$/);
  });

  it('is random', () => {
    expect(generateVerifier()).not.toBe(generateVerifier());
  });
});

describe('challenge', () => {
  it('is the base64url SHA-256 of the verifier', () => {
    const verifier = 'a'.repeat(43);
    expect(challenge(verifier)).toBe(createHash('sha256').update(verifier).digest('base64url'));
  });

  it('differs for different verifiers', () => {
    expect(challenge(generateVerifier())).not.toBe(challenge(generateVerifier()));
  });
});

describe('generateState', () => {
  it('returns a 22-char base64url string (128 bits)', () => {
    const state = generateState();
    expect(state).toHaveLength(22);
    expect(state).toMatch(/^[A-Za-z0-9_-]+$/);
  });
});
