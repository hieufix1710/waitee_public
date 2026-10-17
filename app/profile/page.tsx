'use client';

import BrandLogo from '@/components/BrandLogo';
import { authFetch, getStoredAuth, useAuth } from '@/lib/auth';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import {
  ArrowLeft,
  BadgeCheck,
  Mail,
  Phone,
  Store,
  Trash2,
  TriangleAlert,
  User,
  X,
} from 'lucide-react';
import { motion } from 'motion/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { Toaster, toast } from 'sonner';

export default function ProfilePage() {
  const { t } = useLanguage();
  const { user, isAuthenticated, logout } = useAuth();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [confirmText, setConfirmText] = useState('');
  const [deleting, setDeleting] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const previouslyFocusedRef = useRef<HTMLElement | null>(null);

  const confirmWord = t.profile.confirmWord;
  // Case- and diacritic-insensitive so "xoa" matches "XÓA" on keyboards without
  // Vietnamese input.
  const normalize = (value: string) =>
    value
      .trim()
      .toUpperCase()
      .normalize('NFD')
      .replace(/\p{Diacritic}/gu, '');
  const canDelete = normalize(confirmText) === normalize(confirmWord);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    if (!isAuthenticated) router.replace('/login');
  }, [mounted, isAuthenticated, router]);

  // Modal a11y: close on Escape, lock background scroll, trap focus, and restore
  // focus to the trigger when closed.
  useEffect(() => {
    if (!showDeleteModal) return;
    previouslyFocusedRef.current = document.activeElement as HTMLElement | null;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setShowDeleteModal(false);
        return;
      }
      if (event.key !== 'Tab' || !modalRef.current) return;
      const focusable = Array.from(
        modalRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ),
      );
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement;
      if (event.shiftKey && (active === first || active === modalRef.current)) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', onKeyDown);
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const frame = window.requestAnimationFrame(() => modalRef.current?.focus());
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = originalOverflow;
      window.cancelAnimationFrame(frame);
      previouslyFocusedRef.current?.focus();
    };
  }, [showDeleteModal]);

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setConfirmText('');
  };

  const handleDeleteAccount = async () => {
    if (!canDelete) return;
    const auth = getStoredAuth();
    if (!auth) {
      toast.error(t.profile.sessionExpired);
      return;
    }

    setDeleting(true);
    try {
      const res = await authFetch('/api/user/destroy', {
        method: 'DELETE',
        headers: auth.tenant ? { Tenant: auth.tenant } : undefined,
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        toast.error(data.message || t.profile.deleteError);
        return;
      }

      logout();
      toast.success(t.profile.deleteSuccess);
      router.push('/');
    } catch {
      toast.error(t.profile.deleteError);
    } finally {
      setDeleting(false);
    }
  };

  if (!mounted || !user) {
    return (
      <main
        id="main-content"
        tabIndex={-1}
        aria-busy="true"
        aria-live="polite"
        className="flex min-h-screen items-center justify-center bg-zinc-50"
      >
        <span className="sr-only">{t.common.loading}</span>
        <div
          className="h-8 w-8 animate-spin rounded-full border-2 border-blue-600 border-t-transparent"
          aria-hidden="true"
        />
      </main>
    );
  }

  const displayName =
    user.full_name ||
    [user.first_name, user.last_name].filter(Boolean).join(' ') ||
    user.email ||
    '';
  const initial = displayName.trim().charAt(0).toUpperCase();

  return (
    <>
      <main id="main-content" tabIndex={-1} className="min-h-screen bg-zinc-50">
        <nav className="border-b border-zinc-200 bg-white px-6 py-4">
          <div className="mx-auto flex max-w-3xl items-center justify-between">
            <Link href="/" className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600">
                <BrandLogo className="h-8 w-8 object-contain" />
              </div>
              <span className="text-lg font-bold text-zinc-900">WaiteeRetail</span>
            </Link>
            <div className="flex items-center gap-3">
              <Link
                href="/dashboard"
                className="hidden items-center gap-2 rounded-lg border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-600 transition-colors hover:bg-zinc-50 sm:flex"
              >
                <Store className="h-4 w-4" />
                {t.profile.myStores}
              </Link>
              <Link
                href="/"
                className="hidden items-center gap-2 rounded-lg border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-600 transition-colors hover:bg-zinc-50 sm:flex"
              >
                <ArrowLeft className="h-4 w-4" />
                {t.common.backHome}
              </Link>
            </div>
          </div>
        </nav>

        <div className="mx-auto max-w-3xl px-4 py-12">
          <h1 className="mb-8 text-2xl font-bold text-zinc-900">{t.profile.title}</h1>

          <section
            aria-labelledby="profile-account-heading"
            className="mb-6 overflow-hidden rounded-2xl border border-zinc-100 bg-white shadow-sm"
          >
            <div className="flex items-center gap-4 p-6">
              <span
                aria-hidden="true"
                className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-600 text-lg font-bold text-white"
              >
                {initial || <User className="h-6 w-6" />}
              </span>
              <div className="min-w-0">
                <h2
                  id="profile-account-heading"
                  className="truncate text-xl font-bold text-zinc-900"
                >
                  {displayName}
                </h2>
                <p className="truncate text-sm text-zinc-500">{user.email}</p>
              </div>
            </div>

            <dl className="divide-y divide-zinc-100 border-t border-zinc-100">
              <div className="flex items-center gap-3 px-6 py-4">
                <Mail className="h-4 w-4 shrink-0 text-zinc-400" aria-hidden="true" />
                <dt className="w-28 shrink-0 text-sm font-medium text-zinc-500">
                  {t.profile.email}
                </dt>
                <dd className="flex min-w-0 items-center gap-2">
                  <span className="truncate text-sm text-zinc-900">{user.email}</span>
                  {user.verified_email && (
                    <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-green-50 px-2 py-0.5 text-xs font-medium text-green-700">
                      <BadgeCheck className="h-3 w-3" aria-hidden="true" />
                      {t.profile.verified}
                    </span>
                  )}
                </dd>
              </div>
              <div className="flex items-center gap-3 px-6 py-4">
                <Phone className="h-4 w-4 shrink-0 text-zinc-400" aria-hidden="true" />
                <dt className="w-28 shrink-0 text-sm font-medium text-zinc-500">
                  {t.profile.phone}
                </dt>
                <dd className="min-w-0 truncate text-sm text-zinc-900">
                  {user.phone || t.profile.notProvided}
                </dd>
              </div>
            </dl>
          </section>

          <section
            aria-labelledby="profile-danger-heading"
            className="rounded-2xl border border-red-100 bg-white p-6 shadow-sm"
          >
            <h2
              id="profile-danger-heading"
              className="flex items-center gap-2 text-lg font-bold text-red-600"
            >
              <TriangleAlert className="h-5 w-5" aria-hidden="true" />
              {t.profile.dangerZone}
            </h2>
            <p className="mt-2 text-sm text-zinc-600">{t.profile.deleteDescription}</p>
            <button
              type="button"
              onClick={() => setShowDeleteModal(true)}
              className="mt-4 inline-flex items-center gap-2 rounded-xl bg-red-600 px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-red-700"
            >
              <Trash2 className="h-4 w-4" aria-hidden="true" />
              {t.profile.deleteAccount}
            </button>
          </section>
        </div>
      </main>

      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <motion.div
            ref={modalRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-account-title"
            tabIndex={-1}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative w-full max-w-lg rounded-2xl border border-zinc-100 bg-white p-6 shadow-xl focus:outline-none"
          >
            <button
              type="button"
              onClick={closeDeleteModal}
              aria-label={t.common.close}
              className="absolute right-4 top-4 text-zinc-400 transition-colors hover:text-zinc-600"
            >
              <X className="h-5 w-5" />
            </button>

            <h2 id="delete-account-title" className="mb-1 text-xl font-bold text-zinc-900">
              {t.profile.deleteModalTitle}
            </h2>
            <p className="mb-5 text-sm text-zinc-600">{t.profile.deleteModalMessage}</p>

            <label
              htmlFor="delete-confirm"
              className="mb-2 block text-sm font-semibold text-zinc-900"
            >
              {t.profile.deleteConfirmLabel.replace('{{word}}', confirmWord)}
            </label>
            <input
              id="delete-confirm"
              type="text"
              autoComplete="off"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder={confirmWord}
              className="block w-full rounded-xl border border-zinc-200 px-3 py-3 text-sm text-zinc-900 placeholder-zinc-400 transition-all focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-600/20"
            />

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={closeDeleteModal}
                className="flex flex-1 items-center justify-center rounded-xl border border-zinc-300 px-4 py-3 text-sm font-bold text-zinc-700 transition-all hover:bg-zinc-50"
              >
                {t.common.cancel}
              </button>
              <button
                type="button"
                onClick={handleDeleteAccount}
                disabled={!canDelete || deleting}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-3 text-sm font-bold text-white transition-all hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {deleting ? t.profile.deleting : t.profile.deleteAccount}
              </button>
            </div>
          </motion.div>
        </div>
      )}

      <Toaster position="top-right" richColors />
    </>
  );
}
