'use client';
import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ProcedureProgress } from '@/components/ProcedureProgress';

function HotelsContent() {
  const searchParams = useSearchParams();
  const completedFlight = searchParams.get('completedFlight');
  const [city, setCity] = useState(searchParams.get('city') || '');
  const [checkIn, setCheckIn] = useState(searchParams.get('checkIn') || new Date(Date.now() + 7 * 864e5).toISOString().split('T')[0]);
  const [checkOut, setCheckOut] = useState(searchParams.get('checkOut') || new Date(Date.now() + 10 * 864e5).toISOString().split('T')[0]);
  const [guests, setGuests] = useState(1);
  const [hotels, setHotels] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const cityName = (code: string) => {
    const map: Record<string, string> = { NYC: 'New York', LHR: 'London', LAX: 'Los Angeles', SFO: 'San Francisco', CDG: 'Paris', HND: 'Tokyo' };
    return map[code.toUpperCase()] || code;
  };

  const nights = Math.max(1, Math.ceil((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / 864e5));

  const handleSearchHotels = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setLoading(true);
    setSearched(true);
    try {
      const res = await fetch(`/api/hotels/search?destination=${city}&checkin=${checkIn}&checkout=${checkOut}&rooms=${guests}`);
      const data = await res.json();
      setHotels(data.results || []);
    } catch (err) {
      setHotels([]);
    }
    setLoading(false);
  };

  useEffect(() => { if (searchParams.get('city')) handleSearchHotels(); }, []);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center">
      <ProcedureProgress currentStep={2} />
      {completedFlight && (
        <div className="w-full bg-emerald-600 border-b border-white/10 py-4 shadow-xl">
           <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4 text-white">
                 <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-xl shadow-lg">⚡</div>
                 <div>
                    <h3 className="text-sm font-black uppercase tracking-widest leading-none mb-1">Step 2: Secure Your Stay in {cityName(city)}</h3>
                    <p className="text-[10px] text-white/70 font-bold uppercase tracking-widest">Pricing Guard & Market Buffer Applied</p>
                 </div>
              </div>
              <Link href="/success" className="bg-white/10 hover:bg-white/20 text-white border border-white/20 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">Skip to Checkout →</Link>
           </div>
        </div>
      )}

      <div className="w-full bg-emerald-700 py-12 px-4 shadow-xl relative overflow-hidden">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-4xl font-black text-white mb-8 text-center md:text-left italic uppercase tracking-tighter">ASAP <span className="text-emerald-300">EXCLU</span>SIVE HOTELS</h1>
          
          <form onSubmit={handleSearchHotels} className="bg-white rounded-[2.5rem] p-8 grid grid-cols-1 md:grid-cols-5 gap-4 items-end shadow-2xl relative">
            <div className="md:col-span-1">
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Destination</label>
              <input type="text" value={city} onChange={e => setCity(e.target.value)} placeholder="City or Hotel" required
                className="w-full border-none bg-slate-50 rounded-2xl px-5 py-4 text-sm font-bold focus:ring-2 focus:ring-emerald-500" />
              <div className="flex flex-wrap gap-2 mt-2 ml-1">
                {['London', 'Paris', 'Tokyo', 'Bali'].map(n => (
                  <button key={n} type="button" onClick={() => setCity(n)} className="text-[8px] font-black text-white/40 hover:text-emerald-300 transition-colors border border-white/5 rounded px-1.5 py-0.5 uppercase tracking-tighter">{n}</button>
                ))}
                <span className="text-[8px] font-black text-white/20 mt-0.5">← CHEAT</span>
              </div>
            </div>
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Check-In</label>
              <input type="date" value={checkIn} onChange={e => setCheckIn(e.target.value)}
                className="w-full border-none bg-slate-50 rounded-2xl px-5 py-4 text-sm font-bold focus:ring-2 focus:ring-emerald-500" />
            </div>
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Check-Out</label>
              <input type="date" value={checkOut} onChange={e => setCheckOut(e.target.value)}
                className="w-full border-none bg-slate-50 rounded-2xl px-5 py-4 text-sm font-bold focus:ring-2 focus:ring-emerald-500" />
            </div>
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Guests</label>
              <select value={guests} onChange={e => setGuests(Number(e.target.value))}
                className="w-full border-none bg-slate-50 rounded-2xl px-5 py-4 text-sm font-bold bg-white focus:ring-2 focus:ring-emerald-500 appearance-none">
                {[1,2,3,4,5,6].map(n => <option key={n} value={n}>{n} Adult{n>1?'s':''}</option>)}
              </select>
            </div>
            <button type="submit" disabled={loading}
              className="w-full bg-emerald-600 hover:bg-emerald-800 text-white font-black py-4.5 rounded-2xl transition-all shadow-xl flex items-center justify-center gap-2 transform active:scale-95">
              {loading ? 'POLISHING RATES...' : '🔍 SEARCH ASSETS'}
            </button>
          </form>
          
          <div className="mt-6 flex flex-wrap gap-4 overflow-x-auto pb-2 scrollbar-none opacity-60">
            {['No-Loss Guard Active', 'Market Rate Evaluator', 'Hilton & Marriott Approved', 'Private Wholesaler Rates'].map(p => (
              <span key={p} className="text-[10px] whitespace-nowrap font-black bg-white/10 text-white px-4 py-1.5 rounded-full uppercase tracking-widest">🛡️ {p}</span>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl w-full mx-auto px-4 py-16">
        {loading && <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10 animate-in fade-in duration-500">{[1,2,3,4,5,6].map(i => <div key={i} className="bg-white rounded-[3rem] h-80 animate-pulse border border-slate-200"></div>)}</div>}

        {!loading && hotels.length > 0 && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10 animate-in slide-in-from-bottom-8 duration-700">
            {hotels.map((h: any) => (
              <div key={h.id} className="bg-white rounded-[3rem] border border-slate-200 overflow-hidden hover:border-emerald-600/40 hover:shadow-2xl transition-all group flex flex-col relative">
                <div className="h-64 relative overflow-hidden">
                  <img src={h.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" alt={h.name} />
                  <div className="absolute top-6 left-6 bg-brand-primary text-white text-[9px] font-black px-4 py-1.5 rounded-full uppercase tracking-[0.2em] shadow-2xl">ASAP CURATED</div>
                </div>
                <div className="p-10 flex flex-col flex-1">
                  <div className="flex justify-between items-start mb-6">
                    <h3 className="text-2xl font-black text-slate-800 leading-tight group-hover:text-emerald-700 transition-colors uppercase italic tracking-tighter">{h.name}</h3>
                    <div className="bg-emerald-50 text-emerald-700 text-[10px] font-black px-2 py-1 rounded-lg">{h.rating} / 10</div>
                  </div>
                  
                  <div className="flex flex-col gap-4 mb-10">
                    <div className="flex items-center gap-2">
                       <span className="text-[10px] font-black bg-emerald-600 text-white px-3 py-1.5 rounded-full uppercase tracking-[0.2em] italic">{h.class}</span>
                       <span className="text-[10px] font-black bg-slate-900 text-white px-3 py-1.5 rounded-full uppercase tracking-[0.2em]">{h.mealPlan}</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                       {(h.amenities || h.perks || []).map((p: string) => (
                         <span key={p} className="text-[9px] font-black bg-slate-50 text-slate-400 px-3 py-1.5 rounded-full uppercase tracking-widest border border-slate-100">{p}</span>
                       ))}
                    </div>
                  </div>

                  <div className="mt-auto flex items-center justify-between border-t border-slate-50 pt-8">
                    <div>
                      <div className="text-[10px] font-black text-slate-300 line-through decoration-emerald-800/20 mb-2 uppercase tracking-widest">Market: ${(h.totalRate * 1.5).toFixed(0)}</div>
                      <div className="text-4xl font-black text-emerald-600 leading-none tracking-tighter">${h.totalRate.toFixed(2)}</div>
                      <div className="text-[10px] font-black text-slate-400 mt-3 uppercase tracking-[0.2em]">Verified Nightly Rate</div>
                    </div>
                    <Link href={`/hotels/checkout?hotelId=${h.id}&name=${encodeURIComponent(h.name)}&city=${encodeURIComponent(city)}&checkIn=${checkIn}&checkOut=${checkOut}&priceCents=${h.totalRate * nights * 100}`}
                      className="bg-emerald-600 text-white font-black px-12 py-5 rounded-[2rem] shadow-xl hover:bg-emerald-800 transition-all text-sm uppercase tracking-widest active:scale-95 transform">
                      Secure →
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {!searched && !loading && (
          <div className="text-center py-32 border-2 border-dashed border-slate-200 rounded-[4rem]">
             <span className="text-9xl grayscale opacity-10 block mb-10">🏨</span>
             <h2 className="text-4xl font-black text-slate-300 uppercase italic tracking-tighter">Awaiting Destination...</h2>
             <p className="text-slate-400 font-bold uppercase tracking-widest mt-6">Input location above to unlock unadvertised contract assets.</p>
          </div>
        )}
      </div>

      <div className="bg-brand-sidebar w-full py-20 px-6 text-white text-center border-t border-white/5">
         <h3 className="text-2xl font-black mb-6 italic uppercase tracking-tighter italic">World Travel Partner Since 2001</h3>
         <p className="text-white/40 text-sm max-w-2xl mx-auto leading-relaxed font-bold italic">Delaware HQ · A+ Rated by BBB. All hotel stays include our No-Loss Pricing Guarantee and 24/7 client intercept.</p>
      </div>
    </div>
  );
}

export default function HotelsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center animate-pulse text-slate-400 font-black uppercase tracking-widest">Accessing Hotel Inventory...</div>}>
      <HotelsContent />
    </Suspense>
  );
}
