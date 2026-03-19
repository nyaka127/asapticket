import { Suspense } from 'react';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';

async function SuccessContent({ bookingId, pnr }: { bookingId: string; pnr: string }) {
  let booking = null;

  if (bookingId) {
    try {
      booking = await prisma.flightBooking.findUnique({ where: { id: bookingId } });
    } catch {
      // DB not ready or invalid ID
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center py-16 px-4">
      {/* Success Icon */}
      <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mb-6 shadow-lg shadow-green-100">
        <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
        </svg>
      </div>

      <h1 className="text-3xl font-extrabold text-slate-800 mb-2">Booking Confirmed!</h1>
      <p className="text-slate-500 mb-8 text-center max-w-md">
        Your flight has been booked. Check your email for the full confirmation.
      </p>

      {/* E-Ticket */}
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden max-w-lg w-full">
        {/* Header stripe */}
        <div className="bg-brand-primary px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-brand-secondary flex items-center justify-center font-extrabold text-brand-primary text-xs">AT</div>
            <span className="font-bold text-white">ASAP Tickets</span>
          </div>
          <span className="text-brand-secondary font-mono text-sm font-bold">E-TICKET</span>
        </div>

        {/* Flight Details */}
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="text-center">
              <div className="text-3xl font-extrabold text-slate-800">{booking?.origin || '---'}</div>
              <div className="text-xs text-slate-400 uppercase mt-1">Departure</div>
              {booking?.departureTime && (
                <div className="text-sm font-medium text-slate-600 mt-1">
                  {new Date(booking.departureTime).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                </div>
              )}
            </div>
            <div className="flex flex-col items-center text-slate-300">
              <svg className="w-8 h-8 text-brand-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              <div className="text-xs text-slate-400 mt-1">Nonstop</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-extrabold text-slate-800">{booking?.destination || '---'}</div>
              <div className="text-xs text-slate-400 uppercase mt-1">Arrival</div>
              {booking?.arrivalTime && (
                <div className="text-sm font-medium text-slate-600 mt-1">
                  {new Date(booking.arrivalTime).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                </div>
              )}
            </div>
          </div>

          {/* Dashed separator like a real ticket tear */}
          <div className="relative my-4">
            <div className="border-t border-dashed border-slate-200"></div>
            <div className="absolute -left-6 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-slate-50 border-r border-slate-200"></div>
            <div className="absolute -right-6 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-slate-50 border-l border-slate-200"></div>
          </div>

          {/* Info Grid */}
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div>
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Passenger</div>
              <div className="font-bold text-slate-800">{booking?.passengerName || pnr ? 'Confirmed' : '—'}</div>
            </div>
            <div>
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">PNR / Booking Ref.</div>
              <div className="font-bold text-brand-primary font-mono text-lg tracking-widest">{booking?.pnr || pnr || '—'}</div>
            </div>
            <div>
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Airline</div>
              <div className="font-semibold text-slate-800">{booking?.airline || '—'}</div>
            </div>
            <div>
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Cabin</div>
              <div className="font-semibold text-slate-800">{booking?.cabin || 'ECONOMY'}</div>
            </div>
            <div>
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Status</div>
              <div className="inline-flex items-center gap-1.5 bg-green-100 text-green-700 font-semibold text-sm px-2.5 py-1 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                {booking?.status || 'CONFIRMED'}
              </div>
            </div>
            <div>
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Total Paid</div>
              <div className="font-extrabold text-brand-primary">${booking ? (booking.priceCents / 100).toFixed(2) : '—'}</div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-50 px-6 py-4 flex items-center justify-between text-xs text-slate-400 border-t border-dashed border-slate-200">
          <span>Payment secured by Stripe 🔒</span>
          <button className="text-brand-primary font-semibold hover:underline" onClick={() => window.print()}>
            🖨 Print Ticket
          </button>
        </div>
      </div>

      <div className="mt-8 flex gap-4">
        <Link href="/flights" className="bg-brand-primary text-white font-bold px-6 py-3 rounded-xl hover:bg-brand-dark transition-colors text-sm">
          Search More Flights
        </Link>
        <Link href="/" className="bg-white text-slate-700 font-semibold px-6 py-3 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors text-sm">
          Back to Home
        </Link>
      </div>

      <p className="text-xs text-slate-400 mt-6 text-center max-w-sm">
        A confirmation has been sent to {booking?.passengerEmail || 'your email'}. For support, call <a href="tel:+18669617260" className="underline">+1 866 961 7260</a>.
      </p>
    </div>
  );
}

export default async function SuccessPage({ searchParams }: { searchParams: { bookingId?: string; pnr?: string } }) {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="animate-pulse text-slate-400">Loading your ticket...</div></div>}>
      <SuccessContent bookingId={searchParams.bookingId || ''} pnr={searchParams.pnr || ''} />
    </Suspense>
  );
}
