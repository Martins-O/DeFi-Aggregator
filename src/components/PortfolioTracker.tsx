'use client';

import { useState, useEffect } from 'react';
import { useWallet } from '@/contexts/WalletContext';
import { useAccountBalance } from '@/hooks/useAccountBalance';

interface PortfolioPosition {
  protocol: string;
  amount: number;
  value: number;
  apy: number;
}

export default function PortfolioTracker() {
  const { isConnected, address } = useWallet();
  const { stx } = useAccountBalance();
  const [positions, setPositions] = useState<PortfolioPosition[]>([]);
  const [totalValue, setTotalValue] = useState(0);

  useEffect(() => {
    if (!isConnected || !address) {
      setPositions([]);
      setTotalValue(0);
      return;
    }

    // TODO: Fetch actual positions from contracts
    // This is placeholder data
    const mockPositions: PortfolioPosition[] = [];
    setPositions(mockPositions);
    setTotalValue(mockPositions.reduce((sum, pos) => sum + pos.value, 0));
  }, [isConnected, address]);

  if (!isConnected) {
    return (
      <div className="bg-gray-800 rounded-lg p-8 text-center">
        <p className="text-gray-400">Connect your wallet to view portfolio</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-6">Your Portfolio</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-gray-700 rounded-lg p-4">
          <p className="text-sm text-gray-400 mb-1">Total Value</p>
          <p className="text-2xl font-bold text-white">
            {totalValue.toFixed(2)} STX
          </p>
        </div>

        <div className="bg-gray-700 rounded-lg p-4">
          <p className="text-sm text-gray-400 mb-1">Available Balance</p>
          <p className="text-2xl font-bold text-white">
            {stx.toFixed(2)} STX
          </p>
        </div>

        <div className="bg-gray-700 rounded-lg p-4">
          <p className="text-sm text-gray-400 mb-1">Active Positions</p>
          <p className="text-2xl font-bold text-white">{positions.length}</p>
        </div>
      </div>

      {positions.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-400">No active positions</p>
          <p className="text-sm text-gray-500 mt-2">
            Start depositing to protocols to see your portfolio
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {positions.map((position, index) => (
            <div
              key={index}
              className="bg-gray-700 rounded-lg p-4 flex items-center justify-between"
            >
              <div>
                <p className="font-semibold">{position.protocol}</p>
                <p className="text-sm text-gray-400">
                  {position.amount.toFixed(4)} STX
                </p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-orange-500">
                  {position.apy.toFixed(2)}% APY
                </p>
                <p className="text-sm text-gray-400">
                  ${position.value.toFixed(2)}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
