'use client';
import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { formatPricing } from '@/lib/pricing';
import { CurrencySwitcher } from '@/components/CurrencySwitcher';
import { useTranslation } from '@/components/TranslationProvider';

const TOUR_TYPES = [
  { id: 'city', label: '🏙 City Private Tour', desc: 'Expert guided walking tour of major landmarks' },
  { id: 'culture', label: '🎭 Cultural Insider', desc: 'Local food, arts, and unadvertised cultural sites' },
  { id: 'nature', label: '🌿 Nature Exclusive', desc: 'Private hiking & scenic landscapes with experts' },
];

const POPULAR_DESTINATIONS = [
  { city: 'Paris, France', icon: '🗼', image: 'https://images.unsplash.com/photo-1502602898657-3e91760c604a?auto=format&fit=crop&q=80&w=400' },
  { city: 'Rome, Italy', icon: '🏛', image: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&q=80&w=400' },
  { city: 'Tokyo, Japan', icon: '🗾', image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&q=80&w=400' },
];

const PREF_QUESTIONS = [
  { id: 'pace', label: 'Preferred Pace', options: ['Relaxed', 'Mid-tempo', 'Fast-paced'] },
  { id: 'lang', label: 'Language Expert', options: ['English Only', 'Native Speaker', 'Multilingual Professional'] },
  { id: 'focus', label: 'Interest Focus', options: ['Architecture', 'Gastronomy', 'Local History', 'Modern Life'] },
];

function ToursContent() {
  const searchParams = useSearchParams();
  const [destination, setDestination] = useState(searchParams.get('destination') || '');
  const [date, setDate] = useState(searchParams.get('date') || new Date(Date.now() + 14 * 864e5).toISOString().split('T')[0]);
  const [groupSize, setGroupSize] = useState(searchParams.get('size') || 'private');
  const [tourType, setTourType] = useState('');
  const [prefs, setPrefs] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeCurrency, setActiveCurrency] = useState('USD');
  const [form, setForm] = useState({ name: '', email: '', phone: '', notes: '' });
  const { t } = useTranslation();

  useEffect(() => {
    const saved = localStorage.getItem('user-currency');
    if (saved) setActiveCurrency(saved);
  }, []);

  const PRICES = { private: 150, small: 75, large: 50 };
  const deposit = PRICES[groupSize as keyof typeof PRICES] || 75;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const bookRes = await fetch('/api/tours/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ destination, date, groupSize, tourType, depositCents: deposit * 100, prefs, ...form }),
      });
      if (bookRes.ok) {
        const { url } = await bookRes.json();
        if (url) { window.location.href = url; return; }
      }
    } catch {}
    setLoading(false);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4">
        <div className="bg-slate-900 rounded-[4rem] shadow-2xl border border-white/10 p-16 max-w-md text-center animate-in zoom-in-95 duration-700 backdrop-blur-3xl">
          <div className="text-8xl mb-8">🎉</div>
          <h2 className="text-4xl font-black text-white italic tracking-tighter uppercase mb-4">Request Processed!</h2>
          <p className="text-white/40 mb-10 font-medium italic">An ASAP expert will contact you shortly to finalize your personalized expert guide.</p>
          <div className="bg-brand-primary/10 border border-brand-primary/20 p-6 rounded-[2.5rem] text-[10px] font-black text-brand-primary uppercase tracking-[0.3em] leading-relaxed">Check {form.email} for exclusive booking details.</div>
          <button onClick={() => window.location.href = '/'} className="mt-12 text-white/20 hover:text-white text-[10px] font-black uppercase tracking-[0.5em] transition-all italic">Return to Mainboard</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center selection:bg-brand-primary selection:text-white">
      {/* Hero Header */}
      <div className="w-full bg-slate-900 py-32 px-6 border-b border-white/5 relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src="https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&q=80&w=1920" alt="World Map" className="w-full h-full object-cover opacity-10 blur-sm scale-110" />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-transparent to-slate-950"></div>
          <div className="absolute bottom-0 left-0 w-full h-[300px] bg-brand-primary/5 blur-[150px] pointer-events-none"></div>
        </div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col md:flex-row items-center justify-between mb-12 w-full gap-8">
             <div className="text-center md:text-left">
                <span className="bg-brand-secondary text-brand-primary font-black text-[10px] px-6 py-2 rounded-full uppercase tracking-[0.4em] mb-8 animate-pulse shadow-lg inline-block skew-x-[-12deg]">IRIS V1: EXPERT SYNC ACTIVE</span>
                <h1 className="text-6xl md:text-8xl font-black italic mb-6 tracking-tighter uppercase leading-[0.85]">Personalized <br/> <span className="text-brand-secondary">Tour</span> Guides</h1>
                <p className="text-xl md:text-2xl text-white/40 max-w-2xl font-black italic">Certified experts with unadvertised local knowledge. Private & personalized experiences only.</p>
             </div>
             <div className="flex flex-col items-end gap-4">
                <CurrencySwitcher />
                <div className="bg-white/5 px-6 py-3 rounded-2xl border border-white/10 flex items-center gap-3">
                   <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                   <span className="text-[10px] font-black uppercase tracking-widest text-white/40">GDS BRIDGE: SECURE</span>
                </div>
             </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl w-full mx-auto px-6 py-24 pb-48">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
          {/* Main Booking Panel */}
          <div className="lg:col-span-2 space-y-16">
            {/* Step 1: Destination & Date */}
            <section className="bg-white/5 rounded-[4rem] shadow-2xl border border-white/10 overflow-hidden backdrop-blur-3xl group transition-all hover:border-brand-secondary/40">
              <div className="bg-slate-900 border-b border-white/5 px-10 py-8 flex justify-between items-center relative overflow-hidden">
                <div className="absolute top-0 right-0 w-48 h-48 bg-brand-secondary/5 blur-[60px] pointer-events-none"></div>
                <h2 className="font-black text-2xl tracking-tighter italic uppercase text-white relative z-10">01. Deployment Details</h2>
                <span className="text-white/20 text-[10px] uppercase font-black tracking-[0.4em] italic relative z-10">Unadvertised Private Deals</span>
              </div>
              <div className="p-12 space-y-12">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <label className="block text-[11px] font-black text-white/40 uppercase tracking-[0.3em] mb-4 ml-2 italic">Operation Hub (City)</label>
                    <input type="text" value={destination} onChange={e => setDestination(e.target.value)} required
                      placeholder="Paris, Tokyo, etc."
                      className="w-full border-none bg-white/5 rounded-[2rem] px-8 py-6 text-sm font-black text-white placeholder:text-white/20 focus:bg-white/10 outline-none shadow-inner transition-all italic" />
                  </div>
                  <div>
                    <label className="block text-[11px] font-black text-white/40 uppercase tracking-[0.3em] mb-4 ml-2 italic">Target Date</label>
                    <input type="date" value={date} onChange={e => setDate(e.target.value)} required
                      className="w-full border-none bg-white/5 rounded-[2rem] px-8 py-6 text-sm font-black text-white focus:bg-white/10 outline-none shadow-inner transition-all" />
                  </div>
                </div>

                <div>
                   <label className="block text-[11px] font-black text-white/40 uppercase tracking-[0.3em] mb-5 ml-2 italic">Team Configuration</label>
                   <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                     {[
                       { v: 'private', l: '👥 1–4 Private', d: 'Elite Tier' }, 
                       { v: 'small', l: '👨‍👩‍👦 5–12 Expert', d: 'Tactical Team' }, 
                       { v: 'large', l: '🚌 13+ Event', d: 'Delegation' }
                      ].map(type => (
                       <button key={type.v} type="button" onClick={() => setGroupSize(type.v)}
                         className={`p-6 rounded-[2.5rem] text-left transition-all border ${groupSize === type.v ? 'bg-brand-secondary border-brand-secondary shadow-[0_0_30px_#facc1550] scale-[1.05]' : 'bg-white/5 border-white/10 text-white/40 hover:bg-white/10 hover:text-white'}`}>
                           <div className={`text-[11px] font-black uppercase tracking-widest leading-none mb-1 ${groupSize === type.v ? 'text-brand-primary' : 'text-white/20'}`}>{type.d}</div>
                           <div className={`text-base font-black italic uppercase tracking-tighter ${groupSize === type.v ? 'text-brand-primary' : 'text-white'}`}>{type.l}</div>
                       </button>
                     ))}
                   </div>
                </div>
              </div>
            </section>

            {/* Step 2: Personalized Preference Survey */}
            <section className="bg-white/5 rounded-[4rem] shadow-2xl border border-white/10 overflow-hidden backdrop-blur-3xl group transition-all hover:border-brand-primary/40">
              <div className="bg-slate-900 border-b border-white/5 px-10 py-8 flex justify-between items-center relative overflow-hidden">
                <div className="absolute top-0 right-0 w-48 h-48 bg-brand-primary/5 blur-[60px] pointer-events-none"></div>
                <h2 className="font-black text-2xl tracking-tighter italic uppercase text-white relative z-10">02. Preference Matrix</h2>
                <span className="text-white/20 text-[10px] uppercase font-black tracking-[0.4em] italic relative z-10">Guaranteed Alignment</span>
              </div>
              <div className="p-12 space-y-12">
                 <p className="text-white/40 text-sm font-black italic uppercase tracking-widest">Identify mission objectives to optimize guide allocation:</p>
                 <div className="space-y-10">
                   {PREF_QUESTIONS.map(q => (
                     <div key={q.id}>
                        <label className="block text-[11px] font-black text-white/40 uppercase tracking-[0.3em] mb-5 ml-2 italic">{q.label}</label>
                        <div className="flex flex-wrap gap-3">
                           {q.options.map(opt => (
                             <button key={opt} type="button" onClick={() => setPrefs({...prefs, [q.id]: opt})}
                               className={`px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border ${prefs[q.id] === opt ? 'bg-brand-secondary border-brand-secondary text-brand-primary shadow-[0_0_20px_#facc1540] scale-[1.05]' : 'bg-white/5 border-white/10 text-white/40 hover:bg-white/10 hover:text-white'}`}>{opt}</button>
                           ))}
                        </div>
                     </div>
                   ))}
                 </div>
              </div>
            </section>

            {/* Step 3: Secure & Contact */}
            <section className="bg-white/5 rounded-[4rem] shadow-2xl border border-white/10 overflow-hidden backdrop-blur-3xl group transition-all hover:border-emerald-500/40">
              <div className="bg-slate-900 border-b border-white/5 px-10 py-8 flex justify-between items-center relative overflow-hidden">
                <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/5 blur-[60px] pointer-events-none"></div>
                <h2 className="font-black text-2xl tracking-tighter italic uppercase text-white relative z-10">03. Final Clearance</h2>
                <span className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-[10px] font-black px-4 py-2 rounded-full uppercase tracking-widest italic">BEST RATE SECURED 🛡️</span>
              </div>
              <form onSubmit={handleSubmit} className="p-12 space-y-12">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   <div>
                     <label className="block text-[11px] font-black text-white/40 uppercase tracking-[0.3em] mb-4 ml-2 italic">Official Full Name</label>
                     <input type="text" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required
                        className="w-full border-none bg-white/5 rounded-[2rem] px-8 py-6 text-sm font-black text-white placeholder:text-white/20 focus:bg-white/10 outline-none shadow-inner transition-all italic" />
                   </div>
                   <div>
                     <label className="block text-[11px] font-black text-white/40 uppercase tracking-[0.3em] mb-4 ml-2 italic">Secure Email Hub</label>
                     <input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} required
                        className="w-full border-none bg-white/5 rounded-[2rem] px-8 py-6 text-sm font-black text-white placeholder:text-white/20 focus:bg-white/10 outline-none shadow-inner transition-all" />
                   </div>
                 </div>

                 <div className="bg-slate-900 rounded-[3rem] p-10 flex flex-col md:flex-row items-center justify-between gap-8 border border-white/5 shadow-inner">
                   <div className="text-center md:text-left">
                      <h4 className="font-black text-white text-2xl italic tracking-tighter leading-tight mb-2 uppercase">Guide Allocation Deposit</h4>
                      <p className="text-white/40 text-[10px] font-black uppercase tracking-[0.3em] italic">Blocks your unadvertised private rate on IRIS V1 sync.</p>
                   </div>
                    <div className="text-center">
                       <div className="text-[11px] font-black text-white/20 line-through tracking-[0.4em] mb-2 uppercase italic">{formatPricing(deposit * 2.5, activeCurrency)}</div>
                       <div className="text-6xl font-black text-brand-secondary italic tracking-tighter shadow-brand-secondary/20">{formatPricing(deposit, activeCurrency)}</div>
                    </div>
                 </div>

                 <button type="submit" disabled={loading}
                   className="w-full bg-brand-primary hover:bg-white hover:text-slate-950 text-white font-black py-8 rounded-[3rem] shadow-[0_25px_50px_rgba(235,59,90,0.3)] transition-all text-xl uppercase tracking-[0.2em] italic flex items-center justify-center gap-4 group">
                   {loading ? 'Initializing Secure Uplink...' : <>🔒 SECURE EXPERT ACCESS <span className="group-hover:translate-x-4 transition-transform">→</span></>}
                 </button>
                 <p className="text-center text-[10px] font-black text-white/20 uppercase tracking-[0.5em] leading-relaxed italic">No retail markup. Secured by ASAP Encryption Layer 4. · Optimized for Strategic Deployment.</p>
              </form>
            </section>
          </div>

          {/* Sidebar */}
          <aside className="space-y-12">
            <div className="bg-white/5 rounded-[3.5rem] shadow-2xl border border-white/10 p-10 backdrop-blur-3xl sticky top-28">
              <h3 className="text-[11px] font-black text-brand-secondary uppercase tracking-[0.4em] mb-12 border-b border-white/5 pb-6 italic">Strategic Locations</h3>
              <div className="space-y-6">
                 {POPULAR_DESTINATIONS.map(d => (
                   <button key={d.city} type="button" onClick={() => setDestination(d.city)}
                    className="w-full flex items-center gap-5 p-4 rounded-3xl hover:bg-white/5 transition-all text-left group border border-transparent hover:border-white/10">
                      <div className="w-20 h-20 rounded-2xl overflow-hidden shadow-2xl border border-white/10">
                        <img src={d.image} className="w-full h-full object-cover group-hover:scale-120 transition-transform duration-1000" />
                      </div>
                      <div>
                        <div className="font-black text-white text-lg italic tracking-tighter uppercase leading-none mb-2">{d.city}</div>
                        <div className="flex items-center gap-2">
                           <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_#10b981]"></span>
                           <div className="text-[10px] font-black text-emerald-500 uppercase tracking-widest italic">ASAP VERIFIED</div>
                        </div>
                      </div>
                   </button>
                 ))}
              </div>
            </div>

            <div className="bg-brand-primary rounded-[3.5rem] p-10 text-white shadow-[0_30px_60px_rgba(235,59,90,0.2)] relative overflow-hidden group">
               <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 blur-[80px] pointer-events-none"></div>
               <h3 className="text-xl font-black italic uppercase tracking-tighter mb-8 border-b border-white/20 pb-4">Wholesale Promise</h3>
               <ul className="space-y-6">
                 {['Private Expert Access Only', 'Verified Local Intel', 'No Retail Price Inflation', 'IRIS V1 Settlement Layer', '24/7 Global Crisis Desk'].map(pt => (
                   <li key={pt} className="flex gap-4 items-start text-[10px] font-black text-white uppercase tracking-[0.3em] leading-relaxed">
                     <span className="text-brand-secondary text-base">✓</span> {pt}
                   </li>
                 ))}
               </ul>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

export default function ToursPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-950 flex items-center justify-center animate-pulse text-white/20 font-black uppercase tracking-[0.5em] italic">Initializing Expert Matrix...</div>}>
      <ToursContent />
    </Suspense>
  );
}
