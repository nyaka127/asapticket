'use client';

import React, { createContext, useContext, ReactNode } from 'react';
import { LanguageCode, UI_TRANSLATIONS } from '@/lib/translations';

interface TranslationContextType {
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  t: (key: string) => string;
}

const TranslationContext = createContext<TranslationContextType | undefined>(undefined);

export function TranslationProvider({ children }: { children: ReactNode }) {
  // Hardcoded to English per request "just keep it english"
  const language: LanguageCode = 'en';

  const setLanguage = (lang: LanguageCode) => {
    console.warn("Language changing disabled: App is locked to English mode.");
  };

  const t = (key: string): string => {
    return UI_TRANSLATIONS[key]?.[language] || UI_TRANSLATIONS[key]?.['en'] || key;
  };

  return (
    <TranslationContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </TranslationContext.Provider>
  );
}

export function useTranslation() {
  const context = useContext(TranslationContext);
  if (context === undefined) {
    throw new Error('useTranslation must be used within a TranslationProvider');
  }
  return context;
}
