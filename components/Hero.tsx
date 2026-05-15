'use client';

import React from 'react';
import { motion } from 'motion/react';
import { Play, CheckCircle2, Zap } from 'lucide-react';
import Link from 'next/link';
import { BarChart, Bar, ResponsiveContainer, XAxis, YAxis, Tooltip, Cell } from 'recharts';
import { useLanguage } from '@/lib/i18n/LanguageContext';

const data = [
  { name: 'T2', value: 400 },
  { name: 'T3', value: 300 },
  { name: 'T4', value: 600 },
  { name: 'T5', value: 800 },
  { name: 'T6', value: 500 },
  { name: 'T7', value: 900 },
  { name: 'CN', value: 1100 },
];

export default function Hero() {
  const { t } = useLanguage();

  return (
    <section className="relative pt-32 pb-20 overflow-hidden bg-white">
      {/* Background Blobs */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-50 rounded-full blur-[120px] -z-10 opacity-60 translate-x-1/2 -translate-y-1/2" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          {/* Left Content */}
          <div className="lg:w-1/2 text-left">
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-block text-blue-600 font-bold text-xs tracking-widest uppercase mb-6"
            >
              {t.hero.badge}
            </motion.span>
            
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="font-manrope text-[44px] md:text-[56px] font-black text-[#1a1a1a] tracking-tighter leading-[1.15] mb-8"
            >
              {t.hero.title1}<span className="text-blue-600">{t.hero.titleHighlight}</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-[17px] text-zinc-500 mb-10 leading-relaxed max-w-xl"
            >
              {t.hero.desc}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center gap-6 mb-10"
            >
              <Link href="/signup" className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-2xl font-bold transition-all shadow-sm text-center">
                {t.hero.startFree}
              </Link>
              <Link href="/login" className="flex items-center gap-2 text-zinc-900 font-bold hover:text-blue-600 transition-colors">
                <div className="w-10 h-10 rounded-full border border-zinc-200 flex items-center justify-center">
                  <Play className="w-4 h-4 fill-current" />
                </div>
                {t.hero.watchDemo}
              </Link>
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-sm text-zinc-400"
            >
              {t.hero.trust}
            </motion.p>
          </div>

          {/* Right Dashboard Preview */}
          <div className="lg:w-1/2 relative">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="bg-white p-6 sm:p-8 rounded-[32px] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.08)] border border-zinc-100 relative z-10"
            >
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
                <div className="p-4 bg-white border border-zinc-50 rounded-xl shadow-sm">
                  <p className="text-[10px] text-zinc-400 font-bold uppercase mb-1">{t.hero.stats.revenue}</p>
                  <p className="text-lg font-bold text-zinc-900">12.5M</p>
                  <p className="text-[10px] text-emerald-500 font-bold">+18.5%</p>
                </div>
                <div className="p-4 bg-white border border-zinc-50 rounded-xl shadow-sm">
                  <p className="text-[10px] text-zinc-400 font-bold uppercase mb-1">{t.hero.stats.orders}</p>
                  <p className="text-lg font-bold text-zinc-900">47</p>
                  <p className="text-[10px] text-emerald-500 font-bold">+12</p>
                </div>
                <div className="hidden sm:block p-4 bg-white border border-zinc-50 rounded-xl shadow-sm">
                  <p className="text-[10px] text-zinc-400 font-bold uppercase mb-1">{t.hero.stats.products}</p>
                  <p className="text-lg font-bold text-zinc-900">156</p>
                  <p className="text-[10px] text-blue-500 font-bold">3 {t.hero.stats.warehouses}</p>
                </div>
              </div>

              {/* Real Bar Chart */}
              <div className="h-[200px] sm:h-[240px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data}>
                    <XAxis 
                      dataKey="name" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fontSize: 10, fill: '#94a3b8' }} 
                    />
                    <Tooltip 
                      cursor={{ fill: '#f8fafc' }}
                      contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                    />
                    <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                      {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={index === data.length - 1 ? '#2563eb' : '#dbeafe'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </motion.div>

            {/* Floating Elements */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-6 -right-6 bg-white p-4 rounded-2xl shadow-xl border border-zinc-100 z-20 hidden sm:block"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-50 rounded-full flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                </div>
                <div>
                  <p className="text-[10px] text-zinc-400 font-bold uppercase">{t.hero.stats.inventory}</p>
                  <p className="text-sm font-bold text-zinc-900">{t.hero.stats.synced}</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              className="absolute -bottom-10 -left-10 bg-white p-4 rounded-2xl shadow-xl border border-zinc-100 z-20 hidden sm:block"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center">
                  <Zap className="w-5 h-5 text-blue-500" />
                </div>
                <div>
                  <p className="text-[10px] text-zinc-400 font-bold uppercase">{t.hero.stats.processing}</p>
                  <p className="text-sm font-bold text-zinc-900">{t.hero.stats.speed}</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
