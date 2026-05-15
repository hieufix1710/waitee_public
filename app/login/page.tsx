'use client';

import BrandLogo from '@/components/BrandLogo';
import Link from 'next/link';
import { motion } from 'motion/react';
import { ArrowLeft, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import { useLanguage } from '@/lib/i18n/LanguageContext';

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const { t } = useLanguage();

  return (
    <main className="min-h-screen bg-zinc-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background patterns */}
      <div className="absolute top-0 left-0 w-full h-full -z-10 opacity-30">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-100 rounded-full blur-[120px]" />
        <div className="absolute bottom-[10%] right-[-5%] w-[30%] h-[30%] bg-indigo-100 rounded-full blur-[100px]" />
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative">
        <Link 
          href="/" 
          className="absolute -top-12 left-0 flex items-center gap-2 text-sm font-medium text-zinc-500 hover:text-blue-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
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

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-8 sm:mx-auto sm:w-full sm:max-w-md"
      >
        <div className="bg-white py-8 px-4 shadow-xl shadow-zinc-200/50 sm:rounded-3xl sm:px-10 border border-zinc-100">
          <form className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-zinc-900 mb-2">
                {t.login.email}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-zinc-400" />
                </div>
                <input
                  type="email"
                  required
                  className="block w-full pl-10 pr-3 py-3 border border-zinc-200 rounded-xl text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all sm:text-sm"
                  placeholder={t.login.emailPlaceholder}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-zinc-900 mb-2">
                {t.login.password}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-zinc-400" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
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

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-zinc-300 rounded cursor-pointer"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-zinc-600 cursor-pointer">
                  {t.login.rememberMe}
                </label>
              </div>

              <div className="text-sm">
                <Link href="#" className="font-semibold text-blue-600 hover:text-blue-500">
                  {t.login.forgotPassword}
                </Link>
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-4 px-4 border border-transparent rounded-xl shadow-lg shadow-blue-100 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all"
              >
                {t.login.signIn}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-zinc-200" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-zinc-500">{t.login.orContinueWith}</span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <button className="w-full inline-flex justify-center py-3 px-4 rounded-xl border border-zinc-200 bg-white text-sm font-medium text-zinc-500 hover:bg-zinc-50 transition-all">
                <span className="sr-only">{t.login.google}</span>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.92 3.36-2.04 4.48-1.2 1.2-3.04 2.48-5.8 2.48-4.72 0-8.64-3.84-8.64-8.64s3.92-8.64 8.64-8.64c2.48 0 4.52.88 6.12 2.4l2.32-2.32C18.48 1.48 15.52 0 12.48 0 5.56 0 0 5.56 0 12.48S5.56 24.96 12.48 24.96c3.76 0 6.6-1.24 8.84-3.52 2.32-2.32 3.12-5.56 3.12-8.16 0-.6-.04-1.2-.12-1.76H12.48z" />
                </svg>
              </button>
              <button className="w-full inline-flex justify-center py-3 px-4 rounded-xl border border-zinc-200 bg-white text-sm font-medium text-zinc-500 hover:bg-zinc-50 transition-all">
                <span className="sr-only">{t.login.facebook}</span>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </main>
  );
}
