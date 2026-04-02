import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const { bookingId, type = 'flight', amount: manualAmount, description: manualDescription, currency = 'usd' } = await request.json();
    const headersList = request.headers;
    const protocol = headersList.get('x-forwarded-proto') || 'https';
    const host = headersList.get('x-forwarded-host') || headersList.get('host');
    const appUrl = host ? `${protocol}://${host}` : (process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000');

    let unitAmount = 0;
    let productName = 'Global Travel Asset';
    let productDescription = 'Secure Settlement';
    let customerEmail: string | undefined = undefined;

    if (type === 'flight' && bookingId) {
      const booking = await prisma.flightBooking.findUnique({ where: { id: bookingId } });
      if (!booking) return NextResponse.json({ error: 'Flight booking not found' }, { status: 404 });
      unitAmount = booking.priceCents;
      productName = `Flight: ${booking.origin} → ${booking.destination}`;
      productDescription = `${booking.airline || 'ASAP'} ${booking.flightNumber || ''} · ${booking.cabin || 'ECONOMY'} · ${booking.passengers || 1} Pax`;
      customerEmail = (booking as any).passengerEmail || (booking as any).email || undefined;
    } else if (type === 'hotel' && bookingId) {
      const booking = await prisma.hotelBooking.findUnique({ where: { id: bookingId } });
      if (!booking) return NextResponse.json({ error: 'Hotel booking not found' }, { status: 404 });
      unitAmount = booking.priceCents;
      productName = `Hotel: ${booking.hotelName}`;
      productDescription = `City: ${booking.city} · ${booking.roomType} · Check-in: ${new Date(booking.checkInDate).toLocaleDateString()}`;
    } else if (type === 'car' && bookingId) {
      const booking = await prisma.carBooking.findUnique({ where: { id: bookingId } });
      if (!booking) return NextResponse.json({ error: 'Car booking not found' }, { status: 404 });
      unitAmount = booking.priceCents;
      productName = `Car: ${booking.provider} (${booking.carClass})`;
      productDescription = `Pickup: ${booking.pickupLocation} · Date: ${new Date(booking.pickupDate).toLocaleDateString()}`;
    } else if (type === 'direct') {
      unitAmount = manualAmount || 0;
      productName = manualDescription || 'Global Travel Asset Settlement';
      productDescription = 'Secure Payment via Verified Gateway';
    } else {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }

    if (unitAmount <= 0) return NextResponse.json({ error: 'Invalid amount' }, { status: 400 });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      billing_address_collection: 'required',
      customer_email: customerEmail,
      line_items: [{
        price_data: {
          currency: currency.toLowerCase(),
          product_data: {
            name: productName,
            description: productDescription,
          },
          unit_amount: unitAmount,
        },
        quantity: 1,
      }],
      metadata: { 
        bookingId: bookingId || 'manual', 
        type: type 
      },
      success_url: `${appUrl}/success?type=${type}&bookingId=${bookingId || ''}`,
      cancel_url: `${appUrl}/${type === 'flight' ? 'flights' : type === 'hotel' ? 'hotels' : 'cars'}?cancelled=true`,
    });

    // Update models with session id if possible
    if (type === 'flight' && bookingId) {
      await prisma.flightBooking.update({ where: { id: bookingId }, data: { stripeSessionId: session.id } as any });
    }

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error('Stripe session error:', error);
    return NextResponse.json({ error: 'Failed to create payment session' }, { status: 500 });
  }
}
