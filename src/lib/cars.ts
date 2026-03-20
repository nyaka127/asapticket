/**
 * Iris (Cars) API Service - Mock Implementation
 * Based on Iris Affiliate V1 RAML
 */

import { calculateClientPrice } from './pricing';

export interface CarSearchStartParameters {
  pickup: {
    location: { type: string; value: string };
    date: string;
    hour?: number;
    minute?: number;
  };
  dropoff: {
    date: string;
    hour?: number;
    minute?: number;
  };
}

export const searchCars = async (params: CarSearchStartParameters) => {
  // Simulate API delay (Polling-style latency)
  await new Promise(resolve => setTimeout(resolve, 1200));

  const pickup = (params.pickup.location.value || 'NYC').toUpperCase();

  // Single Taxi Type based on Location with Distance-based Pricing
  let taxiType = {
    id: `taxi-${pickup}-local`,
    agency: "Local Dispatch",
    provider: "DIRECT_DISPATCH",
    car: {
      brand: "Standard City Taxi",
      type: "Standard Pickup",
      passengers: 4,
      bags: 3,
      image: "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&q=80&w=800",
      transmission: "automatic",
      fuel: "Hybrid / EV"
    },
    pricePerKm: 0.75,
    baseFare: 4.50,
    currency: "USD"
  };

  // Regionally swap imagery and brand
  if (['LON', 'LHR', 'LGW', 'LONDON', 'UK', 'ENGLAND', 'BRITAIN'].some(k => pickup.includes(k))) {
    taxiType.car.brand = "City Cab Dispatch";
    taxiType.car.image = "https://images.unsplash.com/photo-1538332576228-eb5b4c4de6f5?auto=format&fit=crop&q=80&w=800"; // Enforce Yellow/Generic
    taxiType.pricePerKm = 0.95;
  } else if (['JFK', 'EWR', 'LGA', 'NYC', 'NY', 'USA', 'AMERICA', 'UNITED STATES'].some(k => pickup.includes(k))) {
    taxiType.car.brand = "City Yellow Cab";
    taxiType.car.image = "https://images.unsplash.com/photo-1538332576228-eb5b4c4de6f5?auto=format&fit=crop&q=80&w=800";
    taxiType.pricePerKm = 0.85;
  } else if (['AF', 'CDG', 'ORY', 'PARIS', 'FRANCE'].some(k => pickup.includes(k))) {
    taxiType.car.brand = "Metro Taxi Service";
    taxiType.car.image = "https://images.unsplash.com/photo-1538332576228-eb5b4c4de6f5?auto=format&fit=crop&q=80&w=800"; // Enforce Yellow/Generic
    taxiType.pricePerKm = 0.90;
  }

  // Randomize Price a bit for realism (+/- 5%)
  const randomize = (val: number) => val * (0.95 + Math.random() * 0.1);
  taxiType.pricePerKm = randomize(taxiType.pricePerKm);
  taxiType.baseFare = randomize(taxiType.baseFare);

  // Calculate estimated total based on fixed 20km city transfer for search results
  const estimatedDistanceKm = 20;
  const rawPrice = taxiType.baseFare + (taxiType.pricePerKm * estimatedDistanceKm);

  // Apply Seasonality & Pricing Guards
  const finalPrice = calculateClientPrice(rawPrice, 1.05);

  // Add Rental Agency Options for "Car Rental Service"
  const rentals = [
    {
      id: `rental-${pickup}-hertz`,
      agency: "Terminal Dispatch",
      provider: "LOCAL_V2",
      car: {
        brand: "Standard Sedan",
        type: "Toyota Camry or Similar",
        passengers: 5,
        bags: 4,
        image: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&q=80&w=800",
        transmission: "automatic",
        fuel: "Electric / Petrol"
      },
      priceTotal: calculateClientPrice(taxiType.baseFare + 15.00, 1.05),
      badges: ["Instant Curb", "Best Price", "Unlimited KM"]
    },
    {
      id: `rental-${pickup}-avis`,
      agency: "Curb Express",
      provider: "LOCAL_V2",
      car: {
        brand: "City Van Large",
        type: "Ford Transit or Similar",
        passengers: 7,
        bags: 6,
        image: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=800",
        transmission: "automatic",
        fuel: "Diesel / Hybrid"
      },
      priceTotal: calculateClientPrice(taxiType.baseFare + 25.00, 1.05),
      badges: ["High Clearance", "GPS Included", "Fuel Efficient"]
    }
  ];

  return [
    {
      ...taxiType,
      priceTotal: finalPrice,
      estimatedDistance: estimatedDistanceKm,
      badges: ["Local Licensed", "No-Loss Guard", "Fixed Rate Available"]
    },
    ...rentals
  ];
};
