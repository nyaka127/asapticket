'use client';
import React, { useState, useEffect } from 'react';
import { SUPPORTED_CURRENCIES, DEFAULT_CURRENCY } from '@/lib/currencies';
import { useTranslation } from './TranslationProvider';

export function CurrencySwitcher() {
  const { t } = useTranslation();
  const [currency, setCurrency] = useState('USD');
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('user-currency');
    if (saved) setCurrency(saved);
  }, []);

  const handleSelect = (code: string) => {
    setCurrency(code);
    localStorage.setItem('user-currency', code);
    setOpen(false);
    window.location.reload(); 
  };

  const current = SUPPORTED_CURRENCIES.find(c => c.code === currency) || DEFAULT_CURRENCY;

  return (
    <div className="relative inline-block text-left">
      <button onClick={() => setOpen(!open)} className="flex items-center gap-3 bg-white/5 border border-white/10 px-6 py-2.5 rounded-xl hover:bg-white/10 transition-all group">
        <span className="text-white/40 text-[9px] font-black uppercase tracking-widest group-hover:text-white/60">{t('currency_label')}</span>
        <span className="text-white font-black text-sm uppercase tracking-tighter">{current.code} ({current.symbol})</span>
      </button>

      {open && (
        <div className="absolute right-0 mt-3 w-64 bg-slate-900 border border-white/10 rounded-[2rem] shadow-[0_40px_100px_rgba(0,0,0,0.5)] z-[200] overflow-hidden animate-in fade-in slide-in-from-top-4 duration-500 p-2">
          <div className="grid grid-cols-1 gap-1">
            {SUPPORTED_CURRENCIES.map(c => (
              <button key={c.code} onClick={() => handleSelect(c.code)}
                className={`w-full flex items-center gap-4 px-6 py-4 hover:bg-white/10 rounded-2xl transition-all ${c.code === currency ? 'bg-white/10' : ''}`}>
                <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center font-black text-xs text-brand-secondary">{c.symbol}</div>
                <div className="flex flex-col">
                  <span className="text-white font-black text-[10px] uppercase tracking-widest leading-none">{c.name}</span>
                  <span className="text-white/40 text-[9px] font-bold uppercase tracking-tighter mt-1">{c.code}</span>
                </div>
                {c.code === currency && <span className="ml-auto text-emerald-500">✓</span>}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
