import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { prisma } from '@/lib/prisma';

// Stripe requires the raw body for webhook signature verification
export const config = {
  api: { bodyParser: false },
};

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

  let event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as any;
    const bookingId = session.metadata?.bookingId;

    if (bookingId) {
      await prisma.flightBooking.update({
        where: { id: bookingId },
        data: {
          status: 'CONFIRMED',
          stripePaymentIntentId: session.payment_intent || null,
        },
      });
      console.log(`✅ Booking ${bookingId} confirmed via Stripe webhook`);
    }
  }

  return NextResponse.json({ received: true });
}
