import React from 'react';
import Link from 'next/link';

export function GlobalPublicFooter() {
  return (
    <footer className="bg-slate-900 w-full py-24 px-6 text-white border-t border-white/5">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 text-left">
        {/* Brand Section */}
        <div className="md:col-span-2">
          <h3 className="text-2xl font-black mb-6 italic uppercase tracking-tighter">ASAP <span className="text-brand-secondary">WORLDWIDE</span></h3>
          <p className="text-white/40 text-sm max-w-md leading-relaxed font-medium">
            Helping over 200,000 travelers globally since 2001. Our mission is to provide private, non-advertised contract rates with a 100% No-Loss Guarantee.
          </p>
          <div className="flex gap-4 mt-8">
            <div className="bg-white/5 p-3 rounded-xl border border-white/10 text-[10px] font-black uppercase tracking-widest text-white/40">ARC ACCREDITED</div>
            <div className="bg-white/5 p-3 rounded-xl border border-white/10 text-[10px] font-black uppercase tracking-widest text-white/40">ASTA MEMBER</div>
            <div className="bg-white/5 p-3 rounded-xl border border-white/10 text-[10px] font-black uppercase tracking-widest text-white/40">BBB A+ RATING</div>
          </div>
        </div>

        {/* Support Hubs */}
        <div>
          <h4 className="text-[10px] font-black text-white uppercase tracking-[0.2em] mb-8">Support Hubs</h4>
          <ul className="space-y-4 text-white/40 text-[11px] font-bold uppercase tracking-widest">
            <li className="flex items-center gap-2 hover:text-white transition-colors">
              <span className="w-1.5 h-1.5 bg-brand-secondary rounded-full"></span>
              24/7 Care: +1 213 694 6417
            </li>
            <li className="flex items-center gap-2 hover:text-white transition-colors lowercase font-black text-brand-secondary">
              <span className="w-1.5 h-1.5 bg-brand-sidebar rounded-full"></span>
              asaptictetagen7@gmail.com
            </li>
            <li className="flex items-center gap-2 text-emerald-400">
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></span>
              WhatsApp Support Active
            </li>
          </ul>
        </div>

        {/* Global Compliance */}
        <div>
          <h4 className="text-[10px] font-black text-white uppercase tracking-[0.2em] mb-8">Compliance</h4>
          <ul className="space-y-4 text-white/40 text-[11px] font-bold uppercase tracking-widest">
            <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
            <li><Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
            <li><Link href="/cookies" className="hover:text-white transition-colors">Cookie Dashboard</Link></li>
            <li><Link href="/disclaimers" className="hover:text-white transition-colors">Regional Disclaimers</Link></li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-20 pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="text-[9px] font-black text-white/20 uppercase tracking-[0.3em]">&copy; 2026 ASAP TICKETS. WORLDWIDE SEARCH POWERED BY IRIS V1.</div>
        <div className="flex items-center gap-8">
          <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest flex items-center gap-2 animate-in fade-in duration-1000">
             <span className="w-2 h-2 bg-emerald-500 rounded-full shadow-[0_0_10px_#10b981]"></span>
             GLOBAL LOSS-GUARD PROTECTION: ON
          </span>
          <span className="text-[9px] font-black text-white/20 uppercase tracking-widest">Delaware Hub · Wilmington, US</span>
        </div>
      </div>
    </footer>
  );
}
