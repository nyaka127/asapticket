'use client';
import React, { useEffect } from 'react';

export function CurrencySwitcher() {
  // Hardcoded to enforce USD globally per user requirement
  useEffect(() => {
    localStorage.setItem('user-currency', 'USD');
  }, []);

  return (
    <div className="relative inline-block text-left opacity-80">
      <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-6 py-3 rounded-full">
        <span className="text-white/60 text-[10px] font-black uppercase tracking-widest">Global Currency</span>
        <span className="text-white font-black text-sm uppercase tracking-tighter cursor-default">USD ($)</span>
      </div>
    </div>
  );
}
