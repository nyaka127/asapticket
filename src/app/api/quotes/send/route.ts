import { NextResponse } from 'next/server';
import { sendEmail } from '@/lib/notifications';
import { generateQuoteEmailHtml } from '@/lib/emailTemplates';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { toEmail, type, title, subtitle, price, details } = body;

    if (!toEmail || !type || !title || !price) {
      return NextResponse.json({ error: 'Missing required quote data' }, { status: 400 });
    }

    const subject = `Your ${type.charAt(0) + type.slice(1).toLowerCase()} Quote from ASAP Tickets`;
    const htmlContent = generateQuoteEmailHtml(type, title, subtitle, price, details);

    // If SendGrid is not configured, we just fake the success for demonstration purposes
    await sendEmail(toEmail, subject, htmlContent);

    return NextResponse.json({ success: true, message: 'Quote sent successfully' });
  } catch (error) {
    console.error('Error sending quote:', error);
    return NextResponse.json({ error: 'Failed to send quote email' }, { status: 500 });
  }
}
