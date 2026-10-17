'use client';

import BrandLogo from '@/components/BrandLogo';
import { useAuth } from '@/lib/auth';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { ArrowLeft, LogIn, Store } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { Toaster, toast } from 'sonner';

const OAUTH_START_URL = '/api/auth/oauth/start';

/** Decodes a base64url-encoded, UTF-8 JSON payload. */
function decodeOAuthSession(value: string): unknown {
  const normalized = value.replace(/-/g, '+').replace(/_/g, '/');
  const padded = normalized.padEnd(normalized.length + ((4 - (normalized.length % 4)) % 4), '=');
  const binary = atob(padded);
  const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
  return JSON.parse(new TextDecoder().decode(bytes));
}

export default function LoginPage() {
  const { t } = useLanguage();
  const { isAuthenticated, login } = useAuth();
  const router = useRouter();

  const [mounted, setMounted] = useState(false);
  const [tenant, setTenant] = useState('');
  const [errorCode, setErrorCode] = useState('');
  const processedHash = useRef(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  // Already authenticated (e.g. arriving from onboarding) -> dashboard.
  useEffect(() => {
    if (mounted && isAuthenticated) router.replace('/dashboard');
  }, [mounted, isAuthenticated, router]);

  // Handle the OAuth callback: the session is handed back in the URL hash so it
  // never reaches the server. Decode it, persist it, then clear the URL. The
  // tenant (if any) stays in the session and the dashboard filters by it.
  useEffect(() => {
    if (!mounted || processedHash.current) return;
    processedHash.current = true;

    const code = new URLSearchParams(window.location.search).get('error');
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (code) setErrorCode(code);

    const match = window.location.hash.match(/oauth=([^&]+)/);
    if (!match) return;

    try {
      login(decodeOAuthSession(match[1]) as unknown as Parameters<typeof login>[0]);
      window.history.replaceState(null, '', window.location.pathname + window.location.search);
      router.replace('/dashboard');
    } catch {
      toast.error(t.onboard.genericError);
    }
  }, [mounted, login, router, t]);

  const handleLogin = () => {
    const params = new URLSearchParams({ returnTo: '/dashboard' });
    const trimmed = tenant.trim();
    if (trimmed) params.set('tenant', trimmed);
    window.location.href = `${OAUTH_START_URL}?${params.toString()}`;
  };

  const errorMessage =
    errorCode === 'oauth_not_configured' ? t.login.oauthNotConfigured : t.login.oauthError;

  return (
    <main className="flex min-h-dvh items-center justify-center bg-zinc-50 px-4 py-10">
      <div className="w-full max-w-md">
        <Link
          href="/"
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-zinc-500 transition-colors hover:text-blue-600"
        >
          <ArrowLeft className="h-4 w-4" />
          {t.login.backHome}
        </Link>

        <div className="rounded-2xl border border-zinc-100 bg-white p-8 shadow-sm">
          <div className="mb-6 text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600">
              <BrandLogo className="h-9 w-9 object-contain" />
            </div>
            <h1 className="text-xl font-bold text-zinc-900">{t.login.title}</h1>
            <p className="mt-1 text-sm text-zinc-500">{t.login.subtitle}</p>
          </div>

          {errorCode && (
            <div className="mb-5 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
              {errorMessage}
            </div>
          )}

          <div className="mb-5">
            <label className="mb-2 block text-sm font-semibold text-zinc-900">
              {t.login.tenant}
            </label>
            <div className="relative">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400">
                <Store className="h-4 w-4" />
              </span>
              <input
                value={tenant}
                onChange={(e) => setTenant(e.target.value)}
                placeholder={t.login.tenantPlaceholder}
                autoComplete="organization"
                className="w-full rounded-xl border border-zinc-200 px-3 py-3 pl-10 text-sm text-zinc-900 placeholder-zinc-400 transition-all focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20"
              />
            </div>
            <p className="mt-1.5 text-xs text-zinc-400">{t.login.tenantHint}</p>
          </div>

          <button
            type="button"
            onClick={handleLogin}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-blue-700"
          >
            <LogIn className="h-4 w-4" />
            {t.login.continueWith}
          </button>

          <p className="mt-6 text-center text-sm text-zinc-500">
            <Link href="/onboard" className="font-semibold text-blue-600 hover:text-blue-700">
              {t.login.signUpLink}
            </Link>
          </p>
        </div>
      </div>

      <Toaster position="top-right" richColors />
    </main>
  );
}
