import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, phone, pref, destination, price } = body;

    const lead = await prisma.lead.create({
      data: {
        name,
        email,
        phone,
        contactMethod: pref || 'WhatsApp',
        targetDestination: destination || 'Anywhere',
        targetPrice: price ? parseInt(price) : null,
        source: 'WEBSITE_TRACKER',
        status: 'NEW',
      }
    });

    return NextResponse.json({ success: true, leadId: lead.id });
  } catch (error) {
    console.error('Lead Capture Error:', error);
    // Return mock success if DB fails (for demo/mock purposes)
    return NextResponse.json({ success: true, leadId: 'MOCK_' + Date.now() });
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
