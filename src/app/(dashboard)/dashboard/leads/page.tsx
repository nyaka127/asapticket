'use client';
import React, { useState, useEffect } from 'react';
import { getDistanceBetweenCodes } from '@/lib/geo';
import { MAJOR_AIRLINES } from '@/lib/airlines';
import { calculateClientPrice, formatPricing } from '@/lib/pricing';

export default function LeadsPage() {
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeads = async () => {
      try {
        const res = await fetch('/api/leads');
        const data = await res.json();
        setLeads(data || []);
      } catch (e) {}
      setLoading(false);
    };
    fetchLeads();
    const interval = setInterval(fetchLeads, 10000); // Poll every 10s
    return () => clearInterval(interval);
  }, []);

  const formatPrice = (price: number | string | null) => {
    if (!price) return 'N/A';
    const num = typeof price === 'string' ? parseFloat(price.replace(/[^0-9.]/g, '')) : price;
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(num);
  };

  return (
    <div className="p-10 font-sans max-w-7xl mx-auto">
      <div className="flex justify-between items-end mb-12">
        <div>
           <span className="text-[10px] font-black text-brand-primary uppercase tracking-[0.4em] mb-2 block">Global CRM</span>
           <h1 className="text-4xl font-black text-slate-800 tracking-tighter italic uppercase">Convertible <span className="text-brand-primary">Leads</span></h1>
           <p className="text-slate-400 font-medium mt-2">Managing global signal pulse from our Worldwide hubs.</p>
        </div>
        <div className="flex gap-4">
           <button className="bg-slate-900 text-white font-black px-8 py-3.5 rounded-2xl shadow-xl hover:scale-105 transition-all text-[10px] uppercase tracking-widest">Global Export</button>
        </div>
      </div>

      {loading && (
        <div className="grid grid-cols-1 gap-6">
           {[1,2,3].map(i => <div key={i} className="h-40 bg-white rounded-[2.5rem] animate-pulse"></div>)}
        </div>
      )}

      {!loading && leads.length === 0 && (
        <div className="text-center py-40 bg-white rounded-[3rem] border border-slate-200">
          <div className="text-6xl mb-6 grayscale opacity-20">📡</div>
          <h3 className="text-2xl font-black text-slate-300 italic uppercase">Awaiting Global Signal...</h3>
          <p className="text-slate-400 font-bold uppercase tracking-widest mt-4">New leads from the client site will appear here in real-time.</p>
        </div>
      )}

      <div className="space-y-6">
        {leads.map((lead, i) => {
          const fromCode = lead.origin || 'NYC';
          const toCode = lead.targetDestination || 'LHR';
          const distance = getDistanceBetweenCodes(fromCode, toCode);
          
          return (
            <div key={lead.id || i} className="group relative bg-white rounded-[2.5rem] p-8 hover:bg-white transition-all border border-slate-200 hover:border-brand-primary/20 hover:shadow-2xl flex flex-col md:flex-row justify-between items-center gap-8">
               <div className="flex items-center gap-8 w-full md:w-auto">
                  <div className="w-20 h-20 bg-slate-50 rounded-[2rem] flex items-center justify-center text-4xl shadow-inner group-hover:bg-brand-primary/5 transition-colors">
                     {lead.contactMethod === 'WhatsApp' ? '💬' : lead.contactMethod === 'Calls' ? '📞' : '✉️'}
                  </div>
                  <div>
                     <h3 className="text-2xl font-black text-slate-800 tracking-tight">{lead.name}</h3>
                     <div className="flex items-center gap-3 mt-1.5">
                        <span className="text-[12px] font-black text-brand-primary bg-brand-primary/10 px-3 py-1 rounded-lg uppercase tracking-wider">{fromCode} → {toCode}</span>
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                           {distance ? `${Math.round(distance).toLocaleString()} KM METRIC` : 'Calculating...'}
                        </span>
                     </div>
                  </div>
               </div>

               <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-8 w-full">
                  <div>
                     <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Captured</p>
                     <p className="text-sm font-bold text-slate-700">{new Date(lead.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div>
                     <p className="text-[9px] font-black text-brand-primary uppercase tracking-widest mb-1 leading-none">Status</p>
                     <p className={`text-sm font-bold uppercase ${lead.status === 'NEW' ? 'text-orange-500' : 'text-emerald-500'}`}>{lead.status}</p>
                  </div>
                  <div>
                     <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Method</p>
                     <p className="text-sm font-bold text-slate-700">{lead.contactMethod}</p>
                  </div>
                  <div className="text-right md:text-left">
                     <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Budget</p>
                     <p className="text-sm font-black text-slate-800">{formatPrice(lead.targetPrice)}</p>
                  </div>
               </div>

               <div className="flex gap-4 w-full md:w-auto">
                  <button className="flex-1 md:flex-none bg-brand-secondary text-brand-primary px-8 py-4 rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all shadow-md active:scale-95">Open Record</button>
                  <button className="p-4 bg-slate-100 rounded-[1.5rem] hover:bg-slate-200 transition-colors">🔄</button>
               </div>
            </div>
          );
        })}
      </div>
      
      <div className="mt-20 pt-10 border-t border-slate-100 flex justify-between items-center opacity-40">
        <div className="text-[9px] font-black uppercase tracking-widest text-slate-400 italic">Connected to Worldwide Global Gateway</div>
        <div className="flex gap-6 text-[9px] font-black uppercase tracking-widest text-slate-400">
          <span>GDPR Compliant</span>
          <span>Loss-Guard Active</span>
        </div>
      </div>
    </div>
  );
}
