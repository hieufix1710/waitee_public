'use client';

import { useLanguage } from '@/lib/i18n/LanguageContext';
import { useAuth } from '@/lib/auth';
import BrandLogo from '@/components/BrandLogo';
import { Globe, LogOut, Menu, X } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { affiliateUrl } from '@/utils/constants';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { t, lang, setLang } = useLanguage();
  const { user, isAuthenticated, logout } = useAuth();

  const displayName =
    user?.full_name ||
    [user?.first_name, user?.last_name].filter(Boolean).join(' ') ||
    user?.email ||
    '';
  const initial = displayName.trim().charAt(0).toUpperCase();

  const handleLogout = () => {
    logout();
    setMobileMenuOpen(false);
    router.push('/');
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: t.nav.product, href: '/products' },
    { name: t.nav.pricing, href: '/pricing' },
    { name: t.nav.about, href: '/about-us' },
  ];

  return (
    <nav
      aria-label={t.nav.mainMenu}
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/90 backdrop-blur-md border-b border-zinc-100 py-3'
          : 'bg-transparent py-5'
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
                aria-current={pathname === link.href ? 'page' : undefined}
                className={`text-sm font-medium transition-colors ${
                  pathname === link.href ? 'text-blue-600' : 'text-zinc-600 hover:text-blue-600'
                }`}
              >
                {link.name}
              </Link>
            ))}
            <a
              href={affiliateUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium text-zinc-600 transition-colors hover:text-blue-600"
            >
              {t.nav.affiliate}
            </a>
          </div>

          <div className="flex items-center gap-4 sm:gap-6">
            <button
              type="button"
              onClick={() => setLang(lang === 'vi' ? 'en' : 'vi')}
              aria-label={t.nav.switchLanguage}
              title={t.nav.switchLanguage}
              className="hidden sm:flex items-center gap-2 px-3 py-1.5 border border-zinc-200 rounded-full cursor-pointer hover:bg-zinc-50 transition-colors"
            >
              <Globe className="w-4 h-4 text-zinc-500" />
              <span className="text-xs font-bold text-zinc-700">{lang.toUpperCase()}</span>
            </button>
            {isAuthenticated ? (
              <div className="hidden sm:flex items-center gap-3">
                <Link
                  href="/dashboard"
                  className="flex items-center gap-2 rounded-full border border-zinc-200 py-1 pl-1 pr-3 transition-colors hover:bg-zinc-50"
                >
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">
                    {initial}
                  </span>
                  <span className="max-w-[160px] truncate text-sm font-bold text-zinc-700">
                    {displayName}
                  </span>
                </Link>
                <button
                  type="button"
                  onClick={handleLogout}
                  title={t.common.logout}
                  aria-label={t.common.logout}
                  className="p-2 text-zinc-500 transition-colors hover:text-blue-600"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <>
                <Link
                  href="/login"
                  className="hidden sm:block text-sm font-bold text-zinc-700 transition-colors hover:text-blue-600"
                >
                  {t.nav.login}
                </Link>
                <Link
                  href="/onboard"
                  className="bg-blue-600 text-white px-4 sm:px-6 py-2.5 rounded-2xl text-sm font-bold transition-colors shadow-sm whitespace-nowrap inline-flex items-center gap-2 hover:bg-blue-700"
                >
                  {t.nav.start}
                </Link>
              </>
            )}

            {/* Mobile Menu Toggle */}
            <button
              className="md:hidden p-2 text-zinc-600 hover:text-blue-600 transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? t.nav.closeMenu : t.nav.openMenu}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div
          id="mobile-menu"
          className="md:hidden bg-white border-b border-zinc-100 py-6 px-4 space-y-4 animate-in slide-in-from-top duration-300"
        >
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              aria-current={pathname === link.href ? 'page' : undefined}
              className={`block text-base font-medium transition-colors ${
                pathname === link.href ? 'text-blue-600' : 'text-zinc-600 hover:text-blue-600'
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              {link.name}
            </Link>
          ))}
          <a
            href={affiliateUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="block text-base font-medium text-zinc-600 transition-colors hover:text-blue-600"
            onClick={() => setMobileMenuOpen(false)}
          >
            {t.nav.affiliate}
          </a>
          {isAuthenticated ? (
            <>
              <Link
                href="/dashboard"
                className="flex items-center gap-3 rounded-xl border border-zinc-200 px-4 py-3"
                onClick={() => setMobileMenuOpen(false)}
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white">
                  {initial}
                </span>
                <span className="min-w-0">
                  <span className="block truncate text-base font-bold text-zinc-800">
                    {displayName}
                  </span>
                  <span className="block text-xs text-zinc-500">{t.dashboard.storeInfo}</span>
                </span>
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-zinc-200 px-4 py-3 text-base font-bold text-zinc-700 transition-colors hover:bg-zinc-50"
              >
                <LogOut className="h-4 w-4" />
                {t.common.logout}
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="block text-base font-medium text-zinc-600 transition-colors hover:text-blue-600"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t.nav.login}
              </Link>
              <Link
                href="/onboard"
                className="block rounded-xl bg-blue-600 px-4 py-3 text-center text-base font-bold text-white transition-colors hover:bg-blue-700"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t.nav.start}
              </Link>
            </>
          )}
          <div className="pt-4 border-t border-zinc-100 flex flex-col gap-4">
            <div>
              <button
                type="button"
                onClick={() => {
                  setLang(lang === 'vi' ? 'en' : 'vi');
                  setMobileMenuOpen(false);
                }}
                className="flex items-center gap-2 text-base font-bold text-zinc-700 cursor-pointer"
              >
                <Globe className="w-5 h-5 text-zinc-500" />
                <span>{lang === 'vi' ? 'English' : 'Tiếng Việt'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
