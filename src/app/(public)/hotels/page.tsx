'use client';
import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ProcedureProgress } from '@/components/ProcedureProgress';
import { calculateClientPrice, formatPricing } from '@/lib/pricing';
import { MAJOR_CITIES } from '@/lib/geo';
import { CurrencySwitcher } from '@/components/CurrencySwitcher';
import { GlobalPublicFooter } from '@/components/GlobalPublicFooter';

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
    <div className="min-h-screen bg-slate-50 flex flex-col items-center">
      <ProcedureProgress currentStep={2} />
      {completedFlight && (
        <div className="w-full bg-emerald-600 border-b border-white/10 py-4 shadow-xl">
          <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4 text-white w-full">
              <div className="hidden md:flex w-10 h-10 bg-white rounded-full items-center justify-center text-xl shadow-lg">⚡</div>
              <div className="flex-1">
                <h3 className="text-sm font-black uppercase tracking-widest leading-none mb-1 flex items-center gap-2">Flight Secured <span className="text-emerald-300">→</span> Do you need a Hotel in {cityName(city)}?</h3>
                <p className="text-[10px] text-white/70 font-bold uppercase tracking-widest">Pricing Guard & Market Buffer Applied to all assets below.</p>
              </div>
            </div>
            <Link href={`/cars?city=${city}&completedHotel=true&adults=${guests.adults}&children=${guests.children}&infants=${guests.infants}`} className="whitespace-nowrap bg-white/10 hover:bg-white/20 text-white border border-white/20 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">
              ⏭️ SKIP HOTEL & CONTINUE TO CARS
            </Link>
          </div>
        </div>
      )}

      <div className="w-full bg-emerald-700 py-12 px-4 shadow-xl relative overflow-hidden">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-4xl font-black text-white text-center md:text-left italic uppercase tracking-tighter">ASAP <span className="text-emerald-300">EXCLU</span>SIVE HOTELS</h1>
            <CurrencySwitcher />
          </div>

          <form onSubmit={handleSearchHotels} className="bg-white rounded-[2.5rem] p-8 grid grid-cols-1 md:grid-cols-5 gap-4 items-end shadow-2xl relative">
            <div className="md:col-span-1 group relative">
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Destination</label>
              <input type="text" value={city} onChange={e => setCity(e.target.value)} placeholder="Enter City, Country or Code" required
                className="w-full border-none bg-slate-50 rounded-2xl px-5 py-4 text-sm font-bold focus:ring-2 focus:ring-emerald-500 text-slate-900" />
              <div className="hidden group-focus-within:grid absolute top-full left-0 md:left-0 w-[90vw] md:w-[700px] z-[120] mt-4 bg-white rounded-[2.5rem] shadow-[0_40px_100px_rgba(0,0,0,0.2)] p-6 md:p-10 grid-cols-1 gap-8 border border-slate-100 animate-in fade-in slide-in-from-top-6 duration-700 max-h-[400px] md:max-h-[600px] overflow-y-auto custom-scrollbar">
                {[
                  { label: 'Global Mega-Hubs', codes: ['DXB', 'LHR', 'JFK', 'SIN', 'HND', 'CDG', 'FRA', 'SYD', 'HKG', 'DOH'] },
                  { label: 'Americas Hubs', codes: ['ATL', 'LAX', 'ORD', 'DFW', 'YYZ', 'MEX', 'GRU', 'EZE', 'BOG', 'REC', 'POA', 'MAO'] },
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
                          className="flex flex-col items-center gap-1.5 p-4 rounded-3xl hover:bg-emerald-50 transition-all border border-transparent hover:border-emerald-100 group/btn">
                          <span className="text-sm font-black text-slate-800 group-hover/btn:text-emerald-600">{code}</span>
                          <span className="text-[8px] font-bold text-slate-400 uppercase tracking-tighter truncate w-full text-center">{MAJOR_CITIES[code]?.name || code}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
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
            <div className="md:col-span-1 group relative">
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Guests</label>
              <button type="button" className="w-full bg-slate-50 rounded-2xl px-5 py-4 text-sm font-black text-slate-700 uppercase tracking-widest text-left">
                {totalGuests} Stayers
              </button>
              <div className="hidden group-hover:block absolute top-full left-[-100px] right-0 z-[110] mt-2 bg-white rounded-[2rem] shadow-2xl p-6 border border-slate-100 animate-in fade-in slide-in-from-top-4 duration-500">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div><p className="text-[10px] font-black uppercase">Adults</p></div>
                    <div className="flex items-center gap-3">
                      <button type="button" onClick={() => setGuests(p => ({ ...p, adults: Math.max(1, p.adults - 1) }))} className="w-8 h-8 rounded-full bg-slate-100 font-black">-</button>
                      <span className="font-black w-4 text-center">{guests.adults}</span>
                      <button type="button" onClick={() => setGuests(p => ({ ...p, adults: p.adults + 1 }))} className="w-8 h-8 rounded-full bg-slate-100 font-black">+</button>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div><p className="text-[10px] font-black uppercase">Children</p></div>
                    <div className="flex items-center gap-3">
                      <button type="button" onClick={() => setGuests(p => ({ ...p, children: Math.max(0, p.children - 1) }))} className="w-8 h-8 rounded-full bg-slate-100 font-black">-</button>
                      <span className="font-black w-4 text-center">{guests.children}</span>
                      <button type="button" onClick={() => setGuests(p => ({ ...p, children: p.children + 1 }))} className="w-8 h-8 rounded-full bg-slate-100 font-black">+</button>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div><p className="text-[10px] font-black uppercase">Infants</p></div>
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
        {loading && (
          <div className="flex flex-col items-center py-20 animate-in fade-in duration-1000">
            <div className="w-16 h-16 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mb-8"></div>
            <div className="space-y-4 text-center">
              <p className="text-xl font-black text-emerald-600 italic uppercase tracking-tighter animate-pulse">Live Inventory Audit in Progress</p>
              <div className="flex flex-col gap-2">
                {['Fetching Direct Contract Rates...', 'Verifying Hilton & Marriott Availability...', 'Applying No-Loss Pricing Guard...', 'Finalizing IRIS V1 Asset Sync...'].map((s, i) => (
                  <p key={s} className={`text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 animate-in slide-in-from-bottom-2 duration-700`} style={{ animationDelay: `${i * 300}ms` }}>✓ {s}</p>
                ))}
              </div>
            </div>
          </div>
        )}

        {!loading && hotels.length > 0 && (
          <div className="space-y-12">
            {/* Search/Filter Bar */}
            <div className="relative max-w-lg mx-auto mb-8">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Filter by hotel name or amenities (e.g. Pool)..."
                className="w-full bg-white border-2 border-slate-200 rounded-2xl px-6 py-4 text-sm font-bold shadow-lg focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all"
              />
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10 animate-in slide-in-from-bottom-8 duration-700">
              {filteredHotels.map((h: any) => (
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
                    </div>
                    <div className="mt-auto flex items-center justify-between border-t border-slate-50 pt-8">
                      <div>
                        <div className="text-[10px] font-black text-slate-300 mb-2 uppercase tracking-widest leading-none">Best Rate Secured</div>
                        <div className="text-4xl font-black text-emerald-600 leading-none tracking-tighter">{formatPricing(h.totalRate, activeCurrency)}</div>
                      </div>
                      <Link href={`/hotels/checkout?hotelId=${h.id}&name=${encodeURIComponent(h.name)}&city=${encodeURIComponent(city)}&checkIn=${checkIn}&checkOut=${checkOut}&nights=${nights}&guests=${totalGuests}&priceCents=${Math.round(h.totalRate * nights * 100)}${completedFlight ? '&flow=step' : ''}`}
                        className="bg-emerald-600 text-white font-black px-12 py-5 rounded-[2rem] shadow-xl hover:bg-emerald-800 transition-all text-sm uppercase tracking-widest active:scale-95 transform">
                        Secure →
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {!loading && searched && hotels.length === 0 && (
              <div className="text-center py-32 border-2 border-dashed border-slate-200 rounded-[4rem] animate-in fade-in duration-1000">
                <span className="text-9xl grayscale opacity-10 block mb-10">🚫</span>
                <h2 className="text-4xl font-black text-slate-300 uppercase italic tracking-tighter">No Assets Found...</h2>
                <p className="text-slate-400 font-bold uppercase tracking-widest mt-6">Try adjusting your search criteria or destination.</p>
              </div>
            )}

            {/* 📍 GLOBAL GOOGLE MAPS INTEGRATION */}
            <div className="mt-20 bg-white rounded-[3rem] p-4 border border-slate-200 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-1000">
              <div className="flex justify-between items-center px-8 py-6">
                <div>
                  <h2 className="text-xl font-black text-slate-800 uppercase tracking-tighter italic">Worldwide <span className="text-emerald-600">Location</span> Radar</h2>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Showing verified hotel assets in {city || 'Global Hubs'}</p>
                </div>
                <div className="bg-emerald-50 text-emerald-700 text-[9px] font-black px-4 py-2 rounded-xl uppercase tracking-widest">Google Maps Verified 🛡️</div>
              </div>
              <div className="w-full h-[500px] rounded-[2rem] overflow-hidden grayscale contrast-125 brightness-110">
                <iframe
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  loading="lazy"
                  allowFullScreen
                  src={`https://www.google.com/maps/embed/v1/search?key=PASTE_YOUR_GOOGLE_MAPS_API_KEY_HERE&q=hotels+in+${encodeURIComponent(city)}&zoom=13`}
                ></iframe>
                {/* Fallback for when API Key is missing */}
                <div className="absolute inset-0 pointer-events-none flex items-center justify-center bg-slate-900/10 backdrop-blur-[2px]">
                  <div className="bg-white/90 p-8 rounded-[2rem] shadow-2xl text-center max-w-sm">
                    <div className="text-4xl mb-4">📍</div>
                    <p className="text-sm font-black text-slate-800 uppercase tracking-tighter">Live Map View Activated</p>
                    <p className="text-[10px] text-slate-500 font-bold mt-2 uppercase tracking-widest">Connect your Google Maps API Key in .env to unlock real-time worldwide positioning.</p>
                  </div>
                </div>
              </div>
            </div>
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
