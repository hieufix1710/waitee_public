'use client';

import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Check, 
  Minus, 
  ChevronDown, 
  Mail,
  Zap,
  Shield,
  Star,
  Users
} from 'lucide-react';
import Link from 'next/link';
import { CYCLE_LABEL, PRICING_COMPARISON_ROWS, type BillingCycle } from '@/lib/pricing/plans';
import { usePricingPlans } from '@/hooks/usePricingPlans';
import { useRouter } from 'next/router';

const faqs = [
  {
    q: "Tôi có thể sử dụng WaiteeRetail miễn phí không?",
    a: "Có, chúng tôi cung cấp gói Free trọn đời cho các cửa hàng nhỏ với quy mô dưới 100 sản phẩm và 1 nhân viên. Bạn có thể bắt đầu ngay mà không cần thẻ tín dụng."
  },
  {
    q: "Tôi có thể chuyển dữ liệu từ hệ thống POS hiện tại sang hệ thống mới được không?",
    a: "Hoàn toàn được. WaiteeRetail hỗ trợ nhập dữ liệu từ file Excel. Đội ngũ kỹ thuật của chúng tôi cũng sẵn sàng hỗ trợ bạn chuyển đổi dữ liệu từ các phần mềm phổ biến khác."
  },
  {
    q: "Có yêu cầu phần cứng cụ thể nào không?",
    a: "WaiteeRetail hoạt động trên nền tảng đám mây, vì vậy bạn chỉ cần một thiết bị có kết nối internet (Máy tính, Máy tính bảng, Điện thoại). Chúng tôi cũng tương thích với hầu hết các loại máy in hóa đơn và máy quét mã vạch phổ biến."
  },
  {
    q: "Điều gì sẽ xảy ra khi tôi đạt đến giới hạn gói cước?",
    a: "Hệ thống sẽ thông báo cho bạn khi sắp đạt giới hạn. Bạn có thể nâng cấp gói cước bất cứ lúc nào để tiếp tục sử dụng không gián đoạn. Dữ liệu của bạn sẽ luôn được giữ an toàn."
  },
  {
    q: "Chính sách hủy đặt phòng của bạn là gì?",
    a: "Bạn có thể hủy gói cước trả phí bất cứ lúc nào. Sau khi hủy, bạn vẫn có thể sử dụng các tính năng trả phí cho đến hết thời hạn đã thanh toán. Chúng tôi không hoàn lại tiền cho khoảng thời gian chưa sử dụng."
  }
];

