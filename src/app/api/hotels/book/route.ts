import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, city, checkIn, checkOut, priceCents, nights, guests, flow, guestName, email, roomType, specialReqs } = body;

    // 1. Record the booking in the Database for the Agent Dashboard
    const booking = await prisma.hotelBooking.create({
      data: {
        hotelName: name || 'Hotel',
        city: city || 'Global',
        checkInDate: checkIn ? new Date(checkIn) : new Date(),
        checkOutDate: checkOut ? new Date(checkOut) : new Date(Date.now() + 864e5),
        roomType: roomType || 'Standard',
        priceCents: priceCents || 0,
        status: 'PENDING',
        userId: 'clz7q3r4p0000ux1234567890' // Default user for this demo/lead capture
      }
    });

    // 2. Return the bookingId so the frontend can pass it to the Stripe Payment Link
    return NextResponse.json({ success: true, bookingId: booking.id });
  } catch (error) {
    console.error('Hotel booking record failed:', error);
    return NextResponse.json({ error: 'Failed to record booking' }, { status: 500 });
  }
}
