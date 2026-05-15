'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown } from 'lucide-react';
import { useLanguage } from '@/lib/i18n/LanguageContext';

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const { t } = useLanguage();

  return (
    <section className="py-24 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <h2 className="font-manrope text-[32px] md:text-[44px] font-black text-[#1a1a1a] mb-6 tracking-tighter">
            {t.faq.title}
          </h2>
          <p className="text-zinc-500 text-lg max-w-2xl mx-auto leading-relaxed">
            {t.faq.subtitle}
          </p>
        </div>

        <div className="grid gap-4">
          {t.faq.items.map((faq, index) => (
            <div 
              key={index}
              className={`rounded-[24px] border transition-all duration-300 ${openIndex === index ? 'bg-zinc-50 border-zinc-200 shadow-sm' : 'bg-white border-zinc-100 hover:border-zinc-200'}`}
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full px-8 py-7 flex items-center justify-between text-left transition-colors"
              >
                <span className={`text-lg font-bold transition-colors ${openIndex === index ? 'text-blue-600' : 'text-[#1a1a1a]'}`}>{faq.q}</span>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${openIndex === index ? 'bg-blue-600 text-white rotate-180' : 'bg-zinc-100 text-zinc-400'}`}>
                  <ChevronDown className="w-4 h-4" />
                </div>
              </button>
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                  >
                    <div className="px-8 pb-8 text-zinc-500 text-base leading-relaxed border-t border-zinc-100 pt-6">
                      {faq.a}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
