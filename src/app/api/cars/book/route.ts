import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { provider, model, carClass, location, pickupDate, dropoffDate, priceCents, days, driverName, email } = body;

    const confirmationId = Math.random().toString(36).substring(2, 9).toUpperCase();
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

    const stripeKey = process.env.STRIPE_SECRET_KEY;
    const successUrl = `${appUrl}/success?type=car&ref=${confirmationId}&name=${encodeURIComponent(provider)}`;

    if (!stripeKey || stripeKey.startsWith('sk_test_paste')) {
      // IF STRIPE IS NOT CONFIGURED, REDIRECT TO SUCCESS PAGE (SIMULATED APPROVAL)
      return NextResponse.json({ url: successUrl });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      customer_email: email || undefined,
      line_items: [{
        price_data: {
          currency: 'usd',
          product_data: {
            name: `Car Rental: ${provider}`,
            description: `${model} (${carClass}) · ${location} · ${days} day(s)`,
          },
          unit_amount: Math.round(priceCents),
        },
        quantity: 1,
      }],
      metadata: { type: 'CAR', confirmationId, driverName, provider, location, pickupDate, dropoffDate },
      success_url: successUrl,
      cancel_url: `${appUrl}/cars`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error('Car book error:', error);
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
