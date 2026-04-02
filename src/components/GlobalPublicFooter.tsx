import React from 'react';
import Link from 'next/link';

export function GlobalPublicFooter() {
  return (
    <footer className="bg-slate-950 w-full py-24 px-6 text-white border-t border-white/5 relative overflow-hidden">
      <div className="absolute inset-0 bg-brand-primary/5 blur-[150px] pointer-events-none"></div>
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 text-left relative z-10">
        {/* Brand Section */}
        <div className="md:col-span-2">
          <Link href="/" className="flex items-center gap-3 mb-8 group">
            <div className="w-10 h-10 bg-brand-secondary rounded-xl flex items-center justify-center font-black text-brand-primary text-[10px] shadow-lg group-hover:rotate-12 transition-transform leading-none shadow-brand-secondary/20">
              ASAP
            </div>
            <div className="flex flex-col leading-none">
              <span className="text-2xl font-black text-white italic tracking-tighter uppercase leading-none">
                ASAP <span className="text-brand-secondary">WHOLESALE</span>
              </span>
              <span className="text-[9px] font-bold text-white/30 uppercase tracking-[0.25em] mt-1">Ticketing Authority</span>
            </div>
          </Link>
          <p className="text-white/40 text-sm max-w-md leading-relaxed font-medium italic">
            Secure non-published wholesale contracts unavailable to standard consumer booking sites. Helping over 200,000 travelers globally since 2001 with direct Tier-1 GDS Uplinks.
          </p>
          <div className="flex flex-wrap gap-4 mt-10">
            <div className="bg-white/5 p-4 rounded-2xl border border-white/10 text-[9px] font-black uppercase tracking-[0.2em] text-white/60">ARC ACCREDITED</div>
            <div className="bg-white/5 p-4 rounded-2xl border border-white/10 text-[9px] font-black uppercase tracking-[0.2em] text-white/60">ASTA QUALIFIED</div>
            <div className="bg-white/5 p-4 rounded-2xl border border-white/10 text-[9px] font-black uppercase tracking-[0.2em] text-brand-secondary shadow-[0_0_15px_rgba(255,211,42,0.1)]">BBB A+ RATING</div>
          </div>
        </div>

        {/* Support Hubs */}
        <div>
          <h4 className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em] mb-10 pb-4 border-b border-white/5">Support Hubs</h4>
          <ul className="space-y-6 text-white/40 text-[11px] font-bold uppercase tracking-widest">
            <li className="flex items-center gap-3 hover:text-white transition-colors group cursor-pointer">
              <span className="w-2 h-2 bg-brand-secondary rounded-full shadow-[0_0_8px_#FFD32A]"></span>
              24/7 Desk: <span className="text-white font-black">+1 213 694 6417</span>
            </li>
            <li className="flex items-center gap-3 hover:text-white transition-colors lowercase font-black text-brand-secondary bg-white/5 p-3 rounded-xl border border-white/10">
              <span className="w-2 h-2 bg-brand-secondary rounded-full"></span>
              asaptictetagen7@gmail.com
            </li>
            <li className="flex items-center gap-3 text-emerald-400 bg-emerald-500/5 p-3 rounded-xl border border-emerald-500/10">
              <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse shadow-[0_0_8px_#10b981]"></span>
              WhatsApp Active Now
            </li>
          </ul>
        </div>

        {/* Global Compliance */}
        <div>
          <h4 className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em] mb-10 pb-4 border-b border-white/5">Policy & Trust</h4>
          <ul className="space-y-4 text-white/40 text-[11px] font-bold uppercase tracking-widest">
            <li><Link href="/privacy" className="hover:text-brand-secondary hover:translate-x-1 transition-all inline-block">Privacy Protocol</Link></li>
            <li><Link href="/terms" className="hover:text-brand-secondary hover:translate-x-1 transition-all inline-block">Trade Terms</Link></li>
            <li><Link href="/cookies" className="hover:text-brand-secondary hover:translate-x-1 transition-all inline-block">Data Dashboard</Link></li>
            <li><Link href="/expert" className="hover:text-brand-secondary hover:translate-x-1 transition-all inline-block">Wholesale Request</Link></li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-24 pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8 relative z-10">
        <div className="text-[10px] font-black text-white/10 uppercase tracking-[0.4em]">&copy; 2026 ASAP WHOLESALE. POWERED BY IRIS V1 GDS.</div>
        <div className="flex flex-wrap items-center justify-center gap-8">
          <span className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.2em] flex items-center gap-3 px-4 py-2 bg-emerald-500/5 rounded-full border border-emerald-500/20">
             <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full shadow-[0_0_12px_#10b981]"></span>
             LOSS-GUARD ACTIVE
          </span>
          <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em]">Delaware Entity · Wilmington HQ</span>
        </div>
      </div>
    </footer>
  );
}
