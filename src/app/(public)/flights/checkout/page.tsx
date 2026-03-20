'use client';
import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { MAJOR_CITIES } from '@/lib/geo';
import { formatPricing } from '@/lib/pricing';

function CheckoutContent() {
   const searchParams = useSearchParams();
   const router = useRouter();
   const [paymentType, setPaymentType] = useState<'full' | 'deposit'>('full');
   const [seatReserve, setSeatReserve] = useState(false);
   const [form, setForm] = useState({
      firstName: '', lastName: '', email: '', phone: ''
   });
   const [passengers, setPassengers] = useState({ adults: 1, children: 0, infants: 0 });
   const [language, setLanguage] = useState('en');
   const [loading, setLoading] = useState(false);
   const [error, setError] = useState<string | null>(null);
   const [activeCurrency, setActiveCurrency] = useState('USD');
   const [clientSecret, setClientSecret] = useState('');
   const [addons, setAddons] = useState({ hotel: true, car: true });
   const [cardDetails, setCardDetails] = useState({ number: '', expiry: '', cvc: '' });
   const [paymentMethod, setPaymentMethod] = useState<'card' | 'mobile'>('card');
   const [mobileDetails, setMobileDetails] = useState({ network: 'MPESA', phone: '' });
   const [copied, setCopied] = useState(false);

   const languages = [
      { code: 'en', name: 'English (US)' },
      { code: 'es', name: 'Español' },
      { code: 'fr', name: 'Français' },
      { code: 'de', name: 'Deutsch' },
      { code: 'zh', name: '中文' },
      { code: 'hi', name: 'हिन्दी' },
      { code: 'ar', name: 'العربية' },
      { code: 'pt', name: 'Português' },
      { code: 'ru', name: 'Русский' },
      { code: 'ja', name: '日本語' }
   ];

   useEffect(() => {
      const saved = localStorage.getItem('user-currency');
      if (saved) setActiveCurrency(saved);

      // Initialize passenger breakdown from total count
      const adultsParam = Number(searchParams.get('adults') || searchParams.get('passengers') || '1');
      const childrenParam = Number(searchParams.get('children') || '0');
      const infantsParam = Number(searchParams.get('infants') || '0');
      setPassengers({ adults: adultsParam, children: childrenParam, infants: infantsParam });
   }, []);

   const flightId = searchParams.get('flightId') || '9912';
   const price = (Number(searchParams.get('priceCents') || '84000') / 100).toFixed(2);

   // Fetch the Secure Client Secret on Mount
   useEffect(() => {
      fetch('/api/create-payment-intent', {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify({ amount: Number(searchParams.get('priceCents') || '84000') }),
      })
         .then((res) => res.json())
         .then((data) => setClientSecret(data.clientSecret));
   }, [searchParams]);

   const origin = searchParams.get('origin') || 'NYC';
   const dest = searchParams.get('destination') || 'LHR';

   const handleCreateBooking = async (e: React.FormEvent) => {
      e.preventDefault();
      setLoading(true);
      setError(null);
      try {
         if (paymentMethod === 'mobile') {
            const mobileRes = await fetch('/api/payments/mobile', {
               method: 'POST',
               headers: { 'Content-Type': 'application/json' },
               body: JSON.stringify({
                  network: mobileDetails.network,
                  phone: mobileDetails.phone,
                  amount: paymentType === 'deposit' ? 50 : Number(price)
               })
            });
            if (!mobileRes.ok) throw new Error('Mobile payment initiation failed');
         }
         // In a real-world scenario with Stripe, you would first create a PaymentMethod/Token
         // from the card details (using Stripe.js on the client) and send that token to
         // the backend instead of the raw card information.
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
               passengers, // Pass the detailed breakdown to backend
               paidAmount: paymentType === 'deposit' ? 5000 : Number(searchParams.get('priceCents') || '84000'), // 5000 cents for $50 deposit
               priceCents: Number(searchParams.get('priceCents') || '84000'),
               origin,
               destination: dest,
               passengerName: `${form.firstName} ${form.lastName}`,
               passengerEmail: form.email,
            }),
         });

         if (!res.ok) {
            const errorData = await res.json().catch(() => ({ error: 'An unexpected error occurred.' }));
            throw new Error(errorData.error || 'Failed to create booking.');
         }

         const { bookingId } = await res.json();

         // Monitoring global securement pulse
         fetch('/api/monitor', {
            method: 'POST',
            body: JSON.stringify({ action: `Flight SECURED: ${form.firstName} ${form.lastName} for ${origin} → ${dest}`, source: 'Website' })
         });

         // Intelligent Routing based on Add-ons
         const query = `bookingId=${bookingId}&city=${dest}&completedFlight=true&adults=${passengers.adults}&children=${passengers.children}&infants=${passengers.infants}`;
         if (addons.hotel) {
            router.push(`/hotels?${query}`);
         } else if (addons.car) {
            router.push(`/cars?${query}`);
         } else {
            router.push(`/success?bookingId=${bookingId}&type=flight`);
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
      // Re-using the shared MAJOR_CITIES mapping for consistency with the flight search page.
      // This assumes MAJOR_CITIES is exported from '@/lib/geo' as it is in flights/page.tsx.
      return MAJOR_CITIES[code.toUpperCase()]?.name || code;
   };

   const handleShare = () => {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
   };

   return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center pb-20 relative">
         {/* Global Language Choice */}
         <div className="absolute top-4 right-4 z-20 hidden md:block">
            <select
               value={language}
               onChange={(e) => setLanguage(e.target.value)}
               className="appearance-none bg-white pl-4 pr-10 py-2 rounded-xl shadow-lg border border-slate-100 text-xs font-black uppercase tracking-widest text-slate-600 focus:ring-2 focus:ring-brand-primary outline-none cursor-pointer hover:bg-slate-50 transition-all"
               style={{ backgroundImage: 'url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23007CB2%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right .7em top 50%', backgroundSize: '.65em auto' }}
            >
               {languages.map(l => <option key={l.code} value={l.code}>{l.name}</option>)}
            </select>
         </div>

         {/* Procedure Progress Bar */}
         <div className="w-full bg-slate-100 border-b border-slate-200 py-3 hidden md:block">
            <div className="max-w-6xl mx-auto flex items-center justify-center gap-12 font-black text-[10px] uppercase tracking-widest leading-relaxed">
               <div className="flex items-center gap-2 text-emerald-600">
                  <span className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center text-[10px]">✓</span>
                  <span>Flight Selected</span>
                  <span className="text-slate-300">→</span>
               </div>
               <div className="flex items-center gap-2 text-brand-primary">
                  <span className="w-6 h-6 rounded-full bg-brand-primary text-white flex items-center justify-center">2</span>
                  <span>Secure PNR ({paymentType === 'deposit' ? 'Hold' : 'Confirm'})</span>
                  <span className="text-slate-300">→</span>
               </div>
               <div className="flex items-center gap-2 text-slate-400">
                  <span className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-[10px]">3</span>
                  <span>Hotel (Option)</span>
                  <span className="text-slate-300">→</span>
               </div>
               <div className="flex items-center gap-2 text-slate-400">
                  <span className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-[10px]">4</span>
                  <span>Car (Option)</span>
               </div>
            </div>
         </div>

         <div className="max-w-6xl w-full mx-auto px-4 py-12 grid lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-8">
               <section className={`rounded-[2.5rem] p-8 shadow-xl transition-all ${paymentType === 'full' ? 'bg-emerald-600 text-white' : 'bg-orange-600 text-white'}`}>
                  <div className="flex items-center gap-4 mb-4">
                     <h2 className="text-2xl font-black italic">
                        {paymentType === 'full'
                           ? '🎟️ World Launch Special: Best Price Guaranteed'
                           : `🚀 Lock Rate @ ${formatPricing(10, activeCurrency)}/Day`}
                     </h2>
                  </div>
                  <p className="text-white/80 font-medium leading-relaxed uppercase text-[10px] tracking-widest mt-2 bg-white/10 w-fit px-3 py-1 rounded-full">
                     Verified Global Inventory · No-Loss Protection Active
                  </p>
                  <p className="text-white/80 font-medium leading-relaxed">
                     {paymentType === 'full'
                        ? "We've locked this exclusive price for you. Enter your details to generate your Airline Confirmation. Verify it directly with the carrier before you authorize payment."
                        : (
                           <>
                              Short on funds? Secure this quote for just <b>{formatPricing(10, activeCurrency)} for 24 hours</b>.
                              <br /><br />
                              <span className="bg-white/20 px-3 py-1.5 rounded-lg text-[11px] font-black uppercase tracking-wider">
                                 NOTE: This $10 fee will be deducted from your total flight cost when you take the flight.
                              </span>
                           </>
                        )
                     }
                  </p>
               </section>

               <div className="flex bg-white p-2 rounded-full border border-slate-200 shadow-sm max-w-sm">
                  <button type="button" onClick={() => setPaymentType('full')} className={`flex-1 py-3 px-6 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${paymentType === 'full' ? 'bg-slate-900 text-white shadow-xl' : 'text-slate-400'}`}>Full Ticket</button>
                  <button type="button" onClick={() => setPaymentType('deposit')} className={`flex-1 py-3 px-6 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${paymentType === 'deposit' ? 'bg-orange-500 text-white shadow-xl' : 'text-slate-400'}`}>{formatPricing(10, activeCurrency)} Daily Lock</button>
               </div>

               {/* Trip Add-ons Section */}
               <div className="bg-white rounded-[2rem] p-6 border border-slate-200 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-700">
                  <div className="flex items-center gap-3 mb-4">
                     <span className="text-xl">🧳</span>
                     <h4 className="text-sm font-black text-slate-800 uppercase tracking-widest">Complete Your Trip</h4>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <label className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${addons.hotel ? 'border-emerald-500 bg-emerald-50' : 'border-slate-100 hover:border-slate-200'}`}>
                        <input type="checkbox" checked={addons.hotel} onChange={() => setAddons(p => ({ ...p, hotel: !p.hotel }))} className="w-5 h-5 accent-emerald-600 rounded-md" />
                        <div>
                           <div className="text-xs font-black text-slate-800 uppercase tracking-widest">Add Hotel Deal</div>
                           <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Unlock Wholesale Rates</div>
                        </div>
                     </label>
                     <label className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${addons.car ? 'border-emerald-500 bg-emerald-50' : 'border-slate-100 hover:border-slate-200'}`}>
                        <input type="checkbox" checked={addons.car} onChange={() => setAddons(p => ({ ...p, car: !p.car }))} className="w-5 h-5 accent-emerald-600 rounded-md" />
                        <div>
                           <div className="text-xs font-black text-slate-800 uppercase tracking-widest">Add Car Rental</div>
                           <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Airport Pickup / Dropoff</div>
                        </div>
                     </label>
                  </div>
               </div>

               <form onSubmit={handleCreateBooking} className="bg-white rounded-[3rem] p-10 border border-slate-200 shadow-xl space-y-6 animate-in slide-in-from-bottom-8 duration-500">
                  <h3 className="text-2xl font-black text-slate-800 border-b border-slate-100 pb-4">Passenger Details</h3>

                  {/* Passenger Breakdown Options */}
                  <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 mb-6">
                     <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Traveler Composition</h4>
                     <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="flex flex-col gap-2">
                           <label className="text-[9px] font-bold text-slate-500 uppercase">Adults (12+)</label>
                           <div className="flex items-center gap-3 bg-white p-2 rounded-xl border border-slate-200 shadow-sm">
                              <button type="button" onClick={() => setPassengers(p => ({ ...p, adults: Math.max(1, p.adults - 1) }))} className="w-8 h-8 flex items-center justify-center bg-slate-100 rounded-lg text-slate-600 font-black hover:bg-brand-primary hover:text-white transition-all">-</button>
                              <span className="flex-1 text-center text-sm font-black text-slate-800">{passengers.adults}</span>
                              <button type="button" onClick={() => setPassengers(p => ({ ...p, adults: p.adults + 1 }))} className="w-8 h-8 flex items-center justify-center bg-slate-100 rounded-lg text-slate-600 font-black hover:bg-brand-primary hover:text-white transition-all">+</button>
                           </div>
                        </div>
                        <div className="flex flex-col gap-2">
                           <label className="text-[9px] font-bold text-slate-500 uppercase">Children (2-11)</label>
                           <div className="flex items-center gap-3 bg-white p-2 rounded-xl border border-slate-200 shadow-sm">
                              <button type="button" onClick={() => setPassengers(p => ({ ...p, children: Math.max(0, p.children - 1) }))} className="w-8 h-8 flex items-center justify-center bg-slate-100 rounded-lg text-slate-600 font-black hover:bg-brand-primary hover:text-white transition-all">-</button>
                              <span className="flex-1 text-center text-sm font-black text-slate-800">{passengers.children}</span>
                              <button type="button" onClick={() => setPassengers(p => ({ ...p, children: p.children + 1 }))} className="w-8 h-8 flex items-center justify-center bg-slate-100 rounded-lg text-slate-600 font-black hover:bg-brand-primary hover:text-white transition-all">+</button>
                           </div>
                        </div>
                        <div className="flex flex-col gap-2">
                           <label className="text-[9px] font-bold text-slate-500 uppercase">Infants (&lt;2)</label>
                           <div className="flex items-center gap-3 bg-white p-2 rounded-xl border border-slate-200 shadow-sm">
                              <button type="button" onClick={() => setPassengers(p => ({ ...p, infants: Math.max(0, p.infants - 1) }))} className="w-8 h-8 flex items-center justify-center bg-slate-100 rounded-lg text-slate-600 font-black hover:bg-brand-primary hover:text-white transition-all">-</button>
                              <span className="flex-1 text-center text-sm font-black text-slate-800">{passengers.infants}</span>
                              <button type="button" onClick={() => setPassengers(p => ({ ...p, infants: p.infants + 1 }))} className="w-8 h-8 flex items-center justify-center bg-slate-100 rounded-lg text-slate-600 font-black hover:bg-brand-primary hover:text-white transition-all">+</button>
                           </div>
                        </div>
                     </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">First Name</label>
                        <input type="text" name="firstName" value={form.firstName} onChange={handleChange} required className="w-full border-none bg-slate-50 rounded-2xl px-5 py-4 text-sm font-bold shadow-sm" />
                     </div>
                     <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Last Name</label>
                        <input type="text" name="lastName" value={form.lastName} onChange={handleChange} required className="w-full border-none bg-slate-50 rounded-2xl px-5 py-4 text-sm font-bold shadow-sm" />
                     </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Email Address</label>
                        <input type="email" name="email" value={form.email} onChange={handleChange} required className="w-full border-none bg-slate-50 rounded-2xl px-5 py-4 text-sm font-bold shadow-sm" />
                     </div>
                     <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">WhatsApp / SMS / Phone</label>
                        <input type="tel" name="phone" value={form.phone} onChange={handleChange} placeholder="+1..." required className="w-full border-none bg-slate-50 rounded-2xl px-5 py-4 text-sm font-bold shadow-sm" />
                     </div>
                  </div>

                  {/* This entire section should be replaced by a secure payment element from Stripe, Braintree, etc. */}
                  {/* Collecting raw credit card data on your server makes you subject to PCI DSS compliance. */}
                  <div className="pt-8">
                     <div className="bg-slate-900 rounded-[3rem] p-10 text-white animate-in fade-in duration-1000 shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-primary/20 blur-[100px]"></div>
                        <div className="relative z-10">
                           <div className="flex items-center gap-3 mb-8">
                              <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center text-xl">{paymentMethod === 'card' ? '💳' : '📱'}</div>
                              <h3 className="text-xl font-black italic uppercase tracking-tighter">Secure Payment Processing</h3>
                           </div>

                           <div className="flex gap-4 mb-8 bg-black/20 p-1 rounded-2xl">
                              <button type="button" onClick={() => setPaymentMethod('card')} className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${paymentMethod === 'card' ? 'bg-white text-slate-900 shadow-lg' : 'text-white/40 hover:text-white'}`}>Credit Card</button>
                              <button type="button" onClick={() => setPaymentMethod('mobile')} className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${paymentMethod === 'mobile' ? 'bg-brand-secondary text-brand-primary shadow-lg' : 'text-white/40 hover:text-white'}`}>Mobile Money</button>
                           </div>

                           {/* Stripe Elements Placeholder UI - Represents the mounted Element */}
                           {paymentMethod === 'card' ? (
                              <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2">
                                 <div className="bg-white/5 border border-white/10 rounded-2xl px-6 py-4">
                                    <label className="block text-[8px] font-black text-white/40 uppercase tracking-widest mb-2">Card Information</label>
                                    <div className="flex items-center gap-3">
                                       <div className="text-white/40">💳</div>
                                       <input
                                          type="text"
                                          placeholder="0000 0000 0000 0000"
                                          required
                                          value={cardDetails.number}
                                          onChange={(e) => setCardDetails({ ...cardDetails, number: e.target.value })}
                                          className="bg-transparent border-none text-white font-mono text-sm placeholder-white/20 w-full focus:ring-0"
                                       />
                                    </div>
                                 </div>
                                 <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-white/5 border border-white/10 rounded-2xl px-6 py-4">
                                       <label className="block text-[8px] font-black text-white/40 uppercase tracking-widest mb-2">Expiry Date</label>
                                       <input
                                          type="text"
                                          placeholder="MM / YY"
                                          required
                                          value={cardDetails.expiry}
                                          onChange={(e) => setCardDetails({ ...cardDetails, expiry: e.target.value })}
                                          className="bg-transparent border-none text-white font-mono text-sm placeholder-white/20 w-full focus:ring-0"
                                       />
                                    </div>
                                    <div className="bg-white/5 border border-white/10 rounded-2xl px-6 py-4">
                                       <label className="block text-[8px] font-black text-white/40 uppercase tracking-widest mb-2">CVC</label>
                                       <input
                                          type="text"
                                          placeholder="123"
                                          required
                                          value={cardDetails.cvc}
                                          onChange={(e) => setCardDetails({ ...cardDetails, cvc: e.target.value })}
                                          className="bg-transparent border-none text-white font-mono text-sm placeholder-white/20 w-full focus:ring-0"
                                       />
                                    </div>
                                 </div>
                              </div>
                           ) : (
                              <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2">
                                 <div className="grid grid-cols-2 gap-4">
                                    <button type="button" onClick={() => setMobileDetails({ ...mobileDetails, network: 'MPESA' })} className={`p-4 rounded-2xl border transition-all flex flex-col items-center gap-2 ${mobileDetails.network === 'MPESA' ? 'bg-emerald-600 border-emerald-500' : 'bg-white/5 border-white/10 hover:bg-white/10'}`}>
                                       <span className="text-2xl">📲</span>
                                       <span className="text-[10px] font-black uppercase tracking-widest">M-Pesa</span>
                                    </button>
                                    <button type="button" onClick={() => setMobileDetails({ ...mobileDetails, network: 'AIRTEL' })} className={`p-4 rounded-2xl border transition-all flex flex-col items-center gap-2 ${mobileDetails.network === 'AIRTEL' ? 'bg-red-600 border-red-500' : 'bg-white/5 border-white/10 hover:bg-white/10'}`}>
                                       <span className="text-2xl">📡</span>
                                       <span className="text-[10px] font-black uppercase tracking-widest">Airtel Money</span>
                                    </button>
                                 </div>
                                 <div className="bg-white/5 border border-white/10 rounded-2xl px-6 py-4">
                                    <label className="block text-[8px] font-black text-white/40 uppercase tracking-widest mb-2">Phone Number</label>
                                    <input
                                       type="tel"
                                       placeholder="254 7..."
                                       value={mobileDetails.phone}
                                       onChange={(e) => setMobileDetails({ ...mobileDetails, phone: e.target.value })}
                                       className="bg-transparent border-none text-white font-mono text-sm placeholder-white/20 w-full focus:ring-0"
                                    />
                                 </div>
                              </div>
                           )}

                           <div className="mt-10 flex flex-col md:flex-row items-center justify-between gap-6 p-6 bg-white/5 rounded-[2rem] border border-white/10">
                              <div className="flex items-center gap-4">
                                 <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-500">🏦</div>
                                 <div>
                                    <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest block">Payment Verification</span>
                                    <span className="text-[9px] text-white/20 font-bold uppercase tracking-tight">Securely Processed</span>
                                 </div>
                              </div>
                           </div>
                        </div>
                     </div>

                     {error && (
                        <div className="mt-4 text-center text-red-500 bg-red-100 border border-red-200 rounded-2xl p-4 text-sm font-bold">
                           {error}
                        </div>
                     )}

                     <button type="submit" disabled={loading}
                        className={`w-full mt-8 text-white font-black py-6 rounded-full shadow-[0_20px_50px_rgba(255,255,255,0.1)] text-2xl transition-all transform hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-3 ${paymentType === 'full' ? 'bg-brand-primary hover:bg-brand-dark' : 'bg-orange-500 hover:bg-orange-600'}`}>
                        {loading ? (
                           <span className="flex items-center gap-3">
                              <span className="w-5 h-5 border-4 border-white/30 border-t-white rounded-full animate-spin"></span>
                              SECURING TICKET...
                           </span>
                        ) : (
                           <>
                              <span className="text-2xl">🔒</span>
                              {paymentType === 'full' ? `SECURE TICKET ${formatPricing(Number(price), activeCurrency)}` : `SECURE LOCK for ${formatPricing(10 + (seatReserve ? 20 : 0), activeCurrency)}`}
                           </>
                        )}
                     </button>

                     <p className="text-center text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-8 flex items-center justify-center gap-2">
                        <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                        End-to-End Encryption Active
                     </p>
                  </div>
               </form>
            </div>

            <aside className="space-y-6">
               <div className="bg-white rounded-[2.5rem] p-8 border border-slate-200 shadow-xl overflow-hidden relative">
                  <div className="absolute top-0 left-0 right-0 h-1.5 bg-brand-primary"></div>
                  <h3 className="text-lg font-black text-slate-800 mb-6 flex items-center gap-2">🎟️ Ticketing Summary</h3>
                  <div className="space-y-6">
                     <div className="flex items-center justify-between pb-6 border-b border-slate-100">
                        <div>
                           <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Due</div>
                           <div className="text-4xl font-black text-brand-primary">
                              {paymentType === 'full' ? formatPricing(Number(price), activeCurrency) : formatPricing(10 + (seatReserve ? 20 : 0), activeCurrency)}
                           </div>
                        </div>
                        <div className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full uppercase tracking-widest text-center">
                           No Hidden Fees<br />Ticketing Pending
                        </div>
                     </div>

                     {paymentType === 'deposit' && (
                        <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 flex flex-col gap-2 group cursor-pointer hover:bg-slate-100 transition-all animate-in zoom-in-95"
                           onClick={() => setSeatReserve(!seatReserve)}>
                           <div className="flex items-center justify-between">
                              <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${seatReserve ? 'bg-brand-primary border-brand-primary' : 'border-slate-200'}`}>
                                 {seatReserve && <span className="text-white text-[10px] font-black">✓</span>}
                              </div>
                              <div className="text-sm font-black text-brand-primary">+$20 Seat Reserve</div>
                           </div>
                           <span className="text-[10px] font-black text-slate-800 uppercase tracking-widest block">Lock preferred flight seat selection while you pay later</span>
                           <span className="text-[9px] font-bold text-emerald-600 uppercase tracking-widest block mt-1">
                              * This fee is also deducted from final ticket price
                           </span>
                        </div>
                     )}

                     <div className="space-y-4">
                        <div>
                           <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Departure Hub</div>
                           <div className="text-sm font-black text-slate-800">{cityName(origin)} ({origin})</div>
                        </div>
                        <div>
                           <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Destination Hub</div>
                           <div className="text-sm font-black text-slate-800">{cityName(dest)} ({dest})</div>
                        </div>
                     </div>
                     <ul className="space-y-4">
                        {['A+ Rated by BBB', 'Verified PNR Promise', 'Started 2001 (23+ Yrs)', 'ARC Accredited Partner'].map(l => (
                           <li key={l} className="flex gap-3 text-[10px] font-black text-slate-400 uppercase tracking-widest leading-relaxed">
                              <span className="text-emerald-500">✓</span> {l}
                           </li>
                        ))}
                     </ul>
                     <button onClick={handleShare} type="button" className="w-full flex items-center justify-center gap-2 bg-slate-50 hover:bg-slate-100 text-slate-600 font-black py-3 rounded-xl text-[10px] uppercase tracking-widest transition-all border border-slate-200">
                        {copied ? '✓ Link Copied' : '🔗 Share Quote Link'}
                     </button>
                  </div>
               </div>

               <div className="bg-brand-sidebar rounded-[2.5rem] p-8 text-white relative border border-white/5 shadow-2xl">
                  <div className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-2">Procedure Step</div>
                  <h4 className="text-lg font-black mb-4">What happens next?</h4>
                  <p className="text-white/60 text-xs font-medium leading-relaxed mb-6">
                     Once you generate your PNR, we will automatically process your selected add-ons.
                  </p>
                  <ul className="space-y-3">
                     {addons.hotel && (
                        <li className="flex items-center gap-3 text-white/80 text-xs font-bold">
                           <span className="text-emerald-400">✓</span> Hotel Search in {dest}
                        </li>
                     )}
                     {addons.car && (
                        <li className="flex items-center gap-3 text-white/80 text-xs font-bold">
                           <span className="text-emerald-400">✓</span> Car Rental Availability
                        </li>
                     )}
                  </ul>
               </div>
            </aside>
         </div>
      </div>
   );
}

export default function CheckoutPage() {
   return (
      <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-slate-400 font-bold">Connecting Secure Gateway...</div>}>
         <CheckoutContent />
      </Suspense>
   );
}
