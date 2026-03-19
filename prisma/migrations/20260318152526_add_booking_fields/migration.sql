-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_FlightBooking" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT,
    "airline" TEXT NOT NULL,
    "flightNumber" TEXT NOT NULL,
    "origin" TEXT NOT NULL,
    "destination" TEXT NOT NULL,
    "departureTime" DATETIME NOT NULL,
    "arrivalTime" DATETIME NOT NULL,
    "priceCents" INTEGER NOT NULL,
    "pnr" TEXT,
    "cabin" TEXT NOT NULL DEFAULT 'ECONOMY',
    "passengers" INTEGER NOT NULL DEFAULT 1,
    "passengerName" TEXT,
    "passengerEmail" TEXT,
    "passengerPassport" TEXT,
    "stripeSessionId" TEXT,
    "stripePaymentIntentId" TEXT,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "FlightBooking_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_FlightBooking" ("airline", "arrivalTime", "createdAt", "departureTime", "destination", "flightNumber", "id", "origin", "pnr", "priceCents", "status", "updatedAt", "userId") SELECT "airline", "arrivalTime", "createdAt", "departureTime", "destination", "flightNumber", "id", "origin", "pnr", "priceCents", "status", "updatedAt", "userId" FROM "FlightBooking";
DROP TABLE "FlightBooking";
ALTER TABLE "new_FlightBooking" RENAME TO "FlightBooking";
CREATE UNIQUE INDEX "FlightBooking_stripeSessionId_key" ON "FlightBooking"("stripeSessionId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
