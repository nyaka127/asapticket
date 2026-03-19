'use client';
import React, { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

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
  const [form, setForm] = useState({ name: '', email: '', phone: '', notes: '' });

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
      <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
        <div className="bg-white rounded-[3rem] shadow-2xl border border-slate-200 p-12 max-w-md text-center animate-in zoom-in-95 duration-500">
          <div className="text-8xl mb-6">🎉</div>
          <h2 className="text-3xl font-black text-slate-800 mb-2">Request Processed!</h2>
          <p className="text-slate-500 mb-6 font-medium">An asap expert will contact you shortly to finalize your personalized expert guide.</p>
          <div className="bg-slate-50 p-4 rounded-2xl text-xs font-black text-brand-primary uppercase tracking-widest leading-relaxed">Check {form.email} for exclusive booking details.</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center">
      {/* Hero Header */}
      <div className="w-full bg-purple-900 py-16 px-6 text-white text-center relative overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-20">
          <img src="https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&q=80&w=1200" alt="World Map" className="w-full h-full object-cover" />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center">
          <span className="bg-brand-secondary text-brand-primary font-black text-[10px] px-3 py-1 rounded-full uppercase tracking-widest mb-6 animate-pulse shadow-lg">ASAP EXCLUSIVE ACCESS</span>
          <h1 className="text-4xl md:text-6xl font-black mb-4 tracking-tight">Personalized Tour Guides</h1>
          <p className="text-lg md:text-xl text-white/70 max-w-2xl font-medium mb-0">Certified experts with unadvertised local knowledge. Private & personalized experiences only.</p>
        </div>
      </div>

      <div className="max-w-7xl w-full mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Booking Panel */}
          <div className="lg:col-span-2 space-y-10">
            {/* Step 1: Destination & Date */}
            <section className="bg-white rounded-[3rem] shadow-xl border border-slate-200 overflow-hidden">
              <div className="bg-purple-600 px-8 py-6 text-white flex justify-between items-center">
                <h2 className="font-black text-xl tracking-tight">Step 1: Your Trip Details</h2>
                <span className="text-white/50 text-[10px] uppercase font-black tracking-widest">Unadvertised Private Deals Only</span>
              </div>
              <div className="p-10 space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">What City?</label>
                    <input type="text" value={destination} onChange={e => setDestination(e.target.value)} required
                      placeholder="Paris, Tokyo, etc."
                      className="w-full border-none bg-slate-50 rounded-2xl px-5 py-4 text-sm font-bold focus:ring-2 focus:ring-purple-500 shadow-sm" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">When?</label>
                    <input type="date" value={date} onChange={e => setDate(e.target.value)} required
                      className="w-full border-none bg-slate-50 rounded-2xl px-5 py-4 text-sm font-bold focus:ring-2 focus:ring-purple-500 shadow-sm" />
                  </div>
                </div>

                <div>
                   <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 ml-1">Group Preferences</label>
                   <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                     {[['private', '👥 1–4 Private'], ['small', '👨‍👩‍👦 5–12 Expert'], ['large', '🚌 13+ Event']].map(([val, label]) => (
                       <button key={val} type="button" onClick={() => setGroupSize(val)}
                         className={`px-5 py-3.5 rounded-2xl text-xs font-black transition-all ${groupSize === val ? 'bg-purple-600 text-white shadow-xl scale-[1.03]' : 'bg-slate-50 text-slate-400 hover:bg-slate-100'}`}>{label}</button>
                     ))}
                   </div>
                </div>
              </div>
            </section>

            {/* Step 2: Personalized Preference Survey */}
            <section className="bg-white rounded-[3rem] shadow-xl border border-slate-200 overflow-hidden">
              <div className="bg-brand-primary px-8 py-6 text-white flex justify-between items-center">
                <h2 className="font-black text-xl tracking-tight">Step 2: Preference Survey</h2>
                <span className="text-white/50 text-[10px] uppercase font-black tracking-widest leading-relaxed">Guaranteed Best Fit</span>
              </div>
              <div className="p-10 space-y-8">
                 <p className="text-slate-500 text-sm font-medium">To provide the absolute best tour guide, please answer these preference questions:</p>
                 <div className="space-y-6">
                   {PREF_QUESTIONS.map(q => (
                     <div key={q.id}>
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 ml-1">{q.label}</label>
                        <div className="flex flex-wrap gap-2">
                           {q.options.map(opt => (
                             <button key={opt} type="button" onClick={() => setPrefs({...prefs, [q.id]: opt})}
                               className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase transition-all ${prefs[q.id] === opt ? 'bg-brand-secondary text-brand-primary font-black shadow-lg scale-[1.05]' : 'bg-slate-50 text-slate-500 hover:bg-slate-100'}`}>{opt}</button>
                           ))}
                        </div>
                     </div>
                   ))}
                 </div>
              </div>
            </section>

            {/* Step 3: Secure & Contact */}
            <section className="bg-white rounded-[3rem] shadow-xl border border-slate-200 overflow-hidden">
              <div className="bg-emerald-600 px-8 py-6 text-white flex justify-between items-center">
                <h2 className="font-black text-xl tracking-tight">Step 3: Secure Exclusive Expert</h2>
                <span className="bg-white/20 text-white text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest">BEST PRICE GUARANTEED</span>
              </div>
              <form onSubmit={handleSubmit} className="p-10 space-y-8">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div>
                     <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Full Name</label>
                     <input type="text" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required
                        className="w-full border-none bg-slate-50 rounded-2xl px-5 py-4 text-sm font-bold shadow-sm" />
                   </div>
                   <div>
                     <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Email</label>
                     <input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} required
                        className="w-full border-none bg-slate-50 rounded-2xl px-5 py-4 text-sm font-bold shadow-sm" />
                   </div>
                 </div>

                 <div className="bg-purple-50 rounded-[2rem] p-8 flex flex-col md:flex-row items-center justify-between gap-6">
                   <div>
                      <h4 className="font-black text-purple-900 text-lg leading-tight mb-1">ASAP Expert Deposit</h4>
                      <p className="text-purple-600/70 text-xs font-medium">To lock in your unadvertised rate and expert guide.</p>
                   </div>
                   <div className="text-center">
                      <div className="text-sm font-black text-purple-400 line-through tracking-widest decoration-purple-600/30">${(deposit * 2.5).toFixed(0)}</div>
                      <div className="text-5xl font-black text-purple-700 leading-none">${deposit}</div>
                   </div>
                 </div>

                 <button type="submit" disabled={loading}
                   className="w-full bg-brand-primary hover:bg-brand-dark text-white font-black py-5 rounded-[2rem] shadow-2xl transition-all text-lg flex items-center justify-center gap-3">
                   {loading ? 'Processing Exclusive Access...' : <>🔒 Secure Expert — Best Price Guaranteed</>}
                 </button>
                 <p className="text-center text-[10px] font-black text-slate-400 uppercase tracking-widest leading-relaxed">No middle-man brand markup. Secured by ASAP Exclusive Stripe. 📱 Optimized for Mobile.</p>
              </form>
            </section>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            <div className="bg-white rounded-[2.5rem] shadow-xl border border-slate-200 p-8">
              <h3 className="text-xl font-black text-slate-800 mb-6 flex items-center gap-2">🌍 Top Exclusive Locations</h3>
              <div className="space-y-4">
                 {POPULAR_DESTINATIONS.map(d => (
                   <button key={d.city} type="button" onClick={() => setDestination(d.city)}
                    className="w-full flex items-center gap-4 p-3 rounded-2xl hover:bg-slate-50 transition-all text-left group">
                      <div className="w-16 h-16 rounded-xl overflow-hidden shadow-md">
                        <img src={d.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                      </div>
                      <div>
                        <div className="font-black text-slate-800 leading-snug">{d.city}</div>
                        <div className="text-[10px] font-black text-brand-primary uppercase mt-0.5 tracking-widest">ASAP PICK 🟢</div>
                      </div>
                   </button>
                 ))}
              </div>
            </div>

            <div className="bg-brand-dark rounded-[2.5rem] p-8 text-white">
               <h3 className="text-xl font-black mb-4">The ASAP Promise</h3>
               <ul className="space-y-4">
                 {['Unadvertised expert guides only', 'Verified local professional photos', 'Personalized preference survey matching', 'Lowest expert rate guarantee', '24/7 Mobile optimized support'].map(pt => (
                   <li key={pt} className="flex gap-4 items-start text-xs font-black text-white/50 uppercase tracking-widest leading-relaxed">
                     <span className="text-brand-secondary">✓</span> {pt}
                   </li>
                 ))}
               </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ToursPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center animate-pulse text-slate-400 font-bold tracking-widest">PERSONALIZING YOUR EXPERT...</div>}>
      <ToursContent />
    </Suspense>
  );
}
