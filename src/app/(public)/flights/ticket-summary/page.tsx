'use client';
import React, { Suspense, useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  CheckCircle2, 
  ShieldCheck, 
  Clock, 
  Award, 
  Download, 
  ArrowRight, 
  Printer, 
  Share2, 
  Phone, 
  Mail, 
  MapPin, 
  Plane, 
  Building2, 
  Car, 
  Map,
  Zap,
  Globe,
  Lock
} from 'lucide-react';
import { formatPricing } from '@/lib/pricing';
import { useTranslation } from '@/components/TranslationProvider';

function TicketSummaryContent() {
   const searchParams = useSearchParams();
   const router = useRouter();
   const { t } = useTranslation();
   const [booking, setBooking] = useState<any>(null);
   const [loading, setLoading] = useState(true);

   const bookingId = searchParams.get('bookingId') || searchParams.get('client_reference_id');

   useEffect(() => {
     if (bookingId) {
        const fetchBooking = async () => {
          try {
            const res = await fetch(`/api/bookings/${bookingId}`);
            if (res.ok) {
              const data = await res.json();
              setBooking(data);
            }
          } catch (e) {}
          setLoading(false);
        };
        fetchBooking();
        const interval = setInterval(fetchBooking, 5000);
        return () => clearInterval(interval);
     } else {
        setLoading(false);
     }
   }, [bookingId]);

   if (loading) return (
     <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950 gap-8">
       <div className="w-20 h-20 border-8 border-white/5 border-t-brand-secondary rounded-full animate-spin shadow-[0_0_50px_rgba(250,204,21,0.2)]"></div>
       <div className="text-center space-y-3">
          <p className="text-[12px] font-black uppercase tracking-[0.6em] text-white/20 animate-pulse italic">Synchronizing Global Asset Matrix...</p>
          <p className="text-[9px] font-black text-brand-secondary uppercase tracking-[0.4em] italic opacity-40">Uplink ID: {bookingId || 'UNSET'}</p>
       </div>
     </div>
   );

   const isConfirmed = booking?.status === 'CONFIRMED';
   const amount = booking?.priceCents ? booking.priceCents / 100 : Number(searchParams.get('amount') || '0');
   const pnr = booking?.pnr || searchParams.get('pnr') || Math.random().toString(36).substring(2, 8).toUpperCase();
   const name = booking?.passengerName || (booking?.firstName ? `${booking.firstName} ${booking.lastName}` : searchParams.get('name') || 'Valued Traveller');
   const origin = booking?.origin || searchParams.get('origin') || 'NYC';
   const dest = booking?.destination || searchParams.get('destination') || 'LHR';

   return (
      <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center selection:bg-brand-primary selection:text-white relative overflow-hidden">
         {/* Background Glow */}
         <div className="absolute top-0 left-0 w-full h-[600px] bg-brand-primary/5 blur-[150px] pointer-events-none"></div>
         <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-brand-secondary/5 blur-[120px] pointer-events-none"></div>

         <main className="w-full max-w-5xl mx-auto px-6 py-24 relative z-10 animate-in fade-in duration-1000">
            {/* Header Status Terminal */}
            <div className="text-center mb-20 space-y-6">
               <div className="inline-flex items-center gap-4 bg-white/5 border border-white/10 px-8 py-3 rounded-full backdrop-blur-3xl shadow-2xl skew-x-[-12deg]">
                  <span className={`flex h-3 w-3 rounded-full ${isConfirmed ? 'bg-emerald-500 shadow-[0_0_15px_#10b981]' : 'bg-orange-400 animate-pulse'}`}></span>
                  <span className="text-[11px] font-black uppercase tracking-[0.5em] text-white italic">
                    {isConfirmed ? 'GLOBAL ASSET SECURED' : 'AWAITING HUB CLEARANCE'}
                  </span>
               </div>
               <h1 className="text-6xl md:text-8xl font-black italic tracking-tighter uppercase leading-[0.8] mb-4">
                 Ticketing <span className={isConfirmed ? 'text-brand-secondary' : 'text-orange-400'}>Manifest</span>
               </h1>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
               {/* PRIMARY ASSET CARD */}
               <div className="lg:col-span-2 space-y-10">
                  <div className="bg-white/5 rounded-[4.5rem] border border-white/10 shadow-[0_50px_100px_rgba(0,0,0,0.6)] overflow-hidden relative group backdrop-blur-3xl">
                     <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-transparent via-brand-secondary to-transparent opacity-40"></div>
                     <div className="absolute top-20 right-20 rotate-12 opacity-[0.03] select-none pointer-events-none group-hover:scale-110 transition-transform duration-1000">
                        <Award className="w-80 h-80 text-white" />
                     </div>
                     
                     <div className="p-16 space-y-16">
                        {/* Transaction Details */}
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 border-b border-white/5 pb-16">
                           <div className="space-y-4">
                              <p className="text-[11px] font-black text-white/20 uppercase tracking-[0.4em] italic mb-1">UNIVERSAL PNR PROMISE</p>
                              <p className="text-5xl font-black text-brand-secondary tracking-[0.25em] font-mono leading-none">{pnr}</p>
                           </div>
                           <div className="md:text-right space-y-4 pt-4 md:pt-0">
                              <p className="text-[11px] font-black text-white/20 uppercase tracking-[0.4em] italic mb-1">TOTAL ASSET SETTLEMENT</p>
                              <p className="text-5xl font-black text-white tracking-tighter leading-none italic">{formatPricing(amount, 'USD')}</p>
                           </div>
                        </div>

                        {/* Tactical Route Visualization */}
                        <div className="flex flex-col md:flex-row items-center justify-between gap-12 relative">
                           <div className="text-center md:text-left space-y-3">
                              <p className="text-5xl font-black text-white tracking-tighter leading-none italic">{origin}</p>
                              <p className="text-[11px] font-black text-white/20 uppercase tracking-[0.4em] italic">DEPARTURE HUB</p>
                           </div>
                           <div className="flex-1 w-full md:w-auto px-12 flex flex-col items-center gap-4 relative">
                              <div className="w-full h-1 bg-white/5 relative rounded-full overflow-hidden">
                                 <div className={`absolute top-0 left-0 h-full ${isConfirmed ? 'bg-emerald-500 w-full' : 'bg-orange-400 w-1/3 animate-pulse'} transition-all duration-3000`}></div>
                              </div>
                              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[22px] w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center border border-white/10 shadow-2xl skew-x-[-12deg]">
                                 <Plane className={`w-6 h-6 ${isConfirmed ? 'text-emerald-500' : 'text-orange-400 animate-pulse'} rotate-90`} />
                              </div>
                              <span className="text-[10px] font-black text-brand-secondary uppercase tracking-[0.5em] italic mt-6">{isConfirmed ? 'UPLINK ESTABLISHED' : 'SYNCING NODE...'}</span>
                           </div>
                           <div className="text-center md:text-right space-y-3">
                              <p className="text-5xl font-black text-white tracking-tighter leading-none italic">{dest}</p>
                              <p className="text-[11px] font-black text-white/20 uppercase tracking-[0.4em] italic">DESTINATION HUB</p>
                           </div>
                        </div>

                        {/* Verified Identity Block */}
                        <div className="bg-white/5 border border-white/10 rounded-[3rem] p-12 text-white space-y-6 shadow-inner relative overflow-hidden group/id">
                           <div className="absolute inset-0 bg-emerald-500/5 opacity-0 group-hover/id:opacity-100 transition-opacity duration-1000"></div>
                           <div className="flex flex-col md:flex-row justify-between items-center gap-8 relative z-10 text-center md:text-left">
                              <div className="flex items-center gap-8">
                                 <div className="w-20 h-20 rounded-[2rem] bg-slate-900 flex items-center justify-center text-4xl shadow-2xl border border-white/10 italic font-black">ID</div>
                                 <div className="space-y-3">
                                    <p className="text-[11px] font-black text-white/20 uppercase tracking-[0.4em] italic leading-none">{t('passenger_details')}</p>
                                    <p className="text-2xl font-black text-white uppercase italic tracking-tighter leading-none">{name}</p>
                                 </div>
                              </div>
                              <div className="space-y-4">
                                 <div className={`px-10 py-4 rounded-2xl font-black uppercase tracking-[0.3em] text-[11px] italic shadow-2xl border ${isConfirmed ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-orange-500/10 text-orange-400 border-orange-500/20 animate-pulse'}`}>
                                    {isConfirmed ? '✓ TICKETING COMPLETE' : '⏳ SETTLEMENT PENDING'}
                                 </div>
                              </div>
                           </div>
                        </div>

                        {/* Interactive Protocols */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-8">
                           <button 
                             disabled={!isConfirmed}
                             onClick={() => window.print()} 
                             className={`flex items-center justify-center gap-6 p-10 rounded-[3rem] transition-all group duration-700 ${isConfirmed ? 'bg-brand-primary text-white hover:bg-white hover:text-slate-950 shadow-[0_20px_50px_rgba(235,59,90,0.3)]' : 'bg-white/5 text-white/10 cursor-not-allowed border border-white/5'}`}>
                              <Download className={`w-8 h-8 ${isConfirmed ? 'group-hover:-translate-y-2' : ''} transition-transform duration-500`} />
                              <span className="text-xl font-black uppercase italic tracking-tighter italic">EXPORT ASSET PDF</span>
                           </button>
                           <button onClick={() => router.push('/')} className="flex items-center justify-center gap-6 p-10 bg-white/5 border border-white/10 text-white/40 rounded-[3rem] hover:bg-white hover:text-slate-950 hover:border-transparent transition-all group duration-700">
                              <span className="text-xl font-black uppercase italic tracking-tighter italic">EXIT MAINBOARD</span>
                              <ArrowRight className="w-6 h-6 group-hover:translate-x-3 transition-transform duration-500" />
                           </button>
                        </div>
                     </div>
                  </div>
               </div>

               {/* SECURITY HUB SIDEBAR */}
               <div className="space-y-10 xl:sticky xl:top-24">
                  <div className="bg-slate-900 rounded-[4rem] p-12 text-white relative overflow-hidden shadow-[0_40px_80px_rgba(0,0,0,0.8)] border border-white/5 group">
                     <div className="absolute top-0 right-0 w-64 h-64 bg-brand-primary/10 blur-[80px] pointer-events-none group-hover:bg-brand-primary/20 transition-all duration-1000"></div>
                     <div className="relative z-10 space-y-8">
                        <div className="flex items-center gap-6 border-b border-white/5 pb-8">
                           <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 shadow-inner group-hover:rotate-12 transition-transform">
                              <ShieldCheck className="w-8 h-8 text-emerald-400 shadow-[0_0_15px_#10b981]" />
                           </div>
                           <h3 className="text-xl font-black uppercase italic tracking-tighter leading-none italic">{t('assurance_title')}</h3>
                        </div>
                        <p className="text-[11px] font-black text-white/20 leading-relaxed uppercase tracking-[0.3em] italic">{t('assurance_desc')}</p>
                        
                        <div className="space-y-8 pt-4">
                           <div className="flex items-center gap-6 group/item cursor-default">
                              <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-emerald-400 border border-white/10 group-hover/item:bg-emerald-500 group-hover/item:text-white transition-all duration-500 text-2xl">🛡️</div>
                              <div className="space-y-1">
                                 <p className="text-[9px] font-black text-white/20 uppercase tracking-[0.3em] italic leading-none">{t('secure_guarantee')}</p>
                                 <p className="text-sm font-black text-white uppercase italic tracking-tighter leading-none">PCI-DSS 4.0 SECURED</p>
                              </div>
                           </div>
                           <div className="flex items-center gap-6 group/item cursor-default">
                              <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-blue-400 border border-white/10 group-hover/item:bg-blue-500 group-hover/item:text-white transition-all duration-500 text-2xl">⚡</div>
                              <div className="space-y-1">
                                 <p className="text-[9px] font-black text-white/20 uppercase tracking-[0.3em] italic leading-none">{t('travel_protection')}</p>
                                 <p className="text-sm font-black text-white uppercase italic tracking-tighter leading-none">INSTANT ACTIVATE</p>
                              </div>
                           </div>
                           <div className="flex items-center gap-6 group/item cursor-default">
                              <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-brand-primary border border-white/10 group-hover/item:bg-brand-primary group-hover/item:text-white transition-all duration-500 text-2xl text-red-500">🎧</div>
                              <div className="space-y-1">
                                 <p className="text-[9px] font-black text-white/20 uppercase tracking-[0.3em] italic leading-none">PRIORITY UPLINK</p>
                                 <p className="text-sm font-black text-white uppercase italic tracking-tighter leading-none">DIRECT ASSET DESK</p>
                              </div>
                           </div>
                        </div>
                     </div>
                  </div>

                  {/* CASE OFFICER CARD */}
                  <div className="bg-white/5 rounded-[4rem] p-10 border border-white/10 shadow-2xl space-y-10 backdrop-blur-3xl group">
                     <div className="flex items-center gap-6 border-b border-white/5 pb-8">
                        <div className="w-16 h-16 rounded-[1.5rem] bg-slate-900 flex items-center justify-center text-6xl shadow-2xl border border-white/10 group-hover:scale-110 transition-transform duration-700">👨‍✈️</div>
                        <div className="space-y-2">
                           <p className="text-[11px] font-black text-white/20 uppercase tracking-[0.4em] italic leading-none">OFFICER ASSIGNED</p>
                           <p className="text-xl font-black text-brand-secondary uppercase italic tracking-tighter leading-none">AGENT IRIS-V7</p>
                        </div>
                     </div>
                     <div className="space-y-8">
                        <a href="tel:+12136946417" className="flex items-center gap-6 group/link">
                           <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center text-brand-secondary border border-white/10 group-hover/link:bg-brand-secondary group-hover/link:text-slate-900 transition-all duration-700 shadow-xl">
                              <Phone className="w-6 h-6" />
                           </div>
                           <div className="space-y-1">
                              <p className="text-[9px] font-black text-white/20 uppercase tracking-[0.3em] italic leading-none">TACTICAL COMMS</p>
                              <p className="text-lg font-black text-white italic tracking-tighter leading-none">+1 (213) 694-6417</p>
                           </div>
                        </a>
                        <a href="mailto:support@asap.travel" className="flex items-center gap-6 group/link">
                           <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center text-white/40 border border-white/10 group-hover/link:bg-white group-hover/link:text-slate-950 transition-all duration-700 shadow-xl">
                              <Mail className="w-6 h-6" />
                           </div>
                           <div className="space-y-1">
                              <p className="text-[9px] font-black text-white/20 uppercase tracking-[0.3em] italic leading-none">ADMINISTRATIVE UPLINK</p>
                              <p className="text-sm font-black text-white italic tracking-tighter leading-none leading-none">support@asap.travel</p>
                           </div>
                        </a>
                     </div>
                     <div className="p-8 bg-brand-primary/5 rounded-[2.5rem] border border-brand-primary/10">
                        <p className="text-[9px] font-black text-brand-primary uppercase tracking-[0.5em] leading-relaxed italic text-center">
                           GLOBAL UPLINK TERMINAL V4.1 · © 2024 WHOLESALE AUTHORITY
                        </p>
                     </div>
                  </div>
               </div>
            </div>
         </main>
      </div>
   );
}

export default function TicketSummaryPage() {
   return (
      <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-slate-950 text-brand-secondary animate-pulse font-black uppercase tracking-[0.6em] italic">RECOVERING ASSET MANIFEST...</div>}>
         <TicketSummaryContent />
      </Suspense>
   );
}
