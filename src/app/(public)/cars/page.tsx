'use client';
import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ProcedureProgress } from '@/components/ProcedureProgress';
import { formatPricing, getPriceSeasonality, getHistoricalPriceStatus } from '@/lib/pricing';
import { MAJOR_CITIES } from '@/lib/geo';
import { CurrencySwitcher } from '@/components/CurrencySwitcher';
import { useTranslation } from '@/components/TranslationProvider';
import { AirportSearchDropdown } from '@/components/AirportSearchDropdown';

function CarsContent() {
  const searchParams = useSearchParams();
  const completedStep2 = searchParams.get('completedStep2');
  const [city, setCity] = useState(searchParams.get('city') || '');
  const [pickupDate, setPickupDate] = useState(searchParams.get('pickupDate') || new Date(Date.now() + 10 * 864e5).toISOString().split('T')[0]);
  const [dropoffDate, setDropoffDate] = useState(searchParams.get('dropoffDate') || new Date(Date.now() + 14 * 864e5).toISOString().split('T')[0]);
  
  const [cars, setCars] = useState<any[]>([]);
  const [activeCurrency, setActiveCurrency] = useState('USD');
  const { t } = useTranslation();
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
    <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center">
      <ProcedureProgress currentStep={3} />
      
      {completedStep2 || searchParams.get('completedHotel') ? (
        <div className="w-full bg-slate-900/80 border-b border-white/5 py-6 shadow-2xl backdrop-blur-3xl relative overflow-hidden">
           <div className="absolute inset-0 bg-brand-primary/5 blur-[100px] pointer-events-none"></div>
           <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
              <div className="flex items-center gap-5 text-white w-full">
                 <div className="hidden md:flex w-14 h-14 bg-brand-primary text-white rounded-2xl items-center justify-center text-2xl shadow-lg shadow-brand-primary/20 animate-pulse italic font-black">CAR</div>
                 <div className="flex-1">
                    <h3 className="text-xl font-black uppercase tracking-tighter italic leading-none mb-2 flex items-center gap-2">{t('hotel_secured')} <span className="text-brand-secondary">→</span> DEPLOY FLEET DISPATCH IN {city.toUpperCase()}?</h3>
                    <p className="text-[10px] text-brand-secondary font-black uppercase tracking-[0.3em]">IRIS V1: NO-LOSS FLEET GUARD ACTIVE ON GLOBAL HUD ASSETS</p>
                 </div>
              </div>
              <Link href="/success" className="whitespace-nowrap bg-white/5 hover:bg-white/10 text-white border border-white/10 px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all shadow-xl">
                {t('skip_car_finalize')}
              </Link>
           </div>
        </div>
      ) : null}

      <div className="w-full bg-slate-900/50 py-24 px-6 border-b border-white/5 relative overflow-hidden">
        <div className="absolute inset-0 bg-brand-primary/5 blur-[200px] pointer-events-none"></div>
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="flex flex-col md:flex-row items-center justify-between mb-12 gap-8">
            <div>
               <h1 className="text-5xl md:text-7xl font-black text-white text-center md:text-left italic uppercase tracking-tighter leading-none mb-3">ASAP <span className="text-brand-secondary">WHOLE</span>SALE</h1>
               <p className="text-[11px] font-black text-brand-secondary uppercase tracking-[0.4em] text-center md:text-left animate-pulse">Fleet Authority · Worldwide Dispatch Sync Active</p>
            </div>
            <div className="flex items-center gap-4">
               <div className="bg-white/5 px-6 py-3 rounded-2xl border border-white/10 flex items-center gap-3">
                  <span className="w-2 h-2 bg-brand-secondary rounded-full animate-pulse shadow-[0_0_10px_#facc15]"></span>
                  <span className="text-[10px] font-black uppercase tracking-widest text-brand-secondary">Network: GLOBAL</span>
               </div>
               <CurrencySwitcher />
            </div>
          </div>
          
          <form onSubmit={handleSearchCars} className="bg-white rounded-[4rem] p-10 grid grid-cols-1 md:grid-cols-4 gap-8 items-end shadow-[0_50px_100px_rgba(0,0,0,0.5)] border-t-[12px] border-amber-500 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/5 blur-[120px] pointer-events-none"></div>
            <div className="md:col-span-1 group relative z-10">
              <AirportSearchDropdown 
                value={city} 
                onChange={val => setCity(val)} 
                label={t('pickup_hub')} 
                placeholder={t('search_help_placeholder')} 
              />
            </div>
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">{t('pickup_date')}</label>
              <input type="date" value={pickupDate} onChange={e => setPickupDate(e.target.value)}
                className="w-full border-none bg-slate-50 rounded-2xl px-5 py-4 text-sm font-bold focus:ring-2 focus:ring-brand-primary" />
            </div>
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">{t('dropoff_date')}</label>
              <input type="date" value={dropoffDate} onChange={e => setDropoffDate(e.target.value)}
                className="w-full border-none bg-slate-50 rounded-2xl px-5 py-4 text-sm font-bold focus:ring-2 focus:ring-brand-primary" />
            </div>
            <button type="submit" disabled={loading}
              className="w-full bg-slate-900 border border-white/10 hover:bg-black text-white font-black py-5 rounded-3xl transition-all shadow-xl flex items-center justify-center gap-2 transform active:scale-95 text-lg z-10">
              {loading ? 'SYNCING FLEET...' : `🔍 ${t('dispatch_asset').toUpperCase()}`}
            </button>
          </form>
          
          <div className="mt-10 flex flex-wrap gap-4 overflow-x-auto pb-4 scrollbar-none opacity-40">
            {['Uber & Lyft Integrated', 'Iris V1 Fleet Access', 'Global Taxi Network', 'No-Loss Guard Active'].map(p => (
              <span key={p} className="text-[10px] whitespace-nowrap font-black bg-white/5 border border-white/10 text-white px-6 py-2 rounded-xl uppercase tracking-widest shadow-lg">🛡️ {p}</span>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl w-full mx-auto px-6 py-20 pb-40">
        {loading && <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12">{[1,2,3,4,5,6].map(i => <div key={i} className="bg-white/5 rounded-[4rem] h-[500px] animate-pulse border border-white/10 shadow-2xl backdrop-blur-3xl"></div>)}</div>}

        {!loading && (cars.length > 0 || searched) && (
          <div className="space-y-20 relative z-10">
            {/* Flexible Date Price Strip */}
            <div className="bg-white/5 rounded-[3rem] p-6 shadow-2xl border border-white/10 overflow-x-auto scrollbar-none mb-12 backdrop-blur-3xl">
              <div className="flex gap-4 min-w-max">
                {[-3, -2, -1, 0, 1, 2, 3].map(offset => {
                  const d = new Date(new Date(pickupDate).getTime() + offset * 864e5);
                  const dStr = d.toISOString().split('T')[0];
                  const s = getPriceSeasonality(city, dStr);
                  const currentS = getPriceSeasonality(city, pickupDate);

                  const isCheaper = s.multiplier < currentS.multiplier;
                  const isSelected = dStr === pickupDate;

                  let colorClass = "bg-white/5 text-white/30 border-white/5 hover:border-white/20";
                  if (isSelected) colorClass = "bg-brand-primary text-white border-brand-primary shadow-2xl shadow-brand-primary/20 ring-4 ring-brand-primary/10 scale-105 z-20";
                  else if (isCheaper) colorClass = "bg-red-600/10 text-red-500 border-red-500/20 hover:bg-red-600/20 relative overflow-hidden";
                  else if (s.isPeak) colorClass = "bg-orange-600/10 text-orange-500 border-orange-500/20 hover:bg-orange-600/20";
                  else if (s.isLow) colorClass = "bg-emerald-600/10 text-emerald-500 border-emerald-500/20 hover:bg-emerald-600/20";
                  
                  return (
                    <button key={offset} onClick={() => { setPickupDate(dStr); handleSearchCars(); }}
                      className={`px-8 py-5 rounded-[2rem] border-2 transition-all flex flex-col items-center gap-1.5 group ${colorClass}`}>
                      {isCheaper && !isSelected && (
                        <div className="absolute top-0 right-0 bg-red-600 text-white text-[8px] font-black px-2 py-1 rounded-bl-xl uppercase tracking-widest">SAVE</div>
                      )}
                      <span className={`text-[9px] font-black uppercase tracking-[0.2em] ${isSelected ? 'text-white/60' : (isCheaper ? 'text-red-400' : 'text-white/20 group-hover:text-white/40')}`}>
                        {d.toLocaleDateString('en-US', { weekday: 'short' })}
                      </span>
                      <span className="text-lg font-black italic uppercase leading-none tracking-tighter">{d.toLocaleDateString('en-US', { day: '2-digit', month: 'short' })}</span>
                      <span className={`text-[11px] font-black mt-1 uppercase tracking-widest ${isSelected ? 'text-white' : ''}`}>
                        {isCheaper ? 'HOT DEAL' : (s.isPeak ? 'Peak' : s.isLow ? 'Best' : 'Avg')}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Search Assistance Intelligence - The "Cheat Help" requested by user */}
            <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-2xl mb-12">
               <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
                  <div className="bg-brand-secondary/20 p-6 rounded-[2rem] border border-brand-secondary/20 text-center md:text-left">
                     <div className="text-3xl mb-4">🧠</div>
                     <h3 className="text-sm font-black uppercase tracking-widest text-brand-secondary mb-1">{t('seasonality_intelligence')}</h3>
                     <p className="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em]">{t('iris_v1_sync')}</p>
                  </div>
                  <div className="flex-1 space-y-4">
                     <div>
                        <div className="flex items-center gap-3 mb-2">
                           <span className="text-xl">📊</span>
                           <h4 className="text-lg font-black italic tracking-tighter uppercase">{getPriceSeasonality(city, pickupDate).label} {t('detected')}</h4>
                        </div>
                        <p className="text-xs font-medium text-white/60 leading-relaxed uppercase italic">
                           {getPriceSeasonality(city, pickupDate).isPeak 
                              ? t('expert_car_peak')
                              : t('expert_car_low')
                           }
                        </p>
                     </div>
                     <div className="flex flex-wrap gap-4 pt-2">
                        <div className="bg-white/5 border border-white/10 px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest flex items-center gap-2">
                           <span className="w-2 h-2 bg-brand-secondary rounded-full animate-pulse"></span>
                           {t('direct_contract_verified')}
                        </div>
                        <div className="bg-white/5 border border-white/10 px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest flex items-center gap-2">
                           <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                           {t('pricing_guard_active')}
                        </div>
                     </div>
                  </div>
               </div>
               <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                  <div className="text-[120px] font-black italic tracking-tighter text-white">ASAP</div>
               </div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12 animate-in slide-in-from-bottom-12 duration-1000">
              {cars.map((c: any) => (
                <div key={c.id} className="bg-white/5 rounded-[4rem] border border-white/10 overflow-hidden hover:border-brand-primary/40 hover:shadow-[0_40px_100px_rgba(0,0,0,0.4)] transition-all group flex flex-col relative backdrop-blur-3xl">
                  <div className="h-72 relative bg-white/5 p-8 flex items-center justify-center group">
                     <div className="absolute inset-0 bg-gradient-to-b from-transparent to-slate-950/40"></div>
                     <img src={c.car.image} className="max-w-full max-h-full object-contain group-hover:scale-110 transition-transform duration-1000 relative z-10" alt={c.car.brand} />
                     <div className="absolute top-8 left-8 bg-brand-secondary text-brand-primary text-[10px] font-black px-6 py-2 rounded-full uppercase tracking-[0.3em] shadow-2xl skew-x-[-12deg]">FLEET DEPLOY</div>
                  </div>
                  <div className="p-12 flex flex-col flex-1">
                     <div className="flex justify-between items-start mb-8">
                        <div>
                           <h3 className="text-3xl font-black text-white uppercase italic tracking-tighter truncate group-hover:text-brand-secondary transition-colors">{c.car.brand}</h3>
                           <p className="text-[11px] font-black text-white/30 uppercase tracking-[0.25em] mt-2">{c.car.type}</p>
                        </div>
                     </div>
                     <div className="mt-auto flex items-end justify-between border-t border-white/5 pt-10">
                        <div>
                           <div className="text-[11px] font-black text-white/20 uppercase tracking-[0.25em] mb-3 italic">Dispatch Rate</div>
                           <div className="text-5xl font-black text-brand-secondary tracking-tighter leading-none">{formatPricing(c.priceTotal, activeCurrency)}</div>
                           <div className="text-[10px] font-black text-brand-secondary/40 mt-3 uppercase tracking-[0.2em]">Loss-Guard Protected</div>
                        </div>
                        <Link href={`/cars/checkout?carId=${c.id}&model=${encodeURIComponent(c.car?.brand || c.model || 'Vehicle')}&provider=${encodeURIComponent(c.agency || c.provider || 'IRIS Fleet')}&location=${encodeURIComponent(city)}&class=${encodeURIComponent(c.car?.type || c.class || 'Standard')}&pickupDate=${pickupDate}&dropoffDate=${dropoffDate}&days=2&priceCents=${Math.round(c.priceTotal * 100)}${searchParams.get('completedHotel') ? '&flow=step' : ''}`}
                          className="bg-brand-primary text-white font-black px-10 py-5 rounded-[2.5rem] shadow-2xl shadow-brand-primary/20 hover:bg-brand-dark transition-all text-sm uppercase tracking-widest active:scale-95 transform italic">
                          Deploy →
                        </Link>
                     </div>
                  </div>
                </div>
              ))}
            </div>

            {searched && !loading && cars.length === 0 && (
              <div className="text-center py-40 bg-white/5 border-2 border-dashed border-white/10 rounded-[4rem] animate-in fade-in duration-1000 backdrop-blur-3xl">
                  <span className="text-9xl grayscale opacity-10 block mb-12">🚕</span>
                  <h2 className="text-5xl font-black text-white/20 uppercase italic tracking-tighter leading-none mb-8">Zero Assets Found in {city.toUpperCase()}</h2>
                  <p className="text-white/40 font-black uppercase tracking-[0.3em] leading-relaxed italic">IRIS V1: ALL GLOBAL FLEET ASSETS CURRENTLY DEPLOYED OR REFURBISHING.</p>
                  <div className="mt-12 flex justify-center gap-4">
                     <button onClick={() => setCity('')} className="bg-white/5 hover:bg-white/10 text-white px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-white/10 transition-all">Reset Dispatch Hub</button>
                  </div>
              </div>
            )}

            {/* 🚕 GLOBAL TAXI RADAR (GOOGLE MAPS) */}
            <div className="mt-32 bg-white/5 rounded-[4rem] p-6 border border-white/10 shadow-[0_50px_100px_rgba(0,0,0,0.5)] overflow-hidden animate-in zoom-in-95 duration-1000 backdrop-blur-3xl">
               <div className="flex justify-between items-center px-10 py-8">
                 <div>
                   <h2 className="text-3xl font-black text-white uppercase tracking-tighter italic leading-none mb-2">Worldwide <span className="text-brand-secondary">Fleet</span> Radar</h2>
                   <p className="text-[10px] text-white/30 font-black uppercase tracking-[0.3em]">Live dispatch availability in {city || 'Global Hubs'} · GDS V1</p>
                 </div>
                 <div className="bg-brand-secondary/10 text-brand-secondary text-[10px] font-black px-6 py-3 rounded-2xl border border-brand-secondary/20 shadow-xl flex items-center gap-2">
                    <span className="w-2 h-2 bg-brand-secondary rounded-full animate-ping shadow-[0_0_10px_#facc15]"></span>
                    Radar Active
                 </div>
               </div>
               <div className="w-full h-[600px] rounded-[3rem] overflow-hidden grayscale invert contrast-150 opacity-80 relative">
                 <iframe 
                   width="100%" 
                   height="100%" 
                   style={{ border: 0 }} 
                   loading="lazy" 
                   allowFullScreen 
                   src={`https://www.google.com/maps/embed/v1/search?key=PASTE_YOUR_GOOGLE_MAPS_API_KEY_HERE&q=taxis+and+transport+in+${encodeURIComponent(city)}&zoom=12`}
                 ></iframe>
                 <div className="absolute inset-0 pointer-events-none flex items-center justify-center bg-slate-950/40 backdrop-blur-[4px]">
                    <div className="bg-slate-900 border border-white/10 p-12 rounded-[3.5rem] shadow-2xl text-center max-w-sm">
                       <div className="text-5xl mb-6">🚕</div>
                       <p className="text-xl font-black text-white uppercase tracking-tighter italic">Global Fleet Data Synced</p>
                       <p className="text-[10px] text-white/40 font-black mt-4 uppercase tracking-[0.2em] leading-relaxed">Connect Google Maps API in .env to visualize your worldwide fleet distribution in real-time.</p>
                    </div>
                 </div>
               </div>
            </div>
          </div>
        )}

        {!searched && !loading && (
          <div className="text-center py-40 bg-white/5 border-2 border-dashed border-white/10 rounded-[4rem] backdrop-blur-3xl">
              <span className="text-9xl opacity-10 grayscale block mb-12">🚕</span>
              <h2 className="text-5xl font-black text-white/20 uppercase italic tracking-tighter leading-none mb-8">Awaiting Taxi Dispatch...</h2>
              <p className="text-white/40 font-black uppercase tracking-[0.3em] mt-8 italic">Initialize hub above to access our global network of chauffeurs.</p>
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

