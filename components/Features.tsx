'use client';

import { motion } from 'motion/react';
import { 
  RefreshCw, 
  LayoutGrid, 
  BarChart3,
  ArrowRight
} from 'lucide-react';
import Link from 'next/link';
import { useLanguage } from '@/lib/i18n/LanguageContext';

const featureIcons = [RefreshCw, LayoutGrid, BarChart3];

export default function Features() {
  const { t } = useLanguage();

  const features = [
    {
      title: t.features.inventory.title,
      description: t.features.inventory.desc,
      icon: RefreshCw,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
    },
    {
      title: t.features.multichannel.title,
      description: t.features.multichannel.desc,
      icon: LayoutGrid,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
    },
    {
      title: t.features.analytics.title,
      description: t.features.analytics.desc,
      icon: BarChart3,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
    },
  ];

  return (
    <section id="features" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-16 gap-6">
          <div className="max-w-2xl">
            <h2 className="font-manrope text-[32px] md:text-[44px] font-black text-[#1a1a1a] mb-6 tracking-tighter leading-tight">
              {t.features.heading}
            </h2>
            <p className="text-zinc-500 leading-relaxed text-lg">
              {t.features.description}
            </p>
          </div>
          <Link href="/products" className="flex items-center gap-2 text-blue-600 font-bold text-sm hover:gap-3 transition-all whitespace-nowrap">
            {t.features.viewMore} <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white p-10 rounded-[32px] border border-zinc-100 shadow-[0_4px_20px_rgba(0,0,0,0.02)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.04)] transition-all duration-300"
            >
              <div className={`w-12 h-12 ${feature.bg} rounded-xl flex items-center justify-center mb-8`}>
                <feature.icon className={`w-5 h-5 ${feature.color}`} />
              </div>
              <h3 className="text-lg font-bold text-[#1a1a1a] mb-4">{feature.title}</h3>
              <p className="text-zinc-500 text-sm leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
