/**
 * Application constants
 */

// Network configuration
export const NETWORKS = {
  TESTNET: 'testnet',
  MAINNET: 'mainnet',
} as const;

// API endpoints
export const API_ENDPOINTS = {
  TESTNET: 'https://api.testnet.hiro.so',
  MAINNET: 'https://api.mainnet.hiro.so',
} as const;

// Contract names
export const CONTRACTS = {
  ROUTER: 'router',
  VAULT_MANAGER: 'vault-manager',
  VELAR_ADAPTER: 'velar-adapter',
  ALEX_ADAPTER: 'alex-adapter',
  MATH_UTILS: 'math',
} as const;

// Vault strategies
export const VAULT_STRATEGIES = {
  MAX_YIELD: 'max-yield',
  BALANCED: 'balanced',
  CONSERVATIVE: 'conservative',
} as const;

// Transaction fee estimates (in micro-STX)
export const TX_FEES = {
  DEFAULT: 1000,
  HIGH_PRIORITY: 5000,
} as const;

// UI constants
export const UI = {
  REFRESH_INTERVAL: 30000, // 30 seconds
  TRANSACTION_TIMEOUT: 300000, // 5 minutes
  MAX_RETRIES: 3,
} as const;

// Numeric constants
export const NUMERIC = {
  MICRO_STX: 1_000_000,
  BASIS_POINTS: 10000,
  PERCENTAGE: 100,
} as const;

// Protocol categories
export const PROTOCOL_CATEGORIES = {
  DEX: 'dex',
  LENDING: 'lending',
  YIELD: 'yield',
} as const;
