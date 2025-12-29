import { useEffect, useState } from 'use';
import { useWallet } from '@/contexts/WalletContext';
import { callReadOnlyFunction, cvToJSON } from '@stacks/transactions';

interface ProtocolAPY {
  protocolId: string;
  apy: number;
  loading: boolean;
  error: string | null;
}

export function useProtocolAPY(protocolId: string, adapterContract: string) {
  const { getNetwork } = useWallet();
  const [data, setData] = useState<ProtocolAPY>({
    protocolId,
    apy: 0,
    loading: true,
    error: null,
  });

  useEffect(() => {
    const fetchAPY = async () => {
      try {
        const [contractAddress, contractName] = adapterContract.split('.');
        const network = getNetwork();

        const response = await callReadOnlyFunction({
          contractAddress,
          contractName,
          functionName: 'get-apy',
          functionArgs: [],
          network,
          senderAddress: contractAddress,
        });

        const result = cvToJSON(response);
        const apyValue = result.value / 100; // Convert basis points to percentage

        setData({
          protocolId,
          apy: apyValue,
          loading: false,
          error: null,
        });
      } catch (error) {
        console.error(`Error fetching APY for ${protocolId}:`, error);
        setData({
          protocolId,
          apy: 0,
          loading: false,
          error: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    };

    fetchAPY();
  }, [protocolId, adapterContract, getNetwork]);

  return data;
}
