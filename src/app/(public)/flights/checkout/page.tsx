'use client';
import React, { useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

function CheckoutContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [paymentType, setPaymentType] = useState<'full' | 'deposit'>('full');
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', phone: '', passport: '' });
  const [loading, setLoading] = useState(false);
  const flightId = searchParams.get('flightId') || '9912';
  const price = (Number(searchParams.get('priceCents') || '84000') / 100).toFixed(2);
  const origin = searchParams.get('origin') || 'NYC';
  const dest = searchParams.get('destination') || 'LHR';

  const handleCreateBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/flights/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
           ...form,
           flightId,
           paymentType,
           paidAmount: paymentType === 'deposit' ? 5000 : Number(searchParams.get('priceCents') || '84000'), // 5000 cents for $50 deposit
           priceCents: Number(searchParams.get('priceCents') || '84000'),
           origin,
           destination: dest
        }),
      });
      const { bookingId } = await res.json();
      router.push(`/hotels?bookingId=${bookingId}&city=${dest}&completedFlight=true`);
    } catch { setLoading(false); }
  };

  const cityName = (code: string) => {
    const map: Record<string, string> = { NYC: 'New York', LHR: 'London', LAX: 'Los Angeles', SFO: 'San Francisco', CDG: 'Paris', HND: 'Tokyo' };
    return map[code.toUpperCase()] || code;
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center pb-20">
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
                 <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-2xl">{paymentType === 'full' ? '🛡️' : '⏳'}</div>
                 <h2 className="text-2xl font-black">
                    {paymentType === 'full' ? 'Verify Your PNR Before Payment' : 'Locked Price @ $10/Day'}
                 </h2>
              </div>
              <p className="text-white/80 font-medium leading-relaxed">
                 {paymentType === 'full'
                    ? "We've locked this exclusive price for you. Enter your details to generate your Airline Confirmation. Verify it directly with the carrier before you authorize payment."
                    : "Short on funds? Secure this quote for just $10 per day. Our experts will manage the hold via your Airline PNR until you're ready to settle the balance."
                 }
              </p>
           </section>

           <div className="flex bg-white p-2 rounded-full border border-slate-200 shadow-sm max-w-sm">
              <button onClick={() => setPaymentType('full')} className={`flex-1 py-3 px-6 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${paymentType === 'full' ? 'bg-slate-900 text-white shadow-xl' : 'text-slate-400'}`}>Full Ticket</button>
              <button onClick={() => setPaymentType('deposit')} className={`flex-1 py-3 px-6 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${paymentType === 'deposit' ? 'bg-orange-500 text-white shadow-xl' : 'text-slate-400'}`}>$10 Daily Lock</button>
           </div>

           <form onSubmit={handleCreateBooking} className="bg-white rounded-[3rem] p-10 border border-slate-200 shadow-xl space-y-8 animate-in slide-in-from-bottom-8 duration-500">
              <h3 className="text-2xl font-black text-slate-800 border-b border-slate-100 pb-4">Passenger Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">First Name</label>
                  <input type="text" value={form.firstName} onChange={e => setForm({...form, firstName: e.target.value})} required className="w-full border-none bg-slate-50 rounded-2xl px-5 py-4 text-sm font-bold shadow-sm" />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Last Name</label>
                  <input type="text" value={form.lastName} onChange={e => setForm({...form, lastName: e.target.value})} required className="w-full border-none bg-slate-50 rounded-2xl px-5 py-4 text-sm font-bold shadow-sm" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Email Address</label>
                  <input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} required className="w-full border-none bg-slate-50 rounded-2xl px-5 py-4 text-sm font-bold shadow-sm" />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">WhatsApp / SMS / Phone</label>
                  <input type="tel" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} placeholder="+1..." required className="w-full border-none bg-slate-50 rounded-2xl px-5 py-4 text-sm font-bold shadow-sm" />
                </div>
              </div>

              <div className="pt-6">
                 <button type="submit" disabled={loading}
                   className={`w-full text-white font-black py-5 rounded-[2.5rem] shadow-2xl text-xl transition-all transform scale-100 hover:scale-[1.02] ${paymentType === 'full' ? 'bg-brand-primary hover:bg-brand-dark' : 'bg-orange-500 hover:bg-orange-600'}`}>
                   {loading ? 'Processing...' : (paymentType === 'full' ? 'Generate PNR & Continue →' : 'Pay $10 Daily Hold →')}
                 </button>

                  <div className="bg-slate-900 rounded-[3rem] p-10 text-white mt-12 animate-in fade-in duration-1000 shadow-2xl relative overflow-hidden">
                     <div className="absolute top-0 right-0 w-64 h-64 bg-brand-primary/20 blur-[100px]"></div>
                     <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-8">
                           <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center text-xl">💳</div>
                           <div>
                              <h3 className="text-xl font-black italic uppercase tracking-tighter">Secure US Bank Payment</h3>
                              <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest mt-1">Direct Settlement · No Intermediaries</p>
                           </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                           <div className="md:col-span-2">
                              <label className="block text-[8px] font-black text-white/40 uppercase tracking-[0.2em] mb-3 ml-1">Credit Card Number</label>
                              <div className="relative">
                                 <input type="text" placeholder="**** **** **** ****" className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-5 font-black text-lg tracking-widest focus:ring-2 focus:ring-brand-primary outline-none transition-all placeholder:text-white/10" />
                                 <div className="absolute right-6 top-1/2 -translate-y-1/2 flex gap-2">
                                    <span className="text-[10px] font-black text-white/20 uppercase border border-white/10 px-2 py-1 rounded">VISA</span>
                                    <span className="text-[10px] font-black text-white/20 uppercase border border-white/10 px-2 py-1 rounded">MC</span>
                                 </div>
                              </div>
                           </div>
                           <div>
                              <label className="block text-[8px] font-black text-white/40 uppercase tracking-[0.2em] mb-3 ml-1">Expiry Date</label>
                              <input type="text" placeholder="MM / YY" className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-5 font-black focus:ring-2 focus-ring-brand-primary outline-none transition-all placeholder:text-white/10 text-center" />
                           </div>
                           <div>
                              <label className="block text-[8px] font-black text-white/40 uppercase tracking-[0.2em] mb-3 ml-1">CVV / CVC</label>
                              <input type="password" placeholder="***" className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-5 font-black focus:ring-2 focus:ring-brand-primary outline-none transition-all placeholder:text-white/10 text-center" />
                           </div>
                        </div>

                        <div className="mt-10 flex flex-col md:flex-row items-center justify-between gap-6 p-6 bg-white/5 rounded-[2rem] border border-white/10">
                           <div className="flex items-center gap-4">
                              <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-500">🏦</div>
                              <div>
                                 <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest block">US Bank Verification</span>
                                 <span className="text-[9px] text-white/20 font-bold uppercase tracking-tight">Processing via Wilmington Delaware Branch</span>
                              </div>
                           </div>
                           <button type="submit" disabled={loading}
                             className={`w-full md:w-auto text-white font-black px-12 py-5 rounded-full shadow-2xl hover:scale-105 transition-all text-sm uppercase tracking-widest ${paymentType === 'full' ? 'bg-brand-primary' : 'bg-orange-500'}`}>
                             {loading ? 'Authorizing...' : `🔒 PAY ${paymentType === 'full' ? '$'+price : '$10'} NOW`}
                           </button>
                        </div>
                     </div>
                  </div>
                  
                  <p className="text-center text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-8 flex items-center justify-center gap-2">
                     <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                     End-to-End Encryption Active @ Wilmington PNR Gateway
                  </p>
              </div>
           </form>
        </div>

        <aside className="space-y-6">
           <div className="bg-white rounded-[2.5rem] p-8 border border-slate-200 shadow-xl overflow-hidden relative">
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-brand-primary/10"></div>
              <h3 className="text-lg font-black text-slate-800 mb-6 flex items-center gap-2">🛒 Trip Summary</h3>
              <div className="space-y-6">
                 <div className="flex items-center justify-between pb-6 border-b border-slate-100">
                    <div className="font-black text-slate-800 text-sm">
                       {cityName(origin)} ({origin}) → <br/> {cityName(dest)} ({dest})
                    </div>
                    <div className="text-4xl font-black text-brand-primary">${price}</div>
                 </div>
                 <ul className="space-y-4">
                    {['A+ Rated by BBB Wilmington', 'Verified PNR Promise', 'Started 2001 (23+ Yrs)', 'ARC Accredited Partner'].map(l => (
                      <li key={l} className="flex gap-3 text-[10px] font-black text-slate-400 uppercase tracking-widest leading-relaxed">
                         <span className="text-emerald-500">✓</span> {l}
                      </li>
                    ))}
                 </ul>
              </div>
           </div>
           
           <div className="bg-brand-sidebar rounded-[2.5rem] p-8 text-white relative border border-white/5 shadow-2xl">
              <div className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-2">Procedure Step</div>
              <h4 className="text-lg font-black mb-4">What happens next?</h4>
              <p className="text-white/60 text-xs font-medium leading-relaxed mb-6">
                 Once you generate your PNR, we'll offer you an exclusive ASAP Hotel Deal in <b>{cityName(dest)}</b>. You can add it or skip to secure your flight only.
              </p>
              <div className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 flex gap-3 items-center">
                 <span className="text-2xl">🏨</span>
                 <span className="text-[10px] font-black uppercase text-brand-secondary">EXCLUSIVE HOTEL DEALS IN {dest}</span>
              </div>
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
