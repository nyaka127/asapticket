import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { 
      name, email, phone, pref, 
      origin, destination, 
      departureDate, returnDate, 
      cabin, flightId, 
      deposit, seats,
      price,
      selectedHotel, selectedCar, selectedTour
    } = body;

    const lead = await prisma.lead.create({
      data: {
        name,
        email,
        phone,
        contactMethod: pref || 'WhatsApp',
        origin,
        targetDestination: destination || 'Anywhere',
        departureDate,
        returnDate,
        cabin: cabin || 'ECONOMY',
        flightId,
        deposit: !!deposit,
        seats: !!seats,
        targetPrice: price ? parseInt(price) : null,
        source: 'WEBSITE_TRACKER',
        status: 'NEW',
      }
    });

    return NextResponse.json({ success: true, leadId: lead.id });
  } catch (error) {
    console.error('Lead Capture Error:', error);
    // Returning a proper error is crucial for debugging. The previous implementation
    // would hide database errors and make it seem like the lead was saved.
    const message = error instanceof Error ? error.message : 'An unknown error occurred.';
    return NextResponse.json({ success: false, error: 'Failed to create lead.', details: message }, { status: 500 });
  }
}

export async function GET() {
  try {
    const leads = await prisma.lead.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(leads);
  } catch {
    return NextResponse.json([]);
  }
}
