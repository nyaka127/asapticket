# 🌍 ASAP Tickets - 24/7 Global Ticketing Portal

A high-performance, premium travel ticketing and CMS ecosystem built for global operations. This platform specializes in flight, hotel, and car rental management with a focus on private wholesale fares and expert-assisted booking flows.

## 🚀 Key Features

- **Global Inventory (2026 Ready)**: Search across 300+ major hubs and regional airports globally with real-time availability.
- **Expert Service Requests**: Sophisticated lead generation for complex routes requiring human negotiation for private fares.
- **No-Loss Pricing Guard**: Integrated pricing logic with market buffers to ensure profitability and user protection.
- **Multi-Vertical CMS**: Full support for Flights, Hotels, and Car Rentals with specialized booking procedures.
- **Enterprise-Grade Stack**: Built with Next.js, TypeScript, Tailwind CSS, and Prisma (SQLite/Postgres).
- **Automated Notifications**: Booking confirmations via WhatsApp, SMS (Twilio), and Email (SendGrid).

## 🌍 Dual Website Architecture
The system runs two distinct websites simultaneously from a single codebase via a custom Node.js server:
1. **Passenger Booking Site** (Port 3000): For public flights, hotels, and car rentals.
2. **Administrative Oversight Hub** (Port 3001): For agents to monitor activity and capture leads.

## 🌍 Scalability & Capacity

| Environment | Database | Hosting | Capacity |
|-------------|----------|---------|----------|
| **Local (Current)** | SQLite | Your Laptop | ~50 Concurrent Users |
| **Production** | PostgreSQL | Vercel / AWS | **10,000+ Concurrent Users** |

### 🚀 Deploying for Production (10,000+ Users)

To handle a global audience, you must deploy the application to a cloud provider.

1.  **Database**:
    -   Create a free PostgreSQL database on a provider like Supabase or Neon.
    -   In your `schema.prisma` file, switch the `provider` to `"postgresql"`.
    -   Get the `POSTGRES_PRISMA_URL` (your database connection string) from your provider.

2.  **Hosting**:
    -   Push your project code to a GitHub repository.
    -   Create a free account on Vercel.
    -   Connect your GitHub repository to Vercel to automatically deploy the site.
    -   In the Vercel project settings, add your database URL and all other API keys from your `.env` file as Environment Variables.

## 🛠️ Global Infrastructure

This platform is designed to be deployed worldwide, featuring:
- **Currency Agnostic Logic**: Global USD enforcement for wholesale stability with local pricing hooks.
- **Distance-Based Routing**: Haversine distance calculations for accurate regional pricing mockups.
- **Seasonality Engine**: Dynamic price adjustments based on destination peak/low seasons.
- **Responsive Aesthetics**: Premium, dark-mode inspired UI that scales flawlessly from mobile to ultra-wide displays.

## ⚙️ Quick Start

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Initialize Database**:
   ```bash
   npx prisma generate
   npx prisma migrate dev
   ```

3. **Global Connectivity**:
   Add your API keys to `.env`:
   ```env
   AMADEUS_CLIENT_ID=
   AMADEUS_CLIENT_SECRET=
   TWILIO_ACCOUNT_SID=
   TWILIO_AUTH_TOKEN=
   SENDGRID_API_KEY=
   ```

4. **Launch Platform**:
   ```bash
   npm run dev
   ```

## 🚀 Quick Launch (Combined Sites)

To start both sites and secure a global tunnel for worldwide access (on smartphone or other networks):
1. Run `start_website.bat`
2. Follow the on-screen instructions.
   - **Local Access**: Port 3000 (Passenger) & Port 3001 (Agent).
   - **Remote Access**: Use the generated `.lhr.life` or `.localhost.run` links for worldwide testing.

## 📈 2026 Roadmap Accomplished
- ✅ Comprehensive regional airport coverage (LATAM, MEA, Oceania, Asia).
- ✅ Precision Seasonal Pricing Guards for 200+ cities.
- ✅ "Insta-Book" vs "Expert Service" hybrid selection UI.
- ✅ Delaware-based agent HQ lead routing simulation.

---
*Established 2021. Powering the next generation of global travel ticketing.*