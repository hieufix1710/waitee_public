'use client';

import { motion } from 'motion/react';
import { 
  CheckCircle2, 
  Smartphone, 
  Zap,
  ShieldCheck
} from 'lucide-react';
import { useLanguage } from '@/lib/i18n/LanguageContext';

export default function POSVietnam() {
  const { t } = useLanguage();

  const items = [
    {
      title: t.pos.easyUse.title,
      description: t.pos.easyUse.desc,
      icon: CheckCircle2,
    },
    {
      title: t.pos.cost.title,
      description: t.pos.cost.desc,
      icon: Zap,
    },
    {
      title: t.pos.support.title,
      description: t.pos.support.desc,
      icon: ShieldCheck,
    },
  ];

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h2 className="font-manrope text-[32px] md:text-[44px] font-black text-[#1a1a1a] mb-8 tracking-tighter leading-tight">
            {t.pos.heading}
          </h2>
          <p className="text-zinc-500 text-lg leading-relaxed">
            {t.pos.description}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {items.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group text-center p-10 rounded-[32px] hover:bg-zinc-50 transition-all duration-500 border border-transparent hover:border-zinc-100"
            >
              <div className="w-20 h-20 bg-blue-50 rounded-3xl flex items-center justify-center mx-auto mb-8 group-hover:scale-110 transition-transform duration-500">
                <item.icon className="w-10 h-10 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-[#1a1a1a] mb-4">{item.title}</h3>
              <p className="text-zinc-500 text-base leading-relaxed">
                {item.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
