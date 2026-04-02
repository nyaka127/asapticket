'use client';
import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { formatPricing } from '@/lib/pricing';
import { useTranslation } from '@/components/TranslationProvider';
import { ShieldCheck, Lock, CreditCard, ChevronLeft, Zap, CheckCircle2 } from 'lucide-react';

function SecurePaymentContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [form, setForm] = useState({ ccNumber: '', ccExpiry: '', ccCvv: '', cardName: '', passportNumber: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { t } = useTranslation();
  const [selectedHotel, setSelectedHotel] = useState<string>('');
  const [selectedCar, setSelectedCar] = useState<string>('');
  const [selectedTour, setSelectedTour] = useState<string>('');
  
  const amount = Number(searchParams.get('amount') || '0');
  const description = searchParams.get('description') || 'Global Travel Asset Settlement';
  const currency = searchParams.get('currency') || 'USD';

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/flights/book', { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          firstName: form.cardName.split(' ')[0],
          lastName: form.cardName.split(' ').slice(1).join(' '),
          email: `${form.cardName.replace(/\s/g, '').toLowerCase()}@secure.capture`,
          phone: 'Secure Lead',
          flightId: 'SECURE_SETTLEMENT',
          origin: 'CUSTOM',
          destination: 'SETTLEMENT',
          passengerPassport: form.passportNumber,
          priceCents: Math.round(amount * 100), 
          currency, 
          description, 
          paymentMethod: 'stripe',
        }),
      });
      if (res.ok) {
        const { bookingId } = await res.json();
        const sessionRes = await fetch('/api/stripe/create-session', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            bookingId, 
            type: 'direct', 
            amount: Math.round(amount * 100),
            description,
            currency 
          }),
        });
        if (sessionRes.ok) {
          const { url } = await sessionRes.json();
          window.location.href = url;
        } else {
          throw new Error('Failed to initiate secure settlement.');
        }
      } else {
        throw new Error('Verification Failed. Please check details.');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown Error');
      setLoading(false);
    }
  };

  const hotels = [
     { id: 'h1', name: 'Grand Horizon Resort', price: 185 },
     { id: 'h2', name: 'Skyline Boutique Hotel', price: 120 },
     { id: 'h3', name: 'Ocean Vista Suites', price: 210 },
  ];

  const cars = [
     { id: 'c1', name: 'Luxury Sedan (Mercedes)', price: 75 },
     { id: 'c2', name: 'Adventure SUV (4x4)', price: 55 },
     { id: 'c3', name: 'Compact Electric', price: 40 },
  ];

  const tours = [
     { id: 't1', name: 'VIP City Helicopter Tour', price: 299 },
     { id: 't2', name: 'Historical Heritage Walk', price: 45 },
     { id: 't3', name: 'Gourmet Safari Dinner', price: 110 },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center selection:bg-brand-primary selection:text-white">

      <main className="w-full max-w-7xl mx-auto px-6 py-24 pb-48">
        <button
          onClick={() => router.back()}
          className="mb-12 flex items-center gap-3 text-white/30 hover:text-white font-black text-[10px] uppercase tracking-[0.4em] transition-all group italic"
        >
          <div className="w-10 h-10 rounded-xl bg-white/5 group-hover:bg-white/10 flex items-center justify-center transition-all border border-white/10">
             <ChevronLeft className="w-5 h-5" />
          </div>
          Abort Operations / Return
        </button>

        <div className="flex flex-col xl:grid xl:grid-cols-12 gap-16">
          {/* Detailed Transaction Summary */}
          <div className="xl:col-span-7 space-y-12">
            <div className="bg-white/5 rounded-[4rem] p-12 border border-white/10 shadow-2xl relative overflow-hidden group backdrop-blur-3xl">
               <div className="absolute top-0 right-0 w-96 h-96 bg-brand-primary/5 blur-[120px] pointer-events-none"></div>
               <div className="flex items-center gap-4 mb-10 border-b border-white/5 pb-8 relative z-10">
                  <div className="w-12 h-12 bg-brand-primary rounded-2xl flex items-center justify-center text-white shadow-xl rotate-[-6deg]">
                     <ShieldCheck className="w-6 h-6" />
                  </div>
                  <div>
                     <h2 className="text-3xl font-black italic uppercase tracking-tighter text-white">Secure Settlement</h2>
                     <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em] italic">Node: Wilmington Delta-9</p>
                  </div>
               </div>

               <div className="space-y-10 relative z-10">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-10">
                     <div className="flex-1">
                        <p className="text-[11px] font-black text-white/20 uppercase tracking-[0.3em] mb-4 italic leading-none">Operation Manifest</p>
                        <p className="text-4xl font-black text-white leading-[0.9] uppercase italic tracking-tighter max-w-md">{description}</p>
                     </div>
                     <div className="text-right">
                        <p className="text-[11px] font-black text-white/20 uppercase tracking-[0.3em] mb-4 italic leading-none">Consolidated Debt</p>
                        <p className="text-6xl font-black text-brand-secondary tracking-tighter italic leading-none shadow-brand-secondary/20">{formatPricing(amount, currency)}</p>
                     </div>
                  </div>
                  
                  <div className="bg-slate-900 rounded-[2.5rem] p-8 border border-white/5 flex items-center justify-between shadow-inner">
                     <div className="flex items-center gap-6">
                        <div className="w-16 h-16 bg-brand-primary/10 rounded-[1.5rem] flex items-center justify-center text-brand-primary border border-brand-primary/20 shadow-xl">
                           <Lock className="w-8 h-8" />
                        </div>
                        <div>
                           <p className="text-sm font-black text-white uppercase tracking-widest leading-none mb-2 italic">PCI-DSS 4.0 Standard Pulse</p>
                           <p className="text-[10px] text-white/40 font-black uppercase tracking-[0.2em]">DIRECT AGENT-TO-BANK NODE: ACTIVE</p>
                        </div>
                     </div>
                     <div className="hidden md:flex flex-col items-end">
                        <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_#10b981]"></div>
                        <span className="text-[8px] font-black text-emerald-500 uppercase tracking-widest mt-2">{t('connected')}</span>
                     </div>
                  </div>
               </div>
            </div>

            <div className="bg-brand-primary rounded-[4rem] p-12 text-white space-y-10 relative overflow-hidden shadow-2xl group">
               <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 blur-[150px] pointer-events-none group-hover:scale-110 transition-transform duration-[10s]"></div>
               <div className="relative z-10">
                  <h3 className="text-2xl font-black italic uppercase tracking-tighter mb-10 border-b border-white/20 pb-6 leading-none">02. Safety Ledger</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                     {[
                       'AES-256 Bit Encryption Hub',
                       'Direct Card-to-Node Verify',
                       'Anti-Fraud Neural Guard',
                       'Zero-Cloud Persistence Protocol',
                       '24/7 Cybersecurity Desk',
                       'Legal Identity Verified'
                     ].map(p => (
                       <div key={p} className="flex gap-4 text-[10px] font-black text-white uppercase tracking-[0.3em] leading-relaxed group/item">
                          <CheckCircle2 className="w-4 h-4 text-brand-secondary group-hover/item:scale-110 transition-transform" /> {p}
                       </div>
                     ))}
                  </div>
               </div>
            </div>

            {/* Trip Customization - Premium Integrated */}
            <div className="bg-white/5 rounded-[4rem] p-12 border border-white/10 shadow-xl space-y-12 backdrop-blur-3xl">
               <div className="flex items-center gap-5 border-b border-white/5 pb-8">
                  <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-brand-secondary border border-white/10 shadow-xl">
                     <Zap className="w-6 h-6" />
                  </div>
                  <div>
                     <h3 className="text-2xl font-black italic uppercase tracking-tighter text-white leading-none mb-2">{t('customize_deployment')}</h3>
                     <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em] italic">{t('sync_secondary_assets')}</p>
                  </div>
               </div>

               <div className="space-y-12">
                  {/* Hotels */}
                  <div>
                     <p className="text-[11px] font-black text-brand-secondary uppercase tracking-[0.4em] mb-6 flex items-center gap-3 italic leading-none">
                        <span className="w-2 h-2 bg-brand-secondary rounded-full"></span> 宿泊 {t('hotels_available')}
                     </p>
                     <div className="flex overflow-x-auto gap-5 pb-6 custom-scrollbar no-scrollbar">
                        {hotels.map((h: any) => (
                           <button key={h.id} onClick={() => setSelectedHotel(selectedHotel === h.name ? '' : h.name)}
                              className={`shrink-0 w-64 p-6 rounded-[2.5rem] border-2 transition-all text-left group ${selectedHotel === h.name ? 'border-brand-secondary bg-brand-secondary/10 shadow-[0_0_30px_#facc1520]' : 'border-white/5 bg-white/5 hover:border-white/10 hover:bg-white/10'}`}>
                              <p className={`text-[13px] font-black uppercase italic tracking-tighter mb-2 ${selectedHotel === h.name ? 'text-brand-secondary' : 'text-white'}`}>{h.name}</p>
                              <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">+${h.price} {t('night_per')}</p>
                           </button>
                        ))}
                     </div>
                  </div>

                  {/* Cars */}
                  <div>
                     <p className="text-[11px] font-black text-brand-primary uppercase tracking-[0.4em] mb-6 flex items-center gap-3 italic leading-none">
                        <span className="w-2 h-2 bg-brand-primary rounded-full"></span> {t('cars_available')}
                     </p>
                     <div className="flex overflow-x-auto gap-5 pb-6 custom-scrollbar no-scrollbar">
                        {cars.map((c: any) => (
                           <button key={c.id} onClick={() => setSelectedCar(selectedCar === c.name ? '' : c.name)}
                              className={`shrink-0 w-64 p-6 rounded-[2.5rem] border-2 transition-all text-left group ${selectedCar === c.name ? 'border-brand-primary bg-brand-primary/10 shadow-[0_0_30px_#eb3b5a20]' : 'border-white/5 bg-white/5 hover:border-white/10 hover:bg-white/10'}`}>
                              <p className={`text-[13px] font-black uppercase italic tracking-tighter mb-2 ${selectedCar === c.name ? 'text-brand-primary' : 'text-white'}`}>{c.name}</p>
                              <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">+${c.price} {t('day_per')}</p>
                           </button>
                        ))}
                     </div>
                  </div>
               </div>
            </div>
          </div>

          {/* RIGHT COLUMN: AUTHORIZATION FORM */}
          <div className="xl:col-span-5 space-y-8">
             <form onSubmit={handlePayment} className="bg-slate-900 rounded-[4.5rem] p-12 border border-white/10 shadow-[0_60px_120px_rgba(0,0,0,0.8)] space-y-12 animate-in slide-in-from-right-12 duration-1000 sticky top-32">
                <div className="flex flex-col gap-10">
                   <div className="flex items-center justify-between border-b border-white/5 pb-8">
                      <div>
                         <h2 className="text-3xl font-black text-white uppercase italic tracking-tighter leading-none mb-2">Authorize</h2>
                         <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em] italic leading-none">Identity Verification Required</p>
                      </div>
                      <div className="flex gap-4">
                         <CreditCard className="w-10 h-10 text-white/20 group-hover:text-brand-secondary transition-colors" />
                      </div>
                   </div>

                   <div className="space-y-10">
                      <div>
                         <label className="block text-[11px] font-black text-white/20 uppercase tracking-[0.3em] mb-4 ml-3 italic leading-none">01. Official Full Name</label>
                         <input type="text" name="cardName" value={form.cardName} onChange={handleChange} placeholder="AS PRINTED ON ID" required
                           className="w-full bg-black/40 border border-white/5 rounded-[2rem] px-8 py-6 font-black text-white italic placeholder:text-white/10 focus:bg-white/5 focus:border-brand-secondary transition-all outline-none uppercase text-base" />
                      </div>
                      <div>
                          <label className="block text-[11px] font-black text-white/20 uppercase tracking-[0.3em] mb-4 ml-3 italic leading-none">02. Passport Authority Node</label>
                          <input type="text" name="passportNumber" value={form.passportNumber} onChange={handleChange} placeholder="LXXXXXXX / PASSPORT ID" required
                            className="w-full bg-black/40 border border-white/5 rounded-[2rem] px-8 py-6 font-black text-white italic placeholder:text-white/10 focus:bg-white/5 focus:border-brand-secondary transition-all outline-none uppercase text-base" />
                       </div>

                    <div className="bg-brand-secondary text-brand-primary rounded-[3rem] p-10 text-center space-y-6 shadow-[0_0_50px_rgba(250,204,21,0.15)] relative overflow-hidden">
                       <div className="absolute top-0 left-0 w-full h-1 bg-brand-primary opacity-20"></div>
                       <p className="text-sm font-black leading-tight uppercase italic relative z-10">
                          Secure Settlement of <br/>
                          <span className="text-4xl font-black block mt-3 shadow-brand-secondary/40">{currency} {amount}</span>
                       </p>
                       <div className="flex items-center justify-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] bg-black/5 py-3 rounded-2xl relative z-10">
                          <Zap className="w-4 h-4 fill-brand-primary" />
                          IRIS ACTIVE GATEWAY SYNC
                       </div>
                    </div>
                   </div>

                   {error && <div className="p-6 bg-red-600/10 border border-red-500/20 rounded-[2.5rem] text-red-500 text-[10px] font-black uppercase tracking-[0.3em] text-center leading-relaxed">Error Code: XM-9 <br/> {error}</div>}

                   <button type="submit" disabled={loading}
                    className="w-full bg-white text-slate-950 font-black py-10 rounded-[3.5rem] shadow-[0_30px_60px_rgba(255,255,255,0.1)] hover:bg-brand-secondary transition-all transform hover:scale-[1.02] active:scale-95 flex flex-col items-center justify-center group overflow-hidden relative">
                      <span className="text-[11px] font-black uppercase tracking-[0.5em] mb-2 leading-none">{loading ? 'SYNCHRONIZING...' : 'AUTHORIZE DEPLOYMENT'}</span>
                      <span className="text-4xl font-black italic tracking-tighter leading-none shadow-brand-secondary/20">{formatPricing(amount, currency)}</span>
                   </button>
                   
                   <div className="flex flex-col items-center gap-6 pt-4">
                      <div className="flex items-center gap-4 text-white/20">
                         <div className="w-px h-6 bg-white/10"></div>
                         <p className="text-[8px] font-black uppercase tracking-[0.6em] italic">Stripe Encrypted Node</p>
                         <div className="w-px h-6 bg-white/10"></div>
                      </div>
                      <div className="flex gap-6 opacity-30">
                         {['VISA', 'MASTERCARD', 'AMEX', 'DISCOVER'].map(c => (
                            <span key={c} className="text-[9px] font-black tracking-widest">{c}</span>
                         ))}
                      </div>
                   </div>
                </div>
             </form>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function SecurePaymentPage() {
   return (
      <Suspense fallback={<div className="min-h-screen bg-slate-950 flex items-center justify-center animate-pulse text-white/20 font-black uppercase tracking-[0.5em] italic">Accessing Secured Gateway Hub...</div>}>
         <SecurePaymentContent />
      </Suspense>
   );
}
