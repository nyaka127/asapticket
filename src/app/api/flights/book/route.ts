import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      flightId,
      airline,
      flightNumber,
      origin,
      destination,
      departureTime,
      arrivalTime,
      priceCents,
      cabin,
      passengers,
      passengerName,
      passengerEmail,
      passengerPassport,
    } = body;

    if (!passengerName || !passengerEmail || !priceCents) {
      return NextResponse.json({ error: 'Missing required passenger fields' }, { status: 400 });
    }

    const pnr = Math.random().toString(36).substring(2, 9).toUpperCase();

    const booking = await prisma.flightBooking.create({
      data: {
        airline,
        flightNumber,
        origin,
        destination,
        departureTime: new Date(departureTime),
        arrivalTime: new Date(arrivalTime),
        priceCents: Math.round(priceCents),
        cabin: cabin || 'ECONOMY',
        passengers: passengers || 1,
        passengerName,
        passengerEmail,
        passengerPassport: passengerPassport || null,
        pnr,
        status: 'PENDING',
      },
    });

    return NextResponse.json({ bookingId: booking.id, pnr: booking.pnr });
  } catch (error) {
    console.error('Book flight error:', error);
    return NextResponse.json({ error: 'Failed to create booking' }, { status: 500 });
  }
}
