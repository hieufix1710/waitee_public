'use client';

import { useLanguage } from '@/lib/i18n/LanguageContext';
import BrandLogo from '@/components/BrandLogo';
import { Globe, Loader2, Menu, X } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { MouseEvent, useEffect, useState } from 'react';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isStarting, setIsStarting] = useState(false);
  const pathname = usePathname();
  const { t, lang, setLang } = useLanguage();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleStartClick = (event: MouseEvent<HTMLAnchorElement>) => {
    if (pathname === '/signup' || isStarting) {
      event.preventDefault();
      return;
    }
    setIsStarting(true);
  };

  const navLinks = [
    { name: t.nav.product, href: '/products' },
    { name: t.nav.pricing, href: '/pricing' },
    { name: t.nav.about, href: '/about-us' },
  ];

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled ? 'bg-white/90 backdrop-blur-md border-b border-zinc-100 py-3' : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-sm">
              <BrandLogo size={40} className="object-contain" />
            </div>
            <span className="font-manrope text-xl font-bold tracking-tight text-[#1a1a1a]">
              Waitee<span className="text-blue-600">Retail</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link 
                key={link.name}
                href={link.href} 
                className={`text-sm font-medium transition-colors ${
                  pathname === link.href 
                    ? 'text-blue-600' 
                    : 'text-zinc-600 hover:text-blue-600'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-4 sm:gap-6">
            <div 
              onClick={() => setLang(lang === 'vi' ? 'en' : 'vi')}
              className="hidden sm:flex items-center gap-2 px-3 py-1.5 border border-zinc-200 rounded-full cursor-pointer hover:bg-zinc-50 transition-colors"
            >
              <Globe className="w-4 h-4 text-zinc-500" />
              <span className="text-xs font-bold text-zinc-700">{lang.toUpperCase()}</span>
            </div>
            {/* <Link href="/login" className="hidden sm:block text-sm font-bold text-zinc-700 hover:text-blue-600 transition-colors">{t.nav.login}</Link> */}
            <Link
              href="/signup"
              onClick={handleStartClick}
              aria-disabled={isStarting}
              className={`bg-blue-600 text-white px-4 sm:px-6 py-2.5 rounded-2xl text-sm font-bold transition-all shadow-sm whitespace-nowrap inline-flex items-center gap-2 ${
                isStarting ? 'cursor-not-allowed pointer-events-none' : 'hover:bg-blue-700'
              }`}
            >
              {t.nav.start}
              {isStarting && <Loader2 className="w-4 h-4 animate-spin" />}
            </Link>
            
            {/* Mobile Menu Toggle */}
            <button 
              className="md:hidden p-2 text-zinc-600 hover:text-blue-600 transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-zinc-100 py-6 px-4 space-y-4 animate-in slide-in-from-top duration-300">
          {navLinks.map((link) => (
            <Link 
              key={link.name}
              href={link.href} 
              className={`block text-base font-medium transition-colors ${
                pathname === link.href 
                  ? 'text-blue-600' 
                  : 'text-zinc-600 hover:text-blue-600'
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              {link.name}
            </Link>
          ))}
          <div className="pt-4 border-t border-zinc-100 flex flex-col gap-4">
            <div 
              onClick={() => {
                setLang(lang === 'vi' ? 'en' : 'vi');
                setMobileMenuOpen(false);
              }}
              className="flex items-center gap-2 text-base font-bold text-zinc-700 cursor-pointer"
            >
              <Globe className="w-5 h-5 text-zinc-500" />
              <span>{lang === 'vi' ? 'English' : 'Tiếng Việt'}</span>
            </div>
            {/* <Link href="/login" className="text-base font-bold text-zinc-700 hover:text-blue-600 transition-colors" onClick={() => setMobileMenuOpen(false)}>{t.nav.login}</Link> */}
          </div>
        </div>
      )}
    </nav>
  );
}