export default function PricingPage() {
  const [billingCycle, setBillingCycle] = useState<BillingCycle>('monthly');
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const { plansByCycle } = usePricingPlans();
  const plans = plansByCycle[billingCycle];

  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      
      {/* Header */}
      <section className="pt-40 pb-24 bg-zinc-900 text-white text-center relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full text-xs font-bold tracking-widest uppercase mb-8 border border-white/10"
          >
            <Star className="w-4 h-4 text-blue-400" />
            <span>BẢNG GIÁ MINH BẠCH</span>
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-black tracking-tighter mb-8 leading-[1.1]"
          >
            Giải pháp phù hợp cho <br className="hidden md:block" /> <span className="text-blue-500">mọi quy mô</span> cửa hàng
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-zinc-400 max-w-2xl mx-auto leading-relaxed"
          >
            Bắt đầu miễn phí và mở rộng quy mô khi bạn phát triển. Không có phí ẩn, không cần thẻ tín dụng, hỗ trợ tận tâm 24/7.
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
            <p className="text-zinc-500 mb-6 font-medium">Hãy chọn gói dịch vụ phù hợp với doanh nghiệp của bạn. Bắt đầu với gói miễn phí và nâng cấp bất cứ lúc nào.</p>
            <div className="flex items-center bg-zinc-100 p-1 rounded-xl">
              <button 
                onClick={() => setBillingCycle('monthly')}
                className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${billingCycle === 'monthly' ? 'bg-zinc-900 text-white shadow-lg' : 'text-zinc-600 hover:text-zinc-900'}`}
              >
                Hàng tháng
              </button>
              <button 
                onClick={() => setBillingCycle('yearly')}
                className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${billingCycle === 'yearly' ? 'bg-zinc-900 text-white shadow-lg' : 'text-zinc-600 hover:text-zinc-900'}`}
              >
                Hàng năm
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {plans.map((plan, i) => (
              <motion.div 
                key={plan.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className={`relative flex flex-col p-10 rounded-[32px] border ${plan.popular ? 'border-blue-600 ring-8 ring-blue-50 shadow-2xl shadow-blue-900/10' : 'border-zinc-100 shadow-sm'} bg-white hover:border-zinc-200 transition-all duration-300`}
              >
                {plan.tag && (
                  <div className={`absolute -top-4 left-1/2 -translate-x-1/2 px-5 py-1.5 rounded-full text-[10px] font-black tracking-[0.2em] uppercase ${plan.name === 'Free' ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-600 text-white shadow-lg shadow-blue-200'}`}>
                    {plan.tag}
                  </div>
                )}
                
                <div className="mb-10">
                  <h3 className="text-3xl font-black text-zinc-900 mb-3 tracking-tighter">{plan.name}</h3>
                  <p className="text-sm text-zinc-500 leading-relaxed">{plan.description}</p>
                </div>

                <div className="mb-10">
                  <div className="flex items-baseline gap-1">
                    <span className="text-5xl font-black text-zinc-900 tracking-tighter">
                      {plan.price === 0 ? '0' : plan.price.toLocaleString('vi-VN')}
                      {plan.price !== 0 && <span className="text-xl font-bold ml-1">đ</span>}
                    </span>
                    {plan.price !== 0 && (
                      <span className="text-zinc-400 font-bold text-sm uppercase tracking-widest ml-1">/{CYCLE_LABEL[plan.billingCycle]}</span>
                    )}
                  </div>
                  <p className="mt-2 text-xs text-zinc-500 uppercase tracking-wider">Thanh toán theo {CYCLE_LABEL[plan.billingCycle]}</p>
                </div>

                <a href='/signup' className={`w-full px-3 py-4 text-center rounded-2xl font-bold text-sm mb-10 transition-all ${plan.popular ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-xl shadow-blue-200' : plan.name === 'Free' ? 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-xl shadow-emerald-200' : 'bg-zinc-900 text-white hover:bg-zinc-800'}`}>
                  {plan.cta}
                </a>

                <div className="space-y-5 mt-auto">
                  <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-2">Tính năng bao gồm:</p>
                  {plan.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center ${plan.name === 'Free' ? 'bg-emerald-50 text-emerald-600' : 'bg-blue-50 text-blue-600'}`}>
                        <Check className="w-3 h-3" />
                      </div>
                      <span className="text-sm text-zinc-600 font-bold">{feature}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex items-start gap-4 p-6 rounded-2xl bg-zinc-50 border border-zinc-100">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center shrink-0">
                <Shield className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h4 className="font-bold text-zinc-900 mb-1">Bảo mật tuyệt đối</h4>
                <p className="text-sm text-zinc-500">Dữ liệu của bạn được mã hóa và lưu trữ trên máy chủ an toàn nhất.</p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-6 rounded-2xl bg-zinc-50 border border-zinc-100">
              <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center shrink-0">
                <Zap className="w-6 h-6 text-emerald-600" />
              </div>
              <div>
                <h4 className="font-bold text-zinc-900 mb-1">Hoàn tiền 100%</h4>
                <p className="text-sm text-zinc-500">Hoàn tiền trong 30 ngày nếu bạn không hài lòng với dịch vụ.</p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-6 rounded-2xl bg-zinc-50 border border-zinc-100">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center shrink-0">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h4 className="font-bold text-zinc-900 mb-1">Hỗ trợ tận tâm</h4>
                <p className="text-sm text-zinc-500">Đội ngũ kỹ thuật hỗ trợ 24/7 qua chat, email và điện thoại.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trial Callout */}
      <section className="py-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-zinc-50 border border-zinc-200 rounded-[2.5rem] p-12 text-center">
            <h2 className="text-2xl font-black text-zinc-900 mb-4">Chưa chắc chắn? Hãy trải nghiệm trước!</h2>
            <p className="text-zinc-600 mb-8 max-w-2xl mx-auto">
              Tất cả các gói trả phí đều có 14 ngày dùng thử miễn phí với đầy đủ tính năng. Hoặc bắt đầu với gói Miễn phí — không giới hạn thời gian, nâng cấp khi bạn sẵn sàng.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a className="px-8 py-4 bg-emerald-600 text-white rounded-2xl font-bold hover:bg-emerald-700 transition-all w-full sm:w-auto" href="/pricing">
                Dùng miễn phí ngay
              </a>
              <a className="px-8 py-4 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 transition-all w-full sm:w-auto" href="/pricing">
                Dùng thử 14 ngày gói cơ bản
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-black text-zinc-900 mb-4">So sánh tất cả các gói dịch vụ</h2>
            <p className="text-zinc-500">Xem bảng phân tích chi tiết các tính năng của từng gói dịch vụ.</p>
          </div>

          <div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0">
            <table className="w-full border-collapse min-w-[800px]">
              <thead>
                <tr className="border-b border-zinc-100">
                  <th className="py-8 px-4 text-left font-bold text-zinc-400 text-xs uppercase tracking-widest">Tính năng</th>
                  <th className="py-8 px-4 text-center font-bold text-emerald-600 text-xs uppercase tracking-widest">Free</th>
                  <th className="py-8 px-4 text-center font-bold text-blue-600 text-xs uppercase tracking-widest">Gói cơ bản</th>
                </tr>
              </thead>
              <tbody>
                {PRICING_COMPARISON_ROWS.map((row, i) => (
                  <tr key={i} className="border-b border-zinc-50 hover:bg-zinc-50/50 transition-colors">
                    <td className="py-6 px-4 text-zinc-700 font-bold text-sm">{row.feature}</td>
                    <td className="py-6 px-4 text-center text-zinc-600 text-sm">
                      {typeof row.free === 'boolean' ? (row.free ? <Check className="w-5 h-5 text-emerald-500 mx-auto" /> : <Minus className="w-5 h-5 text-zinc-200 mx-auto" />) : row.free}
                    </td>
                    <td className="py-6 px-4 text-center text-zinc-600 text-sm">
                      {typeof row.basic === 'boolean' ? (row.basic ? <Check className="w-5 h-5 text-blue-500 mx-auto" /> : <Minus className="w-5 h-5 text-zinc-200 mx-auto" />) : row.basic}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="mt-12 text-center">
            <button className="px-8 py-4 bg-emerald-600 text-white rounded-2xl font-bold hover:bg-emerald-700 transition-all">
              Bắt đầu miễn phí — Không cần thẻ
            </button>
          </div>
        </div>
      </section>

      {/* Guide Section */}
      <section className="py-24 bg-zinc-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-black text-zinc-900 mb-6">Chọn gói POS phù hợp theo giai đoạn phát triển cửa hàng</h2>
          <p className="text-zinc-600 mb-12 leading-relaxed">
            WaiteeRetail hiện cung cấp hai lựa chọn chính: Free để bắt đầu vận hành và Gói cơ bản cho nhu cầu mở rộng. Bạn có thể chọn chu kỳ thanh toán theo tháng hoặc theo năm phù hợp kế hoạch tài chính.
          </p>
          <div className="text-left space-y-6 max-w-2xl mx-auto">
            <div className="flex gap-4">
              <div className="w-1.5 h-1.5 bg-zinc-400 rounded-full mt-2 shrink-0" />
              <p className="text-zinc-600">Gói Free phù hợp cửa hàng mới cần xác thực mô hình và vận hành bán hàng cơ bản hằng ngày.</p>
            </div>
            <div className="flex gap-4">
              <div className="w-1.5 h-1.5 bg-zinc-400 rounded-full mt-2 shrink-0" />
              <p className="text-zinc-600">Gói cơ bản phù hợp cửa hàng đang hoạt động ổn định, cần thêm báo cáo chi tiết và hỗ trợ vận hành nâng cao.</p>
            </div>
            <div className="flex gap-4">
              <div className="w-1.5 h-1.5 bg-zinc-400 rounded-full mt-2 shrink-0" />
              <p className="text-zinc-600">Khi cần thông tin tính năng mới hoặc gói mở rộng, đội ngũ WaiteeRetail sẽ cập nhật trực tiếp trong ứng dụng và kênh hỗ trợ.</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="font-manrope text-[32px] md:text-[44px] font-black text-zinc-900 mb-6 tracking-tighter">
              Câu hỏi thường gặp
            </h2>
            <p className="text-zinc-500 text-lg max-w-2xl mx-auto leading-relaxed">
              Mọi thứ bạn cần biết về chính sách giá và thanh toán của WaiteeRetail.
            </p>
          </div>

          <div className="grid gap-4">
            {faqs.map((faq, i) => (
              <div 
                key={i} 
                className={`rounded-[24px] border transition-all duration-300 ${openFaq === i ? 'bg-zinc-50 border-zinc-200 shadow-sm' : 'bg-white border-zinc-100 hover:border-zinc-200'}`}
              >
                <button 
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full px-8 py-7 flex items-center justify-between text-left transition-colors"
                >
                  <span className={`text-lg font-bold transition-colors ${openFaq === i ? 'text-blue-600' : 'text-zinc-900'}`}>{faq.q}</span>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${openFaq === i ? 'bg-blue-600 text-white rotate-180' : 'bg-zinc-100 text-zinc-400'}`}>
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>
                <AnimatePresence>
                  {openFaq === i && (
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
          
          <div className="mt-16 text-center">
            <p className="text-zinc-500 mb-4">Bạn vẫn còn thắc mắc?</p>
            <Link href="/about-us" className="inline-flex items-center gap-2 text-blue-600 font-bold hover:underline">
              <Mail className="w-4 h-4" />
              Liên hệ với đội ngũ hỗ trợ của chúng tôi
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
