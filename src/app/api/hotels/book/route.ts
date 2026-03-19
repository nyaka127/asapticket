import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, city, checkIn, checkOut, priceCents, nights, guests, guestName, email, roomType, specialReqs } = body;

    const confirmationId = Math.random().toString(36).substring(2, 10).toUpperCase();
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      customer_email: email || undefined,
      line_items: [{
        price_data: {
          currency: 'usd',
          product_data: {
            name: `Hotel: ${name}`,
            description: `${city} · ${roomType} · ${nights} night(s) · ${guests} guest(s)`,
          },
          unit_amount: Math.round(priceCents),
        },
        quantity: 1,
      }],
      metadata: { type: 'HOTEL', confirmationId, guestName, city, checkIn, checkOut },
      success_url: `${appUrl}/success?type=hotel&ref=${confirmationId}&name=${encodeURIComponent(name)}`,
      cancel_url: `${appUrl}/hotels`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error('Hotel book error:', error);
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
