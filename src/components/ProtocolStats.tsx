'use client';

import { useProtocolAPY } from '@/hooks/useProtocolAPY';

interface ProtocolStatsProps {
  protocolId: string;
  protocolName: string;
  adapterContract: string;
  tvl?: number;
}

export default function ProtocolStats({
  protocolId,
  protocolName,
  adapterContract,
  tvl = 0,
}: ProtocolStatsProps) {
  const { apy, loading, error } = useProtocolAPY(protocolId, adapterContract);

  if (loading) {
    return (
      <div className="bg-gray-800 rounded-lg p-6 animate-pulse">
        <div className="h-6 bg-gray-700 rounded w-32 mb-4"></div>
        <div className="h-10 bg-gray-700 rounded w-24"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gray-800 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-2">{protocolName}</h3>
        <p className="text-sm text-red-400">Failed to load APY</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 rounded-lg p-6 hover:bg-gray-750 transition-colors">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">{protocolName}</h3>
        <span className="text-xs text-gray-400 uppercase">{protocolId}</span>
      </div>

      <div className="space-y-3">
        <div>
          <p className="text-sm text-gray-400 mb-1">Current APY</p>
          <p className="text-3xl font-bold text-orange-500">{apy.toFixed(2)}%</p>
        </div>

        {tvl > 0 && (
          <div>
            <p className="text-sm text-gray-400 mb-1">Total Value Locked</p>
            <p className="text-xl font-semibold">${(tvl / 1_000_000).toFixed(2)}M</p>
          </div>
        )}
      </div>
    </div>
  );
}
