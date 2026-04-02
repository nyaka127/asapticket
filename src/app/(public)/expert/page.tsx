'use client';
import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { formatPricing } from '@/lib/pricing';

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
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
           name: form.name,
           email: form.email,
           phone: form.phone,
           origin: 'Consulate Inquiry',
           destination, 
           date, 
           prefs, 
           source: 'Wholesale Consulate Expert Lead',
           type: 'expert_lead' 
        }),
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
        <div className="bg-white/5 rounded-[4rem] border border-white/10 p-16 max-w-2xl text-center animate-in zoom-in-95 duration-700 shadow-2xl relative overflow-hidden backdrop-blur-3xl">
          <div className="absolute inset-0 bg-brand-primary/5 blur-[100px]"></div>
          <div className="relative z-10 flex flex-col items-center">
            <div className="text-8xl mb-8 animate-bounce leading-none">🌍</div>
            <h2 className="text-5xl font-black text-white italic tracking-tighter uppercase mb-6 leading-none">Dispatch Active</h2>
            <p className="text-white/60 mb-10 text-lg font-black leading-relaxed italic">
              Your request for a custom wholesale strategy to <span className="text-brand-secondary">{destination}</span> has been broadcasted. 
              A <span className="text-white">Wholesale Authority Expert</span> is currently auditing global inventory and will initiate contact within 
              <span className="text-brand-secondary animate-pulse"> 10 minutes</span>.
            </p>
            <div className="bg-emerald-500/10 border border-emerald-500/20 px-10 py-5 rounded-2xl font-black text-xs uppercase tracking-[0.3em] shadow-lg text-emerald-400 italic">
               Check {form.email} for Secure Sync
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center selection:bg-brand-primary selection:text-white">

      <main className="w-full max-w-6xl mx-auto px-6 py-24 pb-48">
        <div className="text-center mb-24 space-y-6">
          <div className="flex items-center justify-center gap-4">
             <span className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_15px_#10b981]"></span>
             <span className="text-[11px] font-black uppercase tracking-[0.5em] text-emerald-500 italic">Universal Expert Network: VERIFIED</span>
          </div>
          <h1 className="text-6xl md:text-[8rem] font-black italic tracking-tighter uppercase leading-[0.85] mb-4">
            Private <span className="text-brand-secondary">Consulate</span>
          </h1>
          <p className="text-xl text-white/20 font-black max-w-3xl mx-auto italic uppercase tracking-[0.3em] pt-8 border-t border-white/5 leading-relaxed">
             Direct human negotiation for restricted wholesale settlements.
          </p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-16 items-start">
          {/* Main Form */}
          <div className="xl:col-span-2 space-y-16">
            <section className="bg-white/5 border border-white/10 rounded-[4rem] p-12 space-y-12 relative overflow-hidden group backdrop-blur-3xl shadow-[0_40px_80px_rgba(0,0,0,0.4)]">
               <div className="absolute top-0 right-0 w-80 h-80 bg-brand-primary/5 blur-[120px] group-hover:bg-brand-primary/10 transition-all duration-1000"></div>
               <div className="relative z-10">
                  <div className="flex items-center justify-between border-b border-white/5 pb-10 mb-10">
                    <h2 className="text-4xl font-black italic uppercase tracking-tighter leading-none">1. Foundation</h2>
                    <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em] italic">099-AX BATCH</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div className="space-y-4">
                       <label className="block text-[11px] font-black text-white/20 uppercase tracking-[0.3em] ml-2 italic">Destination Hub</label>
                       <input type="text" value={destination} onChange={e => setDestination(e.target.value)} required
                        placeholder="TOKYO, PARIS, DUBAI..."
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-8 py-6 font-black text-white focus:ring-2 focus:ring-brand-secondary outline-none transition-all placeholder:text-white/10 italic text-lg shadow-inner" />
                    </div>
                    <div className="space-y-4">
                       <label className="block text-[11px] font-black text-white/20 uppercase tracking-[0.3em] ml-2 italic">Provisional Launch</label>
                       <input type="date" value={date} onChange={e => setDate(e.target.value)} required
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-8 py-6 font-black text-white focus:ring-2 focus:ring-brand-secondary outline-none transition-all text-lg shadow-inner" />
                    </div>
                  </div>
               </div>
            </section>

            <section className="bg-white/5 border border-white/10 rounded-[4rem] p-12 space-y-12 relative overflow-hidden group backdrop-blur-3xl shadow-[0_40px_80px_rgba(0,0,0,0.4)]">
               <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/5 blur-[120px] group-hover:bg-emerald-500/10 transition-all duration-1000"></div>
               <div className="relative z-10">
                  <div className="flex items-center justify-between border-b border-white/5 pb-10 mb-10">
                    <h2 className="text-4xl font-black italic uppercase tracking-tighter leading-none">2. Preference Sync</h2>
                    <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em] italic">AI PROFILE MATCH</span>
                  </div>
                  <div className="space-y-12">
                    {PREF_QUESTIONS.map(q => (
                       <div key={q.id}>
                          <label className="block text-[11px] font-black text-white/20 uppercase tracking-[0.4em] mb-6 ml-2 italic">{q.label}</label>
                          <div className="flex flex-wrap gap-4">
                             {q.options.map(opt => (
                               <button key={opt} type="button" onClick={() => setPrefs({...prefs, [q.id]: opt})}
                                className={`px-8 py-4 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] transition-all duration-500 italic ${prefs[q.id] === opt ? 'bg-brand-secondary text-brand-primary shadow-[0_0_30px_rgba(250,204,21,0.2)] scale-[1.1] border-transparent' : 'bg-white/5 text-white/20 border border-white/5 hover:bg-white/10 hover:text-white hover:border-white/10'}`}>{opt}</button>
                             ))}
                          </div>
                       </div>
                    ))}
                  </div>
               </div>
            </section>

            <section className="bg-white/5 border border-brand-primary/40 rounded-[5rem] p-16 space-y-12 relative overflow-hidden backdrop-blur-3xl shadow-[0_80px_160px_rgba(235,59,90,0.1)] group">
               <div className="absolute inset-0 bg-brand-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
               <div className="relative z-10">
                  <div className="flex items-center justify-between border-b border-white/5 pb-10 mb-10">
                    <h2 className="text-4xl font-black italic uppercase tracking-tighter leading-none">3. Secure Dispatch</h2>
                    <span className="text-emerald-500 text-[10px] font-black uppercase bg-emerald-500/10 px-4 py-2 rounded-xl border border-emerald-500/20 italic tracking-[0.3em] shadow-lg">IRIS V1 SHIELD</span>
                  </div>
                  <form onSubmit={handleSubmit} className="space-y-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                      <div className="space-y-4">
                         <label className="block text-[11px] font-black text-white/20 uppercase tracking-[0.3em] ml-2 italic">Legal Full Name</label>
                         <input type="text" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required
                          className="w-full bg-white/5 border border-white/10 rounded-2xl px-8 py-6 font-black text-white text-xl shadow-inner focus:ring-2 focus:ring-brand-secondary outline-none italic" />
                      </div>
                      <div className="space-y-4">
                         <label className="block text-[11px] font-black text-white/20 uppercase tracking-[0.3em] ml-2 italic">Secure Uplink Email</label>
                         <input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} required
                          className="w-full bg-white/5 border border-white/10 rounded-2xl px-8 py-6 font-black text-white text-xl shadow-inner focus:ring-2 focus:ring-brand-secondary outline-none italic" />
                      </div>
                    </div>
                    
                    <button type="submit" disabled={loading}
                      className="w-full bg-brand-primary hover:bg-white hover:text-slate-950 text-white font-black py-10 rounded-[3rem] shadow-[0_40px_80px_rgba(235,59,90,0.3)] transition-all transform hover:scale-[1.02] active:scale-95 text-3xl uppercase tracking-tighter italic duration-500">
                      {loading ? 'INITIALIZING SYNC...' : 'AUTHORIZE EXPERT DISPATCH'}
                    </button>
                    <p className="text-center text-[10px] text-white/20 font-black uppercase tracking-[0.5em] leading-relaxed italic">
                       24/7 GLOBAL RESPONSE PROTOCOL · AES-256 SECURED · DELAWARE HQ OPS
                    </p>
                  </form>
               </div>
            </section>
          </div>

          {/* Sidebar */}
          <div className="space-y-12 xl:sticky xl:top-32">
            <div className="bg-white/5 border border-white/10 rounded-[4rem] p-12 relative group backdrop-blur-3xl shadow-2xl overflow-hidden">
               <div className="absolute top-0 left-0 w-2 h-0 group-hover:h-full bg-brand-secondary transition-all duration-700"></div>
               <h3 className="text-2xl font-black uppercase italic tracking-tighter mb-10 leading-none">Strategic Advantage</h3>
               <ul className="space-y-10">
                 {[
                   'Private Negotiated Inventory',
                   'Custom Continental Routing',
                   'Ground Fleet Distribution',
                   '24/7 Crisis Response Desk',
                   'Worldwide VIP Asset Hub'
                 ].map(item => (
                   <li key={item} className="flex gap-6 text-[11px] font-black text-white/40 uppercase tracking-[0.3em] leading-relaxed italic">
                      <span className="text-brand-secondary text-lg">✓</span> {item}
                   </li>
                 ))}
               </ul>
            </div>

            <div className="bg-brand-primary/5 border border-brand-primary/20 rounded-[4rem] p-12 space-y-8 backdrop-blur-3xl relative overflow-hidden group">
               <div className="absolute inset-0 bg-brand-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
               <div className="text-6xl animate-pulse relative z-10 leading-none">👨‍✈️</div>
               <h3 className="text-2xl font-black uppercase italic tracking-tighter leading-none relative z-10">Consulate Desk Officer</h3>
               <div className="space-y-4 text-sm font-black text-white relative z-10 italic">
                  <p className="flex items-center gap-4 group/item"><span className="text-brand-secondary group-hover/item:scale-125 transition-transform text-xl">📞</span> +1 (213) 694-6417</p>
                  <p className="flex items-center gap-4 group/item"><span className="text-brand-secondary group-hover/item:scale-125 transition-transform text-xl">💬</span> WhatsApp: ACTIVE</p>
                  <p className="flex items-center gap-4 group/item"><span className="text-brand-secondary group-hover/item:scale-125 transition-transform text-xl">✉️</span> support@asap.travel</p>
               </div>
               <p className="text-white/20 text-[10px] font-black uppercase tracking-[0.4em] leading-relaxed border-t border-white/5 pt-8 italic relative z-10">
                  AVAILABLE 24/7 FOR STRATEGIC INTERVENTION. FULL INDEMNITY VIA DELAWARE CORPORATE HUB.
               </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function ExpertLeadPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-slate-950 text-brand-secondary animate-pulse font-black uppercase tracking-[0.5em] italic">Waking Global Expert Network...</div>}>
      <ExpertLeadContent />
    </Suspense>
  );
}
