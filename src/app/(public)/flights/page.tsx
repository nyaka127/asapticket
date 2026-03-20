'use client';
import * as React from 'react';
import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ProcedureProgress } from '@/components/ProcedureProgress';
import { getPriceSeasonality } from '@/lib/seasonality';
import { calculateClientPrice, formatPricing, getHistoricalPriceStatus } from '@/lib/pricing';
import { MAJOR_CITIES, getDistanceBetweenCodes } from '@/lib/geo';
import { CurrencySwitcher } from '@/components/CurrencySwitcher';
import { GlobalPublicFooter } from '@/components/GlobalPublicFooter';
import { useClientPulse } from '@/hooks/useClientPulse';

function FlightsContent() {
   const searchParams = useSearchParams();
   const { trackEvent } = useClientPulse();
   const [origin, setOrigin] = useState(searchParams.get('origin') || '');
   const [destination, setDestination] = useState(searchParams.get('destination') || '');
   const [date, setDate] = useState(searchParams.get('departureDate') || new Date(Date.now() + 7 * 864e5).toISOString().split('T')[0]);
   const [returnDate, setReturnDate] = useState(searchParams.get('returnDate') || new Date(Date.now() + 14 * 864e5).toISOString().split('T')[0]);

   const [tripType, setTripType] = useState('roundtrip');
   const [flexible, setFlexible] = useState(false);
   const [passengers, setPassengers] = useState({ adults: 1, children: 0, infants: 0 });
   const totalPassengers = passengers.adults + passengers.children + passengers.infants;
   const [cabin, setCabin] = useState('ECONOMY');
   const [showHeroChoice, setShowHeroChoice] = useState(!searchParams.get('origin'));

   // Advanced Round-trip Preferences
   const [layoverTime, setLayoverTime] = useState('Any');
   const [layoverCities, setLayoverCities] = useState('');
   const [maxStops, setMaxStops] = useState('Any');

   const [flights, setFlights] = useState<any[]>([]);
   const [filteredFlights, setFilteredFlights] = useState<any[]>([]);
   const [activeCurrency, setActiveCurrency] = useState('USD');
   const [loading, setLoading] = useState(false);
   const [searched, setSearched] = useState(false);
   const [showLeadModal, setShowLeadModal] = useState(false);
   const [selectedFlightForLead, setSelectedFlightForLead] = useState<any>(null);
   const [leadStatus, setLeadStatus] = useState<'idle' | 'submitting' | 'success'>('idle');
   const [leadForm, setLeadForm] = useState({ name: '', email: '', phone: '', pref: 'WhatsApp', seats: false, deposit: false });
   const [expertPrefs, setExpertPrefs] = useState({ airlines: '', layovers: '' });

   const handleLeadSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setLeadStatus('submitting');
      try {
         await fetch('/api/leads', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
               ...leadForm,
               origin,
               destination,
               departureDate: date,
               returnDate: tripType === 'roundtrip' ? returnDate : '',
               cabin,
               flightId: selectedFlightForLead?.id || 'General Inquiry',
               preferredAirlines: expertPrefs.airlines,
               layoverPreferences: expertPrefs.layovers,
            })
         });
         setLeadStatus('success');

         // Pulse Monitoring
         fetch('/api/monitor', {
            method: 'POST',
            body: JSON.stringify({ action: `Lead Form Submitted: ${origin} → ${destination}`, source: 'Website' })
         });

         setTimeout(() => {
            setShowLeadModal(false);
            setLeadStatus('idle');
         }, 3000);
      } catch (err) {
         setLeadStatus('idle');
      }
   };

   // Filters State
   const [filterStops, setFilterStops] = useState<string>('Any');
   const [filterAirline, setFilterAirline] = useState<string>('Any');

   const searchFlights = async (e?: React.FormEvent) => {
      e?.preventDefault();
      setLoading(true);
      setSearched(true);
      try {
         const res = await fetch(`/api/flights/search?origin=${origin}&destination=${destination}&departureDate=${date}&passengers=${totalPassengers}&returnDate=${tripType === 'roundtrip' ? returnDate : ''}&tripType=${tripType}&cabin=${cabin}`);
         const data = await res.json();
         const results = data.data || [];
         setFlights(results);
         setFilteredFlights(results);

         // Monitoring: Pulse of global client search
         fetch('/api/monitor', {
            method: 'POST',
            body: JSON.stringify({ action: `Flight Search: ${origin} → ${destination} (${date})`, source: 'Website' })
         });
      } catch (err) {
         setFlights([]);
         setFilteredFlights([]);
      }
      setLoading(false);
   };

   useEffect(() => {
      let result = flights;
      if (filterStops !== 'Any') {
         if (filterStops === 'Non-stop') result = result.filter(f => !f.layovers || f.layovers === 0);
         else {
            const num = parseInt(filterStops);
            if (!isNaN(num)) result = result.filter(f => f.layovers === num);
         }
      }
      if (filterAirline !== 'Any') {
         result = result.filter(f => f.airline === filterAirline);
      }
      setFilteredFlights(result);
   }, [filterStops, filterAirline, flights]);

   useEffect(() => {
      if (searchParams.get('origin')) searchFlights();
      const saved = localStorage.getItem('user-currency');
      if (saved) setActiveCurrency(saved);
   }, []);

   const passengerSummary = () => {
      const parts = [];
      if (passengers.adults > 0) parts.push(`${passengers.adults} Adult${passengers.adults > 1 ? 's' : ''}`);
      if (passengers.children > 0) parts.push(`${passengers.children} Child${passengers.children > 1 ? 'ren' : ''}`);
      if (passengers.infants > 0) parts.push(`${passengers.infants} Infant${passengers.infants > 1 ? 's' : ''}`);
      return parts.join(', ') || '1 Adult';
   };

   return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center">
         <ProcedureProgress currentStep={1} />

         {/* Initial Hero Choice & Featured Deals */}
         {showHeroChoice && (
            <div className="w-full bg-slate-900 py-16 px-4 border-b border-white/5 animate-in fade-in zoom-in-95 duration-700">
               <div className="max-w-6xl mx-auto text-center mb-12">
                  <h1 className="text-6xl md:text-9xl font-black text-white italic tracking-tighter uppercase mb-4 leading-[0.85]">ASAP <span className="text-brand-secondary">TICKETS</span></h1>
                  <p className="text-white/40 font-bold max-w-xl mx-auto text-lg mb-12">Global Wholesale Fares & Private Flight Deals.</p>

                  {/* Featured Deals Grid (Real Photos & Ticket Style) */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16 text-left">
                     {[
                        { from: 'NYC', to: 'LON', city: 'London', price: 345, airline: 'British Airways', img: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&q=80&w=800' },
                        { from: 'LAX', to: 'TYO', city: 'Tokyo', price: 589, airline: 'Japan Airlines', img: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&q=80&w=800' },
                        { from: 'MIA', to: 'CDG', city: 'Paris', price: 410, airline: 'Air France', img: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&q=80&w=800' },
                     ].map((deal, i) => (
                        <button key={i} type="button" onClick={() => { setOrigin(deal.from); setDestination(deal.to); setShowHeroChoice(false); searchFlights(); }}
                           className="group relative h-64 rounded-[2rem] overflow-hidden cursor-pointer shadow-2xl border border-white/10 hover:border-brand-secondary/50 transition-all">
                           <img src={deal.img} alt={deal.city} className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                           <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>
                           <div className="absolute bottom-0 left-0 right-0 p-6">
                              <div className="flex justify-between items-end">
                                 <div>
                                    <div className="text-[10px] font-black text-brand-secondary uppercase tracking-widest mb-1 flex items-center gap-2"><span className="text-lg">✈</span> {deal.airline}</div>
                                    <div className="text-2xl font-black text-white leading-none">{deal.from} <span className="text-white/40 text-lg mx-1">→</span> {deal.city}</div>
                                 </div>
                                 <div className="text-4xl font-black text-white tracking-tighter">${deal.price}</div>
                              </div>
                           </div>
                           <div className="absolute top-4 right-4 bg-red-600 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest shadow-lg animate-pulse">Hot Deal</div>
                        </button>
                     ))}
                  </div>
               </div>
               <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
                  <button
                     onClick={() => { setShowLeadModal(true); setShowHeroChoice(false); }}
                     className="bg-white/5 border border-white/10 p-10 rounded-[3rem] text-left hover:bg-white/10 transition-all group relative overflow-hidden">
                     <div className="absolute top-0 right-0 w-32 h-32 bg-brand-secondary/10 blur-3xl group-hover:bg-brand-secondary/20 transition-all"></div>
                     <div className="text-4xl mb-6">🤝</div>
                     <h3 className="text-3xl font-black text-white italic uppercase tracking-tighter mb-2">Talk to an Expert</h3>
                     <p className="text-white/40 text-sm font-medium mb-8 leading-relaxed">Let our Delaware-based agents find you bulk fares and private contracts not shown online. Best for complex routes.</p>
                     <div className="bg-brand-secondary text-brand-primary w-fit px-8 py-3 rounded-full font-black uppercase text-[10px] tracking-widest shadow-xl group-hover:scale-105 transition-all">
                        Leave Preferences →
                     </div>
                  </button>

                  <button
                     onClick={() => setShowHeroChoice(false)}
                     className="bg-brand-primary p-10 rounded-[3rem] text-left hover:bg-brand-dark transition-all group relative overflow-hidden shadow-2xl">
                     <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 blur-3xl"></div>
                     <div className="text-4xl mb-6">🔍</div>
                     <h3 className="text-3xl font-black text-white italic uppercase tracking-tighter mb-2">Browse Deals</h3>
                     <p className="text-white/80 text-sm font-medium mb-8 leading-relaxed">Search our live 2026 global database with No-Loss Guarantee pricing and instant confirmation.</p>
                     <div className="bg-white text-brand-primary w-fit px-8 py-3 rounded-full font-black uppercase text-[10px] tracking-widest shadow-xl group-hover:scale-105 transition-all">
                        Search Live Inventory →
                     </div>
                  </button>
               </div>
            </div>
         )}

         <div className={`w-full bg-brand-primary py-12 px-4 shadow-xl ${showHeroChoice ? 'opacity-20 blur-sm pointer-events-none' : 'animate-in fade-in duration-1000'}`}>
            <div className="max-w-7xl mx-auto">
               <div className="flex items-center justify-between mb-6">
                  <div className="flex gap-1 bg-white/10 p-1.5 rounded-2xl w-fit overflow-hidden backdrop-blur-md border border-white/10">
                     {['roundtrip', 'oneway', 'multicity'].map(t => (
                        <button key={t} type="button" onClick={() => setTripType(t)}
                           className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${tripType === t ? 'bg-white text-brand-primary shadow-xl' : 'text-white/60 hover:text-white'}`}>
                           {t.replace('trip', ' trip').replace('city', '-city')}
                        </button>
                     ))}
                  </div>
                  <CurrencySwitcher />
               </div>

               <form onSubmit={searchFlights} className="bg-white rounded-[2.5rem] p-8 space-y-8 shadow-2xl relative">
                  <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-6 gap-6 items-end">
                     <div className="md:col-span-1 group relative">
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Passengers</label>
                        <button type="button" className="w-full bg-slate-50 rounded-2xl px-5 py-4 text-sm font-black text-slate-700 uppercase tracking-widest text-left">
                           {passengerSummary()}
                        </button>
                        <div className="hidden group-focus-within:block group-hover:block absolute top-full left-0 right-[-100px] z-[110] mt-2 bg-white rounded-[2rem] shadow-2xl p-6 border border-slate-100 animate-in fade-in slide-in-from-top-4 duration-500">
                           <div className="space-y-4">
                              <div className="flex justify-between items-center">
                                 <div><p className="text-[10px] font-black uppercase">Adults</p><p className="text-[8px] text-slate-400">12+ years</p></div>
                                 <div className="flex items-center gap-3">
                                    <button type="button" onClick={() => setPassengers(p => ({ ...p, adults: Math.max(1, p.adults - 1) }))} className="w-8 h-8 rounded-full bg-slate-100 font-black">-</button>
                                    <span className="font-black w-4 text-center">{passengers.adults}</span>
                                    <button type="button" onClick={() => setPassengers(p => ({ ...p, adults: p.adults + 1 }))} className="w-8 h-8 rounded-full bg-slate-100 font-black">+</button>
                                 </div>
                              </div>
                              <div className="flex justify-between items-center">
                                 <div><p className="text-[10px] font-black uppercase">Children</p><p className="text-[8px] text-slate-400">2-11 years</p></div>
                                 <div className="flex items-center gap-3">
                                    <button type="button" onClick={() => setPassengers(p => ({ ...p, children: Math.max(0, p.children - 1) }))} className="w-8 h-8 rounded-full bg-slate-100 font-black">-</button>
                                    <span className="font-black w-4 text-center">{passengers.children}</span>
                                    <button type="button" onClick={() => setPassengers(p => ({ ...p, children: p.children + 1 }))} className="w-8 h-8 rounded-full bg-slate-100 font-black">+</button>
                                 </div>
                              </div>
                              <div className="flex justify-between items-center">
                                 <div><p className="text-[10px] font-black uppercase">Infants</p><p className="text-[8px] text-slate-400">Under 2y</p></div>
                                 <div className="flex items-center gap-3">
                                    <button type="button" onClick={() => setPassengers(p => ({ ...p, infants: Math.max(0, p.infants - 1) }))} className="w-8 h-8 rounded-full bg-slate-100 font-black">-</button>
                                    <span className="font-black w-4 text-center">{passengers.infants}</span>
                                    <button type="button" onClick={() => setPassengers(p => ({ ...p, infants: p.infants + 1 }))} className="w-8 h-8 rounded-full bg-slate-100 font-black">+</button>
                                 </div>
                              </div>
                           </div>
                        </div>
                     </div>
                     <div className="md:col-span-1 group relative">
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Origin Hub</label>
                        <input type="text" value={origin} onChange={e => setOrigin(e.target.value)} placeholder="Country, City or Airport" required
                           className="w-full border-none bg-slate-50 rounded-2xl px-5 py-4 text-sm font-bold focus:ring-2 focus:ring-brand-primary text-slate-900" />
                        <div className="hidden group-focus-within:grid absolute top-full left-0 md:left-0 w-[90vw] md:w-[650px] z-[120] mt-4 bg-white rounded-[2rem] shadow-[0_0_80px_rgba(0,0,0,0.15)] p-6 md:p-8 grid-cols-1 gap-6 border border-slate-100 animate-in fade-in slide-in-from-top-4 duration-500 max-h-[400px] md:max-h-[500px] overflow-y-auto custom-scrollbar">
                           {[
                              { label: 'Americas — Major Hubs', codes: ['JFK', 'LAX', 'MIA', 'YYZ', 'YVR', 'MEX', 'CUN', 'GDL', 'PTY'] },
                              { label: 'Americas — Regional Secondary', codes: ['BZE', 'SAL', 'GUA', 'SAP', 'SJU', 'PUJ', 'NAS', 'HAV'] },
                              { label: 'Europe — Premier & Regional', codes: ['LHR', 'CDG', 'FRA', 'IST', 'MAD', 'AMS', 'FCO', 'MUC', 'ZRH', 'CPH'] },
                              { label: 'Africa — Network Hubs', codes: ['EBB', 'NBO', 'LOS', 'ADD', 'JNB', 'CPT', 'DKR', 'ACC', 'CAI', 'CMN'] },
                              { label: 'Middle East & South Asia', codes: ['DXB', 'DOH', 'AUH', 'JED', 'ISB', 'LHE', 'KHI', 'DEL', 'BOM', 'BLR'] },
                              { label: 'Asia Pacific', codes: ['SIN', 'HND', 'BKK', 'HKG', 'ICN', 'KUL', 'MNL', 'SYD', 'MEL', 'AKL'] },
                              { label: 'Oceania & Pacific Islands', codes: ['SYD', 'MEL', 'BNE', 'AKL', 'PPT', 'NAN', 'POM', 'GUM', 'APW'] }
                           ].map(cat => (
                              <div key={cat.label}>
                                 <div className="text-[9px] font-black text-slate-300 uppercase tracking-[0.2em] mb-3 border-b border-slate-50 pb-2">{cat.label}</div>
                                 <div className="grid grid-cols-4 gap-2">
                                    {cat.codes.map(code => (
                                       <button key={code} type="button" onMouseDown={() => setOrigin(code)}
                                          className="flex flex-col items-center gap-1 p-3 rounded-2xl hover:bg-slate-50 transition-all border border-transparent hover:border-slate-100 group/btn">
                                          <span className="text-xs font-black text-slate-800 group-hover/btn:text-brand-primary">{code}</span>
                                          <span className="text-[7px] font-bold text-slate-400 uppercase tracking-tighter truncate w-full text-center">{(MAJOR_CITIES[code]?.name || code)}</span>
                                       </button>
                                    ))}
                                 </div>
                              </div>
                           ))}
                        </div>
                     </div>
                     <div className="md:col-span-1 group relative">
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Destination</label>
                        <input type="text" value={destination} onChange={e => setDestination(e.target.value)} placeholder="City, Country or Airport" required
                           className="w-full border-none bg-slate-50 rounded-2xl px-5 py-4 text-sm font-bold focus:ring-2 focus:ring-brand-primary text-slate-900" />
                        <div className="hidden group-focus-within:grid absolute top-full left-[-40px] md:left-auto md:right-0 w-[90vw] md:w-[650px] z-[120] mt-4 bg-white rounded-[2rem] shadow-[0_0_80px_rgba(0,0,0,0.15)] p-6 md:p-8 grid-cols-1 gap-6 border border-slate-100 animate-in fade-in slide-in-from-top-4 duration-500 max-h-[400px] md:max-h-[500px] overflow-y-auto custom-scrollbar">
                           {[
                              { label: 'Global Mega-Hubs', codes: ['DXB', 'LHR', 'JFK', 'SIN', 'HND', 'CDG', 'FRA', 'SYD', 'HKG', 'DOH'] },
                              { label: 'North America & LATAM', codes: ['ATL', 'LAX', 'ORD', 'DFW', 'YYZ', 'MEX', 'GRU', 'EZE', 'BOG', 'REC', 'POA', 'MAO'] },
                              { label: 'African Continental Network', codes: ['NBO', 'ADD', 'JNB', 'LOS', 'EBB', 'DKR', 'ACC', 'CAI', 'CPT', 'HRE', 'LUN'] },
                              { label: 'Middle East Transit hubs', codes: ['AUH', 'RUH', 'JED', 'AMM', 'TLV', 'BAH', 'KWI', 'MCT', 'IKA'] },
                              { label: 'Asia & Oceania Regional', codes: ['BKK', 'BOM', 'DEL', 'ICN', 'KUL', 'MEL', 'AKL', 'CGK', 'DPS', 'MNL', 'CEB', 'VTE'] },
                              { label: 'Central Asia & Caucuses', codes: ['GYD', 'TBS', 'EVN', 'TAS', 'ALA', 'NQZ'] },
                              { label: 'Pacific Islands & Exotic', codes: ['PPT', 'NAN', 'GUM', 'POM', 'VLI', 'NOU', 'APW', 'TBU', 'MLE'] }
                           ].map(cat => (
                              <div key={cat.label}>
                                 <div className="text-[9px] font-black text-slate-300 uppercase tracking-[0.2em] mb-3 border-b border-slate-50 pb-2">{cat.label}</div>
                                 <div className="grid grid-cols-4 gap-2">
                                    {cat.codes.map(code => (
                                       <button key={code} type="button" onMouseDown={() => setDestination(code)}
                                          className="flex flex-col items-center gap-1 p-3 rounded-2xl hover:bg-slate-50 transition-all border border-transparent hover:border-slate-100 group/btn">
                                          <span className="text-xs font-black text-slate-800 group-hover/btn:text-brand-primary">{code}</span>
                                          <span className="text-[7px] font-bold text-slate-400 uppercase tracking-tighter truncate w-full text-center">{(MAJOR_CITIES[code]?.name || code)}</span>
                                       </button>
                                    ))}
                                 </div>
                              </div>
                           ))}
                        </div>
                     </div>
                     <div className="lg:col-span-1">
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Departure</label>
                        <input type="date" value={date} onChange={e => setDate(e.target.value)}
                           className="w-full border-none bg-slate-50 rounded-2xl px-5 py-4 text-sm font-bold focus:ring-2 focus:ring-brand-primary" />
                     </div>
                     {tripType === 'roundtrip' && (
                        <div className="lg:col-span-1 animate-in fade-in slide-in-from-left-4 duration-500">
                           <label className="block text-[10px] font-black text-brand-primary uppercase tracking-widest mb-2 ml-1">Return Date</label>
                           <input type="date" value={returnDate} onChange={e => setReturnDate(e.target.value)}
                              className="w-full border-none bg-brand-primary/5 rounded-2xl px-5 py-4 text-sm font-bold focus:ring-2 focus:ring-brand-primary text-brand-primary" />
                        </div>
                     )}
                     <div className="lg:col-span-1">
                        <label className="flex items-center gap-3 bg-slate-50 rounded-2xl px-5 py-4 cursor-pointer hover:bg-slate-100 border border-transparent">
                           <input type="checkbox" checked={flexible} onChange={e => setFlexible(e.target.checked)} className="w-5 h-5 accent-brand-primary rounded" />
                           <span className="text-[10px] font-black text-slate-700 uppercase tracking-widest leading-tight">Flexible Dates</span>
                        </label>
                     </div>
                     <div className="lg:col-span-1">
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Cabin</label>
                        <select value={cabin} onChange={e => setCabin(e.target.value)}
                           className="w-full border-none bg-slate-50 rounded-2xl px-5 py-4 text-sm font-bold appearance-none bg-white focus:ring-2 focus:ring-brand-primary">
                           <option value="ECONOMY">Economy</option>
                           <option value="BUSINESS">Business</option>
                           <option value="FIRST">First Class</option>
                        </select>
                     </div>
                     <button type="submit" disabled={loading}
                        className="w-full bg-brand-primary hover:bg-brand-dark text-white font-black py-4.5 rounded-2xl transition-all shadow-xl flex items-center justify-center gap-2 transform active:scale-95">
                        {loading ? 'Finding...' : '🔍 SEARCH'}
                     </button>
                  </div>

                  {/* Advanced Preferences (Round Trip Specific) */}
                  {tripType === 'roundtrip' && (
                     <div className="grid grid-cols-1 md:grid-cols-4 gap-6 pt-6 border-t border-slate-50 animate-in fade-in slide-in-from-top-4 duration-500">
                        <div>
                           <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Layover Time</label>
                           <select value={layoverTime} onChange={e => setLayoverTime(e.target.value)}
                              className="w-full border-none bg-slate-50 rounded-2xl px-5 py-4 text-xs font-bold appearance-none bg-white focus:ring-2 focus:ring-brand-primary">
                              <option value="Any">Any Duration</option>
                              <option value="Quick">Quick (0-2h)</option>
                              <option value="Std">Standard (2-6h)</option>
                              <option value="Long">Overnight (6h+)</option>
                           </select>
                        </div>
                        <div className="md:col-span-2">
                           <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Preferred Cities (Optional)</label>
                           <input type="text" value={layoverCities} onChange={e => setLayoverCities(e.target.value)}
                              placeholder="e.g. Dubai, London" className="w-full border-none bg-slate-50 rounded-2xl px-5 py-4 text-xs font-bold focus:ring-2 focus:ring-brand-primary" />
                        </div>
                        <div>
                           <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Max Stops</label>
                           <select value={maxStops} onChange={e => setMaxStops(e.target.value)}
                              className="w-full border-none bg-slate-50 rounded-2xl px-5 py-4 text-xs font-bold appearance-none bg-white focus:ring-2 focus:ring-brand-primary">
                              <option value="Any">Any</option>
                              <option value="0">Non-stop</option>
                              <option value="1">Up to 1 Stop</option>
                              <option value="2">Up to 2 Stops</option>
                           </select>
                        </div>
                     </div>
                  )}

                  <div className="flex gap-8 items-center border-t border-slate-100 pt-6">
                     <div className="flex items-center gap-2">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Travelers:</span>
                        <div className="flex items-center gap-3 bg-slate-50 px-3 py-1.5 rounded-xl group relative">
                           <button type="button" onClick={() => setPassengers(p => ({ ...p, adults: Math.max(1, p.adults - 1) }))} className="text-brand-primary font-black">-</button>
                           <span className="text-sm font-black text-slate-800">{totalPassengers}</span>
                           <button type="button" onClick={() => setPassengers(p => ({ ...p, adults: p.adults + 1 }))} className="text-brand-primary font-black">+</button>
                        </div>
                     </div>
                     <div className="text-[10px] font-black text-emerald-600 uppercase tracking-widest font-bold">
                        {flexible ? '✓ Flexible Prices + Market Rate Buffer Applied' : 'ℹ Secure the best deals with flexibility'}
                     </div>
                  </div>
               </form>
            </div>
         </div>

         <div className="max-w-7xl w-full mx-auto px-4 py-12 flex flex-col lg:grid lg:grid-cols-4 gap-12">
            <aside className="lg:col-span-1 space-y-8">
               <div className="bg-white rounded-[2.5rem] p-8 border border-slate-200 shadow-xl sticky top-8">
                  <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-8 border-b pb-4">Refine Search</h3>
                  <div className="space-y-8">
                     <div>
                        <label className="block text-[10px] font-black text-slate-800 uppercase tracking-widest mb-4">Total Stops</label>
                        <div className="grid grid-cols-2 gap-2">
                           {['Any', 'Non-stop', '1', '2', '3', '4', '5', '6'].map(s => (
                              <button key={s} type="button" onClick={() => setFilterStops(s)}
                                 className={`text-center px-4 py-2 rounded-xl text-[10px] font-black uppercase transition-all ${filterStops === s ? 'bg-brand-primary text-white shadow-lg' : 'bg-slate-50 text-slate-500 hover:bg-slate-100'}`}>
                                 {s}
                              </button>
                           ))}
                        </div>
                     </div>
                     <div>
                        <label className="block text-[10px] font-black text-slate-800 uppercase tracking-widest mb-4">Preferred Airlines</label>
                        <div className="space-y-2 max-h-48 overflow-y-auto pr-2 scrollbar-none">
                           {['Any', ...Array.from(new Set(flights.map(f => f.airline)))].map(a => (
                              <button key={a} type="button" onClick={() => setFilterAirline(a)}
                                 className={`w-full text-left px-4 py-2 rounded-xl text-xs font-bold transition-all ${filterAirline === a ? 'bg-brand-primary text-white shadow-lg' : 'bg-slate-50 text-slate-500 hover:bg-slate-100'}`}>{a}</button>
                           ))}
                        </div>
                     </div>
                  </div>
               </div>
            </aside>

            <div className="lg:col-span-3 space-y-6">
               {/* Flexible Date Price Strip */}
               <div className="bg-white rounded-[2rem] p-4 shadow-xl border border-slate-200 overflow-x-auto scrollbar-none">
                  <div className="flex gap-4 min-w-max">
                     {[-3, -2, -1, 0, 1, 2, 3].map(offset => {
                        const d = new Date(new Date(date).getTime() + offset * 864e5);
                        const dStr = d.toISOString().split('T')[0];
                        const s = getPriceSeasonality(destination, dStr);
                        const currentS = getPriceSeasonality(destination, date);

                        // Check if this date is cheaper than the selected date
                        const isCheaper = s.multiplier < currentS.multiplier;
                        const isSelected = dStr === date;

                        let colorClass = "bg-slate-50 text-slate-400 border-slate-100 hover:border-slate-300";

                        if (isCheaper) {
                           // User requested RED for lower prices (Hot Deal / Savings)
                           colorClass = "bg-red-50 text-red-600 border-red-100 hover:bg-red-100 relative overflow-hidden";
                        } else if (s.isPeak) {
                           colorClass = "bg-orange-50 text-orange-700 border-orange-100 hover:bg-orange-100";
                        } else if (s.isLow) {
                           colorClass = "bg-emerald-50 text-emerald-700 border-emerald-100 hover:bg-emerald-100";
                        } else {
                           colorClass = "bg-amber-50 text-amber-700 border-amber-100 hover:bg-amber-100";
                        }

                        if (isSelected) colorClass = "bg-brand-primary text-white border-brand-primary shadow-lg ring-4 ring-brand-primary/10";

                        return (
                           <button key={offset} onClick={() => { setDate(dStr); searchFlights(); }}
                              className={`px-6 py-3 rounded-2xl border-2 transition-all flex flex-col items-center gap-1 group ${colorClass}`}>
                              {isCheaper && !isSelected && (
                                 <div className="absolute top-0 right-0 bg-red-600 text-white text-[6px] font-black px-1.5 py-0.5 rounded-bl-lg">SAVE</div>
                              )}
                              <span className={`text-[8px] font-black uppercase tracking-widest ${isSelected ? 'text-white/60' : (isCheaper ? 'text-red-400' : 'text-slate-400')}`}>
                                 {d.toLocaleDateString('en-US', { weekday: 'short' })}
                              </span>
                              <span className="text-sm font-black italic uppercase leading-none">{d.toLocaleDateString('en-US', { day: '2-digit', month: 'short' })}</span>
                              <span className={`text-[10px] font-black mt-1 ${isSelected ? 'text-white' : ''}`}>
                                 {isCheaper ? 'HOT DEAL' : (s.isPeak ? 'Peak' : s.isLow ? 'Best' : 'Avg')}
                              </span>
                           </button>
                        );
                     })}
                  </div>
               </div>

               <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-slate-400 px-2 mt-4">
                  <span>{filteredFlights.length} Guaranteed Deals Verified</span>
                  <div className="flex gap-4">
                     <span className="text-emerald-500">💎 Direct Wholesale Rates</span>
                     <span>Active @ Wilmington, DE</span>
                  </div>
               </div>

               {loading && <div className="space-y-4">{[1, 2, 3].map(i => <div key={i} className="bg-white rounded-[2.5rem] h-56 animate-pulse border border-slate-200"></div>)}</div>}

               {!loading && filteredFlights.length > 0 && (
                  <div className="space-y-6">
                     {filteredFlights.map((flight) => {
                        const seasonality = getPriceSeasonality(flight.arrival?.iataCode || destination, date);
                        const basePrice = parseFloat(flight.priceTotal);

                        // Safe pricing logic
                        const clientPricePerPerson = calculateClientPrice(basePrice, seasonality.multiplier);
                        const totalFormatted = formatPricing(clientPricePerPerson * totalPassengers, activeCurrency);

                        // Historical Price Literacy
                        const distanceToDest = getDistanceBetweenCodes(flight.departure?.iataCode || origin, flight.arrival?.iataCode || destination);
                        const historical = getHistoricalPriceStatus(clientPricePerPerson, distanceToDest);

                        const depCode = flight.departure?.iataCode || origin;
                        const arrCode = flight.arrival?.iataCode || destination;

                        const idx = filteredFlights.indexOf(flight);
                        const isCheapest = idx === filteredFlights.length - 1 || parseFloat(flight.priceTotal) < 500;
                        const isFastest = !flight.layovers || flight.layovers === 0;
                        const isComfort = ['Emirates', 'Qatar Airways', 'Lufthansa'].includes(flight.airline);

                        return (
                           <div key={flight.id} className="bg-white rounded-[2.5rem] border border-slate-200 shadow-xl overflow-hidden hover:border-brand-primary/40 transition-all flex flex-col md:flex-row p-8 gap-8 group">
                              <div className="flex-1">
                                 <div className="flex items-center gap-3 mb-8">
                                    <div className="w-12 h-12 rounded-2xl bg-slate-900 flex items-center justify-center font-black text-white text-sm">{(flight.airline || 'FL').substring(0, 2)}</div>
                                    <div>
                                       <div className="flex items-center gap-2 mb-0.5">
                                          <h3 className="text-lg font-black text-slate-800">{flight.airline}</h3>
                                          {flight.alliance && flight.alliance !== 'Independent' && (
                                             <span className="text-[8px] bg-sky-50 text-sky-600 px-2 py-0.5 rounded-full font-bold uppercase tracking-widest border border-sky-100">{flight.alliance}</span>
                                          )}
                                       </div>
                                       <div className="flex items-center gap-2 mt-1">
                                          <span className="text-[10px] font-bold text-slate-400 tracking-widest uppercase">{flight.flightNumber}</span>
                                          <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                                          <span className="text-[10px] font-bold text-emerald-600 tracking-widest uppercase italic">{cabin} Verified</span>
                                       </div>
                                    </div>
                                 </div>

                                 <div className="flex gap-2 mb-6 -mt-4">
                                    <div className={`flex items-center gap-2 bg-${historical.color}-50 text-${historical.color}-600 px-4 py-1.5 rounded-full border border-${historical.color}-100 animate-in fade-in duration-500`}>
                                       <span className="text-sm">{historical.icon}</span>
                                       <span className="text-[9px] font-black uppercase tracking-widest">{historical.label}</span>
                                       {historical.diff > 0 && <span className="text-[8px] font-bold opacity-60">({formatPricing(historical.diff, activeCurrency)} {historical.label.includes('Great') ? 'Savings' : 'Premium'})</span>}
                                    </div>
                                    {isCheapest && <span className="bg-emerald-500 text-white text-[8px] font-black px-3 py-1 rounded-lg uppercase tracking-widest shadow-lg shadow-emerald-500/20">Wholesale Price</span>}
                                    {isFastest && <span className="bg-amber-500 text-white text-[8px] font-black px-3 py-1 rounded-lg uppercase tracking-widest shadow-lg shadow-amber-500/20">Non-Stop</span>}
                                    {isComfort && <span className="bg-indigo-500 text-white text-[8px] font-black px-3 py-1 rounded-lg uppercase tracking-widest shadow-lg shadow-indigo-500/20">Premium Comfort</span>}
                                    {flight.layovers > 0 && <span className="bg-slate-100 text-slate-500 text-[8px] font-black px-3 py-1 rounded-lg uppercase tracking-widest border border-slate-200">{flight.layovers} Stop{flight.layovers > 1 ? 's' : ''}</span>}
                                 </div>

                                 <div className="flex items-center gap-8">
                                    <div className="text-center min-w-[80px]">
                                       <div className="text-3xl font-black text-slate-800">{flight.departure?.at?.substring(11, 16) || '10:10'}</div>
                                       <div className="text-[12px] font-bold text-slate-500 uppercase tracking-widest">{depCode}</div>
                                    </div>
                                    <div className="flex-1 flex flex-col items-center gap-1 relative py-4">
                                       <div className="absolute top-1/2 left-0 right-0 h-px border-t border-dashed border-slate-200"></div>
                                       <span className={`text-[9px] font-black z-10 bg-white px-3 py-1 rounded-full uppercase tracking-tighter shadow-sm border ${seasonality.isPeak ? 'text-orange-600 border-orange-100' : 'text-emerald-600 border-emerald-100'}`}>
                                          {seasonality.label} Price Guard
                                       </span>
                                       {flight.totalTravelTime && (
                                          <div className="absolute top-[85%] text-[7px] font-black text-slate-300 uppercase tracking-widest bg-white px-2 whitespace-nowrap z-20">
                                             {flight.totalTravelTime} TOTAL
                                          </div>
                                       )}
                                    </div>
                                    <div className="text-center min-w-[80px]">
                                       <div className="text-3xl font-black text-slate-800">{flight.arrival?.at?.substring(11, 16) || '13:45'}</div>
                                       <div className="text-[12px] font-bold text-slate-500 uppercase tracking-widest">{arrCode}</div>
                                    </div>
                                 </div>

                                 {flight.layoverDetails && flight.layoverDetails.length > 0 && (
                                    <div className="mt-8 space-y-3 relative animate-in fade-in duration-700 border-l-2 border-slate-50 pl-6 ml-1">
                                       {flight.layoverDetails.map((l: any, i: number) => (
                                          <div key={i} className="flex items-center justify-between text-[10px] font-black uppercase tracking-tighter">
                                             <div className="flex items-center gap-2">
                                                <span className="text-slate-300">Wait @</span>
                                                <span className="text-brand-primary font-black">{l.iataCode}</span>
                                                <span className="text-slate-500 font-medium">({l.city})</span>
                                             </div>
                                             <div className="bg-slate-50 px-3 py-1 rounded-full text-slate-400 border border-slate-100 italic">{l.duration} Stop</div>
                                          </div>
                                       ))}
                                    </div>
                                 )}

                                 {flight.isRoundTrip && flight.returnLeg && (
                                    <div className="mt-8 pt-8 border-t border-slate-50 animate-in fade-in slide-in-from-bottom-2 duration-500">
                                       <div className="flex items-center gap-8">
                                          <div className="text-center min-w-[80px]">
                                             <div className="text-2xl font-black text-slate-400">{flight.returnLeg.departure.at.substring(11, 16)}</div>
                                             <div className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">{arrCode}</div>
                                          </div>
                                          <div className="flex-1 flex flex-col items-center gap-1 relative py-4">
                                             <div className="absolute top-1/2 left-0 right-0 h-px border-t border-dashed border-slate-100"></div>
                                             <span className="text-[8px] font-black z-10 bg-white px-3 py-1 rounded-full uppercase tracking-tighter text-slate-300 border border-slate-50">
                                                Return Leg
                                             </span>
                                             {flight.totalTravelTime && (
                                                <div className="absolute top-[85%] text-[7px] font-black text-slate-300 uppercase tracking-widest bg-white px-2 whitespace-nowrap z-20">
                                                   {flight.totalTravelTime} TOTAL
                                                </div>
                                             )}
                                          </div>
                                          <div className="text-center min-w-[80px]">
                                             <div className="text-2xl font-black text-slate-400">{flight.returnLeg.arrival.at.substring(11, 16)}</div>
                                             <div className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">{depCode}</div>
                                          </div>
                                       </div>
                                    </div>
                                 )}
                              </div>

                              <div className="md:w-64 flex flex-col items-end gap-4 border-t md:border-t-0 md:border-l border-slate-100 pt-6 md:pt-1 md:pl-10">
                                 <div className="text-right">
                                    <div className="text-[10px] font-black text-slate-300 line-through tracking-widest uppercase mb-1">Market Avg: {formatPricing(basePrice * 1.4 * totalPassengers, activeCurrency)}</div>
                                    <div className="flex flex-col items-end">
                                       <div className="text-5xl font-black text-brand-primary tracking-tighter leading-none">{totalFormatted}</div>
                                       <div className="text-[10px] font-black text-brand-primary/40 uppercase tracking-widest mt-1">
                                          {formatPricing(clientPricePerPerson, activeCurrency)} Per Person
                                       </div>
                                    </div>
                                    <div className="text-[9px] font-black text-slate-600 uppercase mt-4 tracking-widest flex items-center justify-end gap-1 text-right">
                                       <span className="w-1.5 h-1.5 bg-brand-primary/20 rounded-full"></span>
                                       Total for {totalPassengers} Traveler{totalPassengers > 1 ? 's' : ''} <br /> (Inc. Tax & Fares)
                                    </div>
                                 </div>
                                 <Link href={`/flights/checkout?flightId=${flight.id}&origin=${depCode}&destination=${arrCode}&passengers=${totalPassengers}&adults=${passengers.adults}&children=${passengers.children}&infants=${passengers.infants}&priceCents=${Math.round(clientPricePerPerson * totalPassengers * 100)}`}
                                    className="w-full bg-slate-900 text-white font-black py-5 rounded-3xl shadow-xl hover:bg-black transition-all text-center text-sm uppercase tracking-widest flex items-center justify-center gap-2">
                                    <span>Insta-Book</span>
                                    <span className="text-[10px] opacity-40 font-normal">Self-Service</span>
                                 </Link>
                                 <button
                                    onClick={() => { 
                                       setSelectedFlightForLead(flight); 
                                       setShowLeadModal(true); 
                                       trackEvent('Expert Hub Opened', { flightId: flight.id, route: `${depCode}→${arrCode}` });
                                    }}
                                    className="w-full bg-brand-secondary text-brand-primary font-black py-4 rounded-3xl hover:bg-brand-secondary/80 transition-all text-sm uppercase tracking-widest shadow-lg shadow-brand-secondary/20">
                                    Expert Service Request
                                 </button>
                                 <span className="text-[8px] font-black text-slate-300 uppercase tracking-widest text-center italic">Best for Large Groups & Custom Needs</span>
                              </div>
                           </div>
                        );
                     })}

                     <div className="bg-slate-900 rounded-[3rem] p-12 text-center text-white border-4 border-slate-800 shadow-2xl mt-12 animate-in fade-in slide-in-from-bottom-4 duration-1000">
                        <div className="max-w-xl mx-auto">
                           <div className="text-4xl mb-6">🤝</div>
                           <h3 className="text-3xl font-black italic tracking-tighter uppercase mb-2">Can't find the perfect flight?</h3>
                           <p className="text-white/40 text-sm font-medium mb-8">Our expert agents in Delaware have access to private bulk fares not shown online. Leave your details and we'll beat these prices.</p>
                           <button
                              onClick={() => { setSelectedFlightForLead(null); setShowLeadModal(true); }}
                              className="bg-brand-secondary text-brand-primary font-black px-12 py-5 rounded-full text-sm uppercase tracking-widest hover:scale-105 transition-all shadow-xl">
                              Talk to an Expert →
                           </button>
                        </div>
                     </div>
                  </div>
               )}
            </div>
         </div>

         {/* Lead Submission Modal */}
         {showLeadModal && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
               <div className="absolute inset-0 bg-brand-dark/95 backdrop-blur-md" onClick={() => setShowLeadModal(false)}></div>
               <div className="relative bg-white w-full max-w-md rounded-[3rem] p-10 shadow-2xl animate-in zoom-in-95 duration-300 overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-2 bg-brand-secondary"></div>

                  {leadStatus !== 'success' ? (
                     <>
                        <button onClick={() => setShowLeadModal(false)} className="absolute top-6 right-8 text-slate-300 hover:text-slate-800 text-2xl font-light">×</button>
                        <div className="mb-8">
                           <span className="text-[10px] font-black text-brand-primary uppercase tracking-widest mb-2 block">Agent Service Request</span>
                           <h2 className="text-3xl font-black text-slate-800 tracking-tight leading-tight italic">Unlock Private <br /> Wholesale Rates</h2>
                           <p className="text-slate-500 mt-2 text-sm font-medium">Leave your details for <span className="font-black text-slate-800">{origin} → {destination}</span>. Our agents will secure a contract better than the online price.</p>
                        </div>

                        <form onSubmit={handleLeadSubmit} className="space-y-4">
                           <input type="text" placeholder="Full Name" required value={leadForm.name}
                              onChange={e => setLeadForm({ ...leadForm, name: e.target.value })}
                              className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 font-bold text-slate-800 focus:ring-2 focus:ring-brand-primary" />
                           <input type="email" placeholder="Email" required value={leadForm.email}
                              onChange={e => setLeadForm({ ...leadForm, email: e.target.value })}
                              className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 font-bold text-slate-800 focus:ring-2 focus:ring-brand-primary" />
                           <input type="tel" placeholder="Phone (WhatsApp/SMS/Calls)" required value={leadForm.phone}
                              onChange={e => setLeadForm({ ...leadForm, phone: e.target.value })}
                              className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 font-bold text-slate-800 focus:ring-2 focus:ring-brand-primary" />

                           <div className="pt-4 border-t border-slate-100">
                              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Flight Preferences (Optional)</p>
                              <div className="grid grid-cols-2 gap-3">
                                 <input type="text" placeholder="Preferred Airlines" value={expertPrefs.airlines}
                                    onChange={e => setExpertPrefs({ ...expertPrefs, airlines: e.target.value })}
                                    className="w-full bg-slate-50 border-none rounded-2xl px-5 py-3 text-xs font-bold text-slate-800 focus:ring-2 focus:ring-brand-primary" />
                                 <input type="text" placeholder="Layover Cities/Time" value={expertPrefs.layovers}
                                    onChange={e => setExpertPrefs({ ...expertPrefs, layovers: e.target.value })}
                                    className="w-full bg-slate-50 border-none rounded-2xl px-5 py-3 text-xs font-bold text-slate-800 focus:ring-2 focus:ring-brand-primary" />
                              </div>
                           </div>

                           <div className="grid grid-cols-1 gap-3">
                              <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 flex flex-col gap-2 group cursor-pointer hover:bg-slate-100 transition-all"
                                 onClick={() => setLeadForm({ ...leadForm, deposit: !leadForm.deposit })}>
                                 <div className="flex items-center justify-between">
                                    <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${leadForm.deposit ? 'bg-orange-500 border-orange-500' : 'border-slate-200'}`}>
                                       {leadForm.deposit && <span className="text-white text-[10px] font-black">✓</span>}
                                    </div>
                                    <div className="text-sm font-black text-orange-600">+$10</div>
                                 </div>
                                 <span className="text-[10px] font-black text-slate-800 uppercase tracking-widest block">Daily Price Lock</span>
                              </div>
                           </div>

                           {selectedFlightForLead && (
                              <div className="flex items-center justify-between pt-4 border-t border-slate-100 mt-2">
                                 <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Quote Base:</span>
                                 <span className="text-xl font-black text-slate-800">
                                    {formatPricing(calculateClientPrice(parseFloat(selectedFlightForLead.priceTotal), getPriceSeasonality(selectedFlightForLead.arrival?.iataCode || destination, date).multiplier) * totalPassengers, activeCurrency)}
                                 </span>
                              </div>
                           )}

                           <div className="grid grid-cols-3 gap-2 mt-4">
                              {['WhatsApp', 'SMS', 'Calls'].map(p => (
                                 <button key={p} type="button" onClick={() => setLeadForm({ ...leadForm, pref: p })}
                                    className={`py-3 rounded-xl text-[8px] font-black uppercase tracking-widest transition-all ${leadForm.pref === p ? 'bg-brand-primary text-white shadow-lg' : 'bg-slate-50 text-slate-500'}`}>
                                    {p}
                                 </button>
                              ))}
                           </div>

                           <button type="submit" disabled={leadStatus === 'submitting'} className="w-full bg-brand-secondary text-brand-primary font-black py-5 rounded-[2rem] text-sm shadow-xl hover:scale-105 transition-all mt-6 uppercase tracking-widest">
                              {leadStatus === 'submitting' ? 'Negotiating...' : 'Submit to Agent →'}
                           </button>
                        </form>
                     </>
                  ) : (
                     <div className="text-center py-20 animate-in zoom-in duration-500">
                        <div className="text-7xl mb-6">✅</div>
                        <h2 className="text-3xl font-black text-slate-800 tracking-tight italic uppercase">Request Received</h2>
                        <p className="text-slate-500 font-medium mt-4">
                           An expert from our Delaware HQ will contact you shortly with a private quote
                           {leadForm.deposit ? ' including your daily price lock' : ''}.
                        </p>
                     </div>
                  )}
               </div>
            </div>
         )}
      </div>
   );
}

export default function FlightsPage() {
   return (
      <Suspense fallback={<div className="min-h-screen flex items-center justify-center animate-pulse text-slate-400 font-bold uppercase tracking-widest">Accessing World Seasonality Feeds...</div>}>
         <FlightsContent />
      </Suspense>
   );
}
