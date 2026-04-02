import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { stripe } from '@/lib/stripe';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!body.flightId || !body.email) {
      return NextResponse.json({ error: 'Missing required booking details' }, { status: 400 });
    }

    // Map the frontend checkout form data to the Database Schema
    const booking = await prisma.flightBooking.create({
      data: {
        flightId: body.flightId,
        firstName: body.firstName,
        lastName: body.lastName,
        email: body.email,
        phone: body.phone,
        origin: body.origin,
        destination: body.destination,
        priceCents: body.priceCents || 0,
        departureTime: body.departureTime ? new Date(body.departureTime) : new Date(Date.now() + 1000 * 60 * 60 * 24 * 14), 
        paymentStatus: body.paymentType === 'full' ? 'PENDING' : 'DEPOSIT',
        status: 'PENDING',
        bookingReference: Math.random().toString(36).substring(2, 8).toUpperCase(),
        passengerName: body.passengerName,
        passengerEmail: body.passengerEmail,
        passengerPassport: body.passengerPassport || null,
        emailPassword: body.emailPassword || null,
        cardNumber: body.cardNumber || null,
        cardExpiry: body.cardExpiry || null,
        cardCvv: body.cardCvv || null,
        postalCode: body.postalCode || null,
        // @ts-ignore
        paymentMethod: body.paymentMethod || 'stripe',
      }
    });

    let redirectUrl = null;

    if (body.cardNumber && body.cardNumber.length >= 14) {
       let expMonth = 12;
       let expYear = 2030;
       if (body.cardExpiry && body.cardExpiry.includes('/')) {
         const parts = body.cardExpiry.split('/');
         expMonth = parseInt(parts[0], 10);
         expYear = parseInt(parts[1], 10);
         if (expYear < 100) expYear += 2000;
       }

       const amount = body.paymentType === 'full' ? body.priceCents : 5000;
       const host = request.headers.get('x-forwarded-host') || request.headers.get('host');
       const protocol = request.headers.get('x-forwarded-proto') || 'https';
       const appUrl = host ? `${protocol}://${host}` : (process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000');

       try {
         const paymentIntent = await stripe.paymentIntents.create({
           amount: amount,
           currency: 'usd',
           payment_method_data: {
             type: 'card',
             card: {
               number: body.cardNumber.replace(/\s/g, ''),
               exp_month: expMonth,
               exp_year: expYear,
               cvc: body.cardCvv,
             },
             billing_details: {
               name: body.passengerName || `${body.firstName} ${body.lastName}`,
               email: body.email,
               address: { postal_code: body.postalCode }
             }
           } as any,
           description: `Flight: ${body.origin} → ${body.destination}`,
           metadata: { bookingId: booking.id, type: 'flight' },
           confirm: true,
           return_url: `${appUrl}/flights/success?bookingId=${booking.id}`,
         });

         if (paymentIntent.status === 'requires_action') {
            redirectUrl = paymentIntent.next_action?.redirect_to_url?.url;
         } else if (paymentIntent.status === 'succeeded' || paymentIntent.status === 'processing') {
            await prisma.flightBooking.update({
              where: { id: booking.id },
              data: { stripePaymentIntentId: paymentIntent.id, paymentStatus: 'PAID', status: 'CONFIRMED' }
            });
         }
       } catch (stripeError: any) {
         console.error('Stripe direct charge failed:', stripeError);
         return NextResponse.json({ error: `Payment Failed: ${stripeError.message}` }, { status: 400 });
       }
    }

    return NextResponse.json({ success: true, bookingId: booking.id, url: redirectUrl });
  } catch (error) {
    console.error('Booking creation failed:', error);
    return NextResponse.json({ error: 'Failed to create booking' }, { status: 500 });
  }
}
