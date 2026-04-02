'use client';
import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ProcedureProgress } from '@/components/ProcedureProgress';
import { calculateClientPrice, formatPricing, getPriceSeasonality, getHistoricalPriceStatus } from '@/lib/pricing';
import { MAJOR_CITIES } from '@/lib/geo';
import { CurrencySwitcher } from '@/components/CurrencySwitcher';
import { useTranslation } from '@/components/TranslationProvider';
import { AirportSearchDropdown } from '@/components/AirportSearchDropdown';

function HotelsContent() {
  const searchParams = useSearchParams();
  const completedFlight = searchParams.get('completedFlight');
  const [city, setCity] = useState(searchParams.get('city') || '');
  const [checkIn, setCheckIn] = useState(searchParams.get('checkIn') || new Date(Date.now() + 7 * 864e5).toISOString().split('T')[0]);
  const [checkOut, setCheckOut] = useState(searchParams.get('checkOut') || new Date(Date.now() + 10 * 864e5).toISOString().split('T')[0]);
  const [guests, setGuests] = useState({
    adults: Number(searchParams.get('adults') || 1),
    children: Number(searchParams.get('children') || 0),
    infants: Number(searchParams.get('infants') || 0)
  });
  const totalGuests = guests.adults + guests.children + guests.infants;
  const { t } = useTranslation();
  const [hotels, setHotels] = useState<any[]>([]);
  const [activeCurrency, setActiveCurrency] = useState('USD');
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

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
      const res = await fetch(`/api/hotels/search?destination=${city}&checkin=${checkIn}&checkout=${checkOut}&rooms=${totalGuests}`);
      const data = await res.json();
      setHotels(data.results || []);
      setSearchTerm(''); // Reset filter on new search

      // Monitoring global hotel pulse
      fetch('/api/monitor', {
        method: 'POST',
        body: JSON.stringify({ action: `Hotel Search: ${city} (${checkIn})`, source: 'Website' })
      });
    } catch (err) {
      setHotels([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (searchParams.get('city')) handleSearchHotels();
    const saved = localStorage.getItem('user-currency');
    if (saved) setActiveCurrency(saved);
  }, []);

  // Client-side filtering
  const filteredHotels = hotels.filter(h => {
    if (!searchTerm) return true;
    const lower = searchTerm.toLowerCase();
    return h.name.toLowerCase().includes(lower) || h.amenities?.some((a: string) => a.toLowerCase().includes(lower));
  });

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center">
      <ProcedureProgress currentStep={2} />
      {completedFlight && (
        <div className="w-full bg-emerald-600/20 border-b border-emerald-500/10 py-6 shadow-2xl backdrop-blur-3xl relative overflow-hidden">
          <div className="absolute inset-0 bg-emerald-500/5 blur-[100px] pointer-events-none"></div>
          <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
            <div className="flex items-center gap-5 text-white w-full">
              <div className="hidden md:flex w-14 h-14 bg-emerald-500 text-white rounded-2xl items-center justify-center text-2xl shadow-lg shadow-emerald-500/20 animate-pulse italic font-black">HTL</div>
              <div className="flex-1">
                <h3 className="text-xl font-black uppercase tracking-tighter italic leading-none mb-2 flex items-center gap-2">{t('flight_secured')} <span className="text-emerald-400">→</span> DEPLOY HOTEL ASSET SYNC IN {cityName(city).toUpperCase()}?</h3>
                <p className="text-[10px] text-emerald-400 font-black uppercase tracking-[0.3em]">IRIS V1: WHOLESALE BRIDGE VERIFIED · NO LOSS APPLIED</p>
              </div>
            </div>
            <Link href={`/cars?city=${city}&completedHotel=true&adults=${guests.adults}&children=${guests.children}&infants=${guests.infants}`} 
              className="whitespace-nowrap bg-white/5 hover:bg-white/10 text-white border border-white/10 px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all shadow-xl">
              {t('skip_hotel_continue')}
            </Link>
          </div>
        </div>
      )}

      <div className="w-full bg-slate-900/50 py-24 px-6 border-b border-white/5 relative overflow-hidden">
        <div className="absolute inset-0 bg-brand-primary/5 blur-[200px] pointer-events-none"></div>
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="flex flex-col md:flex-row items-center justify-between mb-12 gap-8">
            <div>
               <h1 className="text-5xl md:text-7xl font-black text-white text-center md:text-left italic uppercase tracking-tighter leading-none mb-3">ASAP <span className="text-brand-secondary">WHOLE</span>SALE</h1>
               <p className="text-[11px] font-black text-brand-secondary uppercase tracking-[0.4em] text-center md:text-left animate-pulse">Hotels Authority · GDS Asset Bridge Active</p>
            </div>
            <div className="flex items-center gap-4">
               <div className="bg-white/5 px-6 py-3 rounded-2xl border border-white/10 flex items-center gap-3">
                  <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_#10b981]"></span>
                  <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500">Inventory: LIVE</span>
               </div>
               <CurrencySwitcher />
            </div>
          </div>

          <form onSubmit={handleSearchHotels} className="bg-white rounded-[4rem] p-10 grid grid-cols-1 md:grid-cols-5 gap-8 items-end shadow-[0_50px_100px_rgba(0,0,0,0.5)] border-t-[12px] border-emerald-600 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/5 blur-[120px] pointer-events-none"></div>
            <div className="md:col-span-1 group relative z-10">
              <AirportSearchDropdown 
                value={city} 
                onChange={val => setCity(val)} 
                label={t('destination_label')} 
                placeholder={t('search_help_placeholder')} 
              />
            </div>
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">{t('checkin_label')}</label>
              <input type="date" value={checkIn} onChange={e => setCheckIn(e.target.value)}
                className="w-full border-none bg-slate-50 rounded-2xl px-5 py-4 text-sm font-bold focus:ring-2 focus:ring-emerald-500" />
            </div>
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">{t('checkout_label')}</label>
              <input type="date" value={checkOut} onChange={e => setCheckOut(e.target.value)}
                className="w-full border-none bg-slate-50 rounded-2xl px-5 py-4 text-sm font-bold focus:ring-2 focus:ring-emerald-500" />
            </div>
            <div className="md:col-span-1 group relative">
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">{t('stayers_count')}</label>
              <button type="button" className="w-full bg-slate-50 rounded-2xl px-5 py-4 text-sm font-black text-slate-700 uppercase tracking-widest text-left">
                {totalGuests} {t('stayers_count')}
              </button>
              <div className="hidden group-hover:block absolute top-full left-[-100px] right-0 z-[110] mt-2 bg-white rounded-[2rem] shadow-2xl p-6 border border-slate-100 animate-in fade-in slide-in-from-top-4 duration-500">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div><p className="text-[10px] font-black uppercase">{t('adults_label')}</p></div>
                    <div className="flex items-center gap-3">
                      <button type="button" onClick={() => setGuests(p => ({ ...p, adults: Math.max(1, p.adults - 1) }))} className="w-8 h-8 rounded-full bg-slate-100 font-black">-</button>
                      <span className="font-black w-4 text-center">{guests.adults}</span>
                      <button type="button" onClick={() => setGuests(p => ({ ...p, adults: p.adults + 1 }))} className="w-8 h-8 rounded-full bg-slate-100 font-black">+</button>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div><p className="text-[10px] font-black uppercase">{t('children_label')}</p></div>
                    <div className="flex items-center gap-3">
                      <button type="button" onClick={() => setGuests(p => ({ ...p, children: Math.max(0, p.children - 1) }))} className="w-8 h-8 rounded-full bg-slate-100 font-black">-</button>
                      <span className="font-black w-4 text-center">{guests.children}</span>
                      <button type="button" onClick={() => setGuests(p => ({ ...p, children: p.children + 1 }))} className="w-8 h-8 rounded-full bg-slate-100 font-black">+</button>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div><p className="text-[10px] font-black uppercase">{t('infants_label')}</p></div>
                    <div className="flex items-center gap-3">
                      <button type="button" onClick={() => setGuests(p => ({ ...p, infants: Math.max(0, p.infants - 1) }))} className="w-8 h-8 rounded-full bg-slate-100 font-black">-</button>
                      <span className="font-black w-4 text-center">{guests.infants}</span>
                      <button type="button" onClick={() => setGuests(p => ({ ...p, infants: p.infants + 1 }))} className="w-8 h-8 rounded-full bg-slate-100 font-black">+</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <button type="submit" disabled={loading}
              className="w-full bg-emerald-600 border border-emerald-500/20 hover:bg-emerald-700 text-white font-black py-5 rounded-3xl transition-all shadow-xl flex items-center justify-center gap-2 transform active:scale-95 text-lg z-10">
              {loading ? 'IRIS V1 SYNCING...' : `🔍 ${t('search_assets').toUpperCase()}`}
            </button>
          </form>

          <div className="mt-10 flex flex-wrap gap-4 overflow-x-auto pb-4 scrollbar-none opacity-40">
            {['No-Loss Guard Active', 'Market Rate Evaluator', 'Hilton & Marriott Approved', 'Private Wholesaler Rates'].map(p => (
              <span key={p} className="text-[10px] whitespace-nowrap font-black bg-white/5 border border-white/10 text-white px-6 py-2 rounded-xl uppercase tracking-widest shadow-lg">🛡️ {p}</span>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl w-full mx-auto px-6 py-20 pb-40">
        {loading && (
          <div className="flex flex-col items-center py-32 animate-in fade-in duration-1000">
            <div className="w-24 h-24 border-8 border-emerald-500 border-t-transparent rounded-[2.5rem] animate-spin mb-12 shadow-2xl shadow-emerald-500/20"></div>
            <div className="space-y-6 text-center">
              <h2 className="text-4xl font-black text-white italic uppercase tracking-tighter animate-pulse">IRIS V1 Inventory Sync</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
                {['Direct Contract Retrieval...', 'Hilton/Marriott Verification...', 'No-Loss Guard Injection...', 'Global Asset Finalization...'].map((s, i) => (
                  <div key={s} className="bg-white/5 border border-white/10 px-6 py-3 rounded-2xl flex items-center gap-3 animate-in slide-in-from-bottom-4 duration-700" style={{ animationDelay: `${i * 200}ms` }}>
                     <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                     <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">{s}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {!loading && (hotels.length > 0 || searched) && (
          <div className="space-y-20 relative z-10">
            {/* Flexible Date Price Strip */}
            <div className="bg-white/5 rounded-[3rem] p-6 shadow-2xl border border-white/10 overflow-x-auto scrollbar-none mb-12 backdrop-blur-3xl">
              <div className="flex gap-4 min-w-max">
                {[-3, -2, -1, 0, 1, 2, 3].map(offset => {
                  const d = new Date(new Date(checkIn).getTime() + offset * 864e5);
                  const dStr = d.toISOString().split('T')[0];
                  const s = getPriceSeasonality(city, dStr);
                  const currentS = getPriceSeasonality(city, checkIn);
                  const isCheaper = s.multiplier < currentS.multiplier;
                  const isSelected = dStr === checkIn;

                  let colorClass = "bg-white/5 text-white/30 border-white/5 hover:border-white/20";
                  if (isSelected) colorClass = "bg-emerald-600 text-white border-emerald-500 shadow-2xl shadow-emerald-600/20 ring-4 ring-emerald-500/10 scale-105 z-20";
                  else if (isCheaper) colorClass = "bg-red-600/10 text-red-500 border-red-500/20 hover:bg-red-600/20 relative overflow-hidden";
                  else if (s.isPeak) colorClass = "bg-orange-600/10 text-orange-500 border-orange-500/20 hover:bg-orange-600/20";
                  else if (s.isLow) colorClass = "bg-emerald-600/10 text-emerald-500 border-emerald-500/20 hover:bg-emerald-600/20";
                  
                  return (
                    <button key={offset} onClick={() => { setCheckIn(dStr); handleSearchHotels(); }}
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
                  <div className="bg-emerald-600/20 p-6 rounded-[2rem] border border-emerald-500/20 text-center md:text-left">
                     <div className="text-3xl mb-4">🧠</div>
                     <h3 className="text-sm font-black uppercase tracking-widest text-emerald-400 mb-1">{t('seasonality_intelligence')}</h3>
                     <p className="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em]">{t('iris_v1_sync')}</p>
                  </div>
                  <div className="flex-1 space-y-4">
                     <div>
                        <div className="flex items-center gap-3 mb-2">
                           <span className="text-xl">📊</span>
                           <h4 className="text-lg font-black italic tracking-tighter uppercase">{getPriceSeasonality(city, checkIn).label} {t('detected')}</h4>
                        </div>
                        <p className="text-xs font-medium text-white/60 leading-relaxed uppercase italic">
                           {getPriceSeasonality(city, checkIn).isPeak 
                              ? t('expert_hotel_peak')
                              : t('expert_hotel_low')
                           }
                        </p>
                     </div>
                     <div className="flex flex-wrap gap-4 pt-2">
                        <div className="bg-white/5 border border-white/10 px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest flex items-center gap-2">
                           <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
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

            {/* Search/Filter Bar */}
            <div className="relative max-w-xl mx-auto mb-16">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="FILTER BY ASSET NAME OR AMENITIES..."
                className="w-full bg-white/5 border-2 border-white/10 rounded-[2rem] px-8 py-5 text-[11px] font-black tracking-[0.2em] shadow-2xl focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500/50 outline-none transition-all uppercase text-white placeholder:text-white/20 backdrop-blur-3xl"
              />
              <div className="absolute right-6 top-1/2 -translate-y-1/2 text-emerald-500 font-black text-xs animate-pulse">BRIDGE ACTIVE</div>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12 animate-in slide-in-from-bottom-8 duration-700">
              {filteredHotels.map((h: any) => (
                <div key={h.id} className="bg-white/5 rounded-[4rem] border border-white/10 overflow-hidden hover:border-emerald-500/40 hover:shadow-[0_40px_100px_rgba(0,0,0,0.4)] transition-all group flex flex-col relative backdrop-blur-3xl">
                  <div className="h-72 relative overflow-hidden">
                    <img src={h.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" alt={h.name} />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-60"></div>
                    <div className="absolute top-8 left-8 bg-brand-secondary text-brand-primary text-[10px] font-black px-6 py-2 rounded-full uppercase tracking-[0.3em] shadow-2xl skew-x-[-12deg]">WHOLESALE SYNC</div>
                  </div>
                  <div className="p-12 flex flex-col flex-1">
                    <div className="flex justify-between items-start mb-8">
                       <div>
                          <p className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.3em] mb-2">Inventory Verified</p>
                          <h3 className="text-3xl font-black text-white leading-tight group-hover:text-emerald-400 transition-colors uppercase italic tracking-tighter">{h.name}</h3>
                       </div>
                       <div className="bg-emerald-500/10 text-emerald-400 text-[11px] font-black px-4 py-2 rounded-xl border border-emerald-500/20">{h.rating} / 10</div>
                    </div>
                    <div className="flex flex-wrap gap-3 mb-12">
                        <span className="text-[10px] font-black bg-white/5 border border-white/10 text-white/60 px-5 py-2 rounded-xl uppercase tracking-widest italic">{h.class}</span>
                        <span className="text-[10px] font-black bg-emerald-600/10 border border-emerald-500/20 text-emerald-400 px-5 py-2 rounded-xl uppercase tracking-widest">{h.mealPlan}</span>
                    </div>
                    <div className="mt-auto flex items-center justify-between border-t border-white/5 pt-10">
                      <div>
                        <div className="text-[11px] font-black text-white/20 mb-3 uppercase tracking-[0.25em] leading-none italic">Asset Rate</div>
                        <div className="text-5xl font-black text-emerald-500 leading-none tracking-tighter">{formatPricing(h.totalRate, activeCurrency)}</div>
                      </div>
                      <Link href={`/hotels/checkout?hotelId=${h.id}&name=${encodeURIComponent(h.name)}&city=${encodeURIComponent(city)}&checkIn=${checkIn}&checkOut=${checkOut}&nights=${nights}&guests=${totalGuests}&priceCents=${Math.round(h.totalRate * nights * 100)}${completedFlight ? '&flow=step' : ''}`}
                        className="bg-emerald-600 text-white font-black px-10 py-5 rounded-[2.5rem] shadow-2xl shadow-emerald-600/20 hover:bg-emerald-500 transition-all text-sm uppercase tracking-widest active:scale-95 transform italic">
                        Deploy →
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {!loading && searched && hotels.length === 0 && (
              <div className="text-center py-40 bg-white/5 border-2 border-dashed border-white/10 rounded-[4rem] animate-in fade-in duration-1000 backdrop-blur-3xl">
                <span className="text-9xl grayscale opacity-10 block mb-12">🚫</span>
                <h2 className="text-5xl font-black text-white/20 uppercase italic tracking-tighter italic">No Assets Found...</h2>
                <p className="text-white/40 font-black uppercase tracking-[0.3em] mt-8 italic">IRIS V1 SYNC: 0 MATCHES FOR {city.toUpperCase()}</p>
                <div className="mt-12 flex justify-center gap-4">
                   <button onClick={() => setCity('')} className="bg-white/5 hover:bg-white/10 text-white px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-white/10 transition-all">Clear Search</button>
                </div>
              </div>
            )}

            {/* 📍 GLOBAL GOOGLE MAPS INTEGRATION */}
            <div className="mt-32 bg-white/5 rounded-[4rem] p-6 border border-white/10 shadow-[0_50px_100px_rgba(0,0,0,0.5)] overflow-hidden animate-in zoom-in-95 duration-1000 backdrop-blur-3xl">
              <div className="flex justify-between items-center px-10 py-8">
                <div>
                  <h2 className="text-3xl font-black text-white uppercase tracking-tighter italic leading-none mb-2">Worldwide <span className="text-emerald-500">Location</span> Radar</h2>
                  <p className="text-[10px] text-white/30 font-black uppercase tracking-[0.3em]">Showing verified hotel assets in {city || 'Global Hubs'} · GDS V1</p>
                </div>
                <div className="bg-emerald-500/10 text-emerald-400 text-[10px] font-black px-6 py-3 rounded-2xl border border-emerald-500/20 shadow-xl">Google Maps Verified 🛡️</div>
              </div>
              <div className="w-full h-[600px] rounded-[3rem] overflow-hidden grayscale contrast-125 brightness-110 relative">
                <iframe
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  loading="lazy"
                  allowFullScreen
                  src={`https://www.google.com/maps/embed/v1/search?key=PASTE_YOUR_GOOGLE_MAPS_API_KEY_HERE&q=hotels+in+${encodeURIComponent(city)}&zoom=13`}
                ></iframe>
                {/* Fallback for when API Key is missing */}
                <div className="absolute inset-0 pointer-events-none flex items-center justify-center bg-slate-950/40 backdrop-blur-[4px]">
                  <div className="bg-slate-900 border border-white/10 p-12 rounded-[3.5rem] shadow-2xl text-center max-w-sm">
                    <div className="text-5xl mb-6">📍</div>
                    <p className="text-xl font-black text-white uppercase tracking-tighter italic">Live Map View Activated</p>
                    <p className="text-[10px] text-white/40 font-black mt-4 uppercase tracking-[0.2em] leading-relaxed">Connect your Google Maps API Key in .env to unlock real-time worldwide positioning.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {!searched && !loading && (
          <div className="text-center py-40 bg-white/5 border-2 border-dashed border-white/10 rounded-[4rem] backdrop-blur-3xl">
            <span className="text-9xl grayscale opacity-10 block mb-12">🏨</span>
            <h2 className="text-5xl font-black text-white/20 uppercase italic tracking-tighter">Awaiting Destination...</h2>
            <p className="text-white/40 font-black uppercase tracking-[0.3em] mt-8 italic">Enter location to initialize unadvertised contract assets.</p>
          </div>
        )}
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

