'use client';
import React from 'react';
import Link from 'next/link';

export default function TicketingPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center">
      <main className="flex-1 w-full max-w-7xl mx-auto px-6 py-20 flex flex-col items-center">
        <div className="text-center mb-16 animate-in fade-in slide-in-from-top-4 duration-1000">
          <span className="bg-brand-secondary/20 text-brand-secondary font-black text-[10px] px-4 py-1.5 rounded-full uppercase tracking-[0.3em] mb-6 inline-block border border-brand-secondary/30">
            ASAP Worldwide Ticketing 24/7
          </span>
          <h1 className="text-5xl md:text-7xl font-black italic tracking-tighter uppercase mb-6">
            Global <span className="text-brand-secondary">Ticketing</span> Portal
          </h1>
          <p className="text-lg text-white/40 max-w-2xl font-medium leading-relaxed">
            Access our worldwide inventory of flights, hotels, and vehicle assets. 
            Direct wholesale rates with no-loss pricing protection.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
          {/* Flights */}
          <Link href="/flights" className="group bg-white/5 border border-white/10 rounded-[3rem] p-10 hover:bg-white/10 transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-brand-primary/10 blur-[50px] group-hover:bg-brand-primary/20 transition-all"></div>
            <div className="text-6xl mb-8 group-hover:rotate-12 transition-transform">✈️</div>
            <h2 className="text-3xl font-black italic uppercase tracking-tighter mb-4">Flights</h2>
            <p className="text-white/40 text-sm font-medium leading-relaxed mb-8">
              300+ Global Hubs. Private wholesale fares & unadvertised airline contracts.
            </p>
            <div className="flex items-center gap-2 text-brand-secondary font-black text-[10px] uppercase tracking-widest">
              Search Flights <span className="group-hover:translate-x-2 transition-transform">→</span>
            </div>
          </Link>

          {/* Hotels */}
          <Link href="/hotels" className="group bg-white/5 border border-white/10 rounded-[3rem] p-10 hover:bg-white/10 transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 blur-[50px] group-hover:bg-emerald-500/20 transition-all"></div>
            <div className="text-6xl mb-8 group-hover:rotate-12 transition-transform">🏨</div>
            <h2 className="text-3xl font-black italic uppercase tracking-tighter mb-4">Hotels</h2>
            <p className="text-white/40 text-sm font-medium leading-relaxed mb-8">
              Verified Hilton, Marriott & Global Luxury Assets. Direct contract rates.
            </p>
            <div className="flex items-center gap-2 text-emerald-400 font-black text-[10px] uppercase tracking-widest">
              Search Hotels <span className="group-hover:translate-x-2 transition-transform">→</span>
            </div>
          </Link>

          {/* Cars */}
          <Link href="/cars" className="group bg-white/5 border border-white/10 rounded-[3rem] p-10 hover:bg-white/10 transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 blur-[50px] group-hover:bg-orange-500/20 transition-all"></div>
            <div className="text-6xl mb-8 group-hover:rotate-12 transition-transform">🚗</div>
            <h2 className="text-3xl font-black italic uppercase tracking-tighter mb-4">Cars</h2>
            <p className="text-white/40 text-sm font-medium leading-relaxed mb-8">
              Fleet dispatch in every major city. Uber, Lyft & Private fleet sync.
            </p>
            <div className="flex items-center gap-2 text-orange-400 font-black text-[10px] uppercase tracking-widest">
              Search Cars <span className="group-hover:translate-x-2 transition-transform">→</span>
            </div>
          </Link>
        </div>

        <div className="mt-20 w-full bg-white/5 border border-white/10 rounded-[4rem] p-12 text-center relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-r from-brand-primary/5 via-transparent to-brand-secondary/5 opacity-50"></div>
          <div className="relative z-10">
             <div className="flex flex-wrap justify-center gap-8 md:gap-16">
                {[
                  { label: 'Global Coverage', val: '200+ Countries' },
                  { label: 'Uptime', val: '24/7 Live Monitoring' },
                  { label: 'Security', val: 'AES-256 Encrypted' },
                  { label: 'Support', val: 'Dedicated Expert Line' }
                ].map(stat => (
                  <div key={stat.label} className="text-center">
                    <div className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] mb-2">{stat.label}</div>
                    <div className="text-2xl font-black text-white italic tracking-tighter">{stat.val}</div>
                  </div>
                ))}
             </div>
          </div>
        </div>
      </main>
    </div>
  );
}
