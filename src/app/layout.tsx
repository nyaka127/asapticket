import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ASAP Tickets – Flights, Hotels, Cars & Tours Worldwide",
  description: "Book flights, hotels, car rentals, and tour guides worldwide at the best prices. Secure payment powered by Stripe.",
};

import PresenceGate from "@/components/PresenceGate";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased">
        <PresenceGate>
          {children}
        </PresenceGate>
      </body>
    </html>
  );
}
