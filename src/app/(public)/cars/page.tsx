'use client';
import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ProcedureProgress } from '@/components/ProcedureProgress';
import { formatPricing } from '@/lib/pricing';
import { MAJOR_CITIES } from '@/lib/geo';
import { CurrencySwitcher } from '@/components/CurrencySwitcher';
import { GlobalPublicFooter } from '@/components/GlobalPublicFooter';

function CarsContent() {
  const searchParams = useSearchParams();
  const completedStep2 = searchParams.get('completedStep2');
  const [city, setCity] = useState(searchParams.get('city') || '');
  const [pickupDate, setPickupDate] = useState(searchParams.get('pickupDate') || new Date(Date.now() + 10 * 864e5).toISOString().split('T')[0]);
  const [dropoffDate, setDropoffDate] = useState(searchParams.get('dropoffDate') || new Date(Date.now() + 14 * 864e5).toISOString().split('T')[0]);
  
  const [cars, setCars] = useState<any[]>([]);
  const [activeCurrency, setActiveCurrency] = useState('USD');
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
      
      // Pulse Monitoring dispatch center
      fetch('/api/monitor', {
        method: 'POST',
        body: JSON.stringify({ action: `Car Search: ${city} (${pickupDate})`, source: 'Website' })
      });
    } catch (err) { 
      setCars([]);
    }
    setLoading(false);
  };

  useEffect(() => { 
    if (searchParams.get('city')) handleSearchCars(); 
    const saved = localStorage.getItem('user-currency');
    if (saved) setActiveCurrency(saved);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center">
      <ProcedureProgress currentStep={3} />
      
      {completedStep2 || searchParams.get('completedHotel') ? (
        <div className="w-full bg-brand-primary border-b border-white/10 py-4 shadow-xl">
           <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4 text-white w-full">
                 <div className="hidden md:flex w-10 h-10 bg-white rounded-full items-center justify-center text-xl shadow-lg">⚡</div>
                 <div className="flex-1">
                    <h3 className="text-sm font-black uppercase tracking-widest leading-none mb-1 flex items-center gap-2">Hotel Secured <span className="text-brand-secondary">→</span> Do you need a Car explicitly dispatched to you?</h3>
                    <p className="text-[10px] text-white/70 font-bold uppercase tracking-widest">No-Loss Guard is Active on all global fleets.</p>
                 </div>
              </div>
              <Link href="/success" className="whitespace-nowrap bg-white/10 hover:bg-white/20 text-white border border-white/20 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">
                ⏭️ SKIP CAR RENTAL & FINALIZE TICKETS
              </Link>
           </div>
        </div>
      ) : null}

      <div className="w-full bg-brand-sidebar py-12 px-4 shadow-xl relative overflow-hidden">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-8">
             <h1 className="text-4xl font-black text-white text-center md:text-left italic uppercase tracking-tighter italic">ASAP <span className="text-brand-secondary">WORLDWIDE</span> RENTALS & TAXIS</h1>
             <CurrencySwitcher />
          </div>
          
          <form onSubmit={handleSearchCars} className="bg-white rounded-[2.5rem] p-8 grid grid-cols-1 md:grid-cols-4 gap-6 items-end shadow-2xl relative">
            <div className="md:col-span-1 group relative">
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Pick-Up Hub</label>
              <input type="text" value={city} onChange={e => setCity(e.target.value.toUpperCase())} placeholder="CITY / AIRPORT CODE" maxLength={3} required
                className="w-full border-none bg-slate-50 rounded-2xl px-5 py-4 text-sm font-bold focus:ring-2 focus:ring-brand-primary uppercase" />
              <div className="hidden group-focus-within:grid absolute top-full left-0 md:left-0 w-[90vw] md:w-[700px] z-[120] mt-4 bg-white rounded-[2.5rem] shadow-[0_40px_100px_rgba(0,0,0,0.2)] p-6 md:p-10 grid-cols-1 gap-8 border border-slate-100 animate-in fade-in slide-in-from-top-6 duration-700 max-h-[400px] md:max-h-[600px] overflow-y-auto custom-scrollbar">
                  {[
                    { label: 'Global Mega-Hubs', codes: ['DXB', 'LHR', 'JFK', 'SIN', 'HND', 'CDG', 'FRA', 'SYD', 'HKG', 'DOH'] },
                    { label: 'Americas Dispatch Centers', codes: ['ATL', 'LAX', 'ORD', 'DFW', 'YYZ', 'MEX', 'GRU', 'EZE', 'BOG', 'REC', 'POA', 'MAO'] },
                    { label: 'Africa & Europe Network', codes: ['NBO', 'ADD', 'JNB', 'LOS', 'EBB', 'DKR', 'ACC', 'CAI', 'CPT', 'HRE', 'LUN'] },
                    { label: 'Middle East & Central Asia', codes: ['AUH', 'RUH', 'JED', 'AMM', 'TLV', 'BAH', 'KWI', 'MCT', 'IKA', 'GYD', 'TAS'] },
                    { label: 'Asia & Oceania Regional', codes: ['BKK', 'BOM', 'DEL', 'ICN', 'KUL', 'MEL', 'AKL', 'CGK', 'DPS', 'MNL', 'CEB', 'VTE'] },
                    { label: 'Pacific & Exotic Assets', codes: ['PPT', 'NAN', 'GUM', 'POM', 'VLI', 'NOU', 'APW', 'TBU', 'MLE'] }
                  ].map(cat => (
                    <div key={cat.label}>
                       <div className="text-[10px] font-black text-slate-300 uppercase tracking-[0.25em] mb-4 border-b border-slate-50 pb-3">{cat.label}</div>
                       <div className="grid grid-cols-4 gap-3">
                          {cat.codes.map(code => (
                            <button key={code} type="button" onMouseDown={() => setCity(code)} 
                              className="flex flex-col items-center gap-1.5 p-4 rounded-3xl hover:bg-slate-50 transition-all border border-transparent hover:border-slate-100 group/btn">
                              <span className="text-sm font-black text-slate-800 group-hover/btn:text-brand-primary">{code}</span>
                              <span className="text-[8px] font-bold text-slate-400 uppercase tracking-tighter truncate w-full text-center">{MAJOR_CITIES[code]?.name || code}</span>
                            </button>
                          ))}
                       </div>
                    </div>
                  ))}
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
              {loading ? 'SYNCING FLEET...' : '🔍 DISPATCH ASSET'}
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
          <div className="space-y-12">
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
                     </div>
                     <div className="mt-auto flex items-end justify-between">
                        <div>
                           <div className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] mb-1">Total Disp. Fee</div>
                           <div className="text-4xl font-black text-brand-primary tracking-tighter">{formatPricing(c.priceTotal, activeCurrency)}</div>
                           <div className="text-[10px] font-black text-slate-400 mt-2 uppercase tracking-[0.2em]">Loss-Guard Protected</div>
                        </div>
                        <Link href={`/cars/checkout?carId=${c.id}&model=${encodeURIComponent(c.car?.brand || c.model || 'Vehicle')}&provider=${encodeURIComponent(c.agency || c.provider || 'IRIS Fleet')}&location=${encodeURIComponent(city)}&class=${encodeURIComponent(c.car?.type || c.class || 'Standard')}&pickupDate=${pickupDate}&dropoffDate=${dropoffDate}&days=2&priceCents=${Math.round(c.priceTotal * 100)}${searchParams.get('completedHotel') ? '&flow=step' : ''}`}
                          className="bg-brand-primary text-white font-black px-10 py-5 rounded-[2rem] shadow-xl hover:bg-brand-dark transition-all text-xs uppercase tracking-widest active:scale-95 transform">
                          Book Dispatch →
                        </Link>
                     </div>
                  </div>
                </div>
              ))}
            </div>
 
            {searched && !loading && cars.length === 0 && (
              <div className="text-center py-40 border-2 border-dashed border-slate-200 rounded-[4rem] animate-in fade-in duration-1000">
                  <span className="text-9xl grayscale opacity-10 block mb-10">🚕</span>
                  <h2 className="text-4xl font-black text-slate-300 uppercase italic tracking-tighter leading-none mb-6">Zero Assets Found in {city}</h2>
                  <p className="text-slate-400 font-bold uppercase tracking-widest leading-relaxed">Our global asset sync is currently refreshing. Try a nearby major hub.</p>
              </div>
            )}
 
            {/* 🚕 GLOBAL TAXI RADAR (GOOGLE MAPS) */}
            <div className="mt-20 bg-slate-900 rounded-[3rem] p-4 border border-white/5 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-1000">
               <div className="flex justify-between items-center px-8 py-6">
                 <div>
                   <h2 className="text-xl font-black text-white uppercase tracking-tighter italic">Worldwide <span className="text-brand-secondary">Fleet</span> Radar</h2>
                   <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest mt-1">Live dispatch availability in {city || 'Global Hubs'}</p>
                 </div>
                 <div className="bg-brand-secondary/20 text-brand-secondary text-[9px] font-black px-4 py-2 rounded-xl uppercase tracking-widest flex items-center gap-2">
                    <span className="w-2 h-2 bg-brand-secondary rounded-full animate-ping"></span>
                    Radar Active
                 </div>
               </div>
               <div className="w-full h-[500px] rounded-[2rem] overflow-hidden grayscale invert contrast-150 opacity-80">
                 <iframe 
                   width="100%" 
                   height="100%" 
                   style={{ border: 0 }} 
                   loading="lazy" 
                   allowFullScreen 
                   src={`https://www.google.com/maps/embed/v1/search?key=PASTE_YOUR_GOOGLE_MAPS_API_KEY_HERE&q=taxis+and+transport+in+${encodeURIComponent(city)}&zoom=12`}
                 ></iframe>
                 <div className="absolute inset-0 pointer-events-none flex items-center justify-center bg-black/20 backdrop-blur-[1px]">
                   <div className="bg-slate-900/90 border border-white/10 p-8 rounded-[2rem] shadow-2xl text-center max-w-sm">
                      <div className="text-4xl mb-4">🚕</div>
                      <p className="text-sm font-black text-white uppercase tracking-tighter">Global Fleet Data Synced</p>
                      <p className="text-[10px] text-white/40 font-bold mt-2 uppercase tracking-widest leading-relaxed">Connect Google Maps API in .env to visualize your worldwide fleet distribution in real-time.</p>
                   </div>
                 </div>
               </div>
            </div>
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
