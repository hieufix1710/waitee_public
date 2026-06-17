'use client';

import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { appUrl } from '@/utils/constants';

export default function CTA() {
  const { t } = useLanguage();

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-blue-600 rounded-[40px] p-12 md:p-20 text-center relative overflow-hidden">
          {/* Decorative circles */}
          <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl" />
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-blue-400/20 rounded-full translate-x-1/2 translate-y-1/2 blur-3xl" />
          
          <div className="relative z-10 max-w-3xl mx-auto">
            <h2 className="font-manrope text-3xl md:text-[44px] font-black tracking-tighter text-white mb-8 leading-tight">
              {t.cta.title}
            </h2>
            <p className="text-blue-100 text-lg mb-10">
              {t.cta.desc}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <a
                href={appUrl.ios || '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto bg-white text-blue-600 px-10 py-4 rounded-2xl font-bold text-lg hover:bg-blue-50 transition-all shadow-xl shadow-blue-900/20 text-center inline-block"
              >
                {t.cta.start}
              </a>
              <Link href="/pricing" className="w-full sm:w-auto bg-transparent border border-white/30 text-white px-10 py-4 rounded-2xl font-bold text-lg hover:bg-white/10 transition-all text-center">
                {t.cta.pricing}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
