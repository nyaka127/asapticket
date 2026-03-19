import { NextResponse } from 'next/server';
import { searchCars } from '@/lib/cars';

export async function POST(request: Request) {
  const { searchParams } = new URL(request.url);
  const apiKey = searchParams.get('apiKey');
  const userTrackId = searchParams.get('userTrackId') || 'car-client';
  
  const body = await request.json();
  const searchParamsBody = body.searchStartParameters;

  // 📡 PING THE AGENT MONITOR (Pulse)
  try {
    await fetch(`${new URL(request.url).origin}/api/monitor`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: `Searching Cars in ${searchParamsBody?.pickup?.location?.value || 'unknown'}`,
        path: '/cars',
        metadata: { ...searchParamsBody, userTrackId }
      })
    });
  } catch (e) {
    console.error('Pulse Failed:', e);
  }

  try {
     const results = await searchCars(searchParamsBody);
     
     return NextResponse.json({
       searchId: 'JTAmAp5JvC',
       cluster: '4',
       status: 'complete',
       results,
       currency: 'USD',
       days: 2
     });
  } catch (err) {
    return NextResponse.json({ error: 'Car search failed' }, { status: 500 });
  }
}
