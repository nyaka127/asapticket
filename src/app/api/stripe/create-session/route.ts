import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const { bookingId } = await request.json();
    if (!bookingId) return NextResponse.json({ error: 'bookingId required' }, { status: 400 });

    const booking = await prisma.flightBooking.findUnique({ where: { id: bookingId } });
    if (!booking) return NextResponse.json({ error: 'Booking not found' }, { status: 404 });

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      customer_email: (booking as any).passengerEmail || undefined,
      line_items: [{
        price_data: {
          currency: 'usd',
          product_data: {
            name: `Flight: ${booking.origin} → ${booking.destination}`,
            description: `${booking.airline} ${booking.flightNumber} · ${(booking as any).cabin || 'ECONOMY'} · ${(booking as any).passengers || 1} Pax`,
          },
          unit_amount: booking.priceCents,
        },
        quantity: 1,
      }],
      metadata: { bookingId: booking.id, pnr: booking.pnr || '' },
      success_url: `${appUrl}/success?type=flight&ref=${booking.pnr}&name=${encodeURIComponent(booking.airline + ' ' + booking.origin + '-' + booking.destination)}`,
      cancel_url: `${appUrl}/flights?cancelled=true`,
    });

    await prisma.flightBooking.update({
      where: { id: booking.id },
      data: { stripeSessionId: session.id } as any,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error('Stripe session error:', error);
    return NextResponse.json({ error: 'Failed to create payment session' }, { status: 500 });
  }
}
