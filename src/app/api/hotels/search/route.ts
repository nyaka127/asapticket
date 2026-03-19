import { NextResponse } from 'next/server';
import { searchHotels } from '@/lib/hotels';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const destination = searchParams.get('destination') || 'NYC';
  const checkin = searchParams.get('checkin') || '2026-03-20';
  const checkout = searchParams.get('checkout') || '2026-03-25';
  const rooms = searchParams.get('rooms') || '2';
  const userTrackId = searchParams.get('userTrackId') || 'anonymous-client';

  // 📡 PING THE AGENT MONITOR (Pulse)
  try {
    await fetch(`${new URL(request.url).origin}/api/monitor`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: `Searching Hotels in ${destination}`,
        path: '/hotels',
        metadata: { destination, checkin, checkout, userTrackId }
      })
    });
  } catch (e) {
    console.error('Pulse Failed:', e);
  }

  try {
     const results = await searchHotels({ destination, checkin, checkout, rooms });
     
     return NextResponse.json({
       status: 'complete',
       isCompleted: true,
       userTrackId,
       results,
       currency: 'USD'
     });
  } catch (err) {
    return NextResponse.json({ error: 'Search failed' }, { status: 500 });
  }
}
