'use client';
import React from 'react';
import Link from 'next/link';
import { GlobalPublicHeader } from '@/components/GlobalPublicHeader';
import { GlobalPublicFooter } from '@/components/GlobalPublicFooter';

export default function HomePage() {
   return (
      <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center">
         <GlobalPublicHeader />

         <main className="flex-1 w-full max-w-7xl mx-auto px-6 py-24 flex flex-col items-center justify-center">
            <div className="text-center mb-20 animate-in fade-in slide-in-from-bottom-8 duration-1000">
               <span className="bg-brand-secondary/20 text-brand-secondary font-black text-[10px] px-5 py-2 rounded-full uppercase tracking-[0.4em] mb-8 inline-block border border-brand-secondary/30 shadow-[0_0_30px_rgba(255,234,167,0.1)]">
                  Established 2021 · Global Travel HQ
               </span>
               <h1 className="text-6xl md:text-9xl font-black italic tracking-tighter uppercase leading-[0.9] mb-8">
                  World <span className="text-brand-secondary">Wide</span><br/>Travel CMS
               </h1>
               <p className="text-xl text-white/40 max-w-3xl mx-auto font-medium leading-relaxed italic uppercase tracking-widest pt-8 border-t border-white/5">
                  High-performance ticketing & expert lead generation — <span className="text-white">Active 24/7 Globally</span>.
               </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 w-full mb-20">
               {/* Ticketing Website Card */}
               <Link href="/ticketing" className="group bg-white/5 border border-white/10 rounded-[4rem] p-12 hover:bg-white/10 transition-all duration-700 hover:scale-[1.02] hover:shadow-[0_40px_100px_rgba(0,0,0,0.5)] relative overflow-hidden flex flex-col">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-brand-primary/10 blur-[100px] group-hover:bg-brand-primary/20 transition-all"></div>
                  <div className="text-7xl mb-10 group-hover:scale-110 group-hover:rotate-6 transition-transform duration-500">🎟️</div>
                  <h2 className="text-4xl font-black italic uppercase tracking-tighter mb-4 text-white group-hover:text-brand-primary transition-colors">Ticketing</h2>
                  <p className="text-white/40 text-sm font-medium leading-relaxed mb-10">
                     Standard worldwide bookings for Flights, Hotels, and Cars. Active inventory sync.
                  </p>
                  <div className="mt-auto flex items-center gap-3 text-brand-secondary font-black text-xs uppercase tracking-[0.2em]">
                     Enter Website <span className="group-hover:translate-x-3 transition-transform duration-500">→</span>
                  </div>
               </Link>

               {/* Lead/Expert Website Card */}
               <Link href="/expert" className="group bg-white/5 border border-white/10 rounded-[4rem] p-12 hover:bg-white/10 transition-all duration-700 hover:scale-[1.02] hover:shadow-[0_40px_100px_rgba(0,0,0,0.5)] relative overflow-hidden flex flex-col">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-brand-secondary/10 blur-[100px] group-hover:bg-brand-secondary/20 transition-all"></div>
                  <div className="text-7xl mb-10 group-hover:scale-110 group-hover:-rotate-6 transition-transform duration-500">👑</div>
                  <h2 className="text-4xl font-black italic uppercase tracking-tighter mb-4 text-white group-hover:text-brand-secondary transition-colors">Expert/Lead</h2>
                  <p className="text-white/40 text-sm font-medium leading-relaxed mb-10">
                     Dedicated human-led itinerary negotiation. For trips requiring an expert touch.
                  </p>
                  <div className="mt-auto flex items-center gap-3 text-brand-secondary font-black text-xs uppercase tracking-[0.2em]">
                     Request Expert <span className="group-hover:translate-x-3 transition-transform duration-500">→</span>
                  </div>
               </Link>

               {/* Secure Payment Website Card */}
               <Link href="/secure-payment" className="group bg-white/5 border border-white/10 rounded-[4rem] p-12 hover:bg-white/10 transition-all duration-700 hover:scale-[1.02] hover:shadow-[0_40px_100px_rgba(0,0,0,0.5)] relative overflow-hidden flex flex-col">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 blur-[100px] group-hover:bg-emerald-500/20 transition-all"></div>
                  <div className="text-7xl mb-10 group-hover:scale-110 transition-transform duration-500">🔒</div>
                  <h2 className="text-4xl font-black italic uppercase tracking-tighter mb-4 text-white group-hover:text-emerald-400 transition-colors">Payment</h2>
                  <p className="text-white/40 text-sm font-medium leading-relaxed mb-10">
                     Stable and detailed credit card capture interface. Secure settlement gateway.
                  </p>
                  <div className="mt-auto flex items-center gap-3 text-emerald-400 font-black text-xs uppercase tracking-[0.2em]">
                     Secure Portal <span className="group-hover:translate-x-3 transition-transform duration-500">→</span>
                  </div>
               </Link>
            </div>

            <div className="w-full flex items-center justify-between py-12 border-t border-white/5 opacity-30 group grayscale hover:grayscale-0 transition-all">
               <span className="text-[10px] font-black uppercase tracking-[0.5em]">Global Uplink Terminal v2.1.0</span>
               <div className="flex gap-12">
                  {['TLS v1.3', 'ISO 27001', 'PCI DSS', '24/7 SUPPORT'].map(t => (
                    <span key={t} className="text-[10px] font-black uppercase tracking-widest">{t}</span>
                  ))}
               </div>
            </div>
         </main>

         <GlobalPublicFooter />
      </div>
   );
}