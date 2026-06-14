'use client';

import { motion } from 'motion/react';
import { Check } from 'lucide-react';
import Link from 'next/link';
import { CYCLE_LABEL } from '@/lib/pricing/plans';
import { usePricingPlans } from '@/hooks/usePricingPlans';

export default function Pricing() {
  const { plansByCycle, loading } = usePricingPlans();
  const plans = plansByCycle.monthly;

  if (loading || plans.length === 0) return null;

  return (
    <section id="pricing" className="py-24 bg-zinc-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-blue-600 font-semibold tracking-wide uppercase text-sm mb-3">
            Bảng giá dịch vụ
          </h2>
          <p className="font-manrope text-4xl font-bold text-zinc-900 mb-6">
            Chi phí minh bạch, không phí ẩn
          </p>
          <p className="text-zinc-600">
            Bắt đầu với gói miễn phí và nâng cấp khi bạn phát triển. Xem <Link href="/pricing" className="text-blue-600 font-bold hover:underline">bảng giá chi tiết</Link> để biết thêm thông tin.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {plans.map((plan, index) => {
              const isFree = plan.price === 0;
              return (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`relative bg-white p-8 rounded-3xl border ${
                plan.popular ? 'border-blue-600 shadow-xl ring-4 ring-blue-50' : 'border-zinc-200 shadow-sm'
              }`}
            >
              {plan.popular && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-blue-600 text-white px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
                  Phổ biến nhất
                </div>
              )}
              <div className="mb-8">
                <h3 className="text-xl font-bold text-zinc-900 mb-2">{plan.name}</h3>
                <p className="text-zinc-500 text-sm h-10">{plan.description}</p>
              </div>
              <div className="mb-8">
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-black text-zinc-900">
                    {plan.price === 0 ? '0' : plan.price.toLocaleString('vi-VN')}
                  </span>
                  {plan.price !== 0 && <span className="text-lg font-bold text-zinc-900">đ</span>}
                  <span className="text-zinc-500 ml-1">/{CYCLE_LABEL[plan.billingCycle]}</span>
                </div>
              </div>
              <ul className="space-y-4 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-3 text-sm text-zinc-600">
                    <Check className={`w-5 h-5 ${isFree ? 'text-emerald-500' : 'text-blue-600'} flex-shrink-0`} />
                    {feature}
                  </li>
                ))}
              </ul>
              <button
                className={`w-full py-4 rounded-xl font-bold transition-all ${
                  plan.popular
                    ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-200'
                    : isFree ? 'bg-emerald-600 text-white hover:bg-emerald-700' : 'bg-zinc-100 text-zinc-900 hover:bg-zinc-200'
                }`}
              >
                {plan.cta}
              </button>
            </motion.div>
              );
            })}
        </div>
      </div>
    </section>
  );
}
