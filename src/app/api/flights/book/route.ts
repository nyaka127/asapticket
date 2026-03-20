import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

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
        departureTime: body.departureTime ? new Date(body.departureTime) : new Date(Date.now() + 1000 * 60 * 60 * 24 * 14), // Default to 14 days from now
        paymentStatus: body.paymentType === 'full' ? 'PAID' : 'DEPOSIT',
        status: 'PENDING',
        bookingReference: Math.random().toString(36).substring(2, 8).toUpperCase(),
      }
    });

    return NextResponse.json({ success: true, bookingId: booking.id });
  } catch (error) {
    console.error('Booking creation failed:', error);
    return NextResponse.json({ error: 'Failed to create booking' }, { status: 500 });
  }
}
