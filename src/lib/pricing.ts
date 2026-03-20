export function formatPricing(amount: number, currency: string = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function calculateFee(base: number, percentage: number): number {
  return base * (percentage / 100);
}

export function calculateClientPrice(basePrice: number, seasonalityMultiplier: number): number {
  return basePrice * seasonalityMultiplier * 1.05; // Base * season * 5% margin
}

export function getHistoricalPriceStatus(clientPrice: number, distance: number | null): { color: string, icon: string, label: string, diff: number } {
  // Rough estimate of a "market average"
  const marketAvg = distance ? distance * 0.15 : clientPrice * 1.4; 
  const diff = marketAvg - clientPrice;

  if (diff > 200) return { color: 'emerald', icon: '🔥', label: 'Great Savings', diff };
  if (diff > 0) return { color: 'emerald', icon: '✓', label: 'Below Average', diff };
  return { color: 'slate', icon: 'ℹ', label: 'Market Rate', diff: 0 };
}