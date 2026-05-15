'use client';

import React from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell
} from 'recharts';
import { TrendingUp, Users, ShoppingBag, DollarSign } from 'lucide-react';

const salesData = [
  { name: 'T2', value: 4000 },
  { name: 'T3', value: 3000 },
  { name: 'T4', value: 2000 },
  { name: 'T5', value: 2780 },
  { name: 'T6', value: 1890 },
  { name: 'T7', value: 2390 },
  { name: 'CN', value: 3490 },
];

const categoryData = [
  { name: 'Thời trang', value: 400, color: '#3b82f6' },
  { name: 'Điện tử', value: 300, color: '#10b981' },
  { name: 'Gia dụng', value: 200, color: '#f59e0b' },
  { name: 'Khác', value: 100, color: '#6366f1' },
];

export default function DashboardPreview() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-blue-600 font-semibold tracking-wide uppercase text-sm mb-3">
            Báo cáo thông minh
          </h2>
          <p className="font-manrope text-4xl font-bold text-zinc-900 mb-6">
            Theo dõi kinh doanh trực quan theo thời gian thực
          </p>
          <p className="text-lg text-zinc-600">
            Hệ thống biểu đồ tự động giúp bạn nắm bắt xu hướng bán hàng, tồn kho và hiệu quả kinh doanh chỉ trong nháy mắt.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Stats Cards */}
          <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-4 gap-6 mb-4">
            {[
              { label: 'Doanh thu ngày', value: '12.450.000đ', icon: DollarSign, color: 'bg-blue-50 text-blue-600', trend: '+12.5%' },
              { label: 'Đơn hàng mới', value: '156', icon: ShoppingBag, color: 'bg-emerald-50 text-emerald-600', trend: '+8.2%' },
              { label: 'Khách hàng mới', value: '42', icon: Users, color: 'bg-amber-50 text-amber-600', trend: '+5.1%' },
              { label: 'Tỷ lệ chuyển đổi', value: '3.2%', icon: TrendingUp, color: 'bg-indigo-50 text-indigo-600', trend: '+1.2%' },
            ].map((stat, i) => (
              <div key={i} className="bg-zinc-50 p-6 rounded-2xl border border-zinc-100">
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.color}`}>
                    <stat.icon className="w-6 h-6" />
                  </div>
                  <span className="text-emerald-600 text-sm font-bold">{stat.trend}</span>
                </div>
                <p className="text-zinc-500 text-sm font-medium mb-1">{stat.label}</p>
                <p className="text-2xl font-bold text-zinc-900">{stat.value}</p>
              </div>
            ))}
          </div>

          {/* Main Sales Chart */}
          <div className="lg:col-span-2 bg-zinc-50 p-8 rounded-3xl border border-zinc-100">
            <div className="flex items-center justify-between mb-8">
              <h3 className="font-bold text-zinc-900 text-xl">Doanh thu tuần này</h3>
              <select className="bg-white border border-zinc-200 rounded-lg px-3 py-1 text-sm outline-none">
                <option>7 ngày qua</option>
                <option>30 ngày qua</option>
              </select>
            </div>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={salesData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#71717a', fontSize: 12 }}
                    dy={10}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#71717a', fontSize: 12 }}
                  />
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#2563eb" 
                    strokeWidth={3} 
                    dot={{ r: 4, fill: '#2563eb', strokeWidth: 2, stroke: '#fff' }}
                    activeDot={{ r: 6, strokeWidth: 0 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Category Distribution */}
          <div className="bg-zinc-50 p-8 rounded-3xl border border-zinc-100">
            <h3 className="font-bold text-zinc-900 text-xl mb-8">Cơ cấu ngành hàng</h3>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categoryData} layout="vertical" margin={{ left: 20 }}>
                  <XAxis type="number" hide />
                  <YAxis 
                    dataKey="name" 
                    type="category" 
                    axisLine={false} 
                    tickLine={false}
                    tick={{ fill: '#71717a', fontSize: 12 }}
                  />
                  <Tooltip 
                    cursor={{ fill: 'transparent' }}
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  />
                  <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={20}>
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
