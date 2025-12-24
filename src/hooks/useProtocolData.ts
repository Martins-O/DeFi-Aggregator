'use client';

import { useState, useEffect } from 'react';

interface ProtocolData {
  id: string;
  name: string;
  apy: number;
  tvl: string;
  category: 'DEX' | 'Lending' | 'Staking';
  risk: 'Low' | 'Medium' | 'High';
}

export function useProtocolData() {
  const [protocols, setProtocols] = useState<ProtocolData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProtocolData = async () => {
      try {
        setLoading(true);

        // Placeholder data - will be replaced with actual contract calls
        const mockData: ProtocolData[] = [
          {
            id: 'velar',
            name: 'Velar',
            apy: 12.5,
            tvl: '1,234 sBTC',
            category: 'DEX',
            risk: 'Medium'
          },
          {
            id: 'alex',
            name: 'ALEX',
            apy: 8.75,
            tvl: '2,156 sBTC',
            category: 'Lending',
            risk: 'Low'
          },
          {
            id: 'bitflow',
            name: 'Bitflow',
            apy: 15.2,
            tvl: '890 sBTC',
            category: 'DEX',
            risk: 'High'
          },
          {
            id: 'zest',
            name: 'Zest',
            apy: 10.3,
            tvl: '1,567 sBTC',
            category: 'Lending',
            risk: 'Medium'
          }
        ];

        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));

        setProtocols(mockData);
        setError(null);
      } catch (err) {
        setError('Failed to fetch protocol data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProtocolData();
  }, []);

  const refreshData = async () => {
    setLoading(true);
    // Trigger re-fetch
    await new Promise(resolve => setTimeout(resolve, 1000));
    setLoading(false);
  };

  return { protocols, loading, error, refreshData };
}
