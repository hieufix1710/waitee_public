'use client';

import BrandLogo from '@/components/BrandLogo';
import { PhoneField } from '@/components/PhoneField';
import { useAuth } from '@/lib/auth';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { isValidPhone, toE164 } from '@/lib/phone';
import { getStoredRef } from '@/lib/referral';
import { useQuery } from '@tanstack/react-query';
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  CheckCircle2,
  Lock,
  Mail,
  MapPin,
  ShieldCheck,
  Store,
  User,
} from 'lucide-react';
import type { CountryCode } from 'libphonenumber-js';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { Toaster, toast } from 'sonner';

interface ShopCategory {
  id: number | string;
  name: string;
}

interface OnboardForm {
  categoryId: string;
  customCategory: string;
  shopName: string;
  address: string;
  firstName: string;
  lastName: string;
  email: string;
  countryIso: CountryCode;
  phone: string;
  password: string;
  confirmPassword: string;
}

const EMPTY: OnboardForm = {
  categoryId: '',
  customCategory: '',
  shopName: '',
  address: '',
  firstName: '',
  lastName: '',
  email: '',
  countryIso: 'VN',
  phone: '',
  password: '',
  confirmPassword: '',
};

const TOTAL_STEPS = 3;
const RESEND_COOLDOWN = 60;

const inputClass =
  'w-full rounded-xl border border-zinc-200 px-3 py-3 text-sm text-zinc-900 placeholder-zinc-400 transition-all focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20';

