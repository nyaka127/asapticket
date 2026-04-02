import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = params.id;

  try {
    // Try to find the booking in all possible tables
    const flight = await prisma.flightBooking.findUnique({ where: { id } });
    if (flight) return NextResponse.json({ ...flight, type: 'FLIGHT' });

    const hotel = await prisma.hotelBooking.findUnique({ where: { id } });
    if (hotel) return NextResponse.json({ ...hotel, type: 'HOTEL' });

    const car = await prisma.carBooking.findUnique({ where: { id } });
    if (car) return NextResponse.json({ ...car, type: 'CAR' });

    return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
