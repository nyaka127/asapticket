import { convertFromUsd, SUPPORTED_CURRENCIES, DEFAULT_CURRENCY } from './currencies';

export interface Seasonality {
  multiplier: number;
  label: string;
  isPeak: boolean;
  isLow: boolean;
}

export function getPriceSeasonality(destination: string, date: string): Seasonality {
  const d = new Date(date);
  const month = d.getMonth();
  const day = d.getDate();

  // Peak: Dec 15 - Jan 5, June 1 - Aug 31
  const isPeak = (month === 11 && day >= 15) || (month === 0 && day <= 5) || (month >= 5 && month <= 7);
  // Low: Feb, Oct, Nov
  const isLow = month === 1 || month === 9 || month === 10;

  if (isPeak) return { multiplier: 1.5, label: 'High Demand', isPeak: true, isLow: false };
  if (isLow) return { multiplier: 0.7, label: 'Best Value', isPeak: false, isLow: true };
  return { multiplier: 1.0, label: 'Standard Rate', isPeak: false, isLow: false };
}

export function formatPricing(amountUsd: number, currencyCode: string = 'USD'): string {
  const currency = SUPPORTED_CURRENCIES.find(c => c.code === currencyCode) || DEFAULT_CURRENCY;
  const convertedAmount = convertFromUsd(amountUsd, currencyCode);
  
  return new Intl.NumberFormat(currency.locale, {
    style: 'currency',
    currency: currency.code,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(convertedAmount);
}

export function getRealisticBasePrice(distance: number): number {
  // Logic to provide a "starting low" price based on distance
  if (distance === 0) return 0;
  if (distance < 500) return 60 + Math.random() * 40; // Very short
  if (distance < 1500) return 120 + Math.random() * 80; // Shorter domestic
  if (distance < 3000) return 220 + Math.random() * 150; // Transcon/Medium
  if (distance < 6000) return 450 + Math.random() * 300; // International Long
  return 750 + Math.random() * 600; // Ultra Long
}

export function calculateClientPrice(basePrice: number, seasonalityMultiplier: number): number {
  // Use the generated base, apply seasonality and a 10% wholesale-to-retail margin
  const price = basePrice * seasonalityMultiplier * 1.10;
  return Math.max(49.99, price); // Enforce $49.99 minimum
}

export function getHistoricalPriceStatus(clientPrice: number, distance: number | null): { color: string, icon: string, label: string, diff: number } {
  // Rough estimate of a "market average"
  const marketAvg = distance ? distance * 0.15 : clientPrice * 1.4; 
  const diff = marketAvg - clientPrice;

  if (diff > 200) return { color: 'emerald', icon: '🔥', label: 'Great Savings', diff };
  if (diff > 0) return { color: 'emerald', icon: '✓', label: 'Below Average', diff };
  return { color: 'slate', icon: 'ℹ', label: 'Market Rate', diff: 0 };
}