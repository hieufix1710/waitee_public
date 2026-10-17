'use client';

import { useEffect } from 'react';
import { useLanguage } from '@/lib/i18n/LanguageContext';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const { t } = useLanguage();

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main
      id="main-content"
      tabIndex={-1}
      className="min-h-screen flex items-center justify-center bg-white"
    >
      <div className="text-center max-w-md px-4">
        <h1 className="text-2xl font-black text-zinc-900 mb-4">{t.errorPage.title}</h1>
        <p className="text-zinc-500 mb-8">{t.errorPage.message}</p>
        <button
          onClick={() => reset()}
          className="px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all"
        >
          {t.errorPage.retry}
        </button>
      </div>
    </main>
  );
}
