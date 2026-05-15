'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { en } from './en';
import { vi } from './vi';

export type Language = 'vi' | 'en';
export type Dictionary = typeof vi;

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: Dictionary;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
  const [lang, setLangState] = useState<Language>('vi');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const storedLang = localStorage.getItem('lang') as Language;
    if (storedLang && (storedLang === 'vi' || storedLang === 'en')) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLangState(storedLang);
    }
    setMounted(true);
  }, []);

  const setLang = (newLang: Language) => {
    setLangState(newLang);
    localStorage.setItem('lang', newLang);
  };

  const t = lang === 'vi' ? vi : en;

  if (!mounted) {
    return (
      <LanguageContext.Provider value={{ lang: 'vi', setLang, t: vi }}>
        {children}
      </LanguageContext.Provider>
    );
  }

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
