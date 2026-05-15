'use client';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CTA from '@/components/CTA';
import { motion } from 'motion/react';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { Target, Lightbulb, Heart, Shield, Users, Globe, Zap, Clock } from 'lucide-react';
import Image from 'next/image';

export default function AboutPage() {
  const { t } = useLanguage();

  const valueIcons = [Lightbulb, Heart, Zap, Shield];

  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative pt-40 pb-20 overflow-hidden bg-zinc-50">
        <div className="absolute top-0 left-0 w-full h-full -z-10 opacity-40">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-100 rounded-full blur-[120px]" />
          <div className="absolute bottom-[10%] right-[-5%] w-[30%] h-[30%] bg-indigo-100 rounded-full blur-[100px]" />
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl mx-auto"
          >
            <span className="inline-block text-blue-600 font-bold text-xs tracking-widest uppercase mb-6">
              {t.aboutPage.hero.badge}
            </span>
            <h1 className="text-5xl md:text-6xl font-black tracking-tighter text-zinc-900 mb-8 leading-[1.1]">
              {t.aboutPage.hero.title}
            </h1>
            <p className="text-xl text-zinc-600 leading-relaxed">
              {t.aboutPage.hero.desc}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white border-y border-zinc-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="p-6"
            >
              <div className="text-4xl font-black text-blue-600 mb-2">10,000+</div>
              <div className="text-sm font-bold text-zinc-500 uppercase tracking-wider">{t.aboutPage.stats.customers}</div>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="p-6"
            >
              <div className="text-4xl font-black text-blue-600 mb-2">5M+</div>
              <div className="text-sm font-bold text-zinc-500 uppercase tracking-wider">{t.aboutPage.stats.transactions}</div>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="p-6"
            >
              <div className="text-4xl font-black text-blue-600 mb-2">99.9%</div>
              <div className="text-sm font-bold text-zinc-500 uppercase tracking-wider">{t.aboutPage.stats.uptime}</div>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="p-6"
            >
              <div className="text-4xl font-black text-blue-600 mb-2">24/7</div>
              <div className="text-sm font-bold text-zinc-500 uppercase tracking-wider">{t.aboutPage.stats.support}</div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-24 bg-zinc-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-white p-12 rounded-[32px] shadow-xl shadow-zinc-200/50 border border-zinc-100"
            >
              <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center mb-8">
                <Target className="w-7 h-7 text-blue-600" />
              </div>
              <h2 className="text-3xl font-black tracking-tight text-zinc-900 mb-6">
                {t.aboutPage.mission.title}
              </h2>
              <p className="text-lg text-zinc-600 leading-relaxed">
                {t.aboutPage.mission.desc}
              </p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-zinc-900 p-12 rounded-[32px] shadow-xl text-white"
            >
              <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center mb-8">
                <Globe className="w-7 h-7 text-blue-400" />
              </div>
              <h2 className="text-3xl font-black tracking-tight mb-6">
                {t.aboutPage.vision.title}
              </h2>
              <p className="text-lg text-zinc-300 leading-relaxed">
                {t.aboutPage.vision.desc}
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl font-black tracking-tighter text-zinc-900 mb-6">
              {t.aboutPage.values.title}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {t.aboutPage.values.items.map((value, index) => {
              const Icon = valueIcons[index];
              return (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="p-8 rounded-[32px] bg-zinc-50 border border-zinc-100 hover:shadow-xl hover:shadow-zinc-200/50 transition-all duration-300"
                >
                  <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm mb-6">
                    <Icon className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-bold text-zinc-900 mb-4">{value.title}</h3>
                  <p className="text-zinc-600 leading-relaxed">{value.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <CTA />
      <Footer />
    </main>
  );
}
