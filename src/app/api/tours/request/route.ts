import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { destination, date, groupSize, tourType, depositCents, name, email } = body;

    const confirmationId = Math.random().toString(36).substring(2, 9).toUpperCase();
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

    const groupLabels: Record<string, string> = { private: 'Private Tour', small: 'Small Group Tour', large: 'Large Group Tour' };
    const label = groupLabels[groupSize] || 'Tour';

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      customer_email: email || undefined,
      line_items: [{
        price_data: {
          currency: 'usd',
          product_data: {
            name: `Tour Guide Deposit: ${destination}`,
            description: `${label}${tourType ? ` · ${tourType}` : ''} · ${date}`,
          },
          unit_amount: Math.round(depositCents),
        },
        quantity: 1,
      }],
      metadata: { type: 'TOUR', confirmationId, guestName: name, destination, date, groupSize },
      success_url: `${appUrl}/success?type=tour&ref=${confirmationId}&name=${encodeURIComponent(destination)}`,
      cancel_url: `${appUrl}/tours`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error('Tour request error:', error);
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
