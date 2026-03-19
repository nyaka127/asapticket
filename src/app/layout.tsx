import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ASAP Tickets – Flights, Hotels, Cars & Tours Worldwide",
  description: "Book flights, hotels, car rentals, and tour guides worldwide at the best prices. Secure payment powered by Stripe.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
