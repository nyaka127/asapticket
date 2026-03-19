import { NextResponse } from 'next/server';

// Temporary in-memory log for "Live Activity"
// In a real app, this would go into a Redis/DB or WebSockets
let activityLog: any[] = [];

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const newActivity = {
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toISOString(),
      ...data
    };
    
    // Keep last 50 activities
    activityLog = [newActivity, ...activityLog].slice(0, 50);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ activities: activityLog });
}
