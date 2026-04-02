'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { CurrencySwitcher } from './CurrencySwitcher';
import { useTranslation } from './TranslationProvider';

import { 
  Plane, 
  Hotel as HotelIcon, 
  Car, 
  Crown, 
  Menu, 
  X,
  ShieldCheck,
  MessageSquare
} from 'lucide-react';

export function GlobalPublicHeader() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { t } = useTranslation();
  const navLinks = [
    { name: t('flights_tab'), href: '/flights', icon: <Plane className="w-4 h-4" /> },
    { name: t('hotels_tab'), href: '/hotels', icon: <HotelIcon className="w-4 h-4" /> },
    { name: t('cars_tab'), href: '/cars', icon: <Car className="w-4 h-4" /> },
    { name: t('expert_trips_tab'), href: '/expert', icon: <Crown className="w-4 h-4" /> },
  ];

  return (
    <nav className="w-full bg-slate-900 border-b border-white/5 py-4 px-6 sticky top-0 z-[100] backdrop-blur-xl bg-slate-900/90">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo — ASAP TICKETS */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 bg-brand-secondary rounded-xl flex items-center justify-center font-black text-brand-primary text-[10px] shadow-lg group-hover:rotate-12 transition-transform leading-none text-center shadow-brand-secondary/20">
            ASAP
          </div>
          <div className="flex flex-col leading-none">
            <span className="text-[20px] font-black text-white italic tracking-tighter uppercase leading-none">
              ASAP <span className="text-brand-secondary">WHOLESALE</span>
            </span>
            <span className="text-[9px] font-bold text-white/30 uppercase tracking-[0.25em] mt-1">Ticketing Authority</span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-1 bg-white/5 p-1 rounded-2xl border border-white/10">
          {navLinks.map(link => {
            const isActive = pathname.startsWith(link.href);
            return (
              <Link key={link.href} href={link.href}
                className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-1.5 ${isActive ? 'bg-white text-slate-900 shadow-xl' : 'text-white/60 hover:text-white hover:bg-white/5'}`}>
                <span className="text-sm">{link.icon}</span>
                {link.name}
              </Link>
            );
          })}
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden lg:flex items-center gap-3 border-x border-white/10 px-6 mx-4">
             <CurrencySwitcher />
          </div>

          <div className="hidden md:flex flex-col items-end pr-4 border-r border-white/10">
            <span className="text-[8px] font-black text-white/30 tracking-[0.3em] uppercase">24/7 Global Desk</span>
            <span className="text-sm font-black text-brand-secondary italic tracking-tighter shadow-brand-secondary/20">+1 213 694 6417</span>
          </div>
          
          <div className="hidden xl:flex flex-col items-start pr-4 border-r border-white/10">
            <span className="text-[8px] font-black text-emerald-500/50 tracking-[0.3em] uppercase">WhatsApp</span>
            <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest animate-pulse flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></span> Active Now
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* Secure Payment CTA */}
            <Link href="/secure-payment"
              className="hidden md:flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-500/20 transition-all">
              🔒 {t('secure_payment_cta')}
            </Link>

            {/* Mobile Menu Toggle */}
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden w-10 h-10 bg-white/5 rounded-xl flex flex-col items-center justify-center gap-1 border border-white/10">
              <div className={`w-5 h-0.5 bg-white transition-all ${mobileMenuOpen ? 'rotate-45 translate-y-1.5' : ''}`}></div>
              <div className={`w-5 h-0.5 bg-white transition-all ${mobileMenuOpen ? 'opacity-0' : ''}`}></div>
              <div className={`w-5 h-0.5 bg-white transition-all ${mobileMenuOpen ? '-rotate-45 -translate-y-1.5' : ''}`}></div>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-slate-900 border-b border-white/5 p-6 animate-in slide-in-from-top-4 duration-300">
          <div className="flex flex-col gap-3">
            {navLinks.map(link => {
              const isActive = pathname.startsWith(link.href);
              return (
                <Link key={link.href} onClick={() => setMobileMenuOpen(false)} href={link.href}
                  className={`flex items-center gap-4 p-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all ${isActive ? 'bg-brand-secondary text-brand-primary' : 'bg-white/5 text-white/60'}`}>
                  <span>{link.icon}</span>
                  {link.name}
                </Link>
              );
            })}
            <Link href="/secure-payment" onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-4 p-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              🔒 {t('secure_payment_cta')}
            </Link>
            <div className="flex flex-col gap-2 p-2 bg-white/5 rounded-2xl border border-white/10">
               <div className="flex items-center justify-between px-4 pb-2 border-b border-white/5 mb-2">
                  <span className="text-[8px] font-black text-white/20 uppercase tracking-widest">Preferences</span>
               </div>
               <div className="flex flex-col gap-2">
                  <CurrencySwitcher />
               </div>
            </div>

            <div className="mt-2 p-5 bg-white/5 rounded-[2rem] border border-white/10 text-center">
              <span className="text-[8px] font-black text-white/20 uppercase tracking-[0.3em] block mb-2">Emergency Global Support</span>
              <Link href="tel:+12136946417" className="text-xl font-black text-brand-secondary italic">+1 213 694 6417</Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
