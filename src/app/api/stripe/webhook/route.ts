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

    // Support both dynamic sessions (metadata) and static payment links (client_reference_id)
    const bookingId = object.client_reference_id || object.metadata?.bookingId;

    if (bookingId) {
      // 1. Try updating Flight Booking
      try {
        await prisma.flightBooking.update({
          where: { id: bookingId },
          data: {
            status: 'CONFIRMED',
            paymentStatus: 'PAID',
            stripePaymentIntentId: typeof object.payment_intent === 'string' ? object.payment_intent : object.id,
          },
        });
        console.log(`✅ Flight Booking ${bookingId} confirmed via Stripe webhook`);
        return NextResponse.json({ received: true });
      } catch (e) { /* Not a flight booking, try others */ }

      // 2. Try updating Hotel Booking
      try {
        await prisma.hotelBooking.update({
          where: { id: bookingId },
          data: {
            status: 'CONFIRMED',
          },
        });
        console.log(`✅ Hotel Booking ${bookingId} confirmed via Stripe webhook`);
        return NextResponse.json({ received: true });
      } catch (e) { /* Not a hotel booking */ }

      // 3. Try updating Car Booking
      try {
        await prisma.carBooking.update({
          where: { id: bookingId },
          data: {
            status: 'CONFIRMED',
          },
        });
        console.log(`✅ Car Booking ${bookingId} confirmed via Stripe webhook`);
        return NextResponse.json({ received: true });
      } catch (e) { /* Not a car booking */ }
    }
  }

  return NextResponse.json({ received: true });
}
