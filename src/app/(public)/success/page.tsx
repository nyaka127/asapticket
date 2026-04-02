import React, { Suspense } from 'react';
import Link from 'next/link';
import { CheckCircle2, FileText, Globe, PhoneCall, Mail, Smartphone, Zap } from 'lucide-react';

const TYPE_CONFIG: Record<string, { icon: string; color: string; label: string; nextHref: string; nextLabel: string }> = {
  flight: { icon: '✈️', color: 'text-brand-secondary', label: 'Flight Manifest Verified', nextHref: '/flights', nextLabel: 'Primary Mainboard' },
  hotel: { icon: '🏨', color: 'text-emerald-400', label: 'Hotel Asset Secured', nextHref: '/hotels', nextLabel: 'Resort Inventory' },
  car: { icon: '🚗', color: 'text-orange-400', label: 'Fleet Dispatch Confirmed', nextHref: '/cars', nextLabel: 'Fleet Hub' },
  tour: { icon: '🗺', color: 'text-purple-400', label: 'Expert Guide Authorized', nextHref: '/tours', nextLabel: 'Expert Roster' },
};

async function SuccessContent({ type, ref: bookingRef, name }: { type: string; ref: string; name: string }) {
  const config = TYPE_CONFIG[type] || TYPE_CONFIG.flight;

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center py-24 px-6 relative overflow-hidden selection:bg-brand-primary">
      <div className="absolute inset-0 bg-brand-primary/5 blur-[250px] pointer-events-none"></div>
      
      <div className="relative z-10 flex flex-col items-center max-w-4xl w-full text-center">
        <div className="w-32 h-32 rounded-[2.5rem] bg-emerald-500/10 border-4 border-emerald-500/30 flex items-center justify-center mb-12 shadow-[0_0_80px_rgba(16,185,129,0.2)] animate-in zoom-in-95 duration-1000 rotate-[-8deg] hover:rotate-0 transition-transform">
           <CheckCircle2 className="w-16 h-16 text-emerald-400" />
        </div>
        
        <h1 className="text-6xl md:text-8xl font-black italic tracking-tighter uppercase mb-6 leading-none animate-in fade-in slide-in-from-bottom-8 duration-1000">
          Authorization <span className="text-brand-secondary">Successful</span>
        </h1>
        
        <p className="text-xl md:text-2xl text-white/40 max-w-2xl font-black italic leading-relaxed mb-16 animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-200">
           Stripe Settlement Layer 4 finalized. Your unadvertised wholesale contract is <span className="text-white">Live & Verified</span>. An IRIS V1 Asset manifest and automated e-ticket will be dispatched to your email shortly.
        </p>

        {/* Tactical Booking Manifest */}
        <div className="bg-white/5 rounded-[4.5rem] shadow-2xl border border-white/10 overflow-hidden w-full max-w-2xl animate-in zoom-in-95 duration-1000 delay-300 backdrop-blur-3xl group mb-20">
          <div className="bg-slate-900 border-b border-white/5 px-10 py-8 flex items-center justify-between relative overflow-hidden">
             <div className="absolute top-0 right-0 w-48 h-48 bg-brand-primary/10 blur-[60px] pointer-events-none"></div>
             <div className="flex items-center gap-4 relative z-10">
                <div className="w-10 h-10 bg-brand-secondary rounded-xl flex items-center justify-center font-black text-brand-primary text-[10px] shadow-2xl rotate-[-12deg]">IRIS</div>
                <span className="font-black text-white italic tracking-tighter uppercase text-xl">Asset Manifest</span>
             </div>
             <div className="flex items-center gap-3 relative z-10">
                <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.3em] italic leading-none">Status: VERIFIED</span>
             </div>
          </div>

          <div className="p-12 text-center relative">
            <div className="text-8xl mb-8 group-hover:scale-110 transition-transform duration-1000">{config.icon}</div>
            <h2 className={`text-4xl font-black italic tracking-tighter uppercase mb-2 ${config.color}`}>{name || 'Deploy Selection'}</h2>
            <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.5em] italic">Wholesale Settlement Completed</p>

            {/* Tactical Divider */}
            <div className="relative my-12">
               <div className="border-t border-dashed border-white/10"></div>
               <div className="absolute -left-16 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-slate-950 border-r border-white/10 shadow-inner"></div>
               <div className="absolute -right-16 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-slate-950 border-l border-white/10 shadow-inner"></div>
            </div>

            <div className="grid grid-cols-2 gap-10 text-left">
              <div className="space-y-3">
                <div className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em] leading-none italic">Manifest Node (PNR)</div>
                <div className="font-black text-brand-secondary italic text-4xl tracking-tighter leading-none">{bookingRef || 'Z7XY2M'}</div>
              </div>
              <div className="space-y-4">
                <div className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em] leading-none italic">Asset Compliance</div>
                <div className="flex items-center gap-3 bg-emerald-500/10 border border-emerald-500/20 px-4 py-2 rounded-2xl w-fit">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest leading-none">NO LOSS PROTECTION</span>
                </div>
              </div>
              <div className="space-y-3">
                <div className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em] leading-none italic">Global Command</div>
                <div className="font-black text-white italic text-base leading-none tracking-tighter uppercase opacity-60">IRIS_V1_CENTRAL</div>
              </div>
              <div className="space-y-3">
                <div className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em] leading-none italic">Sync Status</div>
                <div className="font-black text-emerald-400 italic text-base leading-none tracking-tighter uppercase animate-pulse">DEPLOYMENT_ACTIVE</div>
              </div>
            </div>
          </div>

          <div className="bg-slate-900 px-10 py-6 flex flex-col md:flex-row items-center justify-between text-[10px] font-black uppercase tracking-[0.4em] border-t border-white/5 relative z-10 italic">
            <div className="flex items-center gap-3 text-white/20 mb-4 md:mb-0">
               <Zap className="w-3 h-3 fill-emerald-500 border-none" /> SECURED BY STRIPE
            </div>
            <button className="text-brand-secondary hover:text-white transition-colors flex items-center gap-2" onClick={() => typeof window !== 'undefined' && window.print()}>
               <FileText className="w-4 h-4" /> GENERATE PHYSICAL MANIFEST
            </button>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-6 w-full max-w-2xl mb-24">
          <Link href={config.nextHref} className="flex-1 bg-white text-slate-950 font-black px-10 py-8 rounded-[3rem] text-lg uppercase italic tracking-[0.2em] shadow-2xl hover:bg-brand-secondary transition-all transform hover:scale-[1.05] active:scale-95 text-center leading-none">
            {config.nextLabel}
          </Link>
          <Link href="/" className="flex-1 bg-white/5 border border-white/10 text-white font-black px-10 py-8 rounded-[3rem] text-lg uppercase italic tracking-[0.2em] hover:bg-white/10 transition-all text-center leading-none">
            Return to Landing
          </Link>
        </div>

        <div className="bg-slate-900 border border-white/10 rounded-[4rem] p-12 w-full max-w-2xl text-center relative overflow-hidden shadow-inner backdrop-blur-3xl group">
          <div className="absolute inset-0 bg-brand-primary/5 pointer-events-none"></div>
          <h3 className="text-[11px] font-black text-brand-secondary uppercase tracking-[0.6em] mb-12 italic border-b border-white/5 pb-6 leading-none">Direct Operations Desk</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
             <div className="space-y-4">
                <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center mx-auto border border-white/10 group-hover:bg-brand-primary transition-all shadow-xl">
                   <PhoneCall className="w-6 h-6 text-brand-secondary group-hover:text-white" />
                </div>
                <div className="text-[9px] font-black text-white/20 uppercase tracking-[0.4em] italic mb-1">Crisis Hub</div>
                <p className="font-black text-white italic text-xl tracking-tighter shadow-brand-secondary/20">+1 213 694 6417</p>
             </div>
             <div className="space-y-4">
                <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center mx-auto border border-white/10 group-hover:bg-emerald-500 transition-all shadow-xl">
                   <Smartphone className="w-6 h-6 text-emerald-400 group-hover:text-white" />
                </div>
                <div className="text-[9px] font-black text-white/20 uppercase tracking-[0.4em] italic mb-1">WhatsApp Uplink</div>
                <p className="font-black text-emerald-400 italic text-xl tracking-tighter shadow-emerald-500/20 text-[13px] uppercase tracking-widest leading-relaxed">Secure Live Feed</p>
             </div>
          </div>
          <div className="mt-12 pt-8 border-t border-white/5 flex items-center justify-center gap-4 text-white/20">
             <Mail className="w-4 h-4" />
             <p className="text-[9px] font-black uppercase tracking-[0.5em] italic">ADMIN@ASAP.WHOLESALE</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default async function SuccessPage({ searchParams }: { searchParams: { type?: string; ref?: string; name?: string; bookingId?: string; pnr?: string } }) {
  const type = searchParams.type || (searchParams.bookingId ? 'flight' : 'flight');
  const ref = searchParams.ref || searchParams.pnr || '';
  const name = searchParams.name || '';

  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-950 flex items-center justify-center animate-pulse text-white/20 font-black uppercase tracking-[0.5em] italic leading-none">Initializing Success Matrix...</div>}>
      <SuccessContent type={type} ref={ref} name={decodeURIComponent(name)} />
    </Suspense>
  );
}
