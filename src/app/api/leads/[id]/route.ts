import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { status, type } = await request.json();
    const { id } = params;

    if (!id || !status) {
      return NextResponse.json({ error: 'Missing id or status' }, { status: 400 });
    }

    // Since we unify FlightBooking and Lead in the UI, we need to know which one to update
    // If type is provided, use it. Otherwise, try both.
    let updated;

    if (type === 'BOOKING') {
      updated = await prisma.flightBooking.update({
        where: { id },
        data: { status }
      });
    } else if (type === 'ENQUIRY') {
      updated = await prisma.lead.update({
        where: { id },
        data: { status }
      });
    } else {
      // Try both if type isn't passed (fallback)
      try {
        updated = await prisma.lead.update({
          where: { id },
          data: { status }
        });
      } catch (err) {
        updated = await prisma.flightBooking.update({
          where: { id },
          data: { status }
        });
      }
    }

    return NextResponse.json({ success: true, updated });
  } catch (error) {
    console.error('Failed to update lead status:', error);
    return NextResponse.json({ error: 'Failed to update lead status' }, { status: 500 });
  }
}
