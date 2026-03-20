import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    // This endpoint handles the "pulse" monitoring requests from the frontend
    // const body = await request.json();
    // console.log('[SYSTEM MONITOR]', body); // Disabled to prevent terminal lag during high traffic
    return NextResponse.json({ received: true });
}