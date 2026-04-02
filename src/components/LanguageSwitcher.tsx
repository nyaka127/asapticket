'use client';
import React, { useState } from 'react';
import { useTranslation } from './TranslationProvider';
import { LanguageCode } from '@/lib/translations';

export const SUPPORTED_LANGUAGES: { code: LanguageCode; name: string; flag: string }[] = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'sw', name: 'Kiswahili', flag: '🇰🇪' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'ar', name: 'العربية', flag: '🇦🇪' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'zh', name: '中文', flag: '🇨🇳' },
  { code: 'hi', name: 'हिन्दी', flag: '🇮🇳' },
  { code: 'pt', name: 'Português', flag: '🇵🇹' },
  { code: 'ru', name: 'Русский', flag: '🇷🇺' },
  { code: 'ja', name: '日本語', flag: '🇯🇵' },
];

export function LanguageSwitcher() {
  const { language, setLanguage } = useTranslation();
  const [open, setOpen] = useState(false);

  const handleSelect = (code: LanguageCode) => {
    setLanguage(code);
    setOpen(false);
  };

  const current = SUPPORTED_LANGUAGES.find(l => l.code === language) || SUPPORTED_LANGUAGES[0];

  return (
    <div className="relative inline-block text-left">
      <button onClick={() => setOpen(!open)} className="flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2 rounded-xl hover:bg-white/10 transition-all">
        <span className="text-sm">{current.flag}</span>
        <span className="text-white font-black text-[10px] uppercase tracking-widest">{current.name}</span>
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-[190]" onClick={() => setOpen(false)}></div>
          <div className="absolute right-0 mt-2 w-48 bg-slate-800 border border-white/10 rounded-2xl shadow-2xl z-[200] overflow-hidden animate-in fade-in slide-in-from-top-2">
            {SUPPORTED_LANGUAGES.map(l => (
              <button key={l.code} onClick={() => handleSelect(l.code)}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/10 text-left transition-all">
                <span className="text-sm">{l.flag}</span>
                <span className="text-white font-black text-[10px] uppercase tracking-widest">{l.name}</span>
                {l.code === language && <span className="ml-auto text-emerald-400">✓</span>}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
