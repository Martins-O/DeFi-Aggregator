import { useState, useEffect } from 'react';
import { useWallet } from '@/contexts/WalletContext';

export type TransactionStatus = 'pending' | 'success' | 'failed' | 'unknown';

export function useTransactionStatus(txId: string | null) {
  const { getNetwork } = useWallet();
  const [status, setStatus] = useState<TransactionStatus>('unknown');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!txId) {
      setStatus('unknown');
      setLoading(false);
      return;
    }

    const checkStatus = async () => {
      setLoading(true);
      try {
        const network = getNetwork();
        const apiUrl = network.isMainnet()
          ? 'https://api.mainnet.hiro.so'
          : 'https://api.testnet.hiro.so';

        const response = await fetch(`${apiUrl}/extended/v1/tx/${txId}`);
        const data = await response.json();

        if (data.tx_status === 'success') {
          setStatus('success');
        } else if (data.tx_status === 'pending') {
          setStatus('pending');
        } else {
          setStatus('failed');
        }
      } catch (error) {
        console.error('Error checking transaction status:', error);
        setStatus('unknown');
      } finally {
        setLoading(false);
      }
    };

    checkStatus();

    // Poll every 5 seconds if pending
    const interval = setInterval(() => {
      if (status === 'pending') {
        checkStatus();
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [txId, status, getNetwork]);

  return { status, loading };
}
