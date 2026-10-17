'use client';

import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
import { usePricingPlans } from '@/hooks/usePricingPlans';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { buildComparisonRows, type BillingCycle } from '@/lib/pricing/plans';
import { appUrl } from '@/utils/constants';
import { Check, ChevronDown, Mail, Minus, Shield, Star, Users, Zap } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import Link from 'next/link';
import { useState } from 'react';

export default function PricingPage() {
  const { t } = useLanguage();
  const [billingCycle, setBillingCycle] = useState<BillingCycle>('monthly');
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const { plans, plansByCycle, loading } = usePricingPlans();
  const currentPlans = plansByCycle[billingCycle];
  const comparisonRows = buildComparisonRows(plans);

  return (
    <>
      <Navbar />
      <main id="main-content" tabIndex={-1} className="min-h-screen bg-white">
        {/* Header */}
        <section className="pt-40 pb-24 bg-zinc-900 text-white text-center relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full text-xs font-bold tracking-widest uppercase mb-8 border border-white/10"
            >
              <Star className="w-4 h-4 text-blue-400" />
              <span>{t.pricing.badge}</span>
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-5xl md:text-7xl font-black tracking-tighter mb-8 leading-[1.1]"
            >
              {t.pricing.heading}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl text-zinc-400 max-w-2xl mx-auto leading-relaxed"
            >
              {t.pricing.subheading}
            </motion.p>
          </div>

          {/* Background Accent */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-0 opacity-20 pointer-events-none">
            <div className="absolute top-20 left-1/4 w-[500px] h-[500px] bg-blue-600 rounded-full blur-[150px]" />
          </div>
        </section>

        {/* Pricing Toggle & Cards */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col items-center mb-16">
              <p className="text-zinc-500 mb-6 font-medium">{t.pricing.selectHint}</p>
              <div className="flex items-center bg-zinc-100 p-1 rounded-xl">
                <button
                  onClick={() => setBillingCycle('monthly')}
                  className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${billingCycle === 'monthly' ? 'bg-zinc-900 text-white shadow-lg' : 'text-zinc-600 hover:text-zinc-900'}`}
                >
                  {t.pricing.monthly}
                </button>
                <button
                  onClick={() => setBillingCycle('yearly')}
                  className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${billingCycle === 'yearly' ? 'bg-zinc-900 text-white shadow-lg' : 'text-zinc-600 hover:text-zinc-900'}`}
                >
                  {t.pricing.yearly}
                </button>
              </div>
            </div>

            {loading ? (
              <div className="flex justify-center py-32">
                <div className="w-8 h-8 border-4 border-zinc-200 border-t-blue-600 rounded-full animate-spin" />
              </div>
            ) : currentPlans.length === 0 ? (
              <p className="text-center text-zinc-400 py-32">{t.pricing.empty}</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {currentPlans.map((plan, i) => {
                  const isFree = plan.price === 0;
                  return (
                    <motion.div
                      key={plan.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className={`relative flex flex-col p-10 rounded-[32px] border ${plan.popular ? 'border-blue-600 ring-8 ring-blue-50 shadow-2xl shadow-blue-900/10' : 'border-zinc-100 shadow-sm'} bg-white hover:border-zinc-200 transition-all duration-300`}
                    >
                      {plan.tag && (
                        <div
                          className={`absolute -top-4 left-1/2 -translate-x-1/2 px-5 py-1.5 rounded-full text-[10px] font-black tracking-[0.2em] uppercase ${isFree ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-600 text-white shadow-lg shadow-blue-200'}`}
                        >
                          {plan.tag}
                        </div>
                      )}

                      <div className="mb-10">
                        <h3 className="text-3xl font-black text-zinc-900 mb-3 tracking-tighter">
                          {plan.name}
                        </h3>
                        <p className="text-sm text-zinc-500 leading-relaxed">{plan.description}</p>
                      </div>

                      <div className="mb-10">
                        <div className="flex items-baseline gap-1">
                          <span className="text-5xl font-black text-zinc-900 tracking-tighter">
                            {plan.price === 0 ? '0' : plan.price.toLocaleString('vi-VN')}
                            {plan.price !== 0 && <span className="text-xl font-bold ml-1">đ</span>}
                          </span>
                          {plan.price !== 0 && (
                            <span className="text-zinc-400 font-bold text-sm uppercase tracking-widest ml-1">
                              /{plan.billingCycle === 'monthly' ? t.pricing.month : t.pricing.year}
                            </span>
                          )}
                        </div>
                        <p className="mt-2 text-xs text-zinc-500 uppercase tracking-wider">
                          {t.pricing.payBy.replace(
                            '{{cycle}}',
                            plan.billingCycle === 'monthly' ? t.pricing.month : t.pricing.year,
                          )}
                        </p>
                      </div>

                      <a
                        href={appUrl.ios || '#'}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`block w-full px-3 py-4 text-center rounded-2xl font-bold text-sm mb-10 transition-all ${plan.popular ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-xl shadow-blue-200' : isFree ? 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-xl shadow-emerald-200' : 'bg-zinc-900 text-white hover:bg-zinc-800'}`}
                      >
                        {plan.cta}
                      </a>

                      <div className="space-y-5 mt-auto">
                        <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-2">
                          {t.pricing.includes}:
                        </p>
                        {plan.features.map((feature, idx) => (
                          <div key={idx} className="flex items-center gap-3">
                            <div
                              className={`w-5 h-5 rounded-full flex items-center justify-center ${isFree ? 'bg-emerald-50 text-emerald-600' : 'bg-blue-50 text-blue-600'}`}
                            >
                              <Check className="w-3 h-3" />
                            </div>
                            <span className="text-sm text-zinc-600 font-bold">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}

            <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="flex items-start gap-4 p-6 rounded-2xl bg-zinc-50 border border-zinc-100">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center shrink-0">
                  <Shield className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-bold text-zinc-900 mb-1">{t.pricing.security.title}</h4>
                  <p className="text-sm text-zinc-500">{t.pricing.security.desc}</p>
                </div>
              </div>
              <div className="flex items-start gap-4 p-6 rounded-2xl bg-zinc-50 border border-zinc-100">
                <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center shrink-0">
                  <Zap className="w-6 h-6 text-emerald-600" />
                </div>
                <div>
                  <h4 className="font-bold text-zinc-900 mb-1">{t.pricing.cancel.title}</h4>
                  <p className="text-sm text-zinc-500">{t.pricing.cancel.desc}</p>
                </div>
              </div>
              <div className="flex items-start gap-4 p-6 rounded-2xl bg-zinc-50 border border-zinc-100">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center shrink-0">
                  <Users className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h4 className="font-bold text-zinc-900 mb-1">{t.pricing.support.title}</h4>
                  <p className="text-sm text-zinc-500">{t.pricing.support.desc}</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Free Forever Callout */}
        <section className="py-12">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-zinc-50 border border-zinc-200 rounded-[2.5rem] p-12 text-center">
              <h2 className="text-2xl font-black text-zinc-900 mb-4">
                {t.pricing.freeCallout.title}
              </h2>
              <p className="text-zinc-600 mb-8 max-w-2xl mx-auto">{t.pricing.freeCallout.desc}</p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <a
                  href={appUrl.ios || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-8 py-4 bg-emerald-600 text-white rounded-2xl font-bold hover:bg-emerald-700 transition-all w-full sm:w-auto inline-block"
                >
                  {t.pricing.freeCallout.cta}
                </a>
                <Link
                  href="#compare"
                  className="px-8 py-4 bg-white border border-zinc-200 text-zinc-900 rounded-2xl font-bold hover:bg-zinc-100 transition-all w-full sm:w-auto inline-block"
                >
                  {t.pricing.compare}
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Comparison Table */}
        <section id="compare" className="py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-black text-zinc-900 mb-4">{t.pricing.compare}</h2>
              <p className="text-zinc-500">{t.pricing.compareDesc}</p>
            </div>

            <div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0">
              <table className="w-full border-collapse min-w-[800px]">
                <thead>
                  <tr className="border-b border-zinc-100">
                    <th className="py-8 px-4 text-left font-bold text-zinc-400 text-xs uppercase tracking-widest">
                      {t.pricing.features}
                    </th>
                    {comparisonRows.length > 0 &&
                      Object.keys(comparisonRows[0].values).map((name) => (
                        <th
                          key={name}
                          className="py-8 px-4 text-center font-bold text-xs uppercase tracking-widest text-blue-600"
                        >
                          {name}
                        </th>
                      ))}
                  </tr>
                </thead>
                <tbody>
                  {comparisonRows.map((row, i) => (
                    <tr
                      key={i}
                      className="border-b border-zinc-50 hover:bg-zinc-50/50 transition-colors"
                    >
                      <td className="py-6 px-4 text-zinc-700 font-bold text-sm">{row.feature}</td>
                      {Object.entries(row.values).map(([name, value], ci) => (
                        <td key={ci} className="py-6 px-4 text-center text-zinc-600 text-sm">
                          {typeof value === 'boolean' ? (
                            value ? (
                              <Check className="w-5 h-5 mx-auto text-blue-500" />
                            ) : (
                              <Minus className="w-5 h-5 text-zinc-200 mx-auto" />
                            )
                          ) : (
                            value
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-12 text-center">
              <a
                href={appUrl.ios || '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-8 py-4 bg-emerald-600 text-white rounded-2xl font-bold hover:bg-emerald-700 transition-all"
              >
                {t.pricing.startFree}
              </a>
            </div>
          </div>
        </section>

        {/* Guide Section */}
        <section className="py-24 bg-zinc-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-black text-zinc-900 mb-6">{t.pricing.chooseGuide}</h2>
            <p className="text-zinc-600 mb-12 leading-relaxed">{t.pricing.chooseDesc}</p>
            <div className="text-left space-y-6 max-w-2xl mx-auto">
              {t.pricing.guide.map((item, i) => (
                <div key={i} className="flex gap-4">
                  <div className="w-1.5 h-1.5 bg-zinc-400 rounded-full mt-2 shrink-0" />
                  <p className="text-zinc-600">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-24 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-20">
              <h2 className="font-manrope text-[32px] md:text-[44px] font-black text-zinc-900 mb-6 tracking-tighter">
                {t.pricing.faq.title}
              </h2>
              <p className="text-zinc-500 text-lg max-w-2xl mx-auto leading-relaxed">
                {t.pricing.faq.subtitle}
              </p>
            </div>

            <div className="grid gap-4">
              {t.pricing.faq.items.map((faq, i) => (
                <div
                  key={i}
                  className={`rounded-[24px] border transition-all duration-300 ${openFaq === i ? 'bg-zinc-50 border-zinc-200 shadow-sm' : 'bg-white border-zinc-100 hover:border-zinc-200'}`}
                >
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full px-8 py-7 flex items-center justify-between text-left transition-colors"
                  >
                    <span
                      className={`text-lg font-bold transition-colors ${openFaq === i ? 'text-blue-600' : 'text-zinc-900'}`}
                    >
                      {faq.q}
                    </span>
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${openFaq === i ? 'bg-blue-600 text-white rotate-180' : 'bg-zinc-100 text-zinc-400'}`}
                    >
                      <ChevronDown className="w-4 h-4" />
                    </div>
                  </button>
                  <AnimatePresence>
                    {openFaq === i && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
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

            <div className="mt-16 text-center">
              <p className="text-zinc-500 mb-4">{t.pricing.faq.contact}</p>
              <Link
                href="/about-us"
                className="inline-flex items-center gap-2 text-blue-600 font-bold hover:underline"
              >
                <Mail className="w-4 h-4" />
                {t.pricing.faq.contactUs}
              </Link>
            </div>
          </div>
        </section>

        <Footer />
      </main>
    </>
  );
}
