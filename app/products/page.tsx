'use client';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CTA from '@/components/CTA';
import Pricing from '@/components/Pricing';
import { motion } from 'motion/react';
import Link from 'next/link';
import { 
  BarChart3, 
  Package, 
  Users, 
  ShoppingCart, 
  Zap, 
  ShieldCheck, 
  Smartphone, 
  Globe,
  ArrowRight,
  CheckCircle2
} from 'lucide-react';
import Image from 'next/image';

export default function ProductPage() {
  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      
      {/* Product Hero */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-4xl mx-auto"
          >
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-zinc-900 mb-8 leading-[1.1]">
              Giải pháp quản lý <span className="text-blue-600">toàn diện</span> cho mọi cửa hàng
            </h1>
            <p className="text-xl text-zinc-600 mb-10 leading-relaxed max-w-2xl mx-auto">
              WaiteeRetail kết hợp sức mạnh của công nghệ đám mây với giao diện thân thiện, giúp bạn tối ưu hóa quy trình bán hàng và tăng trưởng doanh thu vượt trội.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/signup" className="px-8 py-4 bg-blue-600 text-white rounded-2xl font-bold text-lg hover:bg-blue-700 transition-all shadow-xl shadow-blue-200 w-full sm:w-auto text-center">
                Dùng thử miễn phí
              </Link>
              <Link href="/login" className="px-8 py-4 bg-zinc-100 text-zinc-900 rounded-2xl font-bold text-lg hover:bg-zinc-200 transition-all w-full sm:w-auto text-center">
                Xem bản demo
              </Link>
            </div>
          </motion.div>
        </div>
        {/* Background Accents */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 opacity-30 pointer-events-none">
          <div className="absolute top-20 left-1/4 w-96 h-96 bg-blue-200 rounded-full blur-[120px]" />
          <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-indigo-200 rounded-full blur-[120px]" />
        </div>
      </section>
      {/* Core Modules */}
      <section className="py-32 bg-zinc-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-24">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-xs font-bold tracking-widest uppercase mb-6"
            >
              <Package className="w-4 h-4" />
              <span>HỆ SINH THÁI TOÀN DIỆN</span>
            </motion.div>
            <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-zinc-900 mb-6">Mọi thứ bạn cần để vận hành</h2>
            <p className="text-zinc-500 text-lg max-w-2xl mx-auto">
              WaiteeRetail cung cấp đầy đủ các công cụ cần thiết để bạn quản lý cửa hàng từ A đến Z trên một nền tảng duy nhất.
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: <ShoppingCart className="w-8 h-8 text-blue-600" />,
                title: "Bán hàng (POS)",
                desc: "Giao diện bán hàng nhanh chóng, hỗ trợ quét mã vạch và nhiều phương thức thanh toán."
              },
              {
                icon: <Package className="w-8 h-8 text-blue-600" />,
                title: "Quản lý kho",
                desc: "Theo dõi tồn kho thời gian thực, cảnh báo hàng sắp hết và quản lý nhập xuất kho."
              },
              {
                icon: <Users className="w-8 h-8 text-blue-600" />,
                title: "Khách hàng (CRM)",
                desc: "Lưu trữ thông tin khách hàng, lịch sử mua hàng và chương trình tích điểm thành viên."
              },
              {
                icon: <BarChart3 className="w-8 h-8 text-blue-600" />,
                title: "Báo cáo & Phân tích",
                desc: "Hệ thống báo cáo chi tiết về doanh thu, lợi nhuận và hiệu quả kinh doanh."
              }
            ].map((module, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="group bg-white p-10 rounded-[32px] border border-zinc-200 hover:border-blue-300 hover:shadow-2xl hover:shadow-blue-900/5 transition-all duration-500"
              >
                <div className="mb-8 p-5 bg-blue-50 rounded-2xl w-fit group-hover:scale-110 transition-transform duration-500">
                  {module.icon}
                </div>
                <h3 className="text-2xl font-bold text-zinc-900 mb-4">{module.title}</h3>
                <p className="text-zinc-500 leading-relaxed text-sm">{module.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-24">
            <h2 className="text-blue-600 font-bold tracking-[0.2em] uppercase text-xs mb-4">QUY TRÌNH TRIỂN KHAI</h2>
            <p className="text-4xl md:text-5xl font-black tracking-tighter text-zinc-900">3 bước để bắt đầu kinh doanh hiện đại</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
            {/* Connector Line */}
            <div className="hidden md:block absolute top-[60px] left-[15%] right-[15%] h-px bg-zinc-100 -z-10" />
            
            {[
              {
                step: "01",
                title: "Đăng ký tài khoản",
                desc: "Chỉ mất 30 giây để tạo tài khoản và thiết lập thông tin cửa hàng cơ bản."
              },
              {
                step: "02",
                title: "Nhập dữ liệu",
                desc: "Tải lên danh sách sản phẩm, giá bán và tồn kho từ file Excel một cách nhanh chóng."
              },
              {
                step: "03",
                title: "Bắt đầu bán hàng",
                desc: "Mở giao diện POS và bắt đầu phục vụ khách hàng ngay lập tức trên mọi thiết bị."
              }
            ].map((item, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.2 }}
                className="bg-white p-12 rounded-[40px] border border-zinc-100 text-center relative hover:shadow-xl transition-all duration-500"
              >
                <div className="w-14 h-14 bg-blue-600 text-white rounded-2xl flex items-center justify-center font-bold text-xl shadow-xl shadow-blue-200 mx-auto mb-8">
                  {item.step}
                </div>
                <h3 className="text-2xl font-bold text-zinc-900 mb-4">{item.title}</h3>
                <p className="text-zinc-500 leading-relaxed text-base">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Detailed Features */}
      <section className="py-24 bg-zinc-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-32">
            {/* Feature 1 */}
            <div className="flex flex-col lg:flex-row items-center gap-16">
              <motion.div 
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="flex-1"
              >
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-full text-sm font-bold mb-6">
                  <Zap className="w-4 h-4" />
                  <span>Tốc độ vượt trội</span>
                </div>
                <h2 className="text-4xl font-black tracking-tight text-zinc-900 mb-6 leading-tight">
                  Bán hàng nhanh hơn, phục vụ tốt hơn
                </h2>
                <p className="text-lg text-zinc-600 mb-8 leading-relaxed">
                  Giao diện POS của WaiteeRetail được tối ưu hóa để giảm thiểu thao tác. Nhân viên của bạn có thể hoàn tất một đơn hàng chỉ trong vài giây, ngay cả trong giờ cao điểm.
                </p>
                <ul className="space-y-4">
                  {[
                    "Hỗ trợ phím tắt và màn hình cảm ứng",
                    "Tìm kiếm sản phẩm thông minh",
                    "Xử lý thanh toán đa kênh (QR, Thẻ, Tiền mặt)",
                    "In hóa đơn tự động"
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-zinc-700 font-medium">
                      <CheckCircle2 className="w-5 h-5 text-blue-600" />
                      {item}
                    </li>
                  ))}
                </ul>
              </motion.div>
              <motion.div 
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="flex-1 w-full"
              >
                <div className="rounded-3xl border border-zinc-200 shadow-xl overflow-hidden">
                  <Image 
                    src="https://picsum.photos/seed/pos/800/600" 
                    alt="POS Interface" 
                    width={800} 
                    height={600}
                    className="w-full h-auto"
                    referrerPolicy="no-referrer"
                  />
                </div>
              </motion.div>
            </div>

            {/* Feature 2 */}
            <div className="flex flex-col lg:flex-row-reverse items-center gap-16">
              <motion.div 
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="flex-1"
              >
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-700 rounded-full text-sm font-bold mb-6">
                  <ShieldCheck className="w-4 h-4" />
                  <span>An toàn & Bảo mật</span>
                </div>
                <h2 className="text-4xl font-black tracking-tight text-zinc-900 mb-6 leading-tight">
                  Dữ liệu của bạn luôn được bảo vệ
                </h2>
                <p className="text-lg text-zinc-600 mb-8 leading-relaxed">
                  Chúng tôi sử dụng công nghệ mã hóa hàng đầu để đảm bảo thông tin kinh doanh và dữ liệu khách hàng của bạn luôn an toàn 24/7.
                </p>
                <ul className="space-y-4">
                  {[
                    "Sao lưu dữ liệu tự động hàng ngày",
                    "Phân quyền nhân viên chi tiết",
                    "Lịch sử thao tác hệ thống",
                    "Bảo mật 2 lớp (2FA)"
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-zinc-700 font-medium">
                      <CheckCircle2 className="w-5 h-5 text-indigo-600" />
                      {item}
                    </li>
                  ))}
                </ul>
              </motion.div>
              <motion.div 
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="flex-1 w-full"
              >
                <div className="rounded-3xl border border-zinc-200 shadow-xl overflow-hidden">
                  <Image 
                    src="https://picsum.photos/seed/security/800/600" 
                    alt="Security Features" 
                    width={800} 
                    height={600}
                    className="w-full h-auto"
                    referrerPolicy="no-referrer"
                  />
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Mobile App Section */}
      <section className="py-24 bg-blue-600 overflow-hidden relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="flex-1 text-white">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-8">
                  Quản lý cửa hàng ngay trên điện thoại
                </h2>
                <p className="text-xl text-blue-100 mb-10 leading-relaxed">
                  Ứng dụng WaiteeRetail Mobile giúp bạn theo dõi doanh thu, kiểm kho và quản lý nhân viên mọi lúc, mọi nơi.
                </p>
                <div className="flex flex-wrap gap-4">
                  <div className="bg-black px-6 py-3 rounded-xl flex items-center gap-3 cursor-pointer hover:bg-zinc-900 transition-colors border border-white/10">
                    <Smartphone className="w-6 h-6" />
                    <div className="text-left">
                      <p className="text-[10px] uppercase font-bold opacity-60 text-white/70">Tải về trên</p>
                      <p className="text-sm font-bold">App Store</p>
                    </div>
                  </div>
                  <div className="bg-black px-6 py-3 rounded-xl flex items-center gap-3 cursor-pointer hover:bg-zinc-900 transition-colors border border-white/10">
                    <Globe className="w-6 h-6" />
                    <div className="text-left">
                      <p className="text-[10px] uppercase font-bold opacity-60 text-white/70">Tải về trên</p>
                      <p className="text-sm font-bold">Google Play</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="flex-1 relative"
            >
              <div className="relative z-10 max-w-[300px] mx-auto">
                <Image 
                  src="https://picsum.photos/seed/mobile/600/1200" 
                  alt="Mobile App" 
                  width={600} 
                  height={1200}
                  className="rounded-[3rem] border-8 border-zinc-900 shadow-2xl"
                  referrerPolicy="no-referrer"
                />
              </div>
              {/* Decorative circles */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-500 rounded-full blur-[100px] opacity-50 -z-10" />
            </motion.div>
          </div>
        </div>
      </section>

      <Pricing />
      <CTA />
      <Footer />
    </main>
  );
}
