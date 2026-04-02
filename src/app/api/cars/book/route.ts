import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { provider, model, carClass, location, pickupDate, dropoffDate, priceCents, days, driverName, email } = body;

    // 1. Record the booking in the Database for the Agent Dashboard
    const booking = await prisma.carBooking.create({
      data: {
        provider: provider || 'Rental',
        pickupLocation: location || 'Global',
        dropoffLocation: location || 'Global',
        pickupDate: pickupDate ? new Date(pickupDate) : new Date(),
        dropoffDate: dropoffDate ? new Date(dropoffDate) : new Date(Date.now() + 864e5),
        carClass: carClass || 'Standard',
        priceCents: priceCents || 0,
        status: 'PENDING',
        userId: 'clz7q3r4p0000ux1234567890' // Default user for this demo/lead capture
      }
    });

    // 2. Return the bookingId so the frontend can pass it to the Stripe Payment Link
    return NextResponse.json({ success: true, bookingId: booking.id });
  } catch (error) {
    console.error('Car booking record failed:', error);
    return NextResponse.json({ error: 'Failed to record booking' }, { status: 500 });
  }
}
