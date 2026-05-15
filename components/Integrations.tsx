'use client';

import { motion } from 'motion/react';
import Image from 'next/image';

const partners = [
  { name: 'Stripe', logo: 'https://picsum.photos/seed/stripe/200/100' },
  { name: 'PayPal', logo: 'https://picsum.photos/seed/paypal/200/100' },
  { name: 'Giao Hàng Nhanh', logo: 'https://picsum.photos/seed/ghn/200/100' },
  { name: 'Giao Hàng Tiết Kiệm', logo: 'https://picsum.photos/seed/ghtk/200/100' },
  { name: 'Momo', logo: 'https://picsum.photos/seed/momo/200/100' },
  { name: 'VNPay', logo: 'https://picsum.photos/seed/vnpay/200/100' },
];

export default function Integrations() {
  return (
    <section className="py-20 bg-white border-t border-zinc-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <p className="text-zinc-500 font-medium uppercase tracking-widest text-xs mb-8">
            Kết nối với các đối tác hàng đầu
          </p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 items-center opacity-50 hover:opacity-100 transition-opacity">
          {partners.map((partner, index) => (
            <motion.div
              key={partner.name}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="flex justify-center relative h-10 w-full"
            >
              <Image
                src={partner.logo}
                alt={partner.name}
                fill
                className="object-contain grayscale hover:grayscale-0 transition-all cursor-pointer"
                referrerPolicy="no-referrer"
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
