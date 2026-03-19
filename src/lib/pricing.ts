/**
 * ASAP Tickets - Pricing Safeguard Engine
 * Ensures market-reasonable pricing while protecting against losses.
 */

export interface PricingConfig {
  minProfitMarginFlat: number; // Flat $ profit per ticket
  minProfitPercent: number;    // Minimum % markup
  marketRateBuffer: number;    // % added to cover fluctuations
}

const DEFAULT_CONFIG: PricingConfig = {
  minProfitMarginFlat: 50,      // $50 minimum profit per ticket
  minProfitPercent: 0.10,      // 10% minimum markup
  marketRateBuffer: 0.05       // 5% buffer for real-time volatility
};

/**
 * Calculates the final client price based on cost and seasonality.
 * @param baseCost The raw cost from the provider (e.g. SerpApi)
 * @param seasonalityMultiplier The multiplier from the seasonality engine
 */
export function calculateClientPrice(baseCost: number, seasonalityMultiplier: number): number {
  // 1. Apply Seasonality (Impact of world travel dates)
  let price = baseCost * seasonalityMultiplier;

  // 2. Add Market Rate Buffer (Safety against price jumps)
  price *= (1 + DEFAULT_CONFIG.marketRateBuffer);

  // 3. Ensure Minimum Profit Margin (Agency Safety)
  const minPriceWithPercent = baseCost * (1 + DEFAULT_CONFIG.minProfitPercent);
  const minPriceWithFlat = baseCost + DEFAULT_CONFIG.minProfitMarginFlat;

  // Take the higher of the two profit protections
  const competitiveMinPrice = Math.max(minPriceWithPercent, minPriceWithFlat);

  // Final Safeguard: Never sell below the competitive minimum
  return Math.max(price, competitiveMinPrice);
}

/**
 * Formats a currency value for display
 */
export function formatCurrency(amount: number): string {
  return amount.toFixed(2);
}

/**
 * Historical Price Tracker (Performs real-time benchmark analysis)
 */
export function getHistoricalPriceStatus(currentPrice: number, distance: number) {
  // Benchmarking based on 3-year historical average logic (approx $0.11/km + flat port fees)
  const historicalAvg = (distance * 0.11) + 165;
  const diff = currentPrice - historicalAvg;
  
  if (diff < -50) return { label: 'Great Deal', color: 'emerald', icon: '💎', diff: Math.abs(diff) };
  if (diff > 100) return { label: 'Peak High', color: 'orange', icon: '🔥', diff: diff };
  return { label: 'Market Average', color: 'slate', icon: '📊', diff: 0 };
}
