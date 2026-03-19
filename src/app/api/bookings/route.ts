import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendEmail, sendSms, sendWhatsApp } from "@/lib/notifications";

export async function POST(req: Request) {
  const body = await req.json();
  const { eventId, quantity } = body as { eventId: string; quantity: number };

  if (!eventId || !quantity || quantity <= 0) {
    return NextResponse.json({ message: "Invalid booking payload" }, { status: 400 });
  }

  const event = await prisma.event.findUnique({
    where: { id: eventId },
    include: { bookings: true }
  });

  if (!event) {
    return NextResponse.json({ message: "Event not found" }, { status: 404 });
  }

  const booked = event.bookings.length;
  const availableSeats = Math.max(0, event.totalSeats - booked);

  if (quantity > availableSeats) {
    return NextResponse.json({ message: "Not enough seats available" }, { status: 400 });
  }

  // Placeholder user (no auth yet)
  const user = await prisma.user.upsert({
    where: { email: "guest@localhost" },
    update: {},
    create: {
      name: "Guest",
      email: "guest@localhost",
      phoneNumber: "+10000000000",
      notifyEmail: true,
      notifySms: false,
      notifyWhatsApp: false
    }
  });

  const totalCents = quantity * event.priceCents;

  const booking = await prisma.booking.create({
    data: {
      eventId,
      userId: user.id,
      quantity,
      totalCents,
      status: "CONFIRMED"
    }
  });

  // Send confirmation notifications (best-effort)
  const message = `Your booking for ${event.title} is confirmed. Quantity: ${quantity}. Total: $${(
    totalCents / 100
  ).toFixed(2)}.`;

  if (user.notifySms && user.phoneNumber) {
    await sendSms(user.phoneNumber, message);
  }

  if (user.notifyWhatsApp && user.phoneNumber) {
    await sendWhatsApp(user.phoneNumber, message);
  }

  if (user.notifyEmail) {
    const emailBody = `<p>Thanks for booking <strong>${event.title}</strong>.</p><p>Quantity: ${quantity}</p><p>Total: $${(
      totalCents / 100
    ).toFixed(2)}</p>`;
    await sendEmail(user.email, `Booking confirmed: ${event.title}`, emailBody);
  }

  return NextResponse.json(booking);
}
