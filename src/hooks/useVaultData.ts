import { useState, useEffect } from 'react';
import { useWallet } from '@/contexts/WalletContext';
import { callReadOnlyFunction, cvToJSON } from '@stacks/transactions';

interface VaultInfo {
  vaultId: string;
  strategy: string;
  balance: number;
  owner: string;
  createdAt: number;
}

export function useVaultData(vaultId: string, vaultManagerContract: string) {
  const { getNetwork } = useWallet();
  const [vaultInfo, setVaultInfo] = useState<VaultInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVaultInfo = async () => {
      if (!vaultId || !vaultManagerContract) {
        setLoading(false);
        return;
      }

      try {
        const [contractAddress, contractName] = vaultManagerContract.split('.');
        const network = getNetwork();

        const response = await callReadOnlyFunction({
          contractAddress,
          contractName,
          functionName: 'get-vault-info',
          functionArgs: [],
          network,
          senderAddress: contractAddress,
        });

        const result = cvToJSON(response);

        if (result.value) {
          setVaultInfo({
            vaultId,
            strategy: result.value.strategy,
            balance: result.value.balance,
            owner: result.value.owner,
            createdAt: result.value['created-at'],
          });
          setError(null);
        } else {
          setError('Vault not found');
        }
      } catch (err) {
        console.error('Error fetching vault info:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchVaultInfo();
  }, [vaultId, vaultManagerContract, getNetwork]);

  return { vaultInfo, loading, error };
}
