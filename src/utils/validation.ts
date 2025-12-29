/**
 * Input validation utilities
 */

export function isValidAmount(amount: string | number): boolean {
  const num = typeof amount === 'string' ? parseFloat(amount) : amount;
  return !isNaN(num) && num > 0 && isFinite(num);
}

export function isValidSTXAddress(address: string): boolean {
  // Stacks addresses: SP (mainnet) or ST (testnet) + 39 characters
  const regex = /^(SP|ST)[0-9A-Z]{39}$/;
  return regex.test(address);
}

export function isValidVaultId(id: string): boolean {
  // Alphanumeric, hyphens, underscores, 3-50 chars
  const regex = /^[a-zA-Z0-9_-]{3,50}$/;
  return regex.test(id);
}

export function isValidStrategy(strategy: string): boolean {
  return ['max-yield', 'balanced', 'conservative'].includes(strategy);
}

export function isValidPercentage(value: number): boolean {
  return value >= 0 && value <= 100;
}

export function sanitizeInput(input: string): string {
  return input.trim().replace(/[<>]/g, '');
}

export function validateTransactionAmount(
  amount: string,
  balance: number
): { valid: boolean; error?: string } {
  if (!isValidAmount(amount)) {
    return { valid: false, error: 'Invalid amount' };
  }

  const num = parseFloat(amount);

  if (num <= 0) {
    return { valid: false, error: 'Amount must be greater than 0' };
  }

  if (num > balance) {
    return { valid: false, error: 'Insufficient balance' };
  }

  return { valid: true };
}
