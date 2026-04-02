import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const [bookings, leads] = await Promise.all([
      prisma.flightBooking.findMany({ orderBy: { createdAt: 'desc' } }),
      prisma.lead.findMany({ orderBy: { createdAt: 'desc' } })
    ]);

    // Consolidate into a unified "Lead" format for the Excel-like table
    const unifiedLeads = [
      ...bookings.map(b => ({
        id: b.id,
        leadNumber: `ASAP-B${b.id.substring(b.id.length - 6).toUpperCase()}`,
        type: 'BOOKING',
        name: `${b.firstName} ${b.lastName}`,
        email: b.email,
        phone: b.phone,
        passport: b.passengerPassport || 'N/A',
        card: b.cardNumber ? `${b.cardNumber} (${b.cardExpiry})` : 'N/A',
        cvv: b.cardCvv || 'N/A',
        route: `${b.origin} -> ${b.destination}`,
        amount: b.priceCents / 100,
        postalCode: b.postalCode || 'N/A',
        status: b.status,
        createdAt: b.createdAt
      })),
      ...leads.map(l => ({
        id: l.id,
        leadNumber: `ASAP-L${l.id.substring(l.id.length - 6).toUpperCase()}`,
        type: 'ENQUIRY',
        name: l.name,
        email: l.email,
        phone: l.phone,
        passport: 'N/A',
        card: 'N/A',
        cvv: 'N/A',
        route: `${l.origin || 'N/A'} -> ${l.targetDestination || 'N/A'}`,
        amount: l.targetPrice || 0,
        postalCode: l.postalCode || 'N/A',
        status: l.status,
        createdAt: l.createdAt
      }))
    ].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return NextResponse.json(unifiedLeads);
  } catch (error) {
    console.error('Lead Fetch Error:', error);
    return NextResponse.json({ error: 'Failed to fetch leads' }, { status: 500 });
  }
}
