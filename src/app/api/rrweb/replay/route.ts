import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const sessionId = searchParams.get('sessionId');

  if (!sessionId) {
    try {
      const sessions = await prisma.sessionRecord.findMany({
        orderBy: { updatedAt: 'desc' },
        select: { id: true, sessionId: true, updatedAt: true, createdAt: true }
      });
      return NextResponse.json(sessions);
    } catch {
      return NextResponse.json([]);
    }
  }

  try {
    const session = await prisma.sessionRecord.findUnique({ where: { sessionId } });
    if (!session) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json({ events: session.events });
  } catch (error) {
    console.error('Session Fetch Error:', error);
    return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 });
  }
}
