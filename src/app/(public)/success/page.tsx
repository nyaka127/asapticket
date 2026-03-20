import React, { Suspense } from 'react';
import Link from 'next/link';

const TYPE_CONFIG: Record<string, { icon: string; color: string; label: string; nextHref: string; nextLabel: string }> = {
  flight: { icon: '✈️', color: 'text-brand-primary', label: 'Flight Confirmed', nextHref: '/flights', nextLabel: 'Search More Flights' },
  hotel: { icon: '🏨', color: 'text-emerald-600', label: 'Hotel Reserved', nextHref: '/hotels', nextLabel: 'Find More Hotels' },
  car: { icon: '🚗', color: 'text-orange-500', label: 'Car Reserved', nextHref: '/cars', nextLabel: 'Browse More Cars' },
  tour: { icon: '🗺', color: 'text-purple-600', label: 'Tour Guide Booked', nextHref: '/tours', nextLabel: 'Book Another Tour' },
};

async function SuccessContent({ type, ref: bookingRef, name }: { type: string; ref: string; name: string }) {
  const config = TYPE_CONFIG[type] || TYPE_CONFIG.flight;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center py-16 px-4">
      <div className="w-24 h-24 rounded-full bg-green-100 flex items-center justify-center mb-6 shadow-lg shadow-green-100/60">
        <svg className="w-12 h-12 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <h1 className="text-4xl font-extrabold text-slate-800 mb-2">{config.label}! 🎉</h1>
      <p className="text-slate-500 mb-2 text-center max-w-md text-lg">Your booking has been confirmed and payment received.</p>
      <p className="text-slate-400 mb-10 text-sm">Check your email for the full details and e-ticket.</p>

      {/* Booking Card */}
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden max-w-md w-full">
        <div className="bg-brand-primary px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-brand-secondary flex items-center justify-center font-extrabold text-brand-primary text-sm">AT</div>
            <span className="font-bold text-white text-lg">ASAP Tickets</span>
          </div>
          <span className="text-brand-secondary font-bold text-sm font-mono">CONFIRMED</span>
        </div>

        <div className="p-6 text-center">
          <div className="text-6xl mb-3">{config.icon}</div>
          <h2 className={`text-xl font-extrabold mb-1 ${config.color}`}>{name || 'Your Booking'}</h2>

          {/* Ticket details separator */}
          <div className="relative my-5">
            <div className="border-t border-dashed border-slate-200"></div>
            <div className="absolute -left-6 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-slate-50 border-r border-slate-200"></div>
            <div className="absolute -right-6 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-slate-50 border-l border-slate-200"></div>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm text-left">
            <div>
              <div className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Airline Confirmation (PNR)</div>
              <div className="font-extrabold text-brand-primary font-mono text-2xl tracking-[0.2em]">{bookingRef || 'Z7XY2M'}</div>
            </div>
            <div>
              <div className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Status</div>
              <div className="inline-flex items-center gap-1.5 bg-green-100 text-green-700 font-bold text-xs px-3 py-1.5 rounded-full">
                <span className="w-2 h-2 rounded-full bg-green-500"></span> VERIFIED
              </div>
            </div>
            <div>
              <div className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Global Support</div>
              <div className="font-bold text-slate-700 text-xs tracking-tight">asap.global/help</div>
            </div>
            <div>
              <div className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Status Ping</div>
              <div className="font-bold text-slate-700 text-xs text-green-500">🟢 CONNECTED</div>
            </div>
          </div>
        </div>

        <div className="bg-slate-50 px-6 py-4 flex items-center justify-between text-xs text-slate-400 border-t border-dashed border-slate-200">
          <span>🔒 Secured by Stripe</span>
          <button className="text-brand-primary font-bold hover:underline" onClick={() => window.print()}>
            🖨 Print Confirmation
          </button>
        </div>
      </div>

      <div className="mt-8 flex flex-col sm:flex-row gap-3">
        <Link href={config.nextHref} className="bg-brand-primary text-white font-extrabold px-6 py-3.5 rounded-xl hover:bg-brand-dark transition-colors text-sm text-center">
          {config.nextLabel}
        </Link>
        <Link href="/" className="bg-white text-slate-700 font-semibold px-6 py-3.5 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors text-sm text-center">
          Back to Home
        </Link>
      </div>

      <p className="text-xs text-slate-400 mt-6 text-center">
        Need help? Contact our global hubs 24/7 or via WhatsApp.
      </p>
    </div>
  );
}

export default async function SuccessPage({ searchParams }: { searchParams: { type?: string; ref?: string; name?: string; bookingId?: string; pnr?: string } }) {
  const type = searchParams.type || (searchParams.bookingId ? 'flight' : 'flight');
  const ref = searchParams.ref || searchParams.pnr || '';
  const name = searchParams.name || '';

  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center animate-pulse text-slate-400 text-lg">Loading your confirmation...</div>}>
      <SuccessContent type={type} ref={ref} name={decodeURIComponent(name)} />
    </Suspense>
  );
}
