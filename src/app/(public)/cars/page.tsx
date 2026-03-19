'use client';
import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ProcedureProgress } from '@/components/ProcedureProgress';

function CarsContent() {
  const searchParams = useSearchParams();
  const completedStep2 = searchParams.get('completedStep2');
  const [city, setCity] = useState(searchParams.get('city') || '');
  const [pickupDate, setPickupDate] = useState(searchParams.get('pickupDate') || new Date(Date.now() + 10 * 864e5).toISOString().split('T')[0]);
  const [dropoffDate, setDropoffDate] = useState(searchParams.get('dropoffDate') || new Date(Date.now() + 14 * 864e5).toISOString().split('T')[0]);
  
  const [cars, setCars] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSearchCars = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setLoading(true);
    setSearched(true);
    try {
      const res = await fetch(`/api/cars/search?apiKey=DEMO&userTrackId=demo-user`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          searchStartParameters: {
            pickup: { location: { type: 'city', value: city }, date: pickupDate, hour: 10, minute: 0 },
            dropoff: { date: dropoffDate, hour: 10, minute: 0 }
          }
        })
      });
      const data = await res.json();
      setCars(data.results || []);
    } catch (err) {
      setCars([]);
    }
    setLoading(false);
  };

  useEffect(() => { if (searchParams.get('city')) handleSearchCars(); }, []);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center">
      <ProcedureProgress currentStep={3} />
      
      <div className="w-full bg-brand-sidebar py-12 px-4 shadow-xl relative overflow-hidden">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-4xl font-black text-white mb-8 text-center md:text-left italic uppercase tracking-tighter italic">ASAP <span className="text-brand-secondary">WORLDWIDE</span> TAXI DISPATCH</h1>
          
          <form onSubmit={handleSearchCars} className="bg-white rounded-[2.5rem] p-8 grid grid-cols-1 md:grid-cols-4 gap-4 items-end shadow-2xl relative">
            <div className="md:col-span-1">
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Pick-Up</label>
              <input type="text" value={city} onChange={e => setCity(e.target.value)} placeholder="City or Airport" required
                className="w-full border-none bg-slate-50 rounded-2xl px-5 py-4 text-sm font-bold focus:ring-2 focus:ring-brand-primary" />
              <div className="flex flex-wrap gap-2 mt-2 ml-1">
                {['NYC', 'London', 'Paris'].map(n => (
                  <button key={n} type="button" onClick={() => setCity(n)} className="text-[8px] font-black text-white/40 hover:text-brand-secondary transition-colors border border-white/5 rounded px-1.5 py-0.5 uppercase tracking-tighter">{n}</button>
                ))}
                <span className="text-[8px] font-black text-white/20 mt-0.5">← CHEAT</span>
              </div>
            </div>
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Pick-Up Date</label>
              <input type="date" value={pickupDate} onChange={e => setPickupDate(e.target.value)}
                className="w-full border-none bg-slate-50 rounded-2xl px-5 py-4 text-sm font-bold focus:ring-2 focus:ring-brand-primary" />
            </div>
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Drop-Off Date</label>
              <input type="date" value={dropoffDate} onChange={e => setDropoffDate(e.target.value)}
                className="w-full border-none bg-slate-50 rounded-2xl px-5 py-4 text-sm font-bold focus:ring-2 focus:ring-brand-primary" />
            </div>
            <button type="submit" disabled={loading}
              className="w-full bg-brand-primary hover:bg-brand-dark text-white font-black py-4.5 rounded-2xl transition-all shadow-xl flex items-center justify-center gap-2 transform active:scale-95">
              {loading ? 'REQUESTING DISPATCH...' : '🔍 SEARCH TAXIS'}
            </button>
          </form>
          
          <div className="mt-8 flex flex-wrap gap-4 overflow-x-auto pb-2 scrollbar-none opacity-60">
            {['Uber & Lyft Integrated', 'Iris V1 Fleet Access', 'Global Taxi Network', 'No-Loss Guard Active'].map(p => (
              <span key={p} className="text-[10px] whitespace-nowrap font-black bg-white/10 text-white px-4 py-1.5 rounded-full uppercase tracking-widest border border-white/10">🛡️ {p}</span>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl w-full mx-auto px-4 py-16">
        {loading && <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">{[1,2,3,4,5,6].map(i => <div key={i} className="bg-white rounded-[3rem] h-[500px] animate-pulse border border-slate-200 shadow-sm"></div>)}</div>}

        {!loading && cars.length > 0 && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10 animate-in slide-in-from-bottom-12 duration-1000">
            {cars.map((c: any) => (
              <div key={c.id} className="bg-white rounded-[3rem] border border-slate-200 overflow-hidden hover:border-brand-primary/40 hover:shadow-2xl transition-all group flex flex-col relative">
                <div className="h-64 relative bg-slate-50 p-6 flex items-center justify-center group">
                   <img src={c.car.image} className="max-w-full max-h-full object-contain group-hover:scale-110 transition-transform duration-1000" alt={c.car.brand} />
                   <div className="absolute top-6 left-6 bg-brand-primary text-white text-[9px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest shadow-lg">IRIS V1 CONTRACT</div>
                </div>
                
                <div className="p-10 flex flex-col flex-1">
                   <div className="flex justify-between items-start mb-6">
                      <div>
                         <h3 className="text-2xl font-black text-slate-800 uppercase italic tracking-tighter truncate">{c.car.brand}</h3>
                         <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">{c.car.type}</p>
                      </div>
                      <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-1 rounded-full">
                         <span className="text-[10px] font-black text-slate-800">{(c.agency || 'AG').toUpperCase()}</span>
                      </div>
                   </div>

                   <div className="flex items-center gap-6 mb-8 text-slate-400 border-b border-slate-50 pb-6">
                      <div className="flex flex-col gap-1 items-center">
                         <span className="text-xl">💺</span>
                         <span className="text-[10px] font-black uppercase">{c.car.passengers} Seats</span>
                      </div>
                      <div className="flex flex-col gap-1 items-center">
                         <span className="text-xl">🧳</span>
                         <span className="text-[10px] font-black uppercase">{c.car.bags} Bags</span>
                      </div>
                      <div className="flex flex-col gap-1 items-center">
                         <span className="text-xl">⚡</span>
                         <span className="text-[10px] font-black uppercase">{c.car.fuel}</span>
                      </div>
                   </div>

                   <div className="mt-auto flex items-end justify-between">
                      <div>
                         <div className="text-[10px] font-black text-slate-300 mb-1 uppercase tracking-widest flex items-center gap-2">
                            <span>Base: ${c.baseFare.toFixed(2)}</span>
                            <span className="w-1 h-1 bg-slate-200 rounded-full"></span>
                            <span className="text-brand-primary/60">${c.pricePerKm.toFixed(2)}/KM</span>
                         </div>
                         <div className="text-4xl font-black text-brand-primary tracking-tighter">${c.priceTotal.toFixed(2)}</div>
                         <div className="text-[10px] font-black text-slate-400 mt-2 uppercase tracking-[0.2em]">Estimate for 20KM · Loss-Guard Protected</div>
                      </div>
                      <Link href={`/cars/checkout?carId=${c.id}&brand=${c.car.brand}&pickup=${pickupDate}&dropoff=${dropoffDate}&priceCents=${c.priceTotal * 100}`}
                        className="bg-brand-primary text-white font-black px-10 py-5 rounded-[2rem] shadow-xl hover:bg-brand-dark transition-all text-xs uppercase tracking-widest active:scale-95 transform">
                        Book Dispatch →
                      </Link>
                   </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {!searched && !loading && (
          <div className="text-center py-40 bg-slate-100 rounded-[5rem] border-4 border-white shadow-inner">
              <span className="text-9xl opacity-10 grayscale block mb-10">🚕</span>
              <h2 className="text-4xl font-black text-slate-300 uppercase italic tracking-tighter leading-none mb-6">Awaiting Taxi Dispatch...</h2>
              <p className="text-slate-400 font-bold uppercase tracking-widest leading-relaxed">Search to access our global network of taxis & chauffeurs.</p>
          </div>
        )}
      </div>

      <div className="bg-brand-sidebar w-full py-24 px-6 text-white text-center border-t border-white/5 mt-10">
         <h3 className="text-3xl font-black mb-6 italic uppercase tracking-tighter italic">Trusted Global Fleet Partner Since 2001</h3>
         <p className="text-white/40 text-sm max-w-2xl mx-auto leading-relaxed font-bold italic">Delaware HQ · A+ Rated by BBB. Integrated with Iris V1 Search. All fleet contracts include the ASAP No-Loss Guarantee.</p>
      </div>
    </div>
  );
}

export default function CarsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center animate-pulse text-slate-400 font-black uppercase tracking-widest">Polling Iris Fleet Inventory...</div>}>
      <CarsContent />
    </Suspense>
  );
}
