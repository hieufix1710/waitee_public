'use client';

import BrandLogo from '@/components/BrandLogo';
import Link from 'next/link';
import { Twitter, Github, Linkedin, Facebook } from 'lucide-react';
import { useLanguage } from '@/lib/i18n/LanguageContext';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const { t } = useLanguage();

  const footerLinks = [
    {
      title: t.footer.product,
      links: [
        // { name: t.footer.features, href: '/features' },
        // { name: t.footer.solutions, href: '/solutions' },
        { name: t.footer.pricing, href: '/pricing' },
        // { name: t.footer.updates, href: '/updates' },
      ],
    },
    {
      title: t.footer.company,
      links: [
        { name: t.footer.about, href: '/about-us' },
        { name: t.footer.contact, href: '/contact' },
      ],
    },
    {
      title: t.footer.resources,
      links: [
        // { name: t.footer.documentation, href: '/documentation' },
        { name: t.footer.support, href: '/support' },
      ],
    },
    {
      title: t.footer.legal,
      links: [
        { name: t.footer.privacy, href: '/privacy' },
        { name: t.footer.terms, href: '/terms' },
      ],
    },
  ];

  return (
    <footer className="bg-[#0a0f1a] text-white pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-12 mb-20">
          <div className="col-span-2 md:col-span-4 lg:col-span-2">
            <div className="flex items-center gap-2 mb-8">
              <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-sm">
                <BrandLogo className="h-10 w-10 object-contain" />
              </div>
              <span className="font-manrope text-2xl font-bold tracking-tight">
                Waitee<span className="text-blue-500">Retail</span>
              </span>
            </div>
            <p className="text-zinc-400 text-base leading-relaxed mb-8 max-w-sm">
              {t.footer.description}
            </p>
            <div className="flex gap-4">
              {[Twitter, Facebook, Linkedin, Github].map((Icon, i) => (
                <Link key={i} href="#" className="w-11 h-11 rounded-xl border border-white/10 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-white/5 hover:border-white/20 transition-all">
                  <Icon className="w-5 h-5" />
                </Link>
              ))}
            </div>
          </div>

          {footerLinks.map((section) => (
            <div key={section.title} className="col-span-1">
              <h4 className="font-bold text-white mb-8 text-xs uppercase tracking-[0.2em] opacity-50">
                {section.title}
              </h4>
              <ul className="space-y-4">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-zinc-400 hover:text-blue-500 text-sm transition-colors font-medium"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-zinc-500 text-sm">
            {t.footer.copyright_full.replace('{{year}}', currentYear.toString())}
          </p>
          <div className="flex gap-8">
            <Link href="/security" className="text-zinc-500 hover:text-white text-xs">
              {t.footer.security}
            </Link>
            <Link href="/terms" className="text-zinc-500 hover:text-white text-xs">
              {t.footer.terms}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
