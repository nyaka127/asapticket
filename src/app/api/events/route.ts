import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const events = await prisma.event.findMany({
    orderBy: { startAt: "asc" },
    include: { bookings: true }
  });

  const data = events.map((event) => {
    const booked = event.bookings.length;
    const availableSeats = Math.max(0, event.totalSeats - booked);

    return {
      ...event,
      availableSeats
    };
  });

  return NextResponse.json(data);
}

export async function POST(req: Request) {
  const body = await req.json();
  const { title, description, location, startAt, endAt, priceCents, totalSeats } = body;

  if (!title || !description || !location || !startAt || !priceCents || !totalSeats) {
    return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
  }

  const event = await prisma.event.create({
    data: {
      title,
      description,
      location,
      startAt: new Date(startAt),
      endAt: endAt ? new Date(endAt) : null,
      priceCents,
      totalSeats
    }
  });

  return NextResponse.json(event);
}
