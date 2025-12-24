/**
 * APY Calculation Utilities
 * Normalize and calculate APYs across different protocols
 */

export interface APYData {
  protocol: string;
  apy: number;
  type: 'simple' | 'compound';
  compoundFrequency?: 'daily' | 'weekly' | 'monthly' | 'yearly';
}

/**
 * Convert simple APY to compound APY
 */
export function simpleToCompoundAPY(
  simpleRate: number,
  compoundFrequency: 'daily' | 'weekly' | 'monthly' | 'yearly' = 'daily'
): number {
  const frequencyMap = {
    daily: 365,
    weekly: 52,
    monthly: 12,
    yearly: 1
  };

  const n = frequencyMap[compoundFrequency];
  const r = simpleRate / 100;

  // Compound APY = (1 + r/n)^n - 1
  return ((Math.pow(1 + r / n, n) - 1) * 100);
}

/**
 * Calculate compound interest for a given principal and time period
 */
export function calculateCompoundInterest(
  principal: number,
  apyPercent: number,
  timePeriodDays: number
): number {
  const r = apyPercent / 100;
  const n = 365; // Daily compounding
  const t = timePeriodDays / 365;

  return principal * Math.pow(1 + r / n, n * t);
}

/**
 * Calculate projected earnings over time
 */
export function calculateProjectedEarnings(
  principal: number,
  apyPercent: number,
  days: number
): {
  principal: number;
  interest: number;
  total: number;
} {
  const total = calculateCompoundInterest(principal, apyPercent, days);
  const interest = total - principal;

  return {
    principal,
    interest,
    total
  };
}

/**
 * Calculate opportunity cost between two protocols
 */
export function calculateOpportunityCost(
  amount: number,
  currentAPY: number,
  betterAPY: number,
  days: number = 365
): {
  currentEarnings: number;
  potentialEarnings: number;
  opportunityCost: number;
  costPercentage: number;
} {
  const current = calculateProjectedEarnings(amount, currentAPY, days);
  const potential = calculateProjectedEarnings(amount, betterAPY, days);

  const opportunityCost = potential.interest - current.interest;
  const costPercentage = (opportunityCost / current.interest) * 100;

  return {
    currentEarnings: current.interest,
    potentialEarnings: potential.interest,
    opportunityCost,
    costPercentage
  };
}

/**
 * Calculate weighted average APY across multiple positions
 */
export function calculateWeightedAPY(
  positions: Array<{ amount: number; apy: number }>
): number {
  const totalAmount = positions.reduce((sum, p) => sum + p.amount, 0);

  if (totalAmount === 0) return 0;

  const weightedSum = positions.reduce((sum, p) => {
    return sum + (p.amount * p.apy);
  }, 0);

  return weightedSum / totalAmount;
}

/**
 * Normalize APY data from different protocols
 */
export function normalizeAPY(data: APYData): number {
  if (data.type === 'compound') {
    return data.apy;
  }

  // Convert simple to compound
  return simpleToCompoundAPY(data.apy, data.compoundFrequency);
}

/**
 * Format APY for display
 */
export function formatAPY(apy: number, decimals: number = 2): string {
  return `${apy.toFixed(decimals)}%`;
}

/**
 * Format currency amount
 */
export function formatCurrency(amount: number, decimals: number = 8): string {
  return amount.toFixed(decimals);
}

/**
 * Format large numbers with K, M, B suffixes
 */
export function formatLargeNumber(num: number): string {
  if (num >= 1_000_000_000) {
    return (num / 1_000_000_000).toFixed(2) + 'B';
  }
  if (num >= 1_000_000) {
    return (num / 1_000_000).toFixed(2) + 'M';
  }
  if (num >= 1_000) {
    return (num / 1_000).toFixed(2) + 'K';
  }
  return num.toFixed(2);
}
