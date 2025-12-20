'use client';

import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

type LanguageContextType = {
  language: string;
  setLanguage: (language: string) => void;
  isInitial: boolean;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState('de');
  const [isInitial, setIsInitial] = useState(true);

  useEffect(() => {
    // Toujours utiliser l'allemand par défaut, sauf si l'utilisateur a explicitement choisi une autre langue
    const storedLang = localStorage.getItem('ezcentials-lang');
    if (storedLang && ['de', 'fr', 'en'].includes(storedLang)) {
      setLanguageState(storedLang);
    } else {
      // L'allemand est toujours la langue par défaut pour ce site
      setLanguageState('de');
    }
    setIsInitial(false);
  }, []);

  const setLanguage = (lang: string) => {
    if (['de', 'fr', 'en'].includes(lang)) {
        setLanguageState(lang);
        localStorage.setItem('ezcentials-lang', lang);
    }
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
