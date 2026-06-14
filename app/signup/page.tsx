'use client';

import BrandLogo from '@/components/BrandLogo';
import { useAuth } from '@/lib/auth';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery } from '@tanstack/react-query';
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  Check,
  Eye,
  EyeOff,
  Lock,
  Mail,
  MapPin,
  Phone,
  User
} from 'lucide-react';
import { motion } from 'motion/react';
import Link from 'next/link';
import { ReactNode, useEffect, useMemo, useRef, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Toaster, toast } from 'sonner';
import { z } from 'zod';

type SignupStep = 1 | 2 | 3 | 4;

interface ShopCategory {
  id: number | string;
  name: string;
}

interface ShopCategoriesResponse {
  source: 'remote' | 'fallback';
  categories: ShopCategory[];
}

// ─── Zod schema (created inside component to access translations) ──────────
function createSignupSchema(t: ReturnType<typeof useLanguage>['t'], otherLabel: string) {
  return z
    .object({
      categoryId: z.string().min(1, t.signup.errors.category),
      customCategory: z.string().optional(),
      shopName: z.string().min(1, t.signup.errors.shopName),
      address: z.string().min(1, t.signup.errors.address),
      firstName: z.string().min(1, t.signup.errors.firstName),
      lastName: z.string().min(1, t.signup.errors.lastName),
      email: z
        .string()
        .min(1, t.signup.errors.email)
        .email(t.signup.errors.emailInvalid),
      phone: z.string().min(1, t.signup.errors.phone),
      password: z
        .string()
        .min(1, t.signup.errors.password)
        .min(6, t.signup.errors.passwordLength),
      confirmPassword: z.string().min(1, t.signup.errors.confirmPassword),
      terms: z
        .boolean()
        .refine(val => val === true, t.signup.errors.terms),
    })
    .superRefine((data, ctx) => {
      if (data.password && data.confirmPassword && data.password !== data.confirmPassword) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: t.signup.errors.passwordMismatch,
          path: ['confirmPassword'],
        });
      }
      if (data.categoryId === otherLabel && !data.customCategory?.trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: t.signup.errors.customCategory,
          path: ['customCategory'],
        });
      }
    });
}

type SignupFormValues = {
  categoryId: string;
  customCategory?: string;
  shopName: string;
  address: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  terms: boolean;
};

const STEP_FIELDS: Record<SignupStep, (keyof SignupFormValues)[]> = {
  1: ['categoryId', 'customCategory'],
  2: ['shopName', 'address'],
  3: ['firstName', 'lastName', 'email', 'phone', 'password', 'confirmPassword', 'terms'],
  4: [],
};

const OTP_LENGTH = 6;

