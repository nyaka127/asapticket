import { getDistanceBetweenCodes } from './geo';

/**
 * ASAP Tickets Seasonality & Price Estimation Engine
 * Estimating global travel costs based on historical trends, 
 * regional peak seasons, and month-on-month volatility.
 */

export interface SeasonalityInfo {
  multiplier: number;
  label: string;
  isPeak: boolean;
  isLow: boolean;
  advice: string;
}

const REGIONAL_SEASONS: Record<string, Record<number, number>> = {
  // Northern Hemisphere Summer (Europe, North America)
  NORTHERN_SUMMER: { 0: 1.0, 1: 0.9, 2: 1.0, 3: 1.1, 4: 1.2, 5: 1.5, 6: 1.8, 7: 1.7, 8: 1.3, 9: 1.0, 10: 1.2, 11: 1.6 },
  // Tropical / Southeast Asia Peak (Dry Season)
  TROPICAL_DRY: { 0: 1.8, 1: 1.7, 2: 1.3, 3: 1.1, 4: 1.0, 5: 0.9, 6: 0.9, 7: 1.0, 8: 1.0, 9: 1.2, 10: 1.5, 11: 1.9 },
  // Southern Hemisphere (Australia, South Africa)
  SOUTHERN_SUMMER: { 0: 1.7, 1: 1.5, 2: 1.2, 3: 1.0, 4: 0.9, 5: 0.8, 6: 0.8, 7: 0.9, 8: 1.1, 9: 1.2, 10: 1.4, 11: 1.8 }
};

export function getPriceSeasonality(destination: string, date: string): SeasonalityInfo {
  const d = new Date(date);
  const month = d.getMonth(); // 0-11
  const destUpper = destination.toUpperCase();

  let region = 'NORTHERN_SUMMER'; // Default
  if (['SYD', 'MEL', 'CPT', 'EZE', 'SYDNEY', 'MELBOURNE', 'AUSTRALIA', 'ARGENTINA', 'CAPE TOWN'].some(k => destUpper.includes(k))) {
    region = 'SOUTHERN_SUMMER';
  } else if (['BKK', 'HKT', 'DPS', 'MLE', 'THAILAND', 'BALI', 'MALDIVES', 'PHUKET', 'BKK'].some(k => destUpper.includes(k))) {
    region = 'TROPICAL_DRY';
  }

  // Add Day-of-Week logic (Tuesday/Wednesday are cheaper)
  const day = d.getDay(); // 0 = Sun, ...
  let dayMultiplier = 1.0;
  if (day === 2 || day === 3) dayMultiplier = 0.95; // Tue/Wed cheaper (Wholesale days)
  if (day === 5 || day === 6) dayMultiplier = 1.05; // Fri/Sat expensive

  const multiplier = (REGIONAL_SEASONS[region][month] || 1.0) * dayMultiplier;

  let label = 'Normal Price';
  let advice = 'Good time to book.';
  let isPeak = false;
  let isLow = false;

  if (multiplier >= 1.5) {
    label = 'Peak Season 🔥';
    advice = 'Prices are higher than average due to peak demand.';
    isPeak = true;
  } else if (multiplier <= 0.9) {
    label = 'Off-Peak ❄️';
    advice = 'Great value! This is a low-season price.';
    isLow = true;
  } else if (multiplier > 1.2) {
    label = 'High Demand 📈';
    advice = 'Booking now is recommended as prices are rising.';
  }

  return { multiplier, label, isPeak, isLow, advice };
}

/**
 * Estimates a "Historical Average" base price for a route
 */
export function estimateBasePrice(origin: string, destination: string): number {
  const distanceKm = getDistanceBetweenCodes(origin, destination);

  // Base flat fee + $0.06 per KM (Aggressive wholesale pricing model)
  if (distanceKm) {
    return Math.max(99, 120 + (distanceKm * 0.06));
  }

  // Default fallback mock logic for estimates
  const distanceFactor = origin.length + destination.length;
  return 99 + (distanceFactor * 15);
}
