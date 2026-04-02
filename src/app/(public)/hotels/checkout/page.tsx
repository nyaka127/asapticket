'use client';
import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { formatPricing } from '@/lib/pricing';

function HotelCheckoutContent() {
  const sp = useSearchParams();
  const name = sp.get('name') || 'Hotel';
  const city = sp.get('city') || '';
  const checkIn = sp.get('checkIn') || '';
  const checkOut = sp.get('checkOut') || '';
  const priceCents = parseInt(sp.get('priceCents') || '0', 10);
  const nights = parseInt(sp.get('nights') || '1', 10);
  const guests = sp.get('guests') || '1';
  const flow = sp.get('flow') || 'direct';

  const [form, setForm] = useState({ guestName: '', email: '', roomType: 'Standard King', specialReqs: '' });
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
      const res = await fetch('/api/hotels/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, city, checkIn, checkOut, priceCents, nights, guests, flow, ...form }),
      });
      if (res.ok) {
        const { bookingId } = await res.json();
        const sessionRes = await fetch('/api/stripe/create-session', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ bookingId, type: 'hotel' }),
        });
        if (sessionRes.ok) {
          const { url } = await sessionRes.json();
          window.location.href = url;
        } else {
          throw new Error('Failed to create payment session');
        }
        return;
      }
      throw new Error('Booking failed');
    } catch (err: any) { setError(err.message); setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4">
      <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-10">
        <div className="flex-1 space-y-8">
           <div className="flex items-center gap-3">
              <span className="text-3xl">🔒</span>
              <div>
                 <h1 className="text-3xl font-black italic uppercase tracking-tighter text-slate-800">Secure Reservation</h1>
                 <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest mt-1">End-to-End Encryption Active · Certified Gateway</p>
              </div>
           </div>

          <form onSubmit={handleSubmit} className="bg-white rounded-[3rem] border border-slate-200 shadow-2xl p-10 space-y-8 animate-in slide-in-from-bottom-6 duration-700">
            <div>
               <h2 className="text-xl font-black text-slate-800 uppercase italic tracking-tighter border-b border-slate-100 pb-4 mb-6">Guest Manifest</h2>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div>
                   <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Lead Guest Name *</label>
                   <input type="text" required value={form.guestName} onChange={e => setForm({...form, guestName: e.target.value})}
                     className="w-full border-none bg-slate-50 rounded-2xl px-5 py-4 text-sm font-bold focus:ring-2 focus:ring-emerald-500 shadow-sm" />
                 </div>
                 <div>
                   <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Email Address *</label>
                   <input type="email" required value={form.email} onChange={e => setForm({...form, email: e.target.value})}
                     className="w-full border-none bg-slate-50 rounded-2xl px-5 py-4 text-sm font-bold focus:ring-2 focus:ring-emerald-500 shadow-sm" />
                 </div>
                 <div>
                   <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Room Class Preference</label>
                   <select value={form.roomType} onChange={e => setForm({...form, roomType: e.target.value})}
                     className="w-full border-none bg-slate-50 rounded-2xl px-5 py-4 text-sm font-bold bg-slate-50 focus:ring-2 focus:ring-emerald-500 shadow-sm">
                     <option>Standard King</option><option>Standard Queen</option>
                     <option>Deluxe King</option><option>Suite</option><option>Double Room</option>
                   </select>
                 </div>
                 <div>
                   <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Special Handling Requests</label>
                   <input type="text" value={form.specialReqs} onChange={e => setForm({...form, specialReqs: e.target.value})}
                     placeholder="e.g. high floor, early check-in"
                     className="w-full border-none bg-slate-50 rounded-2xl px-5 py-4 text-sm font-bold focus:ring-2 focus:ring-emerald-500 shadow-sm" />
                 </div>
               </div>
            </div>

            <div className="pt-6">
               <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden">
                  <div className="absolute -top-10 -right-10 w-40 h-40 bg-emerald-500/20 blur-[50px]"></div>
                  <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                     <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-xl shadow-inner border border-white/5">💳</div>
                        <div>
                           <div className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">PCI DSS Compliant</div>
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
              className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white font-black py-5 rounded-full text-lg uppercase tracking-widest transition-all shadow-xl shadow-emerald-600/20 flex items-center justify-center gap-3 transform active:scale-95">
              {loading ? (
                 <span className="flex items-center gap-2">
                    <span className="w-5 h-5 border-4 border-white/30 border-t-white rounded-full animate-spin"></span>
                    SECURING TICKET...
                 </span>
              ) : <>🔒 Authorize {formatPricing(priceCents/100, activeCurrency)}</>}
            </button>
            <div className="text-center text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] pt-4 flex items-center justify-center gap-2">
               <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
               Data is transmitted securely
            </div>
          </form>
        </div>

        <aside className="w-full lg:w-[400px] space-y-6">
          <div className="bg-white rounded-[3rem] border border-slate-200 shadow-xl overflow-hidden relative">
            <div className="h-32 bg-slate-900 absolute top-0 left-0 right-0 p-8">
               <div className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Confirmed Asset</div>
               <h3 className="text-xl font-black text-white italic uppercase tracking-tighter mt-1 truncate">{name}</h3>
            </div>
            <div className="pt-36 p-8 relative z-10 space-y-6">
              <div className="flex justify-between items-end border-b border-slate-100 pb-6">
                 <div>
                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Due</div>
                    <div className="text-4xl font-black text-emerald-600 tracking-tighter">{formatPricing(priceCents/100, activeCurrency)}</div>
                 </div>
                 <div className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full uppercase tracking-widest">No Hidden Fees</div>
              </div>
              
              <div className="space-y-4">
                 <div>
                    <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Destination Location</div>
                    <div className="text-sm font-black text-slate-800">{city}</div>
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                    <div>
                       <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Check-in</div>
                       <div className="text-sm font-black text-slate-800">{checkIn}</div>
                    </div>
                    <div>
                       <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Check-out</div>
                       <div className="text-sm font-black text-slate-800">{checkOut}</div>
                    </div>
                 </div>
                 <div className="grid grid-cols-2 gap-4 pt-2 border-t border-slate-50">
                    <div>
                       <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Duration</div>
                       <div className="text-sm font-black text-slate-800">{nights} Night{nights>1?'s':''}</div>
                    </div>
                    <div>
                       <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Ticketing For</div>
                       <div className="text-sm font-black text-slate-800">{guests}</div>
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

export default function HotelCheckoutPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center animate-pulse text-slate-400">Loading...</div>}>
      <HotelCheckoutContent />
    </Suspense>
  );
}
