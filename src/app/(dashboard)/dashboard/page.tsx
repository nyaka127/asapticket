'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { DESTINATIONS } from '@/lib/tours_info';
import { CommunicationsHub } from '@/components/CommunicationsHub';

export default function AgentDashboard() {
  const [leads, setLeads] = useState<any[]>([]);
  const [selectedDestination, setSelectedDestination] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
    const [activities, setActivities] = useState<any[]>([]);

    // Periodically fetch leads and activities
    useEffect(() => {
      const fetchData = async () => {
        try {
          // Fetch Leads
          const leadsRes = await fetch('/api/leads/all');
          const leadsData = await leadsRes.json();
          setLeads(leadsData || []);

          // Fetch Activities (Traffic)
          const activitiesRes = await fetch('/api/monitor');
          const activitiesData = await activitiesRes.json();
          setActivities(activitiesData.activities || []);
        } catch (e) {
          console.error('Fetch error:', e);
        } finally {
          setLoading(false);
        }
      };

      fetchData();
      const interval = setInterval(fetchData, 10000); 
      return () => clearInterval(interval);
    }, []);

    const formatPrice = (price: number | string | null) => {
      if (!price) return 'N/A';
      const num = typeof price === 'string' ? parseFloat(price.replace(/[^0-9.]/g, '')) : price;
      return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(num);
    };

    return (
      <main className="min-h-screen bg-slate-100 p-8 pt-24 font-sans">
        <div className="max-w-7xl mx-auto">
          
          {/* Header Section */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
             <div>
                <h1 className="text-4xl md:text-5xl font-black text-slate-800 tracking-tighter italic">Agent <span className="text-brand-primary">Command</span></h1>
                <p className="text-slate-400 font-medium mt-2">Global Operations Hub · Stable Link Active</p>
             </div>
             <div className="flex gap-4">
                <Link href="/flights" className="bg-brand-primary text-white font-black px-8 py-4 rounded-2xl shadow-xl hover:scale-105 transition-all text-sm uppercase italic tracking-widest">New Session ✈️</Link>
             </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-12">
             
             {/* LEFT COLUMN: CONSOLIDATED LEADS & TRAFFIC */}
             <div className="lg:col-span-2 space-y-8">
                
                {/* Leads Section */}
                <div className="bg-white rounded-[3rem] shadow-xl border border-white overflow-hidden">
                   <div className="bg-brand-sidebar p-8 flex items-center justify-between border-b border-white/5">
                      <div>
                         <h2 className="text-2xl font-black text-white flex items-center gap-3 italic tracking-tight">Recent Intelligence</h2>
                         <p className="text-white/40 text-[10px] font-black uppercase tracking-[0.2em] mt-1">Consolidated Booking & Enquiry Feed</p>
                      </div>
                      <Link href="/dashboard/leads" className="bg-white/10 text-white p-2 rounded-xl text-[10px] font-black uppercase tracking-widest px-4 hover:bg-white/20 transition-all">View All</Link>
                   </div>
                   <div className="p-8 space-y-6">
                      {loading ? (
                         <div className="py-20 text-center text-slate-300 font-black uppercase italic tracking-widest">Awaiting Data Uplink...</div>
                      ) : leads.length === 0 ? (
                         <div className="py-20 text-center text-slate-300 font-black uppercase italic tracking-widest">No Recent Activity</div>
                      ) : (
                         leads.slice(0, 5).map((lead, i) => (
                           <div key={lead.id || i} className="group bg-slate-50 rounded-[2.5rem] p-6 hover:bg-white transition-all border-2 border-transparent hover:border-brand-primary/10 hover:shadow-lg">
                              <div className="flex flex-col md:flex-row justify-between gap-6">
                                 <div className="flex items-center gap-6">
                                    <div className="w-16 h-16 bg-white rounded-3xl flex items-center justify-center text-3xl shadow-sm border border-slate-100 group-hover:scale-110 transition-transform">
                                       {lead.type === 'BOOKING' ? '🎫' : '✉️'}
                                    </div>
                                    <div>
                                       <h3 className="text-xl font-black text-slate-800 uppercase italic tracking-tighter">{lead.name}</h3>
                                       <div className="flex items-center gap-2 mt-1">
                                          <span className="text-[10px] font-black text-brand-primary bg-brand-primary/5 px-2 py-0.5 rounded uppercase tracking-widest">
                                             {lead.route}
                                          </span>
                                          <span className="text-[9px] text-slate-300 font-bold uppercase">{new Date(lead.createdAt).toLocaleDateString()}</span>
                                       </div>
                                    </div>
                                 </div>
                                 <div className="flex flex-col items-end justify-center text-right">
                                    <div className="flex items-center gap-3">
                                       <span className={`text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-tighter ${lead.status === 'NEW' ? 'bg-orange-100 text-orange-600' : 'bg-emerald-100 text-emerald-600'}`}>
                                          {lead.status}
                                       </span>
                                       <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{lead.type}</span>
                                    </div>
                                    <div className="text-xl font-black text-slate-800 mt-2 tracking-tighter">
                                       {formatPrice(lead.amount)}
                                    </div>
                                 </div>
                              </div>
                           </div>
                         ))
                      )}
                      <Link href="/dashboard/leads" className="block text-center py-4 bg-slate-50 rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] text-slate-400 hover:bg-brand-primary/5 hover:text-brand-primary transition-all">
                         Access Master Lead Database →
                      </Link>
                   </div>
                </div>

                {/* Live Traffic Feed */}
                <div className="bg-white rounded-[3rem] shadow-xl border border-white overflow-hidden">
                   <div className="bg-slate-900 p-8 flex items-center justify-between border-b border-white/5">
                      <div>
                         <h2 className="text-2xl font-black text-white flex items-center gap-3 italic tracking-tight italic">Live Traffic Uplink</h2>
                         <p className="text-white/40 text-[10px] font-black uppercase tracking-[0.2em] mt-1">Real-time Visitor Interaction Log</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                        <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Global Link Secure</span>
                      </div>
                   </div>
                   <div className="p-8 space-y-4">
                      {activities.length === 0 ? (
                        <div className="py-12 text-center text-slate-300 font-black uppercase italic tracking-widest">Waiting for traffic data...</div>
                      ) : (
                        activities.slice(0, 10).map((activity, i) => (
                          <div key={activity.id || i} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-transparent hover:border-slate-100 transition-all">
                            <div className="flex items-center gap-4">
                              <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-lg shadow-sm">
                                {activity.action.includes('flights') ? '✈️' : activity.action.includes('hotels') ? '🏨' : '👤'}
                              </div>
                              <div>
                                <div className="text-xs font-black text-slate-800 uppercase tracking-tight">{activity.action}</div>
                                <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest italic">{activity.source} · {new Date(activity.timestamp).toLocaleTimeString()}</div>
                              </div>
                            </div>
                            <div className="text-[9px] font-black text-emerald-500 bg-emerald-500/5 px-2 py-1 rounded">LIVE UPDATING</div>
                          </div>
                        ))
                      )}
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
                               </div>
                            </div>
                          ) : (
                            <div className="h-full flex flex-col items-center justify-center text-center p-8">
                               <div className="text-4xl mb-4">🌍</div>
                               <h3 className="text-white/40 font-black italic text-lg tracking-tight">Intelligence Ready</h3>
                               <p className="text-white/20 text-xs font-bold leading-relaxed mt-2">Select a global destination to view economic context and travel news.</p>
                            </div>
                          )}
                       </div>
                    </div>
                 </div>
              </div>

           </div>

           {/* RIGHT COLUMN: DISTRIBUTION & TOOLS */}
           <div className="space-y-8">
              
              <div className="bg-brand-primary rounded-[3rem] p-10 text-white shadow-2xl relative overflow-hidden group">
                 <div className="relative z-10">
                    <h3 className="text-2xl font-black italic tracking-tighter mb-8 leading-tight uppercase">Lead Distribution</h3>
                    
                    <div className="space-y-8">
                       <div>
                          <div className="flex justify-between items-end mb-2">
                             <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">Bookings</span>
                             <span className="text-xl font-black italic text-brand-secondary">{leads.filter(l => l.type === 'BOOKING').length}</span>
                          </div>
                          <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                             <div className="bg-brand-secondary h-full transition-all duration-1000" style={{ width: `${(leads.filter(l => l.type === 'BOOKING').length / (leads.length || 1)) * 100}%` }}></div>
                          </div>
                       </div>
                       <div>
                          <div className="flex justify-between items-end mb-2">
                             <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">Enquiries</span>
                             <span className="text-xl font-black italic text-white/80">{leads.filter(l => l.type === 'ENQUIRY').length}</span>
                          </div>
                          <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                             <div className="bg-white/40 h-full transition-all duration-1000" style={{ width: `${(leads.filter(l => l.type === 'ENQUIRY').length / (leads.length || 1)) * 100}%` }}></div>
                          </div>
                       </div>
                    </div>

                    <button className="w-full bg-slate-900 text-white font-black py-5 rounded-[2rem] mt-10 text-[10px] uppercase tracking-[0.3em] shadow-2xl hover:bg-black transition-all">Verify Amadeus Feed ✈️</button>
                 </div>
              </div>

              <div className="bg-slate-900 rounded-[3rem] p-8 grid grid-cols-2 gap-4">
                 {['Admin', 'Settings', 'Inbox', 'Support'].map(n => (
                   <button key={n} className="bg-white/5 hover:bg-brand-secondary hover:text-brand-primary p-4 rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest transition-all text-white/40">
                     {n}
                   </button>
                 ))}
                 <Link href="/dashboard/leads" className="col-span-2 bg-brand-primary/10 text-brand-primary hover:bg-brand-primary hover:text-white p-5 rounded-[2rem] text-[11px] font-black uppercase tracking-widest transition-all text-center border border-brand-primary/20 italic">
                    Master Database →
                 </Link>
              </div>

           </div>
        </div>
      </div>
    </main>
  );
}
