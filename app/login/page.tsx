'use client';

import BrandLogo from '@/components/BrandLogo';
import { useAuth } from '@/lib/auth';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { Eye, EyeOff, Lock, Mail } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Toaster, toast } from 'sonner';

export default function LoginPage() {
  const { t } = useLanguage();
  const { login, isAuthenticated } = useAuth();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated) router.replace('/dashboard');
  }, [isAuthenticated, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    setLoading(true);
    try {
      const res = await fetch('/api/user/sign-in', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user: { email, password } }),
      });
      const data = await res.json();
      if (res.ok && data.user?.uid) {
        login(data);
        toast.success('Đăng nhập thành công!');
        setTimeout(() => router.push('/dashboard'), 500);
      } else if (res.status === 422) {
        router.push(`/resend-verification?email=${encodeURIComponent(email)}`);
      } else {
        toast.error(data.message || 'Đăng nhập thất bại');
      }
    } catch {
      toast.error('Có lỗi xảy ra. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-zinc-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full -z-10 opacity-30">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-100 rounded-full blur-[120px]" />
        <div className="absolute bottom-[10%] right-[-5%] w-[30%] h-[30%] bg-indigo-100 rounded-full blur-[100px]" />
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative">
        <Link
          href="/"
          className="absolute -top-12 left-0 flex items-center gap-2 text-sm font-medium text-zinc-500 hover:text-blue-600 transition-colors"
        >
          <span className="text-lg leading-none">←</span>
          {t.login.backHome}
        </Link>

        <div className="flex justify-center mb-6">
          <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center shadow-sm">
            <BrandLogo size={28} className="h-10 w-10 object-contain" />
          </div>
        </div>

        <h2 className="text-center text-3xl font-extrabold text-zinc-900 tracking-tight">
          {t.login.title}
        </h2>
        <p className="mt-2 text-center text-sm text-zinc-600">
          {t.common.or}{' '}
          <Link href="/signup" className="font-bold text-blue-600 hover:text-blue-500 transition-colors">
            {t.login.signUpLink}
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-xl shadow-zinc-200/50 sm:rounded-3xl sm:px-10 border border-zinc-100">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-semibold text-zinc-900 mb-2">{t.login.email}</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-zinc-400" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-zinc-200 rounded-xl text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all sm:text-sm"
                  placeholder={t.login.emailPlaceholder}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-zinc-900 mb-2">{t.login.password}</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-zinc-400" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-10 py-3 border border-zinc-200 rounded-xl text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all sm:text-sm"
                  placeholder={t.login.passwordPlaceholder}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-zinc-400 hover:text-zinc-600"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-4 px-4 border border-transparent rounded-xl shadow-lg shadow-blue-100 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all disabled:opacity-60"
              >
                {loading ? 'Đang xử lý...' : t.login.signIn}
              </button>
            </div>
          </form>
        </div>
      </div>

      <Toaster position="top-right" richColors />
    </main>
  );
}
