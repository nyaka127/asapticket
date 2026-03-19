import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const DEFAULT_EMAIL = "guest@localhost";

export async function GET() {
  const user = await prisma.user.upsert({
    where: { email: DEFAULT_EMAIL },
    update: {},
    create: {
      name: "Guest",
      email: DEFAULT_EMAIL,
      phoneNumber: "",
      notifyEmail: true,
      notifySms: false,
      notifyWhatsApp: false
    }
  });

  return NextResponse.json(user);
}

export async function PATCH(req: Request) {
  const body = await req.json();
  const { name, phoneNumber, notifyEmail, notifySms, notifyWhatsApp } = body;

  const user = await prisma.user.update({
    where: { email: DEFAULT_EMAIL },
    data: {
      name,
      phoneNumber,
      notifyEmail,
      notifySms,
      notifyWhatsApp
    }
  });

  return NextResponse.json(user);
}
