import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    await prisma.activity.create({
      data: {
        action: data.action || 'Unknown Action',
        source: data.source || 'Website',
      }
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Monitor POST Error:', error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}

export async function GET() {
  try {
    const activities = await prisma.activity.findMany({
      orderBy: { timestamp: 'desc' },
      take: 50
    });
    return NextResponse.json({ activities });
  } catch (error) {
    return NextResponse.json({ activities: [] }, { status: 500 });
  }
}
