'use client';

import { useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';

export function DynamicLang() {
  const { language } = useLanguage();

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.lang = language;
    }
  }, [language]);

  return null;
}







































