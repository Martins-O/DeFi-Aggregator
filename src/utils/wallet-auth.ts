import { UserSession } from '@stacks/connect';
import { StacksNetwork } from '@stacks/network';

export interface AuthenticatedUser {
  address: string;
  network: 'testnet' | 'mainnet';
  username?: string;
  profile?: any;
}

/**
 * Get authenticated user information
 */
export function getAuthenticatedUser(
  userSession: UserSession
): AuthenticatedUser | null {
  if (!userSession.isUserSignedIn()) {
    return null;
  }

  const userData = userSession.loadUserData();
  const network = process.env.NEXT_PUBLIC_NETWORK || 'testnet';
  const address =
    network === 'mainnet'
      ? userData.profile.stxAddress.mainnet
      : userData.profile.stxAddress.testnet;

  return {
    address,
    network: network as 'testnet' | 'mainnet',
    username: userData.username,
    profile: userData.profile,
  };
}

/**
 * Validate wallet address format
 */
export function isValidStacksAddress(address: string): boolean {
  // Stacks addresses start with SP (mainnet) or ST (testnet)
  const regex = /^(SP|ST)[0-9A-Z]{39}$/;
  return regex.test(address);
}

/**
 * Get short address display format
 */
export function formatAddress(address: string | null): string {
  if (!address) return '';
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

/**
 * Check if user has sufficient balance for transaction
 */
export async function checkSufficientBalance(
  address: string,
  amount: number,
  network: StacksNetwork
): Promise<boolean> {
  try {
    const apiUrl =
      network.isMainnet()
        ? 'https://api.mainnet.hiro.so'
        : 'https://api.testnet.hiro.so';

    const response = await fetch(`${apiUrl}/v2/accounts/${address}`);
    const data = await response.json();

    const balanceMicroStx = parseInt(data.balance, 10);
    const balanceStx = balanceMicroStx / 1_000_000;

    return balanceStx >= amount;
  } catch (error) {
    console.error('Error checking balance:', error);
    return false;
  }
}

/**
 * Get wallet connection status display
 */
export function getConnectionStatus(isConnected: boolean, address: string | null) {
  if (!isConnected || !address) {
    return {
      status: 'disconnected',
      message: 'Wallet not connected',
      color: 'gray',
    };
  }

  return {
    status: 'connected',
    message: formatAddress(address),
    color: 'green',
  };
}
