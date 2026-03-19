'use client';
import React, { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

function HotelCheckoutContent() {
  const sp = useSearchParams();
  const name = sp.get('name') || 'Hotel';
  const city = sp.get('city') || '';
  const checkIn = sp.get('checkIn') || '';
  const checkOut = sp.get('checkOut') || '';
  const priceCents = parseInt(sp.get('priceCents') || '0', 10);
  const nights = parseInt(sp.get('nights') || '1', 10);
  const guests = sp.get('guests') || '1';

  const [form, setForm] = useState({ guestName: '', email: '', roomType: 'Standard King', specialReqs: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/hotels/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, city, checkIn, checkOut, priceCents, nights, guests, ...form }),
      });
      if (!res.ok) throw new Error('Booking failed');
      const { url } = await res.json();
      if (url) { window.location.href = url; return; }
      throw new Error('No URL');
    } catch (err: any) { setError(err.message); setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-extrabold text-slate-800 mb-6">Complete Hotel Reservation</h1>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          <form onSubmit={handleSubmit} className="md:col-span-3 bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
            <h2 className="text-lg font-bold text-slate-800 pb-3 border-b border-slate-100">Guest Details</h2>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Full Name *</label>
              <input type="text" required value={form.guestName} onChange={e => setForm({...form, guestName: e.target.value})}
                className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Email *</label>
              <input type="email" required value={form.email} onChange={e => setForm({...form, email: e.target.value})}
                className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Room Type</label>
              <select value={form.roomType} onChange={e => setForm({...form, roomType: e.target.value})}
                className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500">
                <option>Standard King</option><option>Standard Queen</option>
                <option>Deluxe King</option><option>Suite</option><option>Double Room</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Special Requests</label>
              <input type="text" value={form.specialReqs} onChange={e => setForm({...form, specialReqs: e.target.value})}
                placeholder="e.g. high floor, early check-in..."
                className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
            </div>
            {error && <div className="bg-red-50 text-red-700 text-sm rounded-xl px-4 py-3 border border-red-200">⚠️ {error}</div>}
            <button type="submit" disabled={loading}
              className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white font-extrabold py-4 rounded-xl text-base transition-colors flex items-center justify-center gap-2">
              {loading ? <span className="animate-pulse">Redirecting...</span> : <>🔒 Pay ${(priceCents / 100).toFixed(2)} Securely</>}
            </button>
          </form>
          <div className="md:col-span-2">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 sticky top-4">
              <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4">Booking Summary</h2>
              <div className="text-4xl text-center mb-3">🏨</div>
              <h3 className="font-extrabold text-slate-800 text-center mb-1">{name}</h3>
              <p className="text-center text-sm text-slate-500 mb-4">{city}</p>
              <div className="space-y-2 text-sm border-t border-slate-100 pt-4">
                <div className="flex justify-between"><span className="text-slate-500">Check-In</span><span className="font-bold">{checkIn}</span></div>
                <div className="flex justify-between"><span className="text-slate-500">Check-Out</span><span className="font-bold">{checkOut}</span></div>
                <div className="flex justify-between"><span className="text-slate-500">Nights</span><span className="font-bold">{nights}</span></div>
                <div className="flex justify-between"><span className="text-slate-500">Guests</span><span className="font-bold">{guests}</span></div>
                <div className="flex justify-between border-t border-slate-100 pt-3 mt-2">
                  <span className="font-extrabold text-slate-800">Total</span>
                  <span className="font-extrabold text-emerald-600 text-xl">${(priceCents/100).toFixed(2)}</span>
                </div>
              </div>
              <p className="text-xs text-slate-400 mt-4 text-center">🔒 Secured by Stripe</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function HotelCheckoutPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center animate-pulse text-slate-400">Loading...</div>}>
      <HotelCheckoutContent />
    </Suspense>
  );
}
