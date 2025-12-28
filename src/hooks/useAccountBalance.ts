import { useEffect, useState } from 'react';
import { useWallet } from '@/contexts/WalletContext';

interface AccountBalance {
  stx: number;
  locked: number;
  unlocked: number;
  loading: boolean;
  error: string | null;
}

export function useAccountBalance() {
  const { address, network, isConnected } = useWallet();
  const [balance, setBalance] = useState<AccountBalance>({
    stx: 0,
    locked: 0,
    unlocked: 0,
    loading: false,
    error: null,
  });

  useEffect(() => {
    if (!isConnected || !address) {
      setBalance({
        stx: 0,
        locked: 0,
        unlocked: 0,
        loading: false,
        error: null,
      });
      return;
    }

    const fetchBalance = async () => {
      setBalance(prev => ({ ...prev, loading: true, error: null }));

      try {
        const apiUrl =
          network === 'mainnet'
            ? 'https://api.mainnet.hiro.so'
            : 'https://api.testnet.hiro.so';

        const response = await fetch(`${apiUrl}/v2/accounts/${address}`);

        if (!response.ok) {
          throw new Error('Failed to fetch account balance');
        }

        const data = await response.json();

        const stxBalance = parseInt(data.balance, 10) / 1_000_000;
        const lockedBalance = parseInt(data.locked, 10) / 1_000_000;
        const unlockedBalance = stxBalance - lockedBalance;

        setBalance({
          stx: stxBalance,
          locked: lockedBalance,
          unlocked: unlockedBalance,
          loading: false,
          error: null,
        });
      } catch (error) {
        console.error('Error fetching balance:', error);
        setBalance(prev => ({
          ...prev,
          loading: false,
          error: error instanceof Error ? error.message : 'Unknown error',
        }));
      }
    };

    fetchBalance();

    // Refresh balance every 30 seconds
    const interval = setInterval(fetchBalance, 30000);

    return () => clearInterval(interval);
  }, [address, network, isConnected]);

  return balance;
}
