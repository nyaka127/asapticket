import "./globals.css";
import type { Metadata } from "next";
import { headers } from "next/headers";

export async function generateMetadata(): Promise<Metadata> {
  const host = process.env.PUBLIC_URL || "http://localhost:3000";
  return {
    metadataBase: new URL(host),
    title: "ASAP Tickets | Global Wholesale Ticketing Authority",
    description: "Secure non-published wholesale contracts unavailable to standard consumer booking sites. Tier-1 Direct GDS Uplink for Flights, Hotels, and Cars.",
    openGraph: {
      title: "ASAP Tickets | Global Wholesale Ticketing Authority",
      description: "Secure non-published wholesale contracts unavailable to standard consumer booking sites. Tier-1 Direct GDS Uplink.",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: "ASAP Tickets | Global Wholesale Ticketing Authority",
      description: "Secure non-published wholesale contracts unavailable to standard consumer booking sites.",
    }
  };
}

import PresenceGate from "@/components/PresenceGate";
import ScreenWakeLock from "@/components/ScreenWakeLock";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased">
        <PresenceGate>
          <ScreenWakeLock />
          {children}
        </PresenceGate>
      </body>
    </html>
  );
}
