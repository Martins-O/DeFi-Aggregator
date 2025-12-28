'use client';

import { useAccountBalance } from '@/hooks/useAccountBalance';
import { useWallet } from '@/contexts/WalletContext';

export default function WalletBalance() {
  const { isConnected } = useWallet();
  const { stx, unlocked, loading, error } = useAccountBalance();

  if (!isConnected) {
    return null;
  }

  if (loading) {
    return (
      <div className="bg-gray-800 rounded-lg p-4 animate-pulse">
        <div className="h-4 bg-gray-700 rounded w-24 mb-2"></div>
        <div className="h-6 bg-gray-700 rounded w-32"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-900/20 border border-red-800 rounded-lg p-4">
        <p className="text-sm text-red-400">Failed to load balance</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 rounded-lg p-4">
      <p className="text-sm text-gray-400 mb-1">Available Balance</p>
      <div className="flex items-baseline gap-2">
        <p className="text-2xl font-bold text-white">
          {unlocked.toFixed(2)}
        </p>
        <p className="text-sm text-gray-400">STX</p>
      </div>
      {stx !== unlocked && (
        <p className="text-xs text-gray-500 mt-1">
          Total: {stx.toFixed(2)} STX
        </p>
      )}
    </div>
  );
}
