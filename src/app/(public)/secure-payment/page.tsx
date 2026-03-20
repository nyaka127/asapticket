'use client';
import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { formatPricing } from '@/lib/pricing';
import { GlobalPublicHeader } from '@/components/GlobalPublicHeader';
import { GlobalPublicFooter } from '@/components/GlobalPublicFooter';

function SecurePaymentContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [form, setForm] = useState({ ccNumber: '', ccExpiry: '', ccCvv: '', cardName: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const amount = Number(searchParams.get('amount') || '0');
  const description = searchParams.get('description') || 'Global Travel Asset Settlement';
  const currency = searchParams.get('currency') || 'USD';

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      // Logic for secure payment capture
      // In a real app, this would send to a secure vault or Stripe
      const res = await fetch('/api/flights/book', { // Reusing booking API for demo
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, amount, currency, description, action: 'secure_capture' }),
      });
      if (res.ok) {
        router.push('/success?type=payment_captured');
      } else {
        throw new Error('Verification Failed. Please check card details.');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown Error');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center">
      <GlobalPublicHeader />

      <main className="w-full max-w-4xl mx-auto px-6 py-20">
        <div className="flex flex-col md:flex-row gap-12">
          {/* Detailed Transaction Summary */}
          <div className="flex-1 space-y-8">
            <div className="bg-white rounded-[3rem] p-10 border border-slate-200 shadow-xl relative overflow-hidden group">
               <div className="absolute top-0 left-0 w-2 h-0 group-hover:h-full bg-emerald-500 transition-all duration-700"></div>
               <h2 className="text-xl font-black uppercase italic tracking-tighter mb-8 border-b border-slate-50 pb-4">Transaction Summary</h2>
               <div className="space-y-6">
                  <div className="flex justify-between items-start">
                     <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Settlement Asset</p>
                        <p className="font-black text-slate-800 text-lg leading-tight uppercase italic">{description}</p>
                     </div>
                     <div className="text-right">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Amount</p>
                        <p className="text-3xl font-black text-brand-primary tracking-tighter">{formatPricing(amount, currency)}</p>
                     </div>
                  </div>
                  
                  <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 flex items-center justify-between">
                     <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-emerald-500/10 rounded-full flex items-center justify-center text-emerald-600">🛡️</div>
                        <div>
                           <p className="text-[10px] font-black text-slate-800 uppercase tracking-widest leading-none mb-1">ASAP Price Guard Active</p>
                           <p className="text-[9px] text-slate-400 font-bold uppercase tracking-tight">No-Loss Inventory Protection Applied</p>
                        </div>
                     </div>
                     <span className="text-[10px] bg-white px-3 py-1 rounded-full border border-slate-200 font-black text-emerald-500 uppercase">VERIFIED</span>
                  </div>
               </div>
            </div>

            <div className="bg-slate-900 rounded-[3rem] p-10 text-white space-y-6 relative overflow-hidden">
               <div className="absolute top-0 right-0 w-64 h-64 bg-brand-primary/10 blur-[100px]"></div>
               <div className="relative z-10">
                  <h3 className="text-lg font-black uppercase italic tracking-tighter mb-4">Security Protocol</h3>
                  <div className="space-y-4">
                     {[
                       'AES-256 Bit End-to-End Encryption',
                       'PCI DSS Level 1 Compliant Gateway',
                       'Zero-Trust Asset Verification',
                       'Worldwide 24/7 Security Monitoring'
                     ].map(p => (
                       <div key={p} className="flex gap-3 text-[10px] font-black text-white/40 uppercase tracking-widest leading-relaxed">
                          <span className="text-emerald-500">✓</span> {p}
                       </div>
                     ))}
                  </div>
               </div>
            </div>
          </div>

          {/* Stable Credit Card Form */}
          <div className="flex-1">
             <form onSubmit={handlePayment} className="bg-white rounded-[3rem] p-10 border border-slate-200 shadow-2xl space-y-8 animate-in slide-in-from-right-8 duration-700">
                <div className="flex items-center justify-between mb-2">
                   <h2 className="text-2xl font-black text-slate-800 uppercase italic tracking-tighter">Secure Card Capture</h2>
                   <div className="flex gap-2">
                      <span className="text-[8px] font-black border border-slate-200 px-2 py-1 rounded text-slate-300">VISA</span>
                      <span className="text-[8px] font-black border border-slate-200 px-2 py-1 rounded text-slate-300">MASTERCARD</span>
                   </div>
                </div>

                <div className="space-y-6">
                   <div>
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 ml-1">Cardholder Name</label>
                      <input type="text" name="cardName" value={form.cardName} onChange={handleChange} placeholder="AS PRINTED ON CARD" required
                        className="w-full bg-slate-50 border-none rounded-2xl px-6 py-5 font-black text-slate-800 focus:ring-2 focus:ring-brand-primary outline-none transition-all placeholder:text-slate-200" />
                   </div>
                   <div>
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 ml-1">Credit Card Number</label>
                      <input type="text" name="ccNumber" value={form.ccNumber} onChange={handleChange} placeholder="**** **** **** ****" required
                        className="w-full bg-slate-50 border-none rounded-2xl px-6 py-5 font-black text-slate-800 focus:ring-2 focus:ring-brand-primary outline-none transition-all placeholder:text-slate-200 tracking-widest" />
                   </div>
                   <div className="grid grid-cols-2 gap-6">
                      <div>
                         <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 ml-1">Expiry Date</label>
                         <input type="text" name="ccExpiry" value={form.ccExpiry} onChange={handleChange} placeholder="MM / YY" required
                           className="w-full bg-slate-50 border-none rounded-2xl px-6 py-5 font-black text-slate-800 focus:ring-2 focus:ring-brand-primary outline-none transition-all placeholder:text-slate-200 text-center" />
                      </div>
                      <div>
                         <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 ml-1">CVV / CVC</label>
                         <input type="password" name="ccCvv" value={form.ccCvv} onChange={handleChange} placeholder="***" required
                           className="w-full bg-slate-50 border-none rounded-2xl px-6 py-5 font-black text-slate-800 focus:ring-2 focus:ring-brand-primary outline-none transition-all placeholder:text-slate-200 text-center" />
                      </div>
                   </div>
                </div>

                {error && <div className="p-4 bg-red-50 border border-red-100 rounded-2xl text-red-500 text-[10px] font-black uppercase text-center">{error}</div>}

                <button type="submit" disabled={loading}
                 className="w-full bg-slate-900 border-[8px] border-emerald-500/20 hover:bg-black text-white font-black py-6 rounded-[2.5rem] shadow-2xl transition-all transform hover:scale-[1.02] active:scale-95 flex flex-col items-center justify-center group overflow-hidden relative">
                   <div className="absolute inset-0 bg-emerald-500 opacity-0 group-hover:opacity-10 transition-opacity"></div>
                   <span className="text-sm uppercase tracking-widest mb-1">{loading ? 'VERIFYING...' : 'AUTHORIZE SETTLEMENT'}</span>
                   <span className="text-2xl font-black italic tracking-tighter">{formatPricing(amount, currency)}</span>
                </button>

                <p className="text-center text-[9px] font-black text-slate-300 uppercase tracking-[0.3em] mt-4 flex items-center justify-center gap-2">
                   <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                   Worldwide Secure Uplink Active
                </p>
             </form>
          </div>
        </div>
      </main>

      <GlobalPublicFooter />
    </div>
  );
}

export default function SecurePaymentPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-300 animate-pulse font-black uppercase tracking-widest">Bridging Secure Gateway...</div>}>
      <SecurePaymentContent />
    </Suspense>
  );
}
