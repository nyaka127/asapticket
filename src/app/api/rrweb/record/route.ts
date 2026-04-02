import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const { sessionId, events } = await request.json();

    if (!sessionId || !events || !events.length) {
      return NextResponse.json({ error: 'Missing data' }, { status: 400 });
    }

    const existing = await prisma.sessionRecord.findUnique({ where: { sessionId } });
    
    let updatedEvents = [];
    if (existing && Array.isArray(existing.events)) {
      updatedEvents = [...existing.events, ...events];
    } else {
      updatedEvents = events;
    }

    await prisma.sessionRecord.upsert({
      where: { sessionId },
      update: { events: updatedEvents },
      create: { sessionId, events: updatedEvents }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Session Recording Error:', error);
    return NextResponse.json({ error: 'Failed to record session' }, { status: 500 });
  }
}