export default function OnboardPage() {
  const { t, lang } = useLanguage();
  const { isAuthenticated, login } = useAuth();
  const router = useRouter();

  const [mounted, setMounted] = useState(false);
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<OnboardForm>(EMPTY);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  const [email, setEmail] = useState('');
  const [emailFailed, setEmailFailed] = useState(false);
  const [tenantName, setTenantName] = useState('');
  const [otp, setOtp] = useState('');
  const [verifying, setVerifying] = useState(false);
  const [resending, setResending] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Already signed in → nothing to onboard.
  useEffect(() => {
    if (mounted && isAuthenticated && !done) router.replace('/dashboard');
  }, [mounted, isAuthenticated, done, router]);

  useEffect(() => {
    if (cooldown <= 0) return;
    const id = setInterval(() => setCooldown((c) => Math.max(0, c - 1)), 1000);
    return () => clearInterval(id);
  }, [cooldown]);

  const { data: categories = [], isLoading: loadingCategories } = useQuery({
    queryKey: ['shop-categories'],
    queryFn: async (): Promise<ShopCategory[]> => {
      try {
        const res = await fetch('/api/shop-categories', { cache: 'no-store' });
        const payload = (await res.json()) as { categories?: ShopCategory[] };
        return payload.categories ?? [];
      } catch {
        return [];
      }
    },
    staleTime: 5 * 60 * 1000,
  });

  const set = <K extends keyof OnboardForm>(key: K, value: OnboardForm[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => (prev[key] ? { ...prev, [key]: '' } : prev));
  };

  const validateStep = (current: number): boolean => {
    const next: Record<string, string> = {};
    const e = t.onboard.errors;

    if (current === 0) {
      if (!form.categoryId) next.categoryId = e.category;
      if (form.categoryId === '-1' && !form.customCategory.trim())
        next.customCategory = e.customCategory;
      if (!form.shopName.trim()) next.shopName = e.shopName;
      if (!form.address.trim()) next.address = e.address;
    }

    if (current === 1) {
      if (!form.firstName.trim()) next.firstName = e.firstName;
      if (!form.lastName.trim()) next.lastName = e.lastName;
      if (!form.email.trim()) next.email = e.email;
      else if (!/^\S+@\S+\.\S+$/.test(form.email)) next.email = e.emailInvalid;
      if (!form.phone.trim()) next.phone = e.phone;
      else if (!isValidPhone(form.countryIso, form.phone)) next.phone = e.phoneInvalid;
      if (!form.password) next.password = e.password;
      else if (form.password.length < 6) next.password = e.passwordLength;
      if (!form.confirmPassword) next.confirmPassword = e.confirmPassword;
      else if (form.confirmPassword !== form.password) next.confirmPassword = e.passwordMismatch;
    }

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const goNext = () => {
    if (!validateStep(step)) return;
    setStep((s) => Math.min(TOTAL_STEPS - 1, s + 1));
  };

  const submitOnboard = async () => {
    if (!validateStep(1)) return;
    setSubmitting(true);
    try {
      const ref = getStoredRef();
      const res = await fetch('/api/user/onboard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user: {
            email: form.email.trim(),
            phone: toE164(form.countryIso, form.phone.trim()),
            password: form.password,
            firstName: form.firstName.trim(),
            lastName: form.lastName.trim(),
          },
          shop: {
            name: form.shopName.trim(),
            address: form.address.trim(),
            categoryId: form.categoryId,
            customCategory: form.categoryId === '-1' ? form.customCategory.trim() : undefined,
          },
          ...(ref ? { ref } : {}),
        }),
      });

      const data = (await res.json()) as {
        message?: string;
        data?: { email?: string; email_error?: string | null; tenant?: string };
      };

      if (!res.ok) {
        toast.error(data?.message || t.onboard.genericError);
        return;
      }

      setEmail(data?.data?.email ?? form.email.trim());
      setEmailFailed(Boolean(data?.data?.email_error));
      setTenantName(data?.data?.tenant ?? '');
      setCooldown(RESEND_COOLDOWN);
      setStep(2);
      toast.success(t.onboard.success);
    } catch {
      toast.error(t.onboard.genericError);
    } finally {
      setSubmitting(false);
    }
  };

  const verifyOtp = async () => {
    if (!/^\d{6}$/.test(otp)) {
      toast.error(t.onboard.errors.otp);
      return;
    }
    setVerifying(true);
    try {
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier: email.toLowerCase(), otp_code: otp }),
      });
      const data = (await res.json()) as { message?: string } & Record<string, unknown>;
      if (!res.ok) {
        toast.error(data?.message || t.onboard.invalidOtp);
        return;
      }

      // Stay on the landing page: keep the tenant in the session so the
      // dashboard shows the stores the user can access within it (do not jump
      // straight into the POS).
      const session = data as unknown as Record<string, unknown>;
      login({ ...session, ...(tenantName ? { tenant: tenantName } : {}) } as unknown as Parameters<
        typeof login
      >[0]);
      setDone(true);
      router.push('/dashboard');
    } catch {
      toast.error(t.onboard.invalidOtp);
    } finally {
      setVerifying(false);
    }
  };

  const resendOtp = async () => {
    if (cooldown > 0 || resending) return;
    setResending(true);
    try {
      const res = await fetch('/api/user/send-email-verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user: { email: email.toLowerCase() } }),
      });
      const data = (await res.json()) as { message?: string; retry_after?: number };
      if (!res.ok) {
        setCooldown(data?.retry_after ?? RESEND_COOLDOWN);
        toast.error(data?.message || t.onboard.genericError);
        return;
      }
      setEmailFailed(false);
      setCooldown(RESEND_COOLDOWN);
      toast.success(data?.message || t.onboard.resend);
    } catch {
      toast.error(t.onboard.genericError);
    } finally {
      setResending(false);
    }
  };

  const steps = useMemo(
    () => [t.onboard.step1Title, t.onboard.step2Title, t.onboard.step3Title],
    [t],
  );

  return (
    <main className="min-h-dvh bg-zinc-50">
      <nav className="border-b border-zinc-200 bg-white px-6 py-4">
        <div className="mx-auto flex max-w-3xl items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600">
              <BrandLogo className="h-8 w-8 object-contain" />
            </div>
            <span className="text-lg font-bold text-zinc-900">WaiteeRetail</span>
          </Link>
          <Link
            href="/"
            className="text-sm font-medium text-zinc-500 transition-colors hover:text-blue-600"
          >
            {t.onboard.backHome}
          </Link>
        </div>
      </nav>

      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
        {/* Stepper */}
        <div className="mb-8 flex items-center justify-center">
          {steps.map((label, index) => (
            <div key={label} className="flex items-center">
              <div className="flex items-center gap-2">
                <span
                  className={`grid h-9 w-9 place-items-center rounded-full text-sm font-bold transition-colors ${
                    step > index
                      ? 'bg-emerald-500 text-white'
                      : step === index
                        ? 'bg-blue-600 text-white'
                        : 'bg-zinc-200 text-zinc-500'
                  }`}
                >
                  {step > index ? <CheckCircle2 className="h-4 w-4" /> : index + 1}
                </span>
                <span
                  className={`hidden text-sm font-medium sm:inline ${
                    step >= index ? 'text-zinc-900' : 'text-zinc-400'
                  }`}
                >
                  {label}
                </span>
              </div>
              {index < steps.length - 1 && (
                <span
                  className={`mx-2 h-px w-8 sm:w-12 ${step > index ? 'bg-emerald-400' : 'bg-zinc-200'}`}
                />
              )}
            </div>
          ))}
        </div>

        <div className="rounded-2xl border border-zinc-100 bg-white p-6 shadow-sm sm:p-8">
          {step === 0 && (
            <div className="space-y-6">
              <header>
                <h1 className="text-xl font-bold text-zinc-900">{t.onboard.step1Title}</h1>
                <p className="mt-1 text-sm text-zinc-500">{t.onboard.step1Description}</p>
              </header>

              <div>
                <label className="mb-2 block text-sm font-semibold text-zinc-900">
                  {t.dashboard.selectCategory}
                </label>
                {loadingCategories ? (
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                    {Array.from({ length: 6 }).map((_, i) => (
                      <div key={i} className="h-12 animate-pulse rounded-xl bg-zinc-100" />
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                    {categories.map((cat) => {
                      const selected = form.categoryId === String(cat.id);
                      return (
                        <button
                          type="button"
                          key={cat.id}
                          onClick={() => set('categoryId', String(cat.id))}
                          className={`rounded-xl border px-3 py-3 text-sm font-medium transition-colors ${
                            selected
                              ? 'border-blue-600 bg-blue-50 text-blue-700'
                              : 'border-zinc-200 bg-white text-zinc-700 hover:border-blue-300'
                          }`}
                        >
                          {cat.name}
                        </button>
                      );
                    })}
                  </div>
                )}
                {errors.categoryId && (
                  <p className="mt-1 text-xs text-red-600">{errors.categoryId}</p>
                )}
              </div>

              <Field
                label={t.dashboard.shopName}
                icon={<Building2 className="h-4 w-4" />}
                value={form.shopName}
                onChange={(v) => set('shopName', v)}
                placeholder={t.dashboard.shopNamePlaceholder}
                error={errors.shopName}
              />

              <div>
                <label className="mb-2 block text-sm font-semibold text-zinc-900">
                  {t.dashboard.shopAddress}
                </label>
                <div className="relative">
                  <span className="pointer-events-none absolute left-3 top-3.5 text-zinc-400">
                    <MapPin className="h-4 w-4" />
                  </span>
                  <textarea
                    value={form.address}
                    onChange={(e) => set('address', e.target.value)}
                    rows={3}
                    placeholder={t.dashboard.shopAddressPlaceholder}
                    className={`${inputClass} resize-none pl-10`}
                  />
                </div>
                {errors.address && <p className="mt-1 text-xs text-red-600">{errors.address}</p>}
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={goNext}
                  className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-blue-700"
                >
                  {t.onboard.continue}
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-6">
              <header>
                <h1 className="text-xl font-bold text-zinc-900">{t.onboard.step2Title}</h1>
                <p className="mt-1 text-sm text-zinc-500">{t.onboard.step2Description}</p>
              </header>

              <div className="grid gap-4 sm:grid-cols-2">
                <Field
                  label={t.signup.step3.firstName}
                  icon={<User className="h-4 w-4" />}
                  value={form.firstName}
                  onChange={(v) => set('firstName', v)}
                  placeholder={t.signup.step3.firstNamePlaceholder}
                  error={errors.firstName}
                />
                <Field
                  label={t.signup.step3.lastName}
                  icon={<User className="h-4 w-4" />}
                  value={form.lastName}
                  onChange={(v) => set('lastName', v)}
                  placeholder={t.signup.step3.lastNamePlaceholder}
                  error={errors.lastName}
                />
              </div>

              <Field
                label={t.signup.step3.email}
                icon={<Mail className="h-4 w-4" />}
                value={form.email}
                onChange={(v) => set('email', v)}
                placeholder={t.signup.step3.emailPlaceholder}
                type="email"
                error={errors.email}
              />
              <PhoneField
                label={t.signup.step3.phone}
                lang={lang}
                country={form.countryIso}
                value={form.phone}
                onCountryChange={(iso) => set('countryIso', iso)}
                onValueChange={(v) => set('phone', v)}
                error={errors.phone}
              />
              <Field
                label={t.signup.step3.password}
                icon={<Lock className="h-4 w-4" />}
                value={form.password}
                onChange={(v) => set('password', v)}
                placeholder="••••••••"
                type="password"
                error={errors.password}
              />
              <Field
                label={t.signup.step3.confirmPassword}
                icon={<Lock className="h-4 w-4" />}
                value={form.confirmPassword}
                onChange={(v) => set('confirmPassword', v)}
                placeholder="••••••••"
                type="password"
                error={errors.confirmPassword}
              />

              <div className="flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => setStep(0)}
                  disabled={submitting}
                  className="inline-flex items-center gap-2 rounded-xl border border-zinc-300 px-5 py-3 text-sm font-bold text-zinc-700 transition-colors hover:bg-zinc-50 disabled:opacity-60"
                >
                  <ArrowLeft className="h-4 w-4" />
                  {t.onboard.back}
                </button>
                <button
                  type="button"
                  onClick={submitOnboard}
                  disabled={submitting}
                  className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {submitting ? t.onboard.submitting : t.dashboard.createShop}
                  {!submitting && <ArrowRight className="h-4 w-4" />}
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div className="text-center">
                <span className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-blue-50 text-blue-600">
                  <ShieldCheck className="h-7 w-7" />
                </span>
                <h1 className="text-xl font-bold text-zinc-900">{t.onboard.step3Title}</h1>
                <p className="mt-1 text-sm text-zinc-500">
                  {t.onboard.step3Description}{' '}
                  <span className="font-medium text-zinc-700">{email}</span>
                </p>
              </div>

              {emailFailed && (
                <p className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                  {t.onboard.emailFailed}
                </p>
              )}

              <input
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                inputMode="numeric"
                autoComplete="one-time-code"
                placeholder="______"
                className={`${inputClass} text-center text-2xl font-bold tracking-[0.5em]`}
                aria-label={t.onboard.step3Title}
              />

              <button
                type="button"
                onClick={verifyOtp}
                disabled={verifying || otp.length !== 6}
                className="w-full rounded-xl bg-blue-600 px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {verifying ? t.onboard.verifying : t.onboard.verify}
              </button>

              <div className="text-center text-sm text-zinc-500">
                <button
                  type="button"
                  onClick={resendOtp}
                  disabled={cooldown > 0 || resending}
                  className="font-medium text-blue-600 transition-colors hover:text-blue-700 disabled:cursor-not-allowed disabled:text-zinc-400"
                >
                  {resending
                    ? t.onboard.resending
                    : cooldown > 0
                      ? t.onboard.resendIn.replace('{{seconds}}', String(cooldown))
                      : t.onboard.resend}
                </button>
              </div>
            </div>
          )}
        </div>

        <p className="mt-6 flex items-center justify-center gap-2 text-xs text-zinc-400">
          <Store className="h-3.5 w-3.5" />
          {t.onboard.subtitle}
        </p>
      </div>

      <Toaster position="top-right" richColors />
    </main>
  );
}

function Field({
  label,
  icon,
  value,
  onChange,
  placeholder,
  type = 'text',
  error,
}: {
  label: string;
  icon: React.ReactNode;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
  error?: string;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-zinc-900">{label}</label>
      <div className="relative">
        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400">
          {icon}
        </span>
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          type={type}
          className={`${inputClass} pl-10`}
        />
      </div>
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}
