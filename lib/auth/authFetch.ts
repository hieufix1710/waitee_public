export const AUTH_KEY = 'hiu-auth';

export interface StoredAuth {
  access_token: string;
  refresh_token: string;
  expired_at: number;
  user: {
    uid: string;
    email: string;
    first_name: string;
    last_name: string;
    full_name?: string;
    phone?: string;
    verified_email: boolean;
  };
  provider: string;
  auth_provider?: string;
  tenant?: string;
}

export function getStoredAuth(): StoredAuth | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(AUTH_KEY);
    return raw ? (JSON.parse(raw) as StoredAuth) : null;
  } catch {
    return null;
  }
}

export function clearStoredAuth() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(AUTH_KEY);
}

// The session is invalid (expired/revoked): drop it and send the merchant back
// to the login screen instead of leaving them stuck on a page that keeps 401ing.
export function redirectToLogin() {
  if (typeof window === 'undefined') return;
  if (window.location.pathname === '/login') return;
  window.location.replace('/login?error=session_expired');
}

/**
 * `fetch` with the stored session attached. Any 401 clears the session and
 * redirects to `/login`, so callers never silently swallow an expired login.
 */
export async function authFetch(
  input: RequestInfo | URL,
  init: RequestInit = {},
): Promise<Response> {
  const auth = getStoredAuth();
  const headers = new Headers(init.headers);
  if (auth?.access_token) {
    const token = `Bearer ${auth.access_token}`;
    if (!headers.has('Authorization')) headers.set('Authorization', token);
    // Legacy (X-Waitee-Token) sessions are still accepted by the backend.
    if (!headers.has('X-Waitee-Token')) headers.set('X-Waitee-Token', token);
  }

  const response = await fetch(input, { ...init, headers });
  if (response.status === 401) {
    clearStoredAuth();
    redirectToLogin();
  }
  return response;
}
