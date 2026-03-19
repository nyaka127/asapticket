'use client';
import React, { useState } from 'react';
import Link from 'next/link';

const stats = [
  { label: 'Started 2001', value: '23+ Yrs' },
  { label: 'Flights Arranged', value: '200,000+' },
  { label: 'Verified Reviews', value: '100,000+' },
  { label: 'Help In Delaware', value: 'HQ Office' },
];

export default function PublicHomepage() {
  const [showLeadModal, setShowLeadModal] = useState(false);
  const [loadingLead, setLoadingLead] = useState(false);
  const [leadForm, setLeadForm] = useState({ name: '', email: '', phone: '', pref: 'WhatsApp', destination: '' });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmitLead = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingLead(true);
    try {
      await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(leadForm),
      });
      setIsSubmitted(true);
      setTimeout(() => {
        setShowLeadModal(false);
        setIsSubmitted(false);
      }, 3000);
    } catch (err) {
      console.error(err);
      setIsSubmitted(true); // Fallback for demo
    } finally {
      setLoadingLead(false);
    }
  };

  return (
    <main className="flex flex-col bg-slate-50 overflow-x-hidden">
      {/* RatePunk Inspired Hero Section */}
      <section className="relative h-screen min-h-[700px] flex items-center justify-center text-white text-center px-4 overflow-hidden">
        <div className="absolute inset-0 z-0 scale-105">
          <img 
            src="https://images.unsplash.com/photo-1436491865332-7a61a109c0f3?auto=format&fit=crop&q=80&w=2000" 
            alt="Plane Wing"
            className="w-full h-full object-cover brightness-[0.4]"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-brand-dark/20 via-transparent to-brand-dark/80"></div>
        </div>

        <div className="relative z-10 max-w-3xl w-full mx-auto animate-in fade-in duration-1000">
           <div className="flex items-center justify-center gap-3 mb-8">
              <div className="w-12 h-12 bg-brand-secondary rounded-full flex items-center justify-center text-2xl font-black text-brand-primary">⚡</div>
              <span className="text-2xl font-black tracking-tighter uppercase italic">ASAP TICKETS</span>
           </div>
           
           <h1 className="text-6xl md:text-[8rem] font-black leading-[0.9] tracking-tighter mb-8 uppercase italic">
              SAVE UP TO <br/> <span className="text-brand-secondary">90% ON</span> <br/> FLIGHTS
           </h1>
           
           <div className="space-y-2 mb-10">
              <p className="text-xl md:text-2xl font-medium text-white/90">Our members save <span className="text-brand-secondary font-black">$488*</span>/ticket on average.</p>
              <p className="text-[10px] text-white/40 uppercase tracking-widest">*based on unadvertised private contracts 2024</p>
           </div>

           <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button 
                onClick={() => setShowLeadModal(true)}
                className="w-full sm:w-auto bg-brand-secondary text-brand-primary font-black px-12 py-6 rounded-full text-xl shadow-2xl hover:scale-110 transition-all uppercase tracking-tight active:scale-95">
                Start Saving Now 👋
              </button>
              <Link href="/flights" className="w-full sm:w-auto bg-white/10 backdrop-blur-md border border-white/20 text-white font-black px-12 py-6 rounded-full text-sm uppercase tracking-widest hover:bg-white/20 transition-all">
                 Browse Live Deals
              </Link>
           </div>
        </div>

        {/* Floating Indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce opacity-40">
           <span className="text-2xl">↓</span>
        </div>
      </section>

      {/* Trending Deals Section (New Design) */}
      <section className="py-24 bg-white px-6">
         <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
               <p className="text-brand-primary font-black uppercase tracking-[0.3em] text-xs mb-4">Trending Now 🔥</p>
               <h2 className="text-3xl md:text-5xl font-black text-slate-800 tracking-tight">"Smart travelers don't chase — <br/> they <span className="text-brand-primary italic">track.</span>"</h2>
            </div>

            <div className="space-y-4">
               {[
                 { city: 'Bali, Indonesia', price: 345, emoji: '🏝️' },
                 { city: 'Paris, France', price: 316, emoji: '🍷' },
                 { city: 'Sydney, Australia', price: 522, emoji: '🦘' },
                 { city: 'Rome, Italy', price: 299, emoji: '🍕' },
                 { city: 'Tokyo, Japan', price: 389, emoji: '🗾' },
                 { city: 'New York, USA', price: 278, emoji: '🏙️' }
               ].map((deal, i) => (
                 <div key={i} className="flex items-center justify-between p-6 bg-slate-50 rounded-3xl group hover:bg-white hover:shadow-2xl hover:scale-[1.02] transition-all cursor-pointer border border-transparent hover:border-brand-primary/10">
                    <div className="flex items-center gap-6">
                       <span className="text-4xl">{deal.emoji}</span>
                       <div>
                          <h3 className="text-lg font-black text-slate-800">{deal.city}</h3>
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Roundtrip Deal</span>
                       </div>
                    </div>
                    <div className="text-right">
                       <div className="text-2xl font-black text-brand-primary">${deal.price}</div>
                       <div className="text-[10px] font-black text-emerald-500 uppercase">Save 75%</div>
                    </div>
                 </div>
               ))}
            </div>
         </div>
      </section>

      {/* Global Hubs & Premium Partners */}
      <section className="py-24 bg-slate-50 border-y border-slate-200 overflow-hidden">
         <div className="max-w-7xl mx-auto px-6">
            <div className="flex flex-col md:flex-row items-center justify-between mb-16 gap-8">
               <div className="animate-in slide-in-from-left duration-1000">
                  <h2 className="text-4xl md:text-6xl font-black tracking-tighter italic uppercase leading-none text-slate-900">The World's <br/> <span className="text-brand-primary">Premier Network</span></h2>
                  <p className="text-slate-400 font-bold uppercase tracking-[0.4em] mt-4 text-[10px]">Global Hubs & Elite Hospitality Partners</p>
               </div>
               <div className="flex flex-wrap justify-end gap-3 max-w-md">
                  {['LHR', 'DXB', 'JFK', 'NBO', 'HND', 'SIN', 'CDG'].map(code => (
                    <span key={code} className="bg-white border border-slate-200 text-slate-400 text-[10px] font-black px-4 py-2 rounded-xl uppercase tracking-widest hover:border-brand-primary hover:text-brand-primary transition-all cursor-default shadow-sm">{code}</span>
                  ))}
               </div>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-6 gap-8 items-center opacity-30 grayscale hover:grayscale-0 transition-all duration-700">
               {[
                 { name: 'Ritz-Carlton', icon: '🏨' },
                 { name: 'Emirates', icon: '✈️' },
                 { name: 'Waldorf Astoria', icon: '💎' },
                 { name: 'Qatar Airways', icon: '🇶🇦' },
                 { name: 'Four Seasons', icon: '🌿' },
                 { name: 'St. Regis', icon: '🛎️' }
               ].map((b, i) => (
                 <div key={i} className="flex flex-col items-center gap-3 group">
                    <span className="text-4xl group-hover:scale-125 transition-transform duration-500">{b.icon}</span>
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-900 group-hover:text-brand-primary">{b.name}</span>
                 </div>
               ))}
            </div>

            <div className="mt-20 grid grid-cols-1 md:grid-cols-2 gap-10">
               <div className="bg-brand-primary p-12 rounded-[3.5rem] text-white shadow-2xl relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32 group-hover:scale-150 transition-transform duration-1000"></div>
                  <h3 className="text-3xl font-black italic uppercase tracking-tighter mb-4">Elite Hub Access</h3>
                  <p className="text-white/60 font-medium mb-8 text-sm leading-relaxed">Direct unadvertised contracts with major ports in London, Dubai, and Nairobi. We provide full PNR verification for all transcontinental routes.</p>
                  <Link href="/flights" className="bg-white text-brand-primary font-black px-10 py-4 rounded-full text-xs uppercase tracking-widest hover:scale-105 transition-all inline-block shadow-xl">Secure Global Seat →</Link>
               </div>
               <div className="bg-slate-900 p-12 rounded-[3.5rem] text-white shadow-2xl relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-brand-secondary/5 rounded-full -mr-32 -mt-32 group-hover:scale-150 transition-transform duration-1000"></div>
                  <h3 className="text-3xl font-black italic uppercase tracking-tighter mb-4">Diamond Tier Stays</h3>
                  <p className="text-white/40 font-medium mb-8 text-sm leading-relaxed">Exclusive wholesales rates at Ritz-Carlton, Waldorf Astoria, and St. Regis properties worldwide. Verified meal plans and class upgrades included.</p>
                  <Link href="/hotels" className="bg-brand-secondary text-brand-primary font-black px-10 py-4 rounded-full text-xs uppercase tracking-widest hover:scale-105 transition-all inline-block shadow-xl">Claim Exclusive Stay →</Link>
               </div>
            </div>
         </div>
      </section>

      {/* How the Procedure Works (Knit & Easy Section) */}
      <section className="py-24 bg-slate-100 px-6">
         <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16 px-4">
               <h2 className="text-3xl md:text-5xl font-black text-slate-800 tracking-tight italic uppercase">The Procedure</h2>
               <p className="text-slate-400 font-bold uppercase tracking-widest mt-2">Knit & Easy Experience for Global Travelers</p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
               {[
                 { step: '01', label: 'FLIGHTS', desc: 'Secure unadvertised bulk rates with SerpApi live power.', icon: '✈️' },
                 { step: '02', label: 'HOTELS', desc: 'Add ASAP Exclusive stays in your destination city.', icon: '🏨' },
                 { step: '03', label: 'CARS', desc: 'Unlock private rental fleet contracts instantly.', icon: '🚗' },
                 { step: '04', label: 'SECURE', desc: 'Verify your PNR before authorizing payment.', icon: '🛡️' }
               ].map((s, i) => (
                 <div key={i} className="bg-white p-8 rounded-[2.5rem] shadow-xl border-b-8 border-brand-primary active:scale-95 transition-all group">
                    <div className="flex justify-between items-start mb-6">
                       <span className="text-4xl">{s.icon}</span>
                       <span className="text-4xl font-black text-slate-100 group-hover:text-brand-primary/10 transition-colors uppercase tracking-tighter">{s.step}</span>
                    </div>
                    <h3 className="text-lg font-black text-slate-800 mb-2 tracking-tight">{s.label}</h3>
                    <p className="text-xs font-medium text-slate-400 leading-relaxed">{s.desc}</p>
                 </div>
               ))}
            </div>
            
            <div className="mt-16 text-center">
               <Link href="/flights" className="bg-brand-primary text-white font-black px-12 py-6 rounded-full inline-block shadow-2xl hover:bg-brand-dark transition-all scale-100 hover:scale-[1.05] uppercase tracking-widest text-sm">
                  Start Your Procedure →
               </Link>
            </div>
         </div>
      </section>
      
      {/* Global Seasonality Pulse (Travel Dates Insight) */}
      <section className="py-24 bg-brand-dark text-white px-6 relative overflow-hidden">
         {/* Abstract background effect */}
         <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-primary opacity-10 blur-[150px] rounded-full -mr-64 -mt-64"></div>
         <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-brand-secondary opacity-5 blur-[150px] rounded-full -ml-64 -mb-64"></div>

         <div className="max-w-7xl mx-auto relative z-10">
            <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-4">
               <div>
                  <h2 className="text-4xl md:text-6xl font-black tracking-tighter italic uppercase leading-none">Global Price <br/> <span className="text-brand-secondary">Seasonality Pulse</span></h2>
                  <p className="text-white/40 font-bold uppercase tracking-[0.4em] mt-4 text-xs">Tracking World Travel Dates & Trends</p>
               </div>
               <div className="text-right">
                  <span className="text-emerald-400 font-black text-sm uppercase tracking-widest animate-pulse">● Live Estimations Active</span>
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
               {[
                 { region: 'Europe / USA', status: 'Peak High 🔥', advice: 'Northern summer in effect. High demand.', color: 'orange' },
                 { region: 'Asia / Tropical', status: 'Best Value 🌴', advice: 'Dry season ending. Off-peak rates available.', color: 'emerald' },
                 { region: 'Australia / SA', status: 'Southern Winter ❄️', advice: 'Low season deals. Great flight availability.', color: 'blue' }
               ].map((r, i) => (
                 <div key={i} className="bg-white/5 backdrop-blur-md border border-white/10 p-10 rounded-[3rem] hover:bg-white/10 transition-all group">
                    <h3 className="text-xl font-black mb-1 group-hover:text-brand-secondary transition-colors italic uppercase">{r.region}</h3>
                    <div className="text-[10px] font-black uppercase tracking-widest mb-8 text-white/40 border-b border-white/5 pb-4">Monthly Demand Tracking</div>
                    
                    <div className="flex items-center justify-between mb-4">
                       <span className="text-3xl font-black italic tracking-tighter uppercase">{r.status}</span>
                    </div>
                    <p className="text-sm font-medium text-white/50 leading-relaxed mb-10">{r.advice}</p>

                    <button className="w-full bg-white/10 text-white font-black py-4 rounded-2xl text-[10px] uppercase tracking-[0.2em] border border-white/5 hover:bg-white/20 transition-all">View Price Estimates →</button>
                 </div>
               ))}
            </div>

            <div className="mt-20 p-10 bg-white/5 border border-white/10 rounded-[3rem] flex flex-col md:flex-row items-center justify-between gap-8">
               <div className="flex items-center gap-6">
                  <div className="text-5xl">🌎</div>
                  <div>
                     <h4 className="text-2xl font-black italic uppercase">All Airlines. All Destinations.</h4>
                     <p className="text-white/50 font-medium italic">Our SerpApi engine monitors 5,000+ flight routes daily.</p>
                  </div>
               </div>
               <Link href="/flights" className="px-12 py-5 bg-brand-secondary text-brand-primary font-black rounded-full shadow-2xl hover:scale-105 transition-all text-sm uppercase tracking-widest text-center">Open Estimator Pulse</Link>
            </div>
         </div>
      </section>

      {/* Trust Stats Redesigned */}
      <section className="bg-brand-dark py-20">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 lg:grid-cols-4 gap-12 text-center">
          {stats.map(s => (
            <div key={s.label} className="group">
              <div className="text-5xl font-black text-brand-secondary mb-2 tracking-tighter">{s.value}</div>
              <div className="text-white/30 text-[10px] uppercase font-black tracking-widest">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Lead Capture Modal / Slide-over */}
      {showLeadModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
           <div className="absolute inset-0 bg-brand-dark/95 backdrop-blur-md" onClick={() => setShowLeadModal(false)}></div>
           <div className="relative bg-white w-full max-w-md rounded-[3rem] p-8 md:p-12 shadow-[0_0_100px_rgba(0,0,0,0.5)] animate-in zoom-in-95 duration-300 overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-brand-primary via-brand-secondary to-brand-primary"></div>
              
              {!isSubmitted ? (
                <>
                  <button onClick={() => setShowLeadModal(false)} className="absolute top-6 right-8 text-slate-300 hover:text-slate-800 text-2xl font-light">×</button>
                  <div className="mb-8">
                     <div className="w-16 h-16 bg-brand-secondary rounded-2xl flex items-center justify-center text-3xl mb-6 shadow-xl">🔔</div>
                     <h2 className="text-3xl font-black text-slate-800 tracking-tight leading-tight">Get Price Tracking <br/> Alerts Instantly</h2>
                     <p className="text-slate-500 mt-2 font-medium">We monitor unadvertised deals 24/7. When the price drops, you're the first to know.</p>
                  </div>

                  <form onSubmit={handleSubmitLead} className="space-y-5">
                     <div className="space-y-4">
                        <input type="text" placeholder="Your Full Name" required 
                          onChange={e => setLeadForm({...leadForm, name: e.target.value})}
                          className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 font-bold text-slate-800 focus:ring-2 focus:ring-brand-primary" />
                        
                        <input type="email" placeholder="Email Address" required
                          onChange={e => setLeadForm({...leadForm, email: e.target.value})}
                          className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 font-bold text-slate-800 focus:ring-2 focus:ring-brand-primary" />
                        
                        <input type="tel" placeholder="Phone (WhatsApp/SMS)" required
                          onChange={e => setLeadForm({...leadForm, phone: e.target.value})}
                          className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 font-bold text-slate-800 focus:ring-2 focus:ring-brand-primary" />
                        
                        <div>
                           <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 ml-1">Notify me via</label>
                           <div className="grid grid-cols-3 gap-2">
                              {['WhatsApp', 'SMS', 'Calls'].map(p => (
                                <button key={p} type="button" 
                                  onClick={() => setLeadForm({...leadForm, pref: p})}
                                  className={`py-3 rounded-xl text-xs font-black uppercase transition-all ${leadForm.pref === p ? 'bg-brand-primary text-white shadow-lg' : 'bg-slate-50 text-slate-400 hover:bg-slate-100'}`}>
                                  {p}
                                </button>
                              ))}
                           </div>
                        </div>
                     </div>

                     <button type="submit" disabled={loadingLead} className="w-full bg-brand-secondary text-brand-primary font-black py-5 rounded-[2rem] text-lg shadow-2xl hover:scale-105 transition-all mt-4 uppercase disabled:opacity-50">
                        {loadingLead ? 'Activating Tracker...' : 'Activate Deal Tracking →'}
                     </button>
                     <p className="text-[10px] text-center text-slate-300 font-bold uppercase tracking-widest">🛡️ Delaware HQ Verified Security</p>
                  </form>
                </>
              ) : (
                <div className="text-center py-20 space-y-6">
                   <div className="text-7xl">🎉</div>
                   <h2 className="text-4xl font-black text-slate-800 tracking-tighter uppercase italic">YOU'RE ON THE LIST!</h2>
                   <p className="text-slate-500 font-medium">An expert agent from our Wilmington office will contact you via <span className="font-black text-brand-primary">{leadForm.pref}</span> the moment a deal drops.</p>
                </div>
              )}
           </div>
        </div>
      )}

      {/* Footer (RatePunk Style - Dark/Minimal) */}
      <footer className="bg-slate-900 text-white py-24 px-6 border-t border-white/5">
         <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-12">
            <div className="col-span-1 md:col-span-2 space-y-8">
               <div className="text-2xl font-black italic uppercase tracking-tighter">ASAP TICKETS</div>
               <p className="text-white/40 max-w-sm font-medium leading-relaxed font-bold">
                  Trusted global travel partner since 2001. A+ Rated by BBB. Accredited by ARC and ASTA. 
                  Serving you from Wilmington, Delaware with private executive contracts.
               </p>
               <div className="flex gap-4">
                  {['Trustpilot', 'Google', 'Facebook'].map(p => (
                    <div key={p} className="flex items-center gap-1.5 grayscale opacity-40">
                       <span className="text-brand-secondary text-lg">★</span>
                       <span className="text-[10px] font-black uppercase">{p}</span>
                    </div>
                  ))}
               </div>
            </div>
            <div>
               <h4 className="font-black text-xs uppercase tracking-[0.2em] mb-6 text-white/20">Legal</h4>
               <ul className="space-y-3 text-sm font-bold text-white/60">
                  <li>Terms of Service</li>
                  <li>Privacy Policy</li>
                  <li>Flight Terms</li>
                  <li>Hotel Promises</li>
               </ul>
            </div>
            <div>
               <h4 className="font-black text-xs uppercase tracking-[0.2em] mb-6 text-white/20">Support</h4>
               <ul className="space-y-3 text-sm font-bold text-white/60">
                  <li>Wilmington HQ</li>
                  <li>Contact Us</li>
                  <li>+1 866 961 7260</li>
                  <li>help@asaptickets.com</li>
               </ul>
            </div>
         </div>
      </footer>
    </main>
  );
}
