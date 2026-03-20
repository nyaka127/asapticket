'use client';
import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { formatPricing } from '@/lib/pricing';

function CarCheckoutContent() {
  const sp = useSearchParams();
  const provider = sp.get('provider') || 'Rental Company';
  const model = sp.get('model') || 'Vehicle';
  const carClass = sp.get('class') || 'Standard';
  const location = sp.get('location') || '';
  const pickupDate = sp.get('pickupDate') || '';
  const dropoffDate = sp.get('dropoffDate') || '';
  const priceCents = parseInt(sp.get('priceCents') || '0', 10);
  const days = sp.get('days') || '1';

  const [form, setForm] = useState({ driverName: '', email: '', dob: '', licenseCountry: 'USA' });
  const [activeCurrency, setActiveCurrency] = useState('USD');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('user-currency');
    if (saved) setActiveCurrency(saved);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/cars/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ provider, model, carClass, location, pickupDate, dropoffDate, priceCents, days, ...form }),
      });
      if (!res.ok) throw new Error('Reservation failed');
      const { url } = await res.json();
      if (url) { window.location.href = url; return; }
      throw new Error('No URL');
    } catch (err: any) { setError(err.message); setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4">
      <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-10">
        <div className="flex-1 space-y-8">
           <div className="flex items-center gap-3">
              <span className="text-3xl">🔒</span>
              <div>
                 <h1 className="text-3xl font-black italic uppercase tracking-tighter text-slate-800">Secure Ticketing & Dispatch</h1>
                 <p className="text-[10px] font-bold text-orange-600 uppercase tracking-widest mt-1">End-to-End Encryption Active · Certified Gateway</p>
              </div>
           </div>

          <form onSubmit={handleSubmit} className="bg-white rounded-[3rem] border border-slate-200 shadow-2xl p-10 space-y-8 animate-in slide-in-from-bottom-6 duration-700">
            <div>
               <h2 className="text-xl font-black text-slate-800 uppercase italic tracking-tighter border-b border-slate-100 pb-4 mb-6">Driver Manifest</h2>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div>
                   <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Primary Driver Name *</label>
                   <input type="text" required value={form.driverName} onChange={e => setForm({...form, driverName: e.target.value})}
                     className="w-full border-none bg-slate-50 rounded-2xl px-5 py-4 text-sm font-bold focus:ring-2 focus:ring-orange-500 shadow-sm" />
                 </div>
                 <div>
                   <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Email Address *</label>
                   <input type="email" required value={form.email} onChange={e => setForm({...form, email: e.target.value})}
                     className="w-full border-none bg-slate-50 rounded-2xl px-5 py-4 text-sm font-bold focus:ring-2 focus:ring-orange-500 shadow-sm" />
                 </div>
                 <div>
                   <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Date of Birth</label>
                   <input type="date" value={form.dob} onChange={e => setForm({...form, dob: e.target.value})}
                     className="w-full border-none bg-slate-50 rounded-2xl px-5 py-4 text-sm font-bold focus:ring-2 focus:ring-orange-500 shadow-sm" />
                 </div>
                 <div>
                   <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">License Country</label>
                   <select value={form.licenseCountry} onChange={e => setForm({...form, licenseCountry: e.target.value})}
                     className="w-full border-none bg-slate-50 rounded-2xl px-5 py-4 text-sm font-bold bg-slate-50 focus:ring-2 focus:ring-orange-500 shadow-sm">
                     {['USA', 'UK', 'Canada', 'Australia', 'Germany', 'France', 'UAE', 'Other'].map(c => <option key={c}>{c}</option>)}
                   </select>
                 </div>
               </div>
            </div>

            <div className="pt-6">
               <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden">
                  <div className="absolute -top-10 -right-10 w-40 h-40 bg-orange-500/20 blur-[50px]"></div>
                  <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                     <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-xl shadow-inner border border-white/5">💳</div>
                        <div>
                           <div className="text-[10px] font-black text-orange-400 uppercase tracking-widest">PCI DSS Compliant</div>
                           <div className="text-lg font-black italic uppercase tracking-tighter mt-1">Direct Settlement</div>
                        </div>
                     </div>
                     <div className="flex gap-2">
                        {['VISA', 'MASTERCARD', 'AMEX'].map(cc => (
                           <div key={cc} className="text-[8px] font-black text-white/40 uppercase tracking-widest border border-white/10 px-3 py-1.5 rounded bg-white/5">
                              {cc}
                           </div>
                        ))}
                     </div>
                  </div>
               </div>
            </div>

            {error && <div className="bg-red-50 text-red-700 text-sm font-bold rounded-2xl px-5 py-4 border border-red-200">⚠️ {error}</div>}
            
            <button type="submit" disabled={loading}
              className="w-full bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white font-black py-5 rounded-full text-lg uppercase tracking-widest transition-all shadow-xl shadow-orange-500/20 flex items-center justify-center gap-3 transform active:scale-95">
              {loading ? (
                 <span className="flex items-center gap-2">
                    <span className="w-5 h-5 border-4 border-white/30 border-t-white rounded-full animate-spin"></span>
                    VERIFYING DISPATCH...
                 </span>
              ) : <>🔒 Secure Ticket {formatPricing(priceCents/100, activeCurrency)}</>}
            </button>
            <div className="text-center text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] pt-4 flex items-center justify-center gap-2">
               <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></span>
               Data is transmitted securely
            </div>
          </form>
        </div>

        <aside className="w-full lg:w-[400px] space-y-6">
          <div className="bg-white rounded-[3rem] border border-slate-200 shadow-xl overflow-hidden relative">
            <div className="h-32 bg-slate-900 absolute top-0 left-0 right-0 p-8">
               <div className="text-[10px] font-black text-orange-400 uppercase tracking-widest">{provider} Allocation</div>
               <h3 className="text-xl font-black text-white italic uppercase tracking-tighter mt-1 truncate">{model}</h3>
            </div>
            <div className="pt-36 p-8 relative z-10 space-y-6">
              <div className="flex justify-between items-end border-b border-slate-100 pb-6">
                 <div>
                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Due</div>
                    <div className="text-4xl font-black text-orange-500 tracking-tighter">{formatPricing(priceCents/100, activeCurrency)}</div>
                 </div>
                 <div className="text-[10px] font-black text-orange-600 bg-orange-50 px-3 py-1.5 rounded-full uppercase tracking-widest text-right">
                    No Hidden Fees<br/>Ticketing Pending
                 </div>
              </div>
              
              <div className="space-y-4">
                 <div>
                    <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Pick-up / Dispatch Hub</div>
                    <div className="text-sm font-black text-slate-800">{location}</div>
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                    <div>
                       <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Departure</div>
                       <div className="text-sm font-black text-slate-800">{pickupDate}</div>
                    </div>
                    <div>
                       <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Return</div>
                       <div className="text-sm font-black text-slate-800">{dropoffDate}</div>
                    </div>
                 </div>
                 <div className="grid grid-cols-2 gap-4 pt-2 border-t border-slate-50">
                    <div>
                       <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Vehicle Class</div>
                       <div className="text-sm font-black text-slate-800">{carClass}</div>
                    </div>
                    <div>
                       <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Duration</div>
                       <div className="text-sm font-black text-slate-800">{days} Day{parseInt(days)>1?'s':''}</div>
                    </div>
                 </div>
              </div>
              <div className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] pt-4 border-t border-slate-100 text-center flex items-center justify-center gap-1.5">
                 🔒 Verified Booking Process
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

export default function CarCheckoutPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center animate-pulse text-slate-400">Loading...</div>}>
      <CarCheckoutContent />
    </Suspense>
  );
}
