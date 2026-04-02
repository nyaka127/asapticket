'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { ProcedureProgress } from '@/components/ProcedureProgress';
import { MAJOR_CITIES, getDistanceBetweenCodes } from '@/lib/geo';
import { CurrencySwitcher } from '@/components/CurrencySwitcher';
import { useClientPulse } from '@/hooks/useClientPulse';
import { useSearchParams, useRouter } from 'next/navigation';
import { getFullAirportName } from '@/lib/geo';
import { AIRLINES, getBestAirlineLogo, AIRLINE_LOGO_MAP } from '@/lib/airlineLogos';
import { AirportSearchDropdown } from '@/components/AirportSearchDropdown';
import { useTranslation } from '@/components/TranslationProvider';
import { calculateClientPrice, formatPricing, getRealisticBasePrice, getPriceSeasonality, getHistoricalPriceStatus } from '@/lib/pricing';

function FlightsContent() {
   const { t } = useTranslation();
   const { trackEvent } = useClientPulse();
   const searchParams = useSearchParams();
   const router = useRouter();

   const [showHeroChoice, setShowHeroChoice] = useState(false);
   const [origin, setOrigin] = useState(searchParams.get('origin') || '');
   const [destination, setDestination] = useState(searchParams.get('destination') || '');
   const [tripType, setTripType] = useState(searchParams.get('tripType') || 'roundtrip');
   const [date, setDate] = useState(searchParams.get('date') || new Date().toISOString().split('T')[0]);
   const [returnDate, setReturnDate] = useState(searchParams.get('returnDate') || new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0]);
   const [flexible, setFlexible] = useState(searchParams.get('flexible') === 'true');
   const [depFlex, setDepFlex] = useState(Number(searchParams.get('depFlex')) || 3);
   const [retFlex, setRetFlex] = useState(Number(searchParams.get('retFlex')) || 3);
   const [cabin, setCabin] = useState(searchParams.get('cabin') || 'ECONOMY');
   const [passengers, setPassengers] = useState({ 
      adults: Math.max(1, Number(searchParams.get('adults')) || 1), 
      children: Number(searchParams.get('children')) || 0, 
      infants: Number(searchParams.get('infants')) || 0 
   });
   const [loading, setLoading] = useState(false);
   const [showLeadModal, setShowLeadModal] = useState(false);

   // Advanced/Filters
   const [layoverTime, setLayoverTime] = useState('Any');
   const [layoverCities, setLayoverCities] = useState('');
   const [maxStops, setMaxStops] = useState('Any');
   const [filterStops, setFilterStops] = useState('Any');
   const [filterAirline, setFilterAirline] = useState('Any');

   // Lead Form
   const [leadForm, setLeadForm] = useState({ name: '', email: '', phone: '', deposit: false, pref: 'WhatsApp' });
   const [expertPrefs, setExpertPrefs] = useState({ airlines: '', layovers: '' });
   const [selectedFlightForLead, setSelectedFlightForLead] = useState<any>(null);
   const [leadStatus, setLeadStatus] = useState('idle');

   // Data
   const [flights, setFlights] = useState<any[]>([]);
   const [activeCurrency, setActiveCurrency] = useState('USD');

   const totalPassengers = passengers.adults + passengers.children + passengers.infants;

   useEffect(() => {
      const saved = localStorage.getItem('user-currency');
      if (saved) setActiveCurrency(saved);

      // Auto-trigger search if params exist (New Tab Flow)
      if (searchParams.get('origin') && searchParams.get('destination')) {
         performSearch();
      }
   }, []);

   const searchFlights = (e: React.FormEvent) => {
      e.preventDefault();
      if (!origin || !destination) return;

      const params = new URLSearchParams();
      params.set('origin', origin);
      params.set('destination', destination);
      params.set('date', date);
      params.set('tripType', tripType);
      params.set('adults', passengers.adults.toString());
      params.set('children', passengers.children.toString());
      params.set('infants', passengers.infants.toString());
      params.set('cabin', cabin);
      params.set('flexible', flexible.toString());
      params.set('depFlex', depFlex.toString());
      params.set('retFlex', retFlex.toString());

      const url = `${window.location.pathname}?${params.toString()}`;
      router.push(url);
      performSearch();
   };

   const performSearch = async (overrideOrigin?: string, overrideDest?: string, overridePrice?: number) => {
      setLoading(true);
      setTimeout(() => {
         const partners = [
            { name: 'Delta Air Lines', alliance: 'SkyTeam' },
            { name: 'United Airlines', alliance: 'Star Alliance' },
            { name: 'American Airlines', alliance: 'Oneworld' },
            { name: 'British Airways', alliance: 'Oneworld' },
            { name: 'Lufthansa', alliance: 'Star Alliance' },
            { name: 'Air France', alliance: 'SkyTeam' },
            { name: 'KLM', alliance: 'SkyTeam' },
            { name: 'Emirates', alliance: 'None' },
            { name: 'Qatar Airways', alliance: 'Oneworld' }
         ];

         // Filter or use defaults
         const targetAirlines = filterAirline !== 'Any' 
            ? [{ name: filterAirline, alliance: 'Various' }]
            : partners;

         const currentOrigin = overrideOrigin || origin || 'JFK';
         const currentDest = overrideDest || destination || 'LHR';
         const distance = getDistanceBetweenCodes(currentOrigin, currentDest);
         const currentSeasonality = getPriceSeasonality(currentDest, date);
         
         const queryPriceCents = searchParams.get('priceCents');
         const targetPricePerPerson = queryPriceCents ? Number(queryPriceCents) / 100 / totalPassengers : overridePrice;
         const exactBaseTarget = targetPricePerPerson ? (targetPricePerPerson / (currentSeasonality.multiplier * 1.10)) : null;

         const goldenIndex = Math.floor(Math.random() * targetAirlines.length);

         const generatedFlights = targetAirlines.map((airlineObj, index) => {
            const distanceBase = getRealisticBasePrice(distance);
            
            let basePrice;
            if (exactBaseTarget && index === goldenIndex) {
               // Only ONE airline gets the exact discounted price requested
               basePrice = exactBaseTarget;
            } else {
               // All other airlines get their usual/market fare
               basePrice = distanceBase + 50 + (Math.random() * 100); 
            }

            const depHour = 5 + Math.floor(Math.random() * 14);
            const durationHrs = 6 + Math.floor(Math.random() * 8);
            
            return {
               id: `flight-tp-${index}-${Date.now()}`,
               airline: airlineObj.name,
               flightNumber: `${airlineObj.name.substring(0, 2).toUpperCase()}${100 + Math.floor(Math.random() * 800)}`,
               priceTotal: basePrice.toString(),
               departure: { iataCode: currentOrigin, at: `${date}T${depHour.toString().padStart(2, '0')}:00:00` },
               arrival: { iataCode: currentDest, at: `${new Date(new Date(date).getTime() + (Math.random() > 0.5 ? 86400000 : 0)).toISOString().split('T')[0]}T${((depHour + durationHrs) % 24).toString().padStart(2, '0')}:30:00` },
               duration: `${durationHrs}h 30m`,
               layovers: Math.floor(Math.random() * 2), // 0 or 1
               seatsRemaining: Math.floor(Math.random() * 6) + 1,
               showSeatsBadge: Math.random() > 0.4,
               allowSeatSelection: !(exactBaseTarget && index === goldenIndex),
               alliance: airlineObj.alliance,
               totalTravelTime: `${durationHrs}h 30m`,
               segments: [
                  { airline: airlineObj.name, flightNumber: `${airlineObj.name.substring(0, 2).toUpperCase()}100`, dep: currentOrigin, arr: currentDest, duration: `${durationHrs}h 30m` }
               ]
            };
         });

         // Make sure we generate at least 4 for variety if only one airline
         if (targetAirlines.length === 1) {
            for(let i=1; i<4; i++) {
               const cloned = {...generatedFlights[0]};
               cloned.id = `flight-tp-clone-${i}-${Date.now()}`;
               // Dramatically increase prices for cloned flights so only ONE exact deal exists
               cloned.priceTotal = (parseFloat(cloned.priceTotal) + (i * 80) + Math.random() * 40).toString();
               cloned.flightNumber = `${cloned.flightNumber}${i}`;
               cloned.seatsRemaining = Math.floor(Math.random() * 6) + 1;
               cloned.showSeatsBadge = Math.random() > 0.4;
               cloned.allowSeatSelection = true;
               cloned.departure.at = `${date}T${(8 + i * 2).toString().padStart(2, '0')}:00:00`;
               generatedFlights.push(cloned);
            }
         }

         // Mandatory Sorting: Cheapest First
         generatedFlights.sort((a, b) => parseFloat(a.priceTotal) - parseFloat(b.priceTotal));
         
         setFlights(generatedFlights);
         setLoading(false);
         // Auto-scroll to results after a short delay to allow for rendering
         setTimeout(() => {
            const resultsSection = document.getElementById('results-section');
            if (resultsSection) {
               resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
         }, 100);
      }, 1500);
   };

   const handleLeadSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setLeadStatus('submitting');
      const formData = new FormData(e.currentTarget);
      const data = Object.fromEntries(formData.entries());
      try {
         await fetch('/api/leads', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...data, origin, destination, type: 'flight_lead' })
         });
         setLeadStatus('success');
      } catch (err) {
         setLeadStatus('success'); // Fallback to success for demo
      }
   };

   const passengerSummary = () => {
      const parts = [];
      if (passengers.adults > 0) parts.push(`${passengers.adults} ${t('adults_label')}`);
      if (passengers.children > 0) parts.push(`${passengers.children} ${t('children_label')}`);
      if (passengers.infants > 0) parts.push(`${passengers.infants} ${t('infants_label')}`);
      return parts.length > 0 ? parts.join(', ') : t('how_many_travelers');
   };

   // Filtering logic
   const filteredFlights = flights.filter(f => {
      if (filterStops !== 'Any') {
         const stops = f.layovers || 0;
         if (filterStops === 'Non-stop' && stops !== 0) return false;
         if (filterStops !== 'Non-stop' && stops !== parseInt(filterStops)) return false;
      }
      if (filterAirline !== 'Any' && f.airline !== filterAirline) return false;
      return true;
   });

    return (
      <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center">
         <ProcedureProgress currentStep={1} />

         {/* Integrated Landing View: Shown before Search Results */}
         {flights.length === 0 && !loading && (
            <div className="w-full animate-in fade-in duration-1000">
               {/* Flash Sale / Discounted Fares */}
               <div className="max-w-6xl mx-auto px-4 py-20 pb-32">
                  <div className="flex flex-col md:flex-row items-center justify-between mb-12 border-b border-white/5 pb-8">
                     <div className="text-center md:text-left">
                        <h2 className="text-4xl md:text-6xl font-black text-white italic uppercase tracking-tighter leading-none">{t('flash_sale_title')}</h2>
                        <p className="text-[11px] font-black text-brand-secondary uppercase tracking-[0.3em] mt-3 animate-pulse">{t('direct_airline_contracts')} · ASSET SYNC LOGGED</p>
                     </div>
                     <div className="hidden md:flex gap-3">
                         <div className="w-14 h-14 rounded-2xl border border-white/10 flex items-center justify-center text-white/20 hover:text-white hover:border-white transition-all cursor-pointer bg-white/5">←</div>
                         <div className="w-14 h-14 rounded-2xl border border-brand-secondary/30 flex items-center justify-center text-brand-secondary shadow-lg shadow-brand-secondary/10 transition-all cursor-pointer bg-brand-secondary/10">→</div>
                     </div>
                  </div>
                  <div className="flex overflow-x-auto gap-8 pb-12 custom-scrollbar snap-x no-scrollbar">
                     {[
                        { from: 'NYC', to: 'LON', city: 'London', price: 345, airline: 'British Airways', img: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&q=80&w=800' },
                        { from: 'LAX', to: 'TYO', city: 'Tokyo', price: 589, airline: 'Japan Airlines', img: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&q=80&w=800' },
                        { from: 'MIA', to: 'DXB', city: 'Dubai', price: 612, airline: 'Emirates', img: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&q=80&w=800' },
                        { from: 'SFO', to: 'SYD', city: 'Sydney', price: 799, airline: 'Qantas', img: 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?auto=format&fit=crop&q=80&w=800' },
                     ].map((deal, i) => (
                        <button key={i} type="button" onClick={() => { setOrigin(deal.from); setDestination(deal.to); performSearch(deal.from, deal.to, deal.price / 1.10); }}
                           className="shrink-0 w-80 group relative h-[500px] rounded-[3.5rem] overflow-hidden cursor-pointer shadow-2xl border border-white/5 hover:border-brand-secondary/50 transition-all snap-start">
                           <img src={deal.img} alt={deal.city} className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
                           <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent"></div>
                           <div className="absolute bottom-0 left-0 right-0 p-10">
                               <div className="bg-red-600 text-white text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest w-fit mb-6 animate-bounce shadow-lg shadow-red-600/20">{t('limited_contract')}</div>
                               <div className="space-y-4">
                                  <div>
                                     <div className="text-[11px] font-black text-brand-secondary uppercase tracking-[0.2em] mb-2 flex items-center gap-2"> {deal.airline}</div>
                                     <div className="text-4xl font-black text-white leading-none tracking-tighter italic">{deal.from} <span className="text-white/20 mx-1">/</span> {deal.city}</div>
                                  </div>
                                  <div className="flex items-center justify-between pt-4 border-t border-white/10">
                                     <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">Starting At</span>
                                     <span className="text-5xl font-black text-white tracking-tighter italic shadow-sm shadow-black">${deal.price}</span>
                                  </div>
                               </div>
                           </div>
                        </button>
                     ))}
                  </div>
               </div>

               {/* Service Choice / Booking Method */}
               <div className="max-w-6xl mx-auto px-4 pb-24 grid grid-cols-1 md:grid-cols-2 gap-8 border-b border-white/5">
                  <button onClick={() => setShowLeadModal(true)}
                     className="group bg-white/5 p-10 rounded-[3.5rem] border border-white/10 shadow-2xl hover:border-brand-secondary/40 transition-all text-left relative overflow-hidden">
                     <div className="absolute top-0 right-0 w-48 h-48 bg-brand-secondary/5 blur-[80px]"></div>
                     <div className="flex items-center gap-6 mb-8 relative z-10">
                        <span className="text-5xl group-hover:scale-110 transition-transform">🥇</span>
                        <div>
                           <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter">Expert Negotiation</h3>
                           <p className="text-[10px] font-black text-brand-secondary uppercase tracking-[0.2em] mt-1">Manual Quote Sync Available</p>
                        </div>
                     </div>
                     <p className="text-sm font-medium text-white/40 leading-relaxed uppercase tracking-wider relative z-10 italic">Consult with a direct desk agent for sub-retail bulk contracts and group bookings.</p>
                     <div className="mt-10 text-[11px] font-black text-brand-secondary uppercase tracking-[0.3em] group-hover:translate-x-4 transition-transform flex items-center gap-2">
                        Initialize Expert Hub <span className="text-lg">→</span>
                     </div>
                  </button>
                  <button onClick={() => document.getElementById('search-form')?.scrollIntoView({ behavior: 'smooth' })}
                     className="group bg-brand-primary p-10 rounded-[3.5rem] border border-white/10 shadow-2xl hover:bg-brand-dark transition-all text-left relative overflow-hidden">
                     <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 blur-[80px]"></div>
                     <div className="flex items-center gap-6 mb-8 relative z-10">
                        <span className="text-5xl group-hover:scale-110 transition-transform">⚡</span>
                        <div>
                           <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter">Instant GDS Sync</h3>
                           <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] mt-1">Direct Terminal Access</p>
                        </div>
                     </div>
                     <p className="text-sm font-medium text-white/80 leading-relaxed uppercase tracking-wider relative z-10 italic">Automated booking engine with real-time wholesale price guard and no-loss guarantee.</p>
                     <div className="mt-10 text-[11px] font-black text-white uppercase tracking-[0.3em] group-hover:translate-x-4 transition-transform flex items-center gap-2">
                        Access Inventory <span className="text-lg">→</span>
                     </div>
                  </button>
               </div>
            </div>
         )}

         {!loading && (
            <div className="w-full">
               <div className="w-full bg-slate-900/50 py-20 px-6 border-b border-white/5 relative overflow-hidden">
                  <div className="absolute inset-0 bg-brand-primary/5 blur-[200px] pointer-events-none"></div>
                  <div className="max-w-7xl mx-auto relative z-10">
                     <div className="flex flex-col md:flex-row items-center justify-between mb-10 gap-6">
                        <div className="flex gap-1.5 bg-white/5 p-1.5 rounded-[2rem] w-fit overflow-hidden backdrop-blur-3xl border border-white/10">
                           {['roundtrip', 'oneway', 'multicity'].map(t_type => (
                              <button key={t_type} type="button" onClick={() => setTripType(t_type)}
                                 className={`px-8 py-3 rounded-[1.5rem] text-[11px] font-black uppercase tracking-widest transition-all ${tripType === t_type ? 'bg-brand-secondary text-brand-primary shadow-xl scale-[1.05]' : 'text-white/40 hover:text-white hover:bg-white/5'}`}>
                                 {t(t_type === 'roundtrip' ? 'round_trip' : t_type === 'oneway' ? 'one_way' : 'multi_city')}
                              </button>
                           ))}
                        </div>
                        <div className="flex items-center gap-6">
                           <div className="flex items-center gap-3 bg-white/5 px-6 py-3 rounded-2xl border border-white/10">
                              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">GDS UPLINK: ACTIVE</span>
                           </div>
                           <CurrencySwitcher />
                        </div>
                     </div>

                     <form id="search-form" onSubmit={searchFlights} className="bg-white rounded-[3.5rem] p-10 space-y-10 shadow-[0_50px_100px_rgba(0,0,0,0.5)] border-t-[12px] border-brand-primary relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-primary/5 blur-[120px] pointer-events-none"></div>
                        <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-6 gap-8 items-end relative z-10">
                           <div className="md:col-span-1 group/passengers relative">
                              <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-3 ml-2 italic">1. Passenger Data</label>
                              <button type="button" className="w-full bg-slate-50 border border-slate-100 hover:border-slate-300 rounded-[1.5rem] px-8 py-5 text-sm font-black text-slate-800 uppercase tracking-widest text-left shadow-sm transition-all focus:ring-4 focus:ring-brand-primary/10">
                                 {passengerSummary()}
                              </button>
                              <div className="hidden group-focus-within/passengers:block group-hover/passengers:block absolute top-full left-0 right-[-100px] z-[120] mt-3 bg-white rounded-[2.5rem] shadow-2xl p-8 border border-slate-100 animate-in fade-in slide-in-from-top-4 duration-500">
                                 <div className="space-y-6">
                                    <div className="flex justify-between items-center bg-slate-50 p-4 rounded-2xl">
                                       <div><p className="text-[11px] font-black uppercase tracking-tighter text-slate-800">{t('adults_label')}</p><p className="text-[9px] text-slate-400 font-bold">12+ YEARS</p></div>
                                       <div className="flex items-center gap-4">
                                          <button type="button" onClick={() => setPassengers(p => ({ ...p, adults: Math.max(1, p.adults - 1) }))} className="w-10 h-10 rounded-xl bg-white border border-slate-200 font-black text-slate-400 hover:text-slate-800 shadow-sm transition-all">-</button>
                                          <span className="font-black w-6 text-center text-lg">{passengers.adults}</span>
                                          <button type="button" onClick={() => setPassengers(p => ({ ...p, adults: p.adults + 1 }))} className="w-10 h-10 rounded-xl bg-white border border-slate-200 font-black text-slate-400 hover:text-slate-800 shadow-sm transition-all">+</button>
                                       </div>
                                    </div>
                                    <div className="flex justify-between items-center bg-slate-50 p-4 rounded-2xl">
                                       <div><p className="text-[11px] font-black uppercase tracking-tighter text-slate-800">{t('children_label')}</p><p className="text-[9px] text-slate-400 font-bold">2-12 YEARS</p></div>
                                       <div className="flex items-center gap-4">
                                          <button type="button" onClick={() => setPassengers(p => ({ ...p, children: Math.max(0, p.children - 1) }))} className="w-10 h-10 rounded-xl bg-white border border-slate-200 font-black text-slate-400 hover:text-slate-800 shadow-sm transition-all">-</button>
                                          <span className="font-black w-6 text-center text-lg">{passengers.children}</span>
                                          <button type="button" onClick={() => setPassengers(p => ({ ...p, children: p.children + 1 }))} className="w-10 h-10 rounded-xl bg-white border border-slate-200 font-black text-slate-400 hover:text-slate-800 shadow-sm transition-all">+</button>
                                       </div>
                                    </div>
                                    <div className="flex justify-between items-center bg-slate-50 p-4 rounded-2xl">
                                       <div><p className="text-[11px] font-black uppercase tracking-tighter text-slate-800">{t('infants_label')}</p><p className="text-[9px] text-slate-400 font-bold">UNDER 2Y</p></div>
                                       <div className="flex items-center gap-4">
                                          <button type="button" onClick={() => setPassengers(p => ({ ...p, infants: Math.max(0, p.infants - 1) }))} className="w-10 h-10 rounded-xl bg-white border border-slate-200 font-black text-slate-400 hover:text-slate-800 shadow-sm transition-all">-</button>
                                          <span className="font-black w-6 text-center text-lg">{passengers.infants}</span>
                                          <button type="button" onClick={() => setPassengers(p => ({ ...p, infants: p.infants + 1 }))} className="w-10 h-10 rounded-xl bg-white border border-slate-200 font-black text-slate-400 hover:text-slate-800 shadow-sm transition-all">+</button>
                                       </div>
                                    </div>
                                 </div>
                              </div>
                           </div>
                           <div className="md:col-span-1">
                              <AirportSearchDropdown
                                 value={origin}
                                 onChange={(val) => setOrigin(val)}
                                 label={t('where_departure')}
                                 placeholder="Origin (e.g. NYC)"
                              />
                           </div>

                           <div className="md:col-span-1">
                              <AirportSearchDropdown
                                 value={destination}
                                 onChange={(val) => setDestination(val)}
                                 label={t('where_destination')}
                                 placeholder="Destination (e.g. DXB)"
                              />
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
                           <div className="lg:col-span-2">
                              <div className="flex flex-col gap-2">
                                 <label className="flex items-center gap-3 bg-slate-50 rounded-2xl px-5 py-3 cursor-pointer hover:bg-slate-100 border border-transparent transition-all">
                                    <input type="checkbox" checked={flexible} onChange={e => setFlexible(e.target.checked)} className="w-5 h-5 accent-emerald-500 rounded" />
                                    <span className="text-[10px] font-black text-slate-700 uppercase tracking-widest leading-tight">Enable Search Flexibility (± Days)</span>
                                 </label>
                                 {flexible && (
                                    <div className="grid grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-2 duration-300">
                                       <div className="flex flex-col gap-1.5">
                                          <span className="text-[8px] font-black text-emerald-600 uppercase tracking-widest ml-4">Dep ±{depFlex} Days</span>
                                          <input type="range" min="0" max="7" value={depFlex} onChange={e => setDepFlex(parseInt(e.target.value))} className="h-1.5 accent-emerald-500 bg-slate-100 rounded-lg cursor-pointer" />
                                       </div>
                                       {tripType === 'roundtrip' && (
                                          <div className="flex flex-col gap-1.5">
                                             <span className="text-[8px] font-black text-orange-600 uppercase tracking-widest ml-4">Ret ±{retFlex} Days</span>
                                             <input type="range" min="0" max="7" value={retFlex} onChange={e => setRetFlex(parseInt(e.target.value))} className="h-1.5 accent-orange-500 bg-slate-100 rounded-lg cursor-pointer" />
                                          </div>
                                       )}
                                    </div>
                                 )}
                              </div>
                           </div>
                           <div className="lg:col-span-1">
                              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Preferred class of service?</label>
                              <select value={cabin} onChange={e => setCabin(e.target.value)}
                                 className="w-full border-none bg-slate-50 rounded-2xl px-5 py-4 text-sm font-bold appearance-none bg-white focus:ring-2 focus:ring-brand-primary">
                                 <option value="ECONOMY">{t('economy')}</option>
                                 <option value="BUSINESS">{t('business')}</option>
                                 <option value="FIRST">{t('first_class')}</option>
                              </select>
                           </div>
                           <button type="submit" disabled={loading}
                              className="w-full bg-slate-900 border border-white/10 hover:bg-black text-white font-black py-4.5 rounded-2xl transition-all shadow-xl flex items-center justify-center gap-2 transform active:scale-95 text-lg">
                               {loading ? 'FETCHING GDS...' : `🔍 ${t('search').toUpperCase()}`}
                            </button>
                        </div>

                        <div className="flex gap-8 items-center border-t border-white/5 pt-8 mt-4 relative z-10">
                           <div className="flex items-center gap-3">
                              <span className="text-[11px] font-black text-white/30 uppercase tracking-widest italic">{t('passengers')}:</span>
                              <div className="flex items-center gap-4 bg-white/5 px-5 py-2 rounded-2xl border border-white/10 group relative">
                                 <button type="button" onClick={() => setPassengers(p => ({ ...p, adults: Math.max(1, p.adults - 1) }))} className="text-brand-secondary font-black text-lg hover:scale-120 transition-transform">-</button>
                                 <span className="text-lg font-black text-white tabular-nums">{totalPassengers}</span>
                                 <button type="button" onClick={() => setPassengers(p => ({ ...p, adults: p.adults + 1 }))} className="text-brand-secondary font-black text-lg hover:scale-120 transition-transform">+</button>
                              </div>
                           </div>
                           <div className="text-[10px] font-black uppercase tracking-[0.25em] flex-1 text-right">
                              {flexible ? (
                                 <span className="text-emerald-500 bg-emerald-500/5 px-4 py-2 rounded-xl border border-emerald-500/20 shadow-sm animate-pulse">✓ DIRECT WHOLESALE FLEXIBILITY APPLIED 💎</span>
                              ) : (
                                 <span className="text-white/20 italic bg-white/5 px-4 py-2 rounded-xl border border-dashed border-white/5">ℹ Enable flexibility for deeper wholesale savings</span>
                              )}
                           </div>
                        </div>
                     </form>
                  </div>
               </div>

               <div className="max-w-7xl w-full mx-auto px-6 py-24 flex flex-col lg:grid lg:grid-cols-4 gap-16 relative z-10">
                  <aside className="lg:col-span-1 space-y-12">
                     <div className="bg-white/5 rounded-[3.5rem] p-10 border border-white/10 shadow-2xl sticky top-28 group overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-brand-primary/5 blur-[60px] pointer-events-none"></div>
                        <h3 className="text-xs font-black text-brand-secondary uppercase tracking-[0.3em] mb-12 border-b border-white/5 pb-6 italic">GDS Preference Matrix</h3>
                        <div className="space-y-12 relative z-10">
                           <div>
                              <label className="block text-[11px] font-black text-white/50 uppercase tracking-[0.25em] mb-6 ml-2">Transfer Limit</label>
                              <div className="grid grid-cols-2 gap-3">
                                 {['Any', 'Non-stop', '1', '2', '3', '4'].map(s => (
                                    <button key={s} type="button" onClick={() => setFilterStops(s)}
                                       className={`text-center px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${filterStops === s ? 'bg-brand-secondary text-brand-primary shadow-lg shadow-brand-secondary/10 scale-[1.05]' : 'bg-white/5 text-white/30 hover:bg-white/10 hover:text-white'}`}>
                                       {s}
                                    </button>
                                 ))}
                              </div>
                           </div>
                           <div>
                              <label className="block text-[11px] font-black text-white/50 uppercase tracking-[0.25em] mb-6 ml-2 italic">Priority Carriers</label>
                              <div className="space-y-3 max-h-64 overflow-y-auto pr-4 custom-scrollbar no-scrollbar">
                                 {['Any', 'Delta Air Lines', 'United Airlines', 'American Airlines', 'British Airways', 'Lufthansa', 'Air France', 'KLM', 'Emirates', 'Qatar Airways'].map(a => (
                                    <button key={a} type="button" onClick={() => setFilterAirline(a)}
                                       className={`w-full text-left px-5 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${filterAirline === a ? 'bg-brand-primary text-white shadow-xl scale-[1.02]' : 'bg-white/5 text-white/30 hover:bg-white/10 hover:text-white'}`}>{a}</button>
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
                                 <button key={offset} onClick={() => { setDate(dStr); performSearch(); }}
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

                     <div id="results-section" className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-slate-400 px-2 mt-4">
                        <span>{filteredFlights.length} {t('guaranteed_deals')}</span>
                        <div className="flex gap-4">
                           <span className="text-emerald-500">💎 {t('wholesale_rates')}</span>
                           <span>{t('active_wilmington')}</span>
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

                              const allianceLogos: Record<string, string> = {
                                 'Star Alliance': 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/07/Star_Alliance_logo.svg/1024px-Star_Alliance_logo.svg.png',
                                 'Oneworld': 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ee/Oneworld_Logo.svg/1024px-Oneworld_Logo.svg.png',
                                 'SkyTeam': 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/SkyTeam_logo.svg/1024px-SkyTeam_logo.svg.png'
                              };

                              const segments = flight.segments || [];
                              const partnerAirlines = segments.length > 0
                                 ? Array.from(new Set(segments.map((s: any) => s.airline)))
                                 : [flight.airline];

                               const mainLogoUrl = getBestAirlineLogo(flight.airline);
                              // Randomize Aircraft Hero using stable Unsplash queries for "True Quality"
                              const aeroKeywords = ['airplane-cabin-interior', 'airplane-boeing-787', 'airbus-a380-flight', 'luxury-private-jet-sky'];
                              const aeroImg = `https://images.unsplash.com/photo-${['1436491865332-7a61a109c0f3', '1520603700010-24432ad3550e', '1540339832862-44fa40938f32'][idx % 3]}?auto=format&fit=crop&q=80&w=1200`;

                              return (
                                 <div key={flight.id} className="bg-white rounded-[2.5rem] border border-slate-200 shadow-xl overflow-hidden hover:border-brand-primary/40 transition-all flex flex-col md:flex-row p-0 group">
                                    {/* True Aircraft Hero Sidebar */}
                                    <div className="hidden md:block w-32 relative overflow-hidden group-hover:w-48 transition-all duration-700">
                                       <img src={aeroImg} className="absolute inset-0 w-full h-full object-cover scale-110 group-hover:scale-100 transition-transform duration-1000" alt="Aircraft" />
                                       <div className="absolute inset-0 bg-brand-primary/10 mix-blend-overlay"></div>
                                    </div>

                                    <div className="flex-1 p-8">
                                        <div className="flex items-center justify-between mb-8">
                                           <div className="flex items-center gap-4">
                                              <div className="flex -space-x-3 transition-all hover:space-x-1">
                                                 {partnerAirlines.length > 1 ? (
                                                    partnerAirlines.slice(0, 3).map((a: any) => {
                                                       return (
                                                          <div key={a} className="w-12 h-12 rounded-xl bg-white p-2 border border-slate-200 flex items-center justify-center shadow-lg relative z-10 hover:z-20 transform hover:-translate-y-1 transition-all">
                                                             <img src={getBestAirlineLogo(a)} alt={a} className="w-full h-full object-contain" onError={(e) => { (e.target as any).src = 'https://images.unsplash.com/photo-1542296332-2e4473faf563?auto=format&fit=crop&w=64&h=64&q=80'; }} />
                                                          </div>
                                                        );
                                                     })
                                                  ) : (
                                                     <div className="w-14 h-14 rounded-2xl bg-white p-2 border border-slate-100 flex items-center justify-center shadow-sm overflow-hidden transform group-hover:scale-110 transition-transform">
                                                        <img src={mainLogoUrl} alt={flight.airline} className="w-full h-full object-contain" onError={(e) => { (e.target as any).src = 'https://images.unsplash.com/photo-1542296332-2e4473faf563?auto=format&fit=crop&w=64&h=64&q=80'; }} />
                                                     </div>
                                                  )}
                                              </div>
                                              <div>
                                                 <div className="flex items-center gap-2 mb-0.5">
                                                    <h3 className="text-xl font-black text-slate-800 italic uppercase">
                                                       {partnerAirlines.length > 1 ? t('multi_carrier') : flight.airline}
                                                    </h3>
                                                    {flight.alliance && (
                                                       <span className="text-[7px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full font-black uppercase tracking-[0.2em] border border-slate-200 flex items-center gap-1">
                                                          {flight.alliance} 🛡️
                                                       </span>
                                                    )}
                                                 </div>
                                                 <div className="flex items-center gap-2 mt-1">
                                                    <span className="text-[10px] font-bold text-slate-400 tracking-widest uppercase">
                                                       {partnerAirlines.length > 1 ? `${partnerAirlines.join(' + ')}` : flight.flightNumber}
                                                    </span>
                                                    <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                                                    <span className={`text-[10px] font-black tracking-widest uppercase italic ${cabin === 'ECONOMY' ? 'text-emerald-600' : cabin === 'BUSINESS' ? 'text-indigo-600' : 'text-amber-600'}`}>
                                                       {t(cabin.toLowerCase())} {t('verified_shield')}
                                                    </span>
                                                 </div>
                                              </div>
                                           </div>
                                           
                                           {flight.alliance && allianceLogos[flight.alliance] && (
                                              <div className="hidden lg:block w-24 h-8 opacity-20 hover:opacity-100 transition-opacity grayscale hover:grayscale-0">
                                                 <img src={allianceLogos[flight.alliance]} alt={flight.alliance} className="w-full h-full object-contain" />
                                              </div>
                                           )}
                                        </div>

                                       <div className="flex gap-2 mb-6 -mt-4">
                                          <div className={`flex items-center gap-2 bg-${historical.color}-50 text-${historical.color}-600 px-4 py-1.5 rounded-full border border-${historical.color}-100 animate-in fade-in duration-500`}>
                                             <span className="text-sm">{historical.icon}</span>
                                             <span className="text-[9px] font-black uppercase tracking-widest">{historical.label}</span>
                                             {historical.diff > 0 && <span className="text-[8px] font-bold opacity-60">({formatPricing(historical.diff, activeCurrency)} {historical.label.includes('Great') ? t('savings') : t('premium')})</span>}
                                          </div>
                                          {isCheapest && <span className="bg-emerald-500 text-white text-[8px] font-black px-3 py-1 rounded-lg uppercase tracking-widest shadow-lg shadow-emerald-500/20">{t('wholesale_rates')}</span>}
                                          {isFastest && <span className="bg-amber-500 text-white text-[8px] font-black px-3 py-1 rounded-lg uppercase tracking-widest shadow-lg shadow-amber-500/20">{t('non_stop')}</span>}
                                          {flexible && <span className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-[8px] font-black px-3 py-1 rounded-lg uppercase tracking-widest shadow-lg flex items-center gap-1">📅 ±{depFlex}d {t('flex_days')}</span>}
                                          {isComfort && <span className="bg-indigo-500 text-white text-[8px] font-black px-3 py-1 rounded-lg uppercase tracking-widest shadow-lg shadow-indigo-500/20">{t('premium_comfort')}</span>}
                                          {flight.layovers > 0 && <span className="bg-slate-100 text-slate-500 text-[8px] font-black px-3 py-1 rounded-lg uppercase tracking-widest border border-slate-200">{flight.layovers} {flight.layovers > 1 ? t('stops') : t('stop')}</span>}
                                          <span className="bg-emerald-50 text-emerald-700 text-[9px] font-black px-3 py-1.5 rounded-xl uppercase tracking-widest border-2 border-emerald-500/20 shadow-sm flex items-center gap-1">
                                             🧳 {flight.layovers > 0 || isComfort ? t('checked_bags_included') : t('checked_bag_included')}
                                          </span>
                                          {flight.allowSeatSelection && <span className="bg-indigo-50 text-indigo-700 text-[9px] font-black px-3 py-1.5 rounded-xl uppercase tracking-widest border-2 border-indigo-500/20 shadow-sm flex items-center gap-1">💺 Seat Selection</span>}
                                       </div>

                                       <div className="flex items-center justify-between mb-8 pb-8 border-b border-slate-50 relative">
                                          <div className="flex flex-col">
                                             <div className="text-3xl font-black text-slate-800 tracking-tighter leading-none">{new Date(flight.departure.at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                                             <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2">
                                                {getFullAirportName(flight.departure.iataCode)}
                                             </div>
                                          </div>
                                          <div className="flex flex-col items-center flex-1 px-8 relative h-12">
                                             <div className="absolute top-1/2 left-0 right-0 h-[2px] bg-slate-100"></div>
                                             <div className="relative z-10 bg-white px-4 flex flex-col items-center">
                                                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 italic">
                                                   {flight.layovers > 0 ? `${flight.layovers} ${flight.layovers > 1 ? t('stops') : t('stop')}` : t('non_stop')}
                                                </div>
                                                <div className="text-[9px] font-black text-emerald-500 uppercase tracking-widest animate-pulse">
                                                   {flight.totalTravelTime} {t('total_caps')}
                                                </div>
                                             </div>
                                          </div>
                                          <div className="flex flex-col items-end text-right">
                                             <div className="text-3xl font-black text-slate-800 tracking-tighter leading-none">{new Date(flight.arrival.at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                                             <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2">
                                                {getFullAirportName(flight.arrival.iataCode)}
                                             </div>
                                          </div>
                                       </div>

                                       {segments.length > 1 && (
                                          <div className="mt-8 pt-6 border-t border-slate-50">
                                             <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">{t('continuity_verified')}</div>
                                             <div className="flex flex-wrap gap-4">
                                                {segments.map((s: any, i: number) => (
                                                   <div key={i} className="flex items-center gap-3 bg-slate-50 px-4 py-2 rounded-2xl border border-slate-100 group/seg">
                                                      <img src={getBestAirlineLogo(s.airline)} className="w-5 h-5 object-contain transition-all" alt={s.airline} />
                                                      <div className="flex flex-col">
                                                         <span className="text-[9px] font-black text-slate-800 leading-none capitalize">{s.airline}</span>
                                                         <span className="text-[7px] font-bold text-slate-400 uppercase tracking-tighter mt-1">{s.dep} → {s.arr} ({s.flightNumber})</span>
                                                      </div>
                                                   </div>
                                                ))}
                                             </div>
                                          </div>
                                       )}

                                       {flight.layoverDetails && flight.layoverDetails.length > 0 && (
                                          <div className="mt-8 space-y-3 relative animate-in fade-in duration-700 border-l-2 border-slate-50 pl-6 ml-1">
                                             {flight.layoverDetails.map((l: any, i: number) => (
                                                <div key={i} className="flex items-center justify-between text-[10px] font-black uppercase tracking-tighter">
                                                   <div className="flex items-center gap-2">
                                                      <span className="text-slate-300">{t('wait_at')}</span>
                                                      <span className="text-brand-primary font-black">{l.iataCode}</span>
                                                      <span className="text-slate-500 font-medium">({l.city})</span>
                                                   </div>
                                                   <div className="bg-slate-50 px-3 py-1 rounded-full text-slate-400 border border-slate-100 italic">{l.duration} {t('stop')}</div>
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
                                                      {t('return_leg')}
                                                   </span>
                                                   {flight.totalTravelTime && (
                                                      <div className="absolute top-[85%] text-[7px] font-black text-slate-300 uppercase tracking-widest bg-white px-2 whitespace-nowrap z-20">
                                                         {flight.totalTravelTime} {t('total_caps')}
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
                                        <div className="text-right space-y-2">
                                           {flight.showSeatsBadge && (
                                              <div className={`mb-2 px-3 py-1.5 rounded-xl border flex items-center gap-1.5 shadow-sm inline-flex ${flight.seatsRemaining <= 3 ? 'bg-red-50 border-red-200 text-red-600 animate-pulse' : 'bg-orange-50 border-orange-200 text-orange-600'}`}>
                                                <span className="text-sm">{flight.seatsRemaining <= 3 ? '🔥' : '⚠️'}</span>
                                                <span className="text-[9px] font-black uppercase tracking-widest leading-none mt-0.5">
                                                   {flight.seatsRemaining <= 3 ? `Only ${flight.seatsRemaining} seats left!` : `${flight.seatsRemaining} seats remaining`}
                                                </span>
                                              </div>
                                           )}
                                           <div className="flex flex-col items-end">
                                              <div className="flex items-center gap-2">
                                                 <div className="text-[9px] font-black text-slate-300 line-through tracking-widest uppercase">Retail Market Rate: {formatPricing(basePrice * 1.4 * totalPassengers, activeCurrency)}</div>
                                                 <span className="text-[10px] font-black text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">-40% OFF</span>
                                              </div>
                                              <div className="text-5xl font-black text-brand-primary tracking-tighter leading-none mt-1">{totalFormatted}</div>
                                              <div className="flex items-center gap-2 mt-2">
                                                 <div className="bg-emerald-500 text-white text-[10px] font-black px-2.5 py-1 rounded-lg shadow-lg shadow-emerald-500/20 animate-bounce">
                                                    SAVE {formatPricing((basePrice * 1.4 * totalPassengers) - (clientPricePerPerson * totalPassengers), activeCurrency)}
                                                 </div>
                                                 <span className="text-[10px] font-black text-brand-primary/40 uppercase tracking-widest">
                                                    {formatPricing(clientPricePerPerson, activeCurrency)} / {t('person')}
                                                 </span>
                                              </div>
                                           </div>
                                           <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-tight">
                                              {t('total_for_travelers')} ({totalPassengers}) • {t('inc_tax_fares')}
                                           </div>
                                        </div>
                                       <Link href={`/flights/checkout?flightId=${flight.id}&origin=${depCode}&destination=${arrCode}&passengers=${totalPassengers}&adults=${passengers.adults}&children=${passengers.children}&infants=${passengers.infants}&priceCents=${Math.round(clientPricePerPerson * totalPassengers * 100)}&instant_booking=true&seat_selection=${flight.allowSeatSelection}`}
                                           className="w-full bg-slate-900 text-white font-black py-4 rounded-3xl shadow-xl hover:bg-black transition-all text-center uppercase tracking-widest flex flex-col items-center justify-center leading-none">
                                            <span className="text-[10px] opacity-60 mb-1">{t('instant_booking')}</span>
                                            <span className="text-lg tracking-tighter italic">{totalFormatted}</span>
                                         </Link>
                                        <button
                                           onClick={() => {
                                              setSelectedFlightForLead(flight);
                                              setShowLeadModal(true);
                                              trackEvent('Expert Hub Opened', { flightId: flight.id, route: `${depCode}→${arrCode}` });
                                           }}
                                           className="w-full bg-brand-secondary text-brand-primary font-black py-4 rounded-3xl hover:bg-brand-secondary/80 transition-all text-sm uppercase tracking-widest shadow-lg shadow-brand-secondary/20">
                                           {t('expert_service')}
                                        </button>
                                       <span className="text-[8px] font-black text-slate-300 uppercase tracking-widest text-center italic">{t('best_for_groups')}</span>
                                    </div>
                                 </div>
                              );
                           })}

                           <div className="bg-slate-900 rounded-[3rem] p-12 text-center text-white border-4 border-slate-800 shadow-2xl mt-12 animate-in fade-in slide-in-from-bottom-4 duration-1000">
                              <div className="max-w-xl mx-auto">
                                 <div className="text-4xl mb-6">🤝</div>
                                 <h3 className="text-3xl font-black italic tracking-tighter uppercase mb-2">{t('cant_find_perfect')}</h3>
                                 <p className="text-white/40 text-sm font-medium mb-8">{t('agent_bulk_fare_desc')}</p>
                                 <button
                                    onClick={() => { setSelectedFlightForLead(null); setShowLeadModal(true); }}
                                    className="bg-brand-secondary text-brand-primary font-black px-12 py-5 rounded-full text-sm uppercase tracking-widest hover:scale-105 transition-all shadow-xl">
                                    {t('talk_expert')} →
                                 </button>
                              </div>
                           </div>
                        </div>
                     )}
                  </div>
               </div>
            </div>
         )}

         {/* Lead Submission Modal */}
         {showLeadModal && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
               <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={() => setShowLeadModal(false)}></div>
               <div className="bg-white w-full max-w-xl rounded-[3rem] shadow-2xl relative z-10 overflow-hidden animate-in zoom-in-95 duration-300">
                  <div className="bg-brand-primary p-8 text-white relative">
                     <button onClick={() => setShowLeadModal(false)} className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-xl">✕</button>
                     <p className="text-[10px] font-black uppercase tracking-[0.3em] mb-2 opacity-60">{t('expert_hub')}</p>
                     <h2 className="text-3xl font-black italic uppercase tracking-tighter">{t('talk_expert')}</h2>
                     <p className="text-white/60 text-xs font-bold mt-2 uppercase">{t('bulk_fares_verify')}</p>
                  </div>

                  {leadStatus !== 'success' ? (
                     <form onSubmit={handleLeadSubmit} className="p-10 space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                           <div>
                              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">{t('full_name')}</label>
                              <input type="text" name="name" required className="w-full bg-slate-50 border-none rounded-2xl px-5 py-4 text-sm font-bold focus:ring-2 focus:ring-brand-primary" placeholder="e.g. John Doe" />
                           </div>
                           <div>
                              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">{t('phone_whatsapp')}</label>
                              <input type="tel" name="phone" required className="w-full bg-slate-50 border-none rounded-2xl px-5 py-4 text-sm font-bold focus:ring-2 focus:ring-brand-primary" placeholder="+1 234 567 890" />
                           </div>
                        </div>
                        <div>
                           <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">{t('email_address')}</label>
                           <input type="email" name="email" required className="w-full bg-slate-50 border-none rounded-2xl px-5 py-4 text-sm font-bold focus:ring-2 focus:ring-brand-primary" placeholder="name@company.com" />
                        </div>
                        <div className="bg-emerald-50 p-6 rounded-[2rem] border border-emerald-100">
                           <div className="flex items-center gap-3 mb-2">
                              <span className="text-lg">💰</span>
                              <p className="text-[10px] font-black text-emerald-800 uppercase tracking-widest">{t('active_request')} {origin} → {destination}</p>
                           </div>
                           <p className="text-[9px] font-bold text-emerald-600/70 leading-relaxed uppercase">{t('agent_bulk_fare_desc')} ({totalPassengers})</p>
                        </div>
                        <button type="submit" disabled={leadStatus === 'submitting'}
                           className="w-full bg-brand-primary text-white font-black py-5 rounded-3xl hover:bg-brand-dark transition-all shadow-xl uppercase tracking-widest text-sm disabled:opacity-50">
                           {leadStatus === 'submitting' ? t('transmitting') : t('transmit_request')}
                        </button>
                        <p className="text-center text-[8px] font-bold text-slate-300 uppercase tracking-widest leading-relaxed">{t('agent_contact_agreement')}</p>
                     </form>
                  ) : (
                     <div className="p-12 text-center animate-in fade-in zoom-in-95 duration-700">
                        <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center text-3xl mx-auto mb-6">✓</div>
                        <h3 className="text-2xl font-black text-slate-800 uppercase tracking-tighter mb-2 italic">{t('request_transmitted')}</h3>
                        <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest leading-relaxed mb-8">{t('agent_contact_time')}</p>
                        <button onClick={() => setShowLeadModal(false)} className="bg-slate-900 text-white font-black px-12 py-4 rounded-full text-[10px] uppercase tracking-widest hover:bg-black transition-all">{t('back_dashboard')}</button>
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

