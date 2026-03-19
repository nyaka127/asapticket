import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const eventId = params.id;

  const existing = await prisma.event.findUnique({ where: { id: eventId } });
  if (!existing) {
    return NextResponse.json({ message: "Event not found" }, { status: 404 });
  }

  await prisma.booking.deleteMany({ where: { eventId } });
  await prisma.event.delete({ where: { id: eventId } });

  return NextResponse.json({ message: "Deleted" });
}
