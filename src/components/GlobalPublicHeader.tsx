'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function GlobalPublicHeader() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: 'Ticketing', href: '/ticketing', icon: '🎟️' },
    { name: 'Expert Trips', href: '/expert', icon: '👑' },
    { name: 'Secure Payment', href: '/secure-payment', icon: '🔒' }
  ];

  return (
    <nav className="w-full bg-slate-900 border-b border-white/5 py-4 px-6 sticky top-0 z-[100] backdrop-blur-xl bg-slate-900/90">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
           <div className="w-8 h-8 md:w-10 md:h-10 bg-brand-secondary rounded-xl flex items-center justify-center font-black text-brand-primary text-sm md:text-lg shadow-lg group-hover:rotate-12 transition-transform italic">ASAP</div>
           <span className="text-lg md:text-xl font-black text-white italic tracking-tighter uppercase">WORLD<span className="text-brand-secondary">WIDE</span></span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-1 bg-white/5 p-1 rounded-2xl border border-white/10">
          {navLinks.map(link => {
            const isActive = pathname.startsWith(link.href);
            return (
              <Link key={link.href} href={link.href} className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${isActive ? 'bg-white text-slate-900 shadow-xl' : 'text-white/60 hover:text-white hover:bg-white/5'}`}>
                {link.name}
              </Link>
            );
          })}
        </div>

        <div className="flex items-center gap-4">
           <div className="hidden md:flex flex-col items-end">
              <span className="text-[8px] font-black text-white/30 tracking-[0.3em] uppercase">24/7 Global Desk</span>
              <span className="text-[10px] font-black text-brand-secondary tracking-widest">+1 213 694 6417</span>
           </div>
           
           {/* Mobile Menu Toggle */}
           <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden w-10 h-10 bg-white/5 rounded-xl flex flex-col items-center justify-center gap-1 border border-white/10">
              <div className={`w-5 h-0.5 bg-white transition-all ${mobileMenuOpen ? 'rotate-45 translate-y-1.5' : ''}`}></div>
              <div className={`w-5 h-0.5 bg-white transition-all ${mobileMenuOpen ? 'opacity-0' : ''}`}></div>
              <div className={`w-5 h-0.5 bg-white transition-all ${mobileMenuOpen ? '-rotate-45 -translate-y-1.5' : ''}`}></div>
           </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-slate-900 border-b border-white/5 p-6 animate-in slide-in-from-top-4 duration-300">
          <div className="flex flex-col gap-3">
            {navLinks.map(link => {
              const isActive = pathname.startsWith(link.href);
              return (
                <Link key={link.href} onClick={() => setMobileMenuOpen(false)} href={link.href} className={`flex items-center gap-4 p-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all ${isActive ? 'bg-brand-secondary text-brand-primary' : 'bg-white/5 text-white/60'}`}>
                  <span>{link.icon}</span>
                  {link.name}
                </Link>
              );
            })}
            <div className="mt-4 p-6 bg-white/5 rounded-[2rem] border border-white/10 text-center">
               <span className="text-[8px] font-black text-white/20 uppercase tracking-[0.3em] block mb-2">Emergency Global Support</span>
               <Link href="tel:+12136946417" className="text-xl font-black text-brand-secondary italic">+1 213 694 6417</Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
