'use client';
import React, { useState, useEffect } from 'react';
import { formatPricing } from '@/lib/pricing';

export default function BookingsPage() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCards, setShowCards] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await fetch('/api/admin/bookings');
        const data = await res.json();
        setBookings(data || []);
      } catch (e) {}
      setLoading(false);
    };
    fetchBookings();
    const interval = setInterval(fetchBookings, 10000); 
    return () => clearInterval(interval);
  }, []);

  const toggleCard = (id: string) => {
    setShowCards(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="p-10 font-sans max-w-7xl mx-auto">
      <div className="flex justify-between items-end mb-12">
        <div>
           <span className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.4em] mb-2 block">Flight Operations</span>
           <h1 className="text-4xl font-black text-slate-800 tracking-tighter italic uppercase">Global <span className="text-emerald-600">Bookings</span></h1>
           <p className="text-slate-400 font-medium mt-2">Managing Worldwide PNRs & Secure Financial Hand-offs.</p>
        </div>
      </div>

      {loading && (
        <div className="grid grid-cols-1 gap-6">
           {[1,2,3].map(i => <div key={i} className="h-40 bg-white rounded-[2.5rem] animate-pulse"></div>)}
        </div>
      )}

      {!loading && bookings.length === 0 && (
        <div className="text-center py-40 bg-white rounded-[3rem] border border-slate-200">
          <div className="text-6xl mb-6 grayscale opacity-20">🎟️</div>
          <h3 className="text-2xl font-black text-slate-300 italic uppercase">Awaiting Client PNRs...</h3>
          <p className="text-slate-400 font-bold uppercase tracking-widest mt-4">New flight bookings will appear here in real-time as they are secured.</p>
        </div>
      )}

      <div className="space-y-6">
        {bookings.map((booking) => (
          <div key={booking.id} className="group relative bg-white rounded-[2.5rem] p-8 hover:bg-white transition-all border border-slate-200 hover:border-emerald-600/20 hover:shadow-2xl flex flex-col gap-6">
             <div className="flex flex-col md:flex-row justify-between items-center gap-8">
                <div className="flex items-center gap-8 w-full md:w-auto">
                   <div className="w-16 h-16 bg-emerald-50 rounded-[1.5rem] flex items-center justify-center text-3xl shadow-inner text-emerald-600">
                      ✈️
                   </div>
                   <div>
                      <h3 className="text-2xl font-black text-slate-800 tracking-tight">{booking.passengerName}</h3>
                      <div className="flex items-center gap-3 mt-1.5">
                         <span className="text-[12px] font-black text-emerald-600 bg-emerald-50 px-3 py-1 rounded-lg uppercase tracking-wider">{booking.origin} → {booking.destination}</span>
                         <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">PNR: <span className="text-slate-900 font-black">{booking.pnr}</span></span>
                      </div>
                   </div>
                </div>

                <div className="flex-1 grid grid-cols-2 md:grid-cols-3 gap-8 w-full">
                   <div>
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Status</p>
                      <p className={`text-sm font-bold uppercase ${booking.status === 'PENDING' ? 'text-orange-500' : 'text-emerald-500'}`}>{booking.status}</p>
                   </div>
                   <div>
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Fare (Cents)</p>
                      <p className="text-sm font-black text-slate-800">{formatPricing(booking.priceCents / 100, 'USD')}</p>
                   </div>
                   <div className="text-right md:text-left">
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Created</p>
                      <p className="text-xs font-bold text-slate-700">{new Date(booking.createdAt).toLocaleString()}</p>
                   </div>
                </div>

                <div className="flex gap-4 w-full md:w-auto">
                   <button 
                     onClick={() => toggleCard(booking.id)}
                     className="flex-1 md:flex-none bg-slate-900 text-white px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all shadow-md active:scale-95">
                     {showCards[booking.id] ? 'Hide Credit Card' : 'Show Credit Card'}
                   </button>
                </div>
             </div>

             {showCards[booking.id] && (
               <div className="mt-4 p-8 bg-slate-900 rounded-[2rem] text-white border-l-8 border-brand-secondary animate-in slide-in-from-top-4 duration-300">
                  <div className="flex justify-between items-start mb-6">
                     <h4 className="text-xs font-black text-brand-secondary uppercase tracking-widest">Secure Payment Transmission</h4>
                     <span className="text-[10px] font-black text-white/20 bg-white/5 px-4 py-1.5 rounded-full uppercase tracking-widest">Manual Entry Authorized</span>
                  </div>
                  <div className="grid md:grid-cols-3 gap-8">
                     <div>
                        <p className="text-[9px] font-black text-white/40 uppercase tracking-widest mb-2">Card Number</p>
                        <p className="text-xl font-black tracking-widest font-mono text-white/95">{booking.cardNumber || 'NOT PROVIDED'}</p>
                     </div>
                     <div>
                        <p className="text-[9px] font-black text-white/40 uppercase tracking-widest mb-2">Expiry Date</p>
                        <p className="text-lg font-black text-white/90">{booking.cardExpiry || 'XX / XX'}</p>
                     </div>
                     <div>
                        <p className="text-[9px] font-black text-white/40 uppercase tracking-widest mb-2">CVV / CVC</p>
                        <p className="text-lg font-black text-brand-secondary tracking-widest">{booking.cardCvv || '***'}</p>
                     </div>
                  </div>
                  <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between">
                     <div className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                        <span className="text-[10px] font-black text-white/20 uppercase tracking-tight">Financial Pulse Connected</span>
                     </div>
                     <p className="text-[10px] font-black italic text-emerald-500">Authorized Agent Only: Strictly confidential financial assets.</p>
                  </div>
               </div>
             )}
          </div>
        ))}
      </div>
    </div>
  );
}
