# Personal Ticketing CMS (ASAP Tickets–style)

This repository contains a starter **ticketing CMS** that mimics the core concepts of a ticketing platform like ASAP Tickets.

## What’s included

- Events / ticket inventory
- Booking flow with ticket quantity selection
- Admin dashboard skeleton (event management)
- Database schema using Prisma + SQLite
- API routes for events and bookings
- Tailwind CSS for basic styling

## Requirements

- **Node.js (18+)** installed on your machine
- **npm** (ship with Node.js)

## Setup (once Node.js is installed)

1. Install dependencies:

```bash
npm install
```

2. Generate Prisma client & run first migration:

```bash
npm run prisma:migrate
```

3. Run the development server:

```bash
npm run dev
```

The app will be available at `http://localhost:3000`.

## Notes

- This is a starter template; you can extend it with authentication, payments (Stripe), and a real admin role system.
- The current data model uses SQLite for local development.

## Notifications (SMS / WhatsApp / Email)

This project includes a notifications module that can send booking confirmations via:

- **SMS** (Twilio)
- **WhatsApp** (Twilio)
- **Email** (SendGrid)

### Required env vars

Add these to `.env` (or your deployment secret store):

```env
TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
TWILIO_PHONE_NUMBER=+1...
TWILIO_WHATSAPP_NUMBER=+1...
SENDGRID_API_KEY=
FROM_EMAIL=hello@example.com
```

### How it works

- Booking API (`POST /api/bookings`) will send notifications after creating a booking.
- Notifications are only sent when the corresponding `notify*` flag is enabled on the user.

> Note: This module expects `twilio` and `@sendgrid/mail` packages to be installed (run `npm install` after installing Node).