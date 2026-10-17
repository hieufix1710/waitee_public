// Referral (affiliate) code capture for the landing page.
// Merchants can arrive from an affiliate link (`?ref=<code>`); we persist the code
// locally (first-touch wins) and forward it when the shop is created so the
// backend can attribute the referral.

export const REF_STORAGE_KEY = 'waitee-ref';

function isBrowser(): boolean {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
}

/**
 * Read the `?ref=<code>` query param from the current URL and persist it.
 * First-touch: an already-stored code is never overwritten.
 * Safe to call during SSR (returns `null` without touching localStorage).
 */
export function captureRefFromUrl(): string | null {
  if (!isBrowser()) return null;

  try {
    const existing = window.localStorage.getItem(REF_STORAGE_KEY)?.trim();
    if (existing) return existing;

    const ref = new URLSearchParams(window.location.search).get('ref')?.trim();
    if (!ref) return null;

    window.localStorage.setItem(REF_STORAGE_KEY, ref);
    return ref;
  } catch {
    return null;
  }
}

/** Return the stored referral code, or `null` when absent/unavailable. */
export function getStoredRef(): string | null {
  if (!isBrowser()) return null;
  try {
    const ref = window.localStorage.getItem(REF_STORAGE_KEY)?.trim();
    return ref || null;
  } catch {
    return null;
  }
}

/** Remove the stored referral code (e.g. after it has been consumed). */
export function clearStoredRef(): void {
  if (!isBrowser()) return;
  try {
    window.localStorage.removeItem(REF_STORAGE_KEY);
  } catch {
    // ignore storage errors (private mode / quota)
  }
}