export default function SignupPage() {
  const { t } = useLanguage();
  const { login } = useAuth();

  const otherLabel: string = t.common.other ?? 'Other';

  const schema = useMemo(
    () => createSignupSchema(t, otherLabel),
    [otherLabel]
  );

  const {
    register,
    control,
    handleSubmit,
    trigger,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<SignupFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      categoryId: '',
      customCategory: '',
      shopName: '',
      address: '',
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
      terms: false,
    },
  });

  const [currentStep, setCurrentStep] = useState<SignupStep>(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [mathQuestion, setMathQuestion] = useState('');
  const [mathAnswer, setMathAnswer] = useState('');
  const [mathExpected, setMathExpected] = useState<number | null>(null);
  const [signupEmail, setSignupEmail] = useState('');
   const [otp, setOtp] = useState<string[]>(
    Array(OTP_LENGTH).fill('')
  );

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [verifying, setVerifying] = useState(false);
  const [otpSending, setOtpSending] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval>>(undefined);

  useEffect(() => {
    if (cooldown > 0) {
      timerRef.current = setInterval(() => {
        setCooldown((prev) => {
          if (prev <= 1) { clearInterval(timerRef.current); return 0; }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [cooldown]);

  const watchedCategory = watch('categoryId');

  const { data: categoryOptions = [], isLoading: isCategoriesLoading } = useQuery({
    queryKey: ['shop-categories'],
    queryFn: async (): Promise<ShopCategory[]> => {
      try {
        const response = await fetch('/api/shop-categories', { cache: 'no-store' });
        const payload = (await response.json()) as ShopCategoriesResponse;
        return payload.categories;
      } catch {
        return [];
      }
    },
    staleTime: 5 * 60 * 1000,
  });

  useEffect(() => {
    if (currentStep === 3) {
      const a = Math.floor(Math.random() * 10) + 1;
      const b = Math.floor(Math.random() * 10) + 1;
      setMathQuestion(`${a} + ${b} = ?`);
      setMathExpected(a + b);
      setMathAnswer('');
    }
  }, [currentStep]);

  const nextStep = async () => {
    const valid = await trigger(STEP_FIELDS[currentStep]);
    if (!valid) return;
    if (currentStep < 4) setCurrentStep(s => (s + 1) as SignupStep);
  };

  const previousStep = () => {
    if (currentStep > 1) setCurrentStep(s => (s - 1) as SignupStep);
  };

  const onSubmit = async (data: SignupFormValues) => {
    if (!mathAnswer || Number(mathAnswer) !== mathExpected) {
      toast.error('Vui lòng trả lời phép tính đúng để tiếp tục.');
      return;
    }

    try {
      const loadingToastId = toast.loading('Đang xử lý...');

      const response = await fetch('/api/user/onboard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user: {
            email: data.email,
            password: data.password,
            firstName: data.firstName,
            lastName: data.lastName,
            phone: data.phone,
          },
          shop: {
            name: data.shopName,
            address: data.address,
            categoryId: data.categoryId,
            customCategory: data.customCategory,
          },
          planId: null
        }),
      });

      const resData = await response.json();

      if (!response.ok) {
        toast.dismiss(loadingToastId);
        toast.error(resData.message || t.signup.errors.unknownError);
        return;
      }

      toast.dismiss(loadingToastId);
      toast.success(t.signup.step3.success || 'Đăng ký thành công!');

      sessionStorage.setItem('signup_shop', JSON.stringify({ name: data.shopName, address: data.address }));
      setSignupEmail(data.email);
      setCurrentStep(4);
    } catch (error) {
      toast.error(t.signup.errors.unknownError || 'Có lỗi xảy ra. Vui lòng thử lại.');
      console.error('Onboard error:', error);
    }
  };

  const updateOtp = (index: number, value: string) => {
  const next = [...otp];
  next[index] = value;
  setOtp(next);
};

const handleChange = (
  index: number,
  e: React.ChangeEvent<HTMLInputElement>
) => {
  const value = e.target.value.replace(/\D/g, '');

  if (!value) {
    updateOtp(index, '');
    return;
  }

  updateOtp(index, value.slice(-1));

  if (index < OTP_LENGTH - 1) {
    inputRefs.current[index + 1]?.focus();
  }
};

const handleKeyDown = (
  index: number,
  e: React.KeyboardEvent<HTMLInputElement>
) => {
  switch (e.key) {
    case 'Backspace':
      if (otp[index]) {
        updateOtp(index, '');
        return;
      }

      if (index > 0) {
        updateOtp(index - 1, '');
        inputRefs.current[index - 1]?.focus();
      }
      break;

    case 'ArrowLeft':
      if (index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
      break;

    case 'ArrowRight':
      if (index < OTP_LENGTH - 1) {
        inputRefs.current[index + 1]?.focus();
      }
      break;
  }
};

const handlePaste = (
  e: React.ClipboardEvent<HTMLInputElement>
) => {
  e.preventDefault();

  const pasted = e.clipboardData
    .getData('text')
    .replace(/\D/g, '')
    .slice(0, OTP_LENGTH);

  if (!pasted) return;

  const next = Array(OTP_LENGTH).fill('');

  pasted.split('').forEach((char, index) => {
    next[index] = char;
  });

  setOtp(next);

  const focusIndex = Math.min(
    pasted.length,
    OTP_LENGTH - 1
  );

  inputRefs.current[focusIndex]?.focus();
};

const otpCode = otp.join('');


  const handleVerifyOtp = async () => {
    if (otpCode.length !== 6) return;
    setVerifying(true);
    try {
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ otp_code: otpCode, identifier: signupEmail }),
      });
      const data = await res.json();
      if (res.ok && data.user?.uid) {
        toast.success('Email đã xác nhận thành công!');
        login(data);
        setTimeout(() => window.location.href = '/dashboard', 1000);
      } else {
        toast.error(data.message || 'Mã OTP không đúng');
      }
    } catch {
      toast.error('Có lỗi xảy ra. Vui lòng thử lại.');
    } finally {
      setVerifying(false);
    }
  };

  const handleResendOtp = async () => {
    if (cooldown > 0) return;
    setOtpSending(true);
    try {
      const res = await fetch('/api/user/send-email-verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user: { email: signupEmail } }),
      });
      if (res.status === 429) {
        const data = await res.json();
        setCooldown(data?.retry_after || 60);
        toast.error(data?.message || 'Vui lòng chờ trước khi gửi lại');
      } else {
        toast.success('Đã gửi lại mã OTP');
      }
    } catch {
      toast.error('Gửi thất bại');
    } finally {
      setOtpSending(false);
    }
  };

  // ─── Helpers ───────────────────────────────────────────────────────────────
  const renderCategorySkeleton = () => (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="h-16 rounded-xl border border-zinc-200 bg-zinc-100 animate-pulse"
        />
      ))}
    </div>
  );

  const renderStepIndicator = () => (
    <div className="mb-8 flex items-center justify-center">
      {[1, 2, 3, 4].map((step, index) => {
        const isCompleted = currentStep > step;
        const isActive = currentStep === step;
        return (
          <div key={step} className="flex items-center">
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold transition-all ${
                isCompleted
                  ? 'bg-blue-600 text-white'
                  : isActive
                  ? 'bg-blue-200 text-blue-900'
                  : 'bg-zinc-200 text-zinc-600'
              }`}
            >
              {isCompleted ? <Check className="h-4 w-4" /> : step}
            </div>
            {index < 3 ? (
              <div className={`mx-3 h-0.5 w-14 ${currentStep > step ? 'bg-blue-600' : 'bg-zinc-200'}`} />
            ) : null}
          </div>
        );
      })}
    </div>
  );

  const renderTextInput = ({
    label,
    field,
    placeholder,
    icon,
    type = 'text',
  }: {
    label: string;
    field: keyof SignupFormValues;
    placeholder: string;
    icon: ReactNode;
    type?: string;
  }) => (
    <div>
      <label className="mb-2 block text-sm font-semibold text-zinc-900">{label}</label>
      <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-zinc-400">
          {icon}
        </div>
        <input
          type={type}
          {...register(field)}
          placeholder={placeholder}
          className={`block w-full rounded-xl border py-3 pl-10 pr-3 text-sm text-zinc-900 placeholder-zinc-400 transition-all focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20 ${
            errors[field] ? 'border-red-300' : 'border-zinc-200'
          }`}
        />
      </div>
      {errors[field] ? <p className="mt-1 text-xs text-red-600">{errors[field]?.message}</p> : null}
    </div>
  );

  // ─── Step content ──────────────────────────────────────────────────────────
  const renderStepContent = () => {
    if (currentStep === 1) {
      return (
        <div className="space-y-6">
          <div className="text-center">
            <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-bold text-blue-700">
              {t.signup.stepIndicator} 1 {t.signup.of} 4
            </span>
            <h3 className="mt-3 text-xl font-bold text-zinc-900">{t.signup.step1.title}</h3>
            <p className="mt-1 text-sm text-zinc-600">{t.signup.step1.description}</p>
          </div>

          <Controller
            control={control}
            name="categoryId"
            render={({ field }) => (
              <>
                {isCategoriesLoading ? (
                  renderCategorySkeleton()
                ) : (
                  <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
                    {categoryOptions.map(category => {
                      const isSelected = field.value === String(category.id);
                      return (
                        <button
                          type="button"
                          key={category.id}
                          onClick={() => field.onChange(String(category.id))}
                          className={`rounded-xl border px-3 py-4 text-sm font-medium transition-all ${
                            isSelected
                              ? 'border-blue-600 bg-blue-50 text-blue-700'
                              : 'border-zinc-200 bg-white text-zinc-700 hover:border-blue-300'
                          }`}
                        >
                          {category.name}
                        </button>
                      );
                    })}
                  </div>
                )}
              </>
            )}
          />

          {errors.categoryId ? <p className="text-xs text-red-600">{errors.categoryId.message}</p> : null}

          {watchedCategory === otherLabel ? (
            <div>
              <label className="mb-2 block text-sm font-semibold text-zinc-900">{t.signup.step1.label}</label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-zinc-400">
                  <Building2 className="h-4 w-4" />
                </div>
                <input
                  type="text"
                  {...register('customCategory')}
                  placeholder={t.signup.step1.placeholder}
                  className={`block w-full rounded-xl border py-3 pl-10 pr-3 text-sm text-zinc-900 placeholder-zinc-400 transition-all focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20 ${
                    errors.customCategory ? 'border-red-300' : 'border-zinc-200'
                  }`}
                />
              </div>
              {errors.customCategory ? (
                <p className="mt-1 text-xs text-red-600">{errors.customCategory.message}</p>
              ) : null}
            </div>
          ) : null}

          <button
            type="button"
            onClick={nextStep}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-bold text-white transition-all hover:bg-blue-700"
          >
            {t.signup.continue} <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      );
    }

    if (currentStep === 2) {
      return (
        <div className="space-y-6">
          <div className="text-center">
            <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-bold text-blue-700">
              {t.signup.stepIndicator} 2 {t.signup.of} 4
            </span>
            <h3 className="mt-3 text-xl font-bold text-zinc-900">{t.signup.step2.title}</h3>
            <p className="mt-1 text-sm text-zinc-600">{t.signup.step2.description}</p>
          </div>

          {renderTextInput({
            label: t.signup.step2.storeName,
            field: 'shopName',
            placeholder: t.signup.step2.storeNamePlaceholder,
            icon: <Building2 className="h-4 w-4" />,
          })}

          <div>
            <label className="mb-2 block text-sm font-semibold text-zinc-900">{t.signup.step2.address}</label>
            <div className="relative">
              <div className="pointer-events-none absolute left-3 top-3 text-zinc-400">
                <MapPin className="h-4 w-4" />
              </div>
              <textarea
                {...register('address')}
                placeholder={t.signup.step2.addressPlaceholder}
                rows={3}
                className={`block w-full resize-none rounded-xl border py-3 pl-10 pr-3 text-sm text-zinc-900 placeholder-zinc-400 transition-all focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20 ${
                  errors.address ? 'border-red-300' : 'border-zinc-200'
                }`}
              />
            </div>
            {errors.address ? <p className="mt-1 text-xs text-red-600">{errors.address.message}</p> : null}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={previousStep}
              className="flex items-center justify-center gap-2 rounded-xl border border-zinc-300 px-4 py-3 text-sm font-bold text-zinc-700 transition-all hover:bg-zinc-50"
            >
              <ArrowLeft className="h-4 w-4" /> {t.signup.back}
            </button>
            <button
              type="button"
              onClick={nextStep}
              className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-bold text-white transition-all hover:bg-blue-700"
            >
              {t.signup.continue} <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      );
    }

    if (currentStep === 3) {
      return (
      <div className="space-y-6">
        <div className="text-center">
          <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-700">
            {t.signup.stepIndicator} 3 {t.signup.of} 4
          </span>
          <h3 className="mt-3 text-xl font-bold text-zinc-900">{t.signup.step3.title}</h3>
          <p className="mt-1 text-sm text-zinc-600">{t.signup.step3.description}</p>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {renderTextInput({
            label: t.signup.step3.firstName,
            field: 'firstName',
            placeholder: t.signup.step3.firstNamePlaceholder,
            icon: <User className="h-4 w-4" />,
          })}
          {renderTextInput({
            label: t.signup.step3.lastName,
            field: 'lastName',
            placeholder: t.signup.step3.lastNamePlaceholder,
            icon: <User className="h-4 w-4" />,
          })}
        </div>

        {renderTextInput({
          label: t.signup.step3.email,
          field: 'email',
          placeholder: t.signup.step3.emailPlaceholder,
          icon: <Mail className="h-4 w-4" />,
          type: 'email',
        })}

        {renderTextInput({
          label: t.signup.step3.phone,
          field: 'phone',
          placeholder: t.signup.step3.phonePlaceholder,
          icon: <Phone className="h-4 w-4" />,
          type: 'tel',
        })}

        {/* Password */}
        <div>
          <label className="mb-2 block text-sm font-semibold text-zinc-900">{t.signup.step3.password}</label>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-zinc-400">
              <Lock className="h-4 w-4" />
            </div>
            <input
              type={showPassword ? 'text' : 'password'}
              {...register('password')}
              placeholder="••••••••"
              className={`block w-full rounded-xl border py-3 pl-10 pr-12 text-sm text-zinc-900 placeholder-zinc-400 transition-all focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20 ${
                errors.password ? 'border-red-300' : 'border-zinc-200'
              }`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(p => !p)}
              className="absolute inset-y-0 right-3 text-zinc-400 hover:text-zinc-600"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {errors.password ? <p className="mt-1 text-xs text-red-600">{errors.password.message}</p> : null}
        </div>

        {/* Confirm Password */}
        <div>
          <label className="mb-2 block text-sm font-semibold text-zinc-900">
            {t.signup.step3.confirmPassword}
          </label>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-zinc-400">
              <Lock className="h-4 w-4" />
            </div>
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              {...register('confirmPassword')}
              placeholder="••••••••"
              className={`block w-full rounded-xl border py-3 pl-10 pr-12 text-sm text-zinc-900 placeholder-zinc-400 transition-all focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20 ${
                errors.confirmPassword ? 'border-red-300' : 'border-zinc-200'
              }`}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(p => !p)}
              className="absolute inset-y-0 right-3 text-zinc-400 hover:text-zinc-600"
            >
              {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {errors.confirmPassword ? (
            <p className="mt-1 text-xs text-red-600">{errors.confirmPassword.message}</p>
          ) : null}
        </div>

        {/* Terms */}
        <div className="flex items-start gap-3">
          <input
            id="terms"
            type="checkbox"
            {...register('terms')}
            className="mt-1 h-4 w-4 cursor-pointer rounded border-zinc-300 text-blue-600"
          />
          <label htmlFor="terms" className="text-sm text-zinc-600">
            {t.signup.step3.terms.split(' ')[0]}{' '}
            <Link href="/terms" className="font-semibold text-blue-600 hover:text-blue-500">
              {t.signup.step3.termsLink1}
            </Link>{' '}
            {t.common.and}{' '}
            <Link href="/privacy" className="font-semibold text-blue-600 hover:text-blue-500">
              {t.signup.step3.termsLink2}
            </Link>
          </label>
        </div>
        {errors.terms ? <p className="text-xs text-red-600">{errors.terms.message}</p> : null}

        {/* Math challenge */}
        <div>
          <p className="mb-2 block text-sm font-semibold text-zinc-900">
            Vui lòng giải phép tính sau để xác minh:
          </p>
          <div className="flex items-center gap-2">
            <span className="font-mono text-lg">{mathQuestion}</span>
            <input
              type="number"
              className="ml-2 w-20 rounded border border-zinc-200 px-2 py-1 text-center"
              value={mathAnswer}
              onChange={e => setMathAnswer(e.target.value)}
              placeholder="?"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={previousStep}
            disabled={isSubmitting}
            className="flex items-center justify-center gap-2 rounded-xl border border-zinc-300 px-4 py-3 text-sm font-bold text-zinc-700 transition-all hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <ArrowLeft className="h-4 w-4" /> {t.signup.back}
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 text-sm font-bold text-white transition-all hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? t.signup.step3.processing : t.signup.step3.submit}
          </button>
        </div>
      </div>
    );
    }

    if (currentStep === 4) {
      return (
      <div className="space-y-6">
        <div className="text-center">
          <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-700">
            {t.signup.stepIndicator} 4 {t.signup.of} 4
          </span>
          <h3 className="mt-3 text-xl font-bold text-zinc-900">{t.signup.step4?.title || 'Xác thực email'}</h3>
          <p className="mt-1 text-sm text-zinc-600">{t.signup.step4?.description || 'Vui lòng nhập mã OTP đã gửi đến email của bạn'}</p>
        </div>

        <div className="mx-auto max-w-xs space-y-4">
          <div>
            <label className="mb-2 block text-center text-sm font-semibold text-zinc-700">{signupEmail}</label>
            <div className="flex gap-2 justify-center">
  {otp.map((digit, index) => (
    <input
      key={index}
      ref={el => {
        inputRefs.current[index] = el;
      }}
      type="text"
      inputMode="numeric"
      maxLength={1}
      autoComplete="one-time-code"
      autoFocus={index === 0}
      value={digit}
      onChange={e => handleChange(index, e)}
      onKeyDown={e => handleKeyDown(index, e)}
      onPaste={handlePaste}
      onFocus={e => e.target.select()}
      className={`h-12 w-12 rounded-xl border text-center text-lg font-bold text-zinc-900 transition-all
        focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20
        ${
          digit
            ? 'border-blue-600 bg-blue-50'
            : 'border-zinc-200'
        }`}
    />
  ))}
</div>
          </div>

          <button
            type="button"
            onClick={handleVerifyOtp}
            disabled={otp.length !== 6 || verifying}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 text-sm font-bold text-white transition-all hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {verifying ? 'Đang xác thực...' : (t.signup.step4?.verify || 'Xác thực')}
          </button>

          {cooldown > 0 ? (
            <div className="w-full text-center">
              <button
                type="button"
                disabled
                className="w-full cursor-not-allowed rounded-xl border border-zinc-200 bg-zinc-100 px-4 py-3 text-sm font-bold text-zinc-400"
              >
                {t.signup.step4?.resend || 'Gửi lại mã'}
              </button>
              <p className="mt-1 text-xs text-orange-500">{`Gửi lại sau ${cooldown}s`}</p>
            </div>
          ) : (
            <button
              type="button"
              onClick={handleResendOtp}
              disabled={otpSending}
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-zinc-300 px-4 py-3 text-sm font-bold text-zinc-700 transition-all hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {otpSending ? 'Đang gửi...' : (t.signup.step4?.resend || 'Gửi lại mã')}
            </button>
          )}
        </div>
      </div>
    );
    }
  };

  return (
    <main className="relative flex min-h-screen flex-col justify-center overflow-hidden bg-zinc-50 py-12 sm:px-6 lg:px-8">
      {/* Background blobs */}
      <div className="absolute left-0 top-0 -z-10 h-full w-full opacity-30">
        <div className="absolute left-[-10%] top-[-10%] h-[40%] w-[40%] rounded-full bg-blue-100 blur-[120px]" />
        <div className="absolute bottom-[10%] right-[-5%] h-[30%] w-[30%] rounded-full bg-indigo-100 blur-[100px]" />
      </div>

      <div className="relative sm:mx-auto sm:w-full sm:max-w-md">
        <Link
          href="/"
          className="absolute -top-12 left-0 flex items-center gap-2 text-sm font-medium text-zinc-500 transition-colors hover:text-blue-600"
        >
          <ArrowLeft className="h-4 w-4" />
          {t.signup.backHome}
        </Link>

        <div className="mb-6 flex justify-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 shadow-sm">
            <BrandLogo className="h-12 w-12 object-contain" />
          </div>
        </div>

        <h2 className="text-center text-3xl font-extrabold tracking-tight text-zinc-900">
          {t.signup.title}
        </h2>
        <p className="mt-2 text-center text-sm text-zinc-600">
          {t.signup.subtitle.split('?')[0]}?{' '}
          <Link href="/login" className="font-bold text-blue-600 transition-colors hover:text-blue-500">
            {t.signup.subtitle.split('?')[1]}
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="border border-zinc-100 bg-white px-4 py-8 shadow-xl shadow-zinc-200/50 sm:rounded-3xl sm:px-10"
        >
          <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
            {renderStepIndicator()}
            {renderStepContent()}
          </form>
        </motion.div>
      </div>

      <Toaster position="top-right" richColors />
    </main>
  );
}
