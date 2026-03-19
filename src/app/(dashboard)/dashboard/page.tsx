'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { getDistanceBetweenCodes } from '@/lib/geo';
import { MAJOR_AIRLINES } from '@/lib/airlines';
import { DESTINATIONS } from '@/lib/tours_info';

export default function AgentDashboard() {
  const [activities, setActivities] = useState<any[]>([]);
  const [selectedDestination, setSelectedDestination] = useState<string | null>(null);

  // Periodically fetch client activity pulse
  useEffect(() => {
    const fetchActivity = async () => {
      try {
        const res = await fetch('/api/monitor');
        const data = await res.json();
        setActivities(data.activities || []);
      } catch (e) {}
    };
    
    fetchActivity();
    const interval = setInterval(fetchActivity, 5000); // Poll every 5s
    return () => clearInterval(interval);
  }, []);

  const leads = [
    { name: 'Devy Nails', from: 'LHR', to: 'JFK', departure: '2024-05-12', return: '2024-05-25', pref: 'WhatsApp', price: '$850', status: 'Alert Ready', airline: 'BA' },
    { name: 'Sarah Miller', from: 'FCO', to: 'CDG', departure: '2024-06-01', return: '2024-06-08', pref: 'Calls', price: '$299', status: 'Tracking', airline: 'AF' },
    { name: 'John Doe', from: 'NBO', to: 'JFK', departure: '2024-07-10', return: '2024-07-30', pref: 'WhatsApp', price: '$1200', status: 'In Progress', airline: 'KQ' },
    { name: 'Amara Okafor', from: 'LOS', to: 'LHR', departure: '2024-08-15', return: '2024-09-02', pref: 'Email', price: '$950', status: 'Alert Ready', airline: 'ET' }
  ];

  return (
    <main className="min-h-screen bg-slate-100 p-8 pt-24 font-sans">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
           <div>
              <span className="text-[10px] font-black text-brand-primary uppercase tracking-[0.4em] mb-2 block animate-pulse">Monitoring Live...</span>
              <h1 className="text-4xl md:text-5xl font-black text-slate-800 tracking-tighter italic">Agent <span className="text-brand-primary">Command</span></h1>
              <p className="text-slate-400 font-medium mt-2">Delaware HQ · Connected to Public Site Pulse {activities.length > 0 && <span className="text-emerald-500 font-bold ml-2">● LIVE</span>}</p>
           </div>
           <div className="flex gap-4">
              <Link href="/flights" className="bg-brand-primary text-white font-black px-8 py-4 rounded-2xl shadow-xl hover:scale-105 transition-all text-sm uppercase italic tracking-widest">New Session ✈️</Link>
           </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-12">
           
           {/* LEFT COLUMN: LIVE PULSE & LEADS */}
           <div className="lg:col-span-2 space-y-8">
              
              {/* PRICE TRACKING LEADS FEED WITH DATES & DISTANCE */}
              <div className="bg-white rounded-[3rem] shadow-xl border border-white overflow-hidden">
                 <div className="bg-brand-sidebar p-8 flex items-center justify-between border-b border-white/5">
                    <div>
                       <h2 className="text-2xl font-black text-white flex items-center gap-3 italic tracking-tight">Active Convertible Leads</h2>
                       <p className="text-white/40 text-[10px] font-black uppercase tracking-[0.2em] mt-1">Routes, Dates & Distance Metrics</p>
                    </div>
                    <div className="flex gap-2">
                       <button className="bg-white/10 text-white p-2 rounded-xl text-xs font-bold px-4 hover:bg-white/20 transition-all">Export CSV</button>
                    </div>
                 </div>
                 <div className="p-8 space-y-6">
                    {leads.map((lead, i) => {
                      const distance = getDistanceBetweenCodes(lead.from, lead.to);
                      const airline = MAJOR_AIRLINES.find(a => a.code === lead.airline);
                      
                      return (
                        <div key={i} className="group relative bg-slate-50 rounded-[2.5rem] p-6 hover:bg-white transition-all border-2 border-transparent hover:border-brand-primary/10 hover:shadow-lg">
                           <div className="flex flex-col md:flex-row justify-between gap-6">
                              <div className="flex items-center gap-6">
                                 <div className="w-16 h-16 bg-white rounded-3xl flex items-center justify-center text-3xl shadow-sm border border-slate-100 group-hover:scale-110 transition-transform">
                                    {lead.pref === 'WhatsApp' ? '💬' : lead.pref === 'Calls' ? '📞' : '✉️'}
                                 </div>
                                 <div>
                                    <h3 className="text-xl font-black text-slate-800">{lead.name}</h3>
                                    <div className="flex items-center gap-2 mt-1">
                                       <span className="text-[12px] font-black text-brand-primary bg-brand-primary/10 px-2 py-0.5 rounded uppercase tracking-wider">{lead.from} → {lead.to}</span>
                                       <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                                          {distance ? `${Math.round(distance).toLocaleString()} KM` : 'N/A Distance'}
                                       </span>
                                    </div>
                                 </div>
                              </div>
                              <div className="flex flex-col items-end justify-center">
                                 <div className="flex gap-4 mb-2">
                                    <div className="text-right">
                                       <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Dep Date</p>
                                       <p className="text-xs font-bold text-slate-700">{lead.departure}</p>
                                    </div>
                                    <div className="text-right">
                                       <p className="text-[9px] font-black text-brand-primary uppercase tracking-widest leading-none">Return Date</p>
                                       <p className="text-xs font-bold text-brand-primary">{lead.return || 'Oneway'}</p>
                                    </div>
                                 </div>
                                 <div className="flex items-center gap-3">
                                    <span className={`text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-tighter ${lead.status === 'Alert Ready' ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-200 text-slate-500'}`}>{lead.status}</span>
                                    <span className="text-xs font-bold text-slate-500">{airline?.name || 'Various Airlines'}</span>
                                 </div>
                              </div>
                           </div>
                           <div className="mt-4 pt-4 border-t border-slate-100 flex justify-between items-center">
                              <div className="text-2xl font-black text-slate-800 tracking-tighter">
                                 <span className="text-slate-400 text-sm font-medium mr-1 italic">Target:</span> {lead.price}
                              </div>
                              <button className="bg-brand-secondary text-brand-primary px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all shadow-md">Open File →</button>
                           </div>
                        </div>
                      );
                    })}
                 </div>
              </div>

              {/* WORLD TOUR INFORMATION & GLOBAL NEWS */}
              <div className="bg-slate-900 rounded-[3rem] shadow-2xl overflow-hidden border-4 border-slate-800">
                 <div className="p-8 flex items-center justify-between border-b border-white/5 bg-slate-800">
                    <div>
                       <h2 className="text-2xl font-black text-white italic tracking-tight">Global Tour Intelligence</h2>
                       <p className="text-white/40 text-[10px] font-black uppercase tracking-[0.2em] mt-1">Economic Insights & Essential Travel News</p>
                    </div>
                 </div>
                 <div className="p-8">
                    <div className="grid md:grid-cols-2 gap-6">
                       <div className="space-y-4">
                          <p className="text-[10px] font-black text-brand-secondary uppercase tracking-widest">Select Destination</p>
                          <div className="flex flex-wrap gap-2">
                             {Object.keys(DESTINATIONS).map(dest => (
                               <button 
                                 key={dest} 
                                 onClick={() => setSelectedDestination(dest)}
                                 className={`px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${selectedDestination === dest ? 'bg-brand-primary text-white shadow-lg scale-105' : 'bg-white/5 text-white/40 hover:bg-white/10'}`}
                               >
                                 {dest}
                               </button>
                             ))}
                          </div>
                       </div>
                       
                       <div className="bg-white/5 rounded-3xl p-6 border border-white/5 min-h-[300px]">
                          {selectedDestination ? (
                            <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                               <h3 className="text-2xl font-black text-brand-secondary italic mb-1">{DESTINATIONS[selectedDestination].name}</h3>
                               <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em] mb-6">{DESTINATIONS[selectedDestination].country}</p>
                               
                               <div className="space-y-6">
                                  <div>
                                     <h4 className="text-[9px] font-black text-brand-primary uppercase tracking-widest mb-1 flex items-center gap-2">
                                        <span className="w-1.5 h-1.5 bg-brand-primary rounded-full animate-pulse"></span> Economic Context
                                     </h4>
                                     <p className="text-white/70 text-sm font-medium leading-relaxed">{DESTINATIONS[selectedDestination].economicStatus}</p>
                                  </div>
                                  
                                  <div>
                                     <h4 className="text-[9px] font-black text-emerald-500 uppercase tracking-widest mb-1 flex items-center gap-2">
                                        <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span> Vital Travel Info
                                     </h4>
                                     <p className="text-white/70 text-sm font-medium leading-relaxed">{DESTINATIONS[selectedDestination].necessaryInfo}</p>
                                  </div>

                                  <div className="bg-brand-primary/10 rounded-2xl p-4 border border-brand-primary/20">
                                     <h4 className="text-[9px] font-black text-brand-primary uppercase tracking-widest mb-1">Latest News</h4>
                                     <p className="text-white/90 text-sm font-bold italic">"{DESTINATIONS[selectedDestination].news}"</p>
                                  </div>

                                  <div className="pt-2">
                                     <div className="flex flex-wrap gap-2">
                                        {DESTINATIONS[selectedDestination].highlights.map(h => (
                                          <span key={h} className="bg-white/10 text-white/60 text-[9px] font-bold px-3 py-1 rounded-full">{h}</span>
                                        ))}
                                     </div>
                                  </div>
                               </div>
                            </div>
                          ) : (
                            <div className="h-full flex flex-col items-center justify-center text-center p-8">
                               <div className="text-4xl mb-4">🌍</div>
                               <h3 className="text-white/40 font-black italic text-lg tracking-tight">Intelligence Ready</h3>
                               <p className="text-white/20 text-xs font-bold leading-relaxed mt-2">Select a global destination to view economic context and essential travel intelligence.</p>
                            </div>
                          )}
                       </div>
                    </div>
                 </div>
              </div>

           </div>

           {/* RIGHT COLUMN: PNR & STATUS */}
           <div className="space-y-8">
              
              {/* URGENT: PNR VERIFICATION */}
              <div className="bg-brand-primary rounded-[2.5rem] p-8 text-white shadow-2xl relative overflow-hidden group border-r-8 border-brand-secondary">
                 <div className="relative z-10">
                    <div className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] mb-4">Awaiting Payment</div>
                    <h3 className="text-2xl font-black mb-8 leading-tight italic">5 Verified PNRs <br/> Expiring Soon</h3>
                    
                    <div className="space-y-4">
                       {[
                         { pnr: 'Z7XY2M', route: 'NYC → LHR', time: 'Expiring in 2h' }
                       ].map(p => (
                         <div key={p.pnr} className="bg-white/10 backdrop-blur px-5 py-4 rounded-2xl border border-white/10">
                            <div className="flex justify-between items-start mb-2">
                               <span className="font-mono font-bold text-brand-secondary text-lg">{p.pnr}</span>
                               <span className="text-[9px] font-black uppercase text-white/50">{p.time}</span>
                            </div>
                            <div className="text-xs font-bold text-white/80">{p.route} Negotiated Rate</div>
                         </div>
                       ))}
                    </div>

                    <button className="w-full bg-brand-secondary text-brand-primary font-black py-4 rounded-xl mt-8 text-xs uppercase tracking-[0.2em] shadow-xl hover:scale-105 transition-all">Verify Amadeus Feed ✈️</button>
                 </div>
              </div>

              {/* LIVE INVOLVEMENT FEED (Moved from main column for better balance) */}
              <div className="bg-slate-800 rounded-[2.5rem] shadow-xl overflow-hidden border-4 border-slate-700">
                 <div className="p-6 border-b border-white/5">
                    <h2 className="text-lg font-black text-white italic tracking-tight">Activity Pulse</h2>
                 </div>
                 <div className="p-6 max-h-[300px] overflow-y-auto custom-scrollbar space-y-3 bg-slate-900/50">
                    {activities.length > 0 ? activities.slice(0, 5).map((act, i) => (
                      <div key={act.id || i} className="flex items-center gap-4 p-3 bg-white/5 rounded-2xl border border-white/5 group hover:bg-white/10 transition-all">
                             <div className="w-8 h-8 bg-brand-primary/20 rounded-lg flex items-center justify-center text-sm border border-brand-primary/30 shrink-0">
                                {act.action.includes('Flight') ? '✈️' : act.action.includes('Hotel') ? '🏨' : '🖱️'}
                             </div>
                             <div className="truncate">
                                <h3 className="text-[11px] font-bold text-white/90 truncate">{act.action}</h3>
                                <p className="text-[9px] font-bold text-white/30 uppercase tracking-widest">
                                   {new Date(act.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </p>
                             </div>
                      </div>
                    )) : (
                      <div className="p-6 text-center text-white/20 font-bold italic tracking-widest text-[10px]">Awaiting Signal...</div>
                    )}
                 </div>
              </div>

              {/* QUICK LINKS */}
              <div className="bg-slate-900 rounded-[2.5rem] p-8 grid grid-cols-2 gap-4">
                 {['CRM', 'Quotes', 'Inbox', 'Stats'].map(n => (
                   <button key={n} className="bg-white/5 hover:bg-brand-secondary hover:text-brand-primary p-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all text-white/40">
                     {n}
                   </button>
                 ))}
              </div>

           </div>
        </div>
      </div>
    </main>
  );
}
