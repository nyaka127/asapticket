'use client';
import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { formatPricing } from '@/lib/pricing';
import { CurrencySwitcher } from '@/components/CurrencySwitcher';
import { GlobalPublicHeader } from '@/components/GlobalPublicHeader';
import { GlobalPublicFooter } from '@/components/GlobalPublicFooter';

const PREF_QUESTIONS = [
  { id: 'pace', label: 'Preferred Pace', options: ['Relaxed', 'Mid-tempo', 'Fast-paced'] },
  { id: 'lang', label: 'Language Expert', options: ['English Only', 'Native Speaker', 'Multilingual Professional'] },
  { id: 'focus', label: 'Interest Focus', options: ['Architecture', 'Gastronomy', 'Local History', 'Business Liaison'] },
];

function ExpertLeadContent() {
  const searchParams = useSearchParams();
  const [destination, setDestination] = useState(searchParams.get('destination') || '');
  const [date, setDate] = useState(searchParams.get('date') || new Date(Date.now() + 21 * 864e5).toISOString().split('T')[0]);
  const [prefs, setPrefs] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeCurrency, setActiveCurrency] = useState('USD');
  const [form, setForm] = useState({ name: '', email: '', phone: '', notes: '' });

  useEffect(() => {
    const saved = localStorage.getItem('user-currency');
    if (saved) setActiveCurrency(saved);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Logic for expert request submission
      const res = await fetch('/api/quotes/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ destination, date, prefs, ...form, type: 'expert_lead' }),
      });
      if (res.ok) {
        setSubmitted(true);
      }
    } catch {}
    setLoading(false);
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4">
        <div className="bg-white/5 rounded-[4rem] border border-white/10 p-16 max-w-2xl text-center animate-in zoom-in-95 duration-700 shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-brand-primary/5 blur-[100px]"></div>
          <div className="relative z-10 flex flex-col items-center">
            <div className="text-8xl mb-8 animate-bounce">🌍</div>
            <h2 className="text-5xl font-black text-white italic tracking-tighter uppercase mb-6">Expert Dispatch Active</h2>
            <p className="text-white/60 mb-10 text-lg font-medium leading-relaxed">
              Your request for a custom expert-led trip to <b>{destination}</b> has been received. 
              An ASAP Expert is currently reviewing global inventory and will contact you within 
              <span className="text-brand-secondary font-black"> 15 minutes</span>.
            </p>
            <div className="bg-brand-secondary text-brand-primary px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-lg">
              Check {form.email} for Confirmation
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center">
      <GlobalPublicHeader />

      <main className="w-full max-w-5xl mx-auto px-6 py-20">
        <div className="text-center mb-16 space-y-4">
          <div className="flex items-center justify-center gap-3">
             <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
             <span className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-500">24/7 Expert Network Online</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black italic tracking-tighter uppercase leading-none">
            Expert <span className="text-brand-secondary">Lead</span> Console
          </h1>
          <p className="text-lg text-white/40 font-medium max-w-2xl mx-auto italic uppercase tracking-widest pt-4 border-t border-white/5">
             For specialized travel requiring dedicated human negotiation.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Main Form */}
          <div className="md:col-span-2 space-y-12">
            <section className="bg-white/5 border border-white/10 rounded-[3rem] p-10 space-y-10 relative overflow-hidden group">
               <div className="absolute top-0 right-0 w-64 h-64 bg-brand-primary/5 blur-[100px] group-hover:bg-brand-primary/10 transition-all"></div>
               <div className="relative z-10">
                  <h2 className="text-2xl font-black italic uppercase tracking-tighter mb-8 border-b border-white/5 pb-4">1. Itinerary Foundation</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                       <label className="block text-[10px] font-black text-white/30 uppercase tracking-[0.25em] ml-1">Universal Hub / City</label>
                       <input type="text" value={destination} onChange={e => setDestination(e.target.value)} required
                        placeholder="e.g. TOKYO, PARIS, DUBAI"
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-5 font-black text-white focus:ring-2 focus:ring-brand-secondary outline-none transition-all placeholder:text-white/10" />
                    </div>
                    <div className="space-y-3">
                       <label className="block text-[10px] font-black text-white/30 uppercase tracking-[0.25em] ml-1">Proposed Launch Date</label>
                       <input type="date" value={date} onChange={e => setDate(e.target.value)} required
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-5 font-black text-white focus:ring-2 focus:ring-brand-secondary outline-none transition-all" />
                    </div>
                  </div>
               </div>
            </section>

            <section className="bg-white/5 border border-white/10 rounded-[3rem] p-10 space-y-10 relative overflow-hidden group">
               <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 blur-[100px] group-hover:bg-emerald-500/10 transition-all"></div>
               <div className="relative z-10">
                  <h2 className="text-2xl font-black italic uppercase tracking-tighter mb-8 border-b border-white/5 pb-4">2. Personalized Expert Match</h2>
                  <div className="space-y-8">
                    {PREF_QUESTIONS.map(q => (
                       <div key={q.id}>
                          <label className="block text-[10px] font-black text-white/30 uppercase tracking-[0.2em] mb-4 ml-1">{q.label}</label>
                          <div className="flex flex-wrap gap-3">
                             {q.options.map(opt => (
                               <button key={opt} type="button" onClick={() => setPrefs({...prefs, [q.id]: opt})}
                                className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${prefs[q.id] === opt ? 'bg-brand-secondary text-brand-primary font-black shadow-lg scale-[1.05]' : 'bg-white/5 text-white/40 hover:bg-white/10'}`}>{opt}</button>
                             ))}
                          </div>
                       </div>
                    ))}
                  </div>
               </div>
            </section>

            <section className="bg-white border-[8px] border-brand-primary rounded-[4rem] p-12 space-y-10 text-slate-900 shadow-2xl relative overflow-hidden">
               <div className="relative z-10">
                  <h2 className="text-3xl font-black italic uppercase tracking-tighter mb-8 border-b border-slate-100 pb-4">3. Secure Dispatch Identity</h2>
                  <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-3">
                         <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Full Legal Name</label>
                         <input type="text" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required
                          className="w-full bg-slate-50 border-none rounded-2xl px-6 py-5 font-black text-slate-800 text-lg shadow-inner" />
                      </div>
                      <div className="space-y-3">
                         <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Contact Email</label>
                         <input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} required
                          className="w-full bg-slate-50 border-none rounded-2xl px-6 py-5 font-black text-slate-800 text-lg shadow-inner" />
                      </div>
                    </div>
                    
                    <button type="submit" disabled={loading}
                      className="w-full bg-brand-primary hover:bg-brand-dark text-white font-black py-8 rounded-[2.5rem] shadow-[0_20px_50px_rgba(235,59,90,0.3)] transition-all transform hover:scale-[1.02] active:scale-95 text-2xl uppercase tracking-tighter italic">
                      {loading ? 'Initializing Expert Sync...' : '🚀 DISPATCH EXPERT REQUEST'}
                    </button>
                    <p className="text-center text-[10px] text-slate-400 font-black uppercase tracking-widest leading-relaxed">
                       24/7 Global Response Guarantee. AES-256 Encrypted Lead Routing.
                    </p>
                  </form>
               </div>
            </section>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            <div className="bg-white/5 border border-white/10 rounded-[3rem] p-10 relative group">
               <div className="absolute top-0 left-0 w-2 h-0 group-hover:h-full bg-brand-secondary transition-all duration-700"></div>
               <h3 className="text-lg font-black uppercase italic tracking-tighter mb-6">Expert Advantage</h3>
               <ul className="space-y-6">
                 {[
                   'Private Negotiated Fares',
                   'Custom Multicity Routing',
                   'Ground Service Coordination',
                   '24/7 Global Crisis Desk',
                   'Worldwide VIP Asset Access'
                 ].map(item => (
                   <li key={item} className="flex gap-4 text-[10px] font-black text-white/40 uppercase tracking-widest leading-relaxed">
                      <span className="text-brand-secondary">✓</span> {item}
                   </li>
                 ))}
               </ul>
            </div>

            <div className="bg-brand-primary/10 border border-brand-primary/20 rounded-[3rem] p-10 space-y-6">
               <div className="text-4xl">🔱</div>
               <h3 className="text-xl font-black uppercase italic tracking-tighter leading-none">Elite Concierge Status</h3>
               <p className="text-white/50 text-[10px] font-black uppercase tracking-[0.2em] leading-relaxed">
                  Automatically applied to all expert lead requests. Your privacy is managed by our Delaware-based legal HQ.
               </p>
            </div>
          </div>
        </div>
      </main>

      <GlobalPublicFooter />
    </div>
  );
}

export default function ExpertLeadPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-slate-950 text-brand-secondary animate-pulse font-black uppercase tracking-widest">Waking Global Expert Network...</div>}>
      <ExpertLeadContent />
    </Suspense>
  );
}
