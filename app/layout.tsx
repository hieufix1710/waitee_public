import type {Metadata, Viewport} from 'next';
import { Inter, Manrope } from 'next/font/google';
// @ts-ignore - noinspection ES6UnusedImports
import './globals.css';

import ChatButton from '@/components/ChatButton';
import { LanguageProvider } from '@/lib/i18n/LanguageContext';
import { AuthProvider } from '@/lib/auth/AuthContext';
import Providers from './providers';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

const manrope = Manrope({
  subsets: ['latin'],
  variable: '--font-manrope',
});

export const metadata: Metadata = {
  title: 'WaiteeRetail - Modern POS & Inventory Management',
  description: 'WaiteeRetail là nền tảng quản lý bán hàng và kho bãi hiện đại cho các doanh nghiệp bán lẻ.',
  manifest: '/manifest.webmanifest',
  icons: {
    icon: [{url: '/favicon.ico'}],
    apple: [{url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png'}],
    shortcut: [{url: '/favicon.ico'}],
  },
  appleWebApp: {
    capable: true,
    title: 'WaiteeRetail',
    statusBarStyle: 'default',
  },
  applicationName: 'WaiteeRetail',
};

export const viewport: Viewport = {
  themeColor: '#ffffff',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="vi" className={`${inter.variable} ${manrope.variable}`}>
      <body suppressHydrationWarning className="font-manrope antialiased text-zinc-900 bg-white">
        <LanguageProvider>
          <AuthProvider>
          <Providers>
            {children}
            <ChatButton />
          </Providers>
          </AuthProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
