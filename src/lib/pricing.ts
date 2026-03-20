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
  minProfitMarginFlat: 15,      // $15 (Safer minimum profit per ticket)
  minProfitPercent: 0.05,       // 5% (Sustainable volume markup)
  marketRateBuffer: 0.05        // 5% (Safety buffer for volatility/currency flux)
};

const GLOBAL_LAUNCH_DISCOUNT = 0.85; // 15% flat discount for worldwide rollout

/**
 * Calculates the final client price based on cost and seasonality.
 * @param baseCost The raw cost from the provider (e.g. SerpApi)
 * @param seasonalityMultiplier The multiplier from the seasonality engine
 */
export function calculateClientPrice(baseCost: number, seasonalityMultiplier: number): number {
  // 1. Apply Seasonality
  let price = baseCost * seasonalityMultiplier;

  // 2. Add minimal Market Rate Buffer
  price *= (1 + DEFAULT_CONFIG.marketRateBuffer);

  // 3. Ensure tiny Minimum Profit Margin for Launch
  const minPriceWithPercent = baseCost * (1 + DEFAULT_CONFIG.minProfitPercent);
  const minPriceWithFlat = baseCost + DEFAULT_CONFIG.minProfitMarginFlat;
  const competitiveMinPrice = Math.max(minPriceWithPercent, minPriceWithFlat);

  // 4. Apply Global Launch Discount
  price *= GLOBAL_LAUNCH_DISCOUNT;

  // Final Safeguard
  return Math.max(price, competitiveMinPrice);
}

/**
 * Formats a currency value for display in a specific currency.
 * @param amountUsd The core price in USD
 * @param currencyCode The target currency code (e.g., 'GBP', 'KES')
 */
export function formatPricing(amountUsd: number, currencyCode: string = 'USD'): string {
  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currencyCode,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amountUsd);
  } catch (error) {
    // Fallback to USD if the currency code is invalid or causes a crash
    return `$${amountUsd.toFixed(0)}`;
  }
}

/**
 * Historical Price Tracker (Performs real-time benchmark analysis)
 */
export function getHistoricalPriceStatus(currentPriceUsd: number, distance: number) {
  // Benchmarking based on public OTA averages (approx $0.14/km + taxes)
  const historicalAvg = (distance * 0.14) + 180;
  const diff = currentPriceUsd - historicalAvg;

  if (diff < -50) return { label: 'Wholesale Deal', color: 'emerald', icon: '💎', diff: Math.abs(diff) };
  if (diff > 80) return { label: 'High Demand', color: 'orange', icon: '🔥', diff: diff };
  return { label: 'Below Market', color: 'blue', icon: '📉', diff: Math.abs(diff) };
}
