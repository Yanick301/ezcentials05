'use client';

import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

type LanguageContextType = {
  language: string;
  setLanguage: (language: string) => void;
  isInitial: boolean;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language] = useState('de');
  const [isInitial, setIsInitial] = useState(true);

  useEffect(() => {
    // Le site est désormais exclusivement en allemand
    localStorage.setItem('ezcentials-lang', 'de');
    setIsInitial(false);
  }, []);

  const setLanguage = (lang: string) => {
    // No-op car l'allemand est la seule langue
    console.log('Language switching is disabled, site is German-only.');
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, isInitial }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
