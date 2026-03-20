import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { prisma } from '@/lib/prisma';
import Stripe from 'stripe';


export async function POST(request: Request) {
  const body = await request.text();
  const sig = request.headers.get('stripe-signature');

  if (!sig) {
    return NextResponse.json({ error: 'Missing stripe-signature header' }, { status: 400 });
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret || webhookSecret.startsWith('whsec_YOUR')) {
    console.warn('⚠️  STRIPE_WEBHOOK_SECRET not configured — skipping webhook verification in dev');
    return NextResponse.json({ received: true });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  // Handle both Checkout Sessions and direct Payment Intents for full compliance
  if (event.type === 'checkout.session.completed' || event.type === 'payment_intent.succeeded') {
    const object = event.data.object as any;

    // The bookingId must be attached to the metadata when creating the payment intent/session
    const bookingId = object.metadata?.bookingId;

    if (bookingId) {
      await prisma.flightBooking.update({
        where: { id: bookingId },
        data: {
          status: 'CONFIRMED',
          // For a payment_intent, the ID is object.id. For a checkout.session, it's object.payment_intent.
          stripePaymentIntentId: typeof object.payment_intent === 'string' ? object.payment_intent : object.id,
        },
      });
      console.log(`✅ Booking ${bookingId} confirmed via Stripe webhook`);
    }
  }

  return NextResponse.json({ received: true });
}
