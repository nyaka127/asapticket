'use client';
import React, { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

function CarCheckoutContent() {
  const sp = useSearchParams();
  const provider = sp.get('provider') || 'Rental Company';
  const model = sp.get('model') || 'Vehicle';
  const carClass = sp.get('class') || 'Standard';
  const location = sp.get('location') || '';
  const pickupDate = sp.get('pickupDate') || '';
  const dropoffDate = sp.get('dropoffDate') || '';
  const priceCents = parseInt(sp.get('priceCents') || '0', 10);
  const days = sp.get('days') || '1';

  const [form, setForm] = useState({ driverName: '', email: '', dob: '', licenseCountry: 'USA' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/cars/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ provider, model, carClass, location, pickupDate, dropoffDate, priceCents, days, ...form }),
      });
      if (!res.ok) throw new Error('Reservation failed');
      const { url } = await res.json();
      if (url) { window.location.href = url; return; }
      throw new Error('No URL');
    } catch (err: any) { setError(err.message); setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-extrabold text-slate-800 mb-6">Complete Car Reservation</h1>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          <form onSubmit={handleSubmit} className="md:col-span-3 bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
            <h2 className="text-lg font-bold text-slate-800 pb-3 border-b border-slate-100">Driver Details</h2>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Full Name *</label>
              <input type="text" required value={form.driverName} onChange={e => setForm({...form, driverName: e.target.value})}
                className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Email *</label>
              <input type="email" required value={form.email} onChange={e => setForm({...form, email: e.target.value})}
                className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Date of Birth</label>
              <input type="date" value={form.dob} onChange={e => setForm({...form, dob: e.target.value})}
                className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">License Country</label>
              <select value={form.licenseCountry} onChange={e => setForm({...form, licenseCountry: e.target.value})}
                className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-orange-400">
                {['USA', 'UK', 'Canada', 'Australia', 'Germany', 'France', 'UAE', 'Other'].map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            {error && <div className="bg-red-50 text-red-700 text-sm rounded-xl px-4 py-3 border border-red-200">⚠️ {error}</div>}
            <button type="submit" disabled={loading}
              className="w-full bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white font-extrabold py-4 rounded-xl text-base transition-colors flex items-center justify-center gap-2">
              {loading ? <span className="animate-pulse">Redirecting...</span> : <>🔒 Pay ${(priceCents / 100).toFixed(2)} Securely</>}
            </button>
          </form>
          <div className="md:col-span-2">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 sticky top-4">
              <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4">Rental Summary</h2>
              <div className="text-5xl text-center mb-3">🚗</div>
              <h3 className="font-extrabold text-slate-800 text-center leading-snug">{model}</h3>
              <p className="text-center text-sm text-orange-600 font-bold mb-4">{provider} · {carClass}</p>
              <div className="space-y-2 text-sm border-t border-slate-100 pt-4">
                <div className="flex justify-between"><span className="text-slate-500">Pickup</span><span className="font-bold">{location}</span></div>
                <div className="flex justify-between"><span className="text-slate-500">Pick-up Date</span><span className="font-bold">{pickupDate}</span></div>
                <div className="flex justify-between"><span className="text-slate-500">Return Date</span><span className="font-bold">{dropoffDate}</span></div>
                <div className="flex justify-between"><span className="text-slate-500">Duration</span><span className="font-bold">{days} day(s)</span></div>
                <div className="flex justify-between border-t border-slate-100 pt-3 mt-2">
                  <span className="font-extrabold text-slate-800">Total</span>
                  <span className="font-extrabold text-orange-500 text-xl">${(priceCents/100).toFixed(2)}</span>
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

export default function CarCheckoutPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center animate-pulse text-slate-400">Loading...</div>}>
      <CarCheckoutContent />
    </Suspense>
  );
}
