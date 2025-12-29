'use client';

import { useVaultData } from '@/hooks/useVaultData';

interface VaultCardProps {
  vaultId: string;
  vaultManagerContract: string;
}

export default function VaultCard({ vaultId, vaultManagerContract }: VaultCardProps) {
  const { vaultInfo, loading, error } = useVaultData(vaultId, vaultManagerContract);

  if (loading) {
    return (
      <div className="bg-gray-800 rounded-lg p-6 animate-pulse">
        <div className="h-6 bg-gray-700 rounded w-32 mb-4"></div>
        <div className="h-10 bg-gray-700 rounded w-24"></div>
      </div>
    );
  }

  if (error || !vaultInfo) {
    return (
      <div className="bg-gray-800 rounded-lg p-6">
        <p className="text-red-400">Failed to load vault</p>
      </div>
    );
  }

  const strategyColor = {
    'max-yield': 'text-orange-500',
    'balanced': 'text-blue-500',
    'conservative': 'text-green-500',
  }[vaultInfo.strategy] || 'text-gray-400';

  return (
    <div className="bg-gray-800 rounded-lg p-6 hover:bg-gray-750 transition-colors">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">{vaultId}</h3>
        <span className={`text-sm font-medium ${strategyColor}`}>
          {vaultInfo.strategy}
        </span>
      </div>

      <div className="space-y-3">
        <div>
          <p className="text-sm text-gray-400 mb-1">Balance</p>
          <p className="text-2xl font-bold">
            {(vaultInfo.balance / 1_000_000).toFixed(2)} STX
          </p>
        </div>

        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-400">Owner</span>
          <span className="font-mono text-xs">
            {vaultInfo.owner.slice(0, 8)}...{vaultInfo.owner.slice(-6)}
          </span>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-700 flex gap-2">
        <button className="flex-1 px-4 py-2 bg-orange-500 hover:bg-orange-600 rounded-lg text-sm font-medium transition-colors">
          Deposit
        </button>
        <button className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm font-medium transition-colors">
          Withdraw
        </button>
      </div>
    </div>
  );
}
