'use client';

import { useState } from 'react';
import ProtocolCard from '@/components/ProtocolCard';
import TransactionModal from '@/components/TransactionModal';
import WalletConnect from '@/components/WalletConnect';
import { useProtocolData } from '@/hooks/useProtocolData';
import { useRouter } from '@/hooks/useRouter';

export default function Dashboard() {
  const { protocols, loading, error } = useProtocolData();
  const { depositToProtocol, withdrawFromProtocol } = useRouter();
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProtocol, setSelectedProtocol] = useState<string | null>(null);
  const [transactionType, setTransactionType] = useState<'deposit' | 'withdraw'>('deposit');

  const handleDeposit = (protocolId: string) => {
    setSelectedProtocol(protocolId);
    setTransactionType('deposit');
    setModalOpen(true);
  };

  const handleWithdraw = (protocolId: string) => {
    setSelectedProtocol(protocolId);
    setTransactionType('withdraw');
    setModalOpen(true);
  };

  const handleConfirmTransaction = async (amount: string) => {
    if (!selectedProtocol) return;

    if (transactionType === 'deposit') {
      await depositToProtocol(selectedProtocol, amount);
    } else {
      await withdrawFromProtocol(selectedProtocol, amount);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black">
      {/* Header */}
      <header className="border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white">sBTC DeFi Aggregator</h1>
              <p className="text-gray-400 mt-1">Discover optimal yields across Stacks protocols</p>
            </div>
            <WalletConnect />
          </div>
        </div>
      </header>

      {/* Stats Overview */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6">
            <p className="text-gray-400 text-sm mb-2">Total Value Locked</p>
            <p className="text-2xl font-bold text-white">5,847 sBTC</p>
            <p className="text-green-500 text-sm mt-1">+12.5% this week</p>
          </div>
          <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6">
            <p className="text-gray-400 text-sm mb-2">Average APY</p>
            <p className="text-2xl font-bold text-orange-500">11.68%</p>
            <p className="text-gray-400 text-sm mt-1">Across all protocols</p>
          </div>
          <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6">
            <p className="text-gray-400 text-sm mb-2">Your Total Deposits</p>
            <p className="text-2xl font-bold text-white">0.00 sBTC</p>
            <p className="text-gray-400 text-sm mt-1">Connect wallet</p>
          </div>
          <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6">
            <p className="text-gray-400 text-sm mb-2">Projected Earnings</p>
            <p className="text-2xl font-bold text-green-500">0.00 sBTC</p>
            <p className="text-gray-400 text-sm mt-1">Annual estimate</p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-4 mb-6">
          <button className="px-4 py-2 bg-orange-500 text-white rounded-lg text-sm font-medium">
            All Protocols
          </button>
          <button className="px-4 py-2 bg-gray-800 text-gray-300 hover:bg-gray-700 rounded-lg text-sm font-medium transition-colors">
            DEX
          </button>
          <button className="px-4 py-2 bg-gray-800 text-gray-300 hover:bg-gray-700 rounded-lg text-sm font-medium transition-colors">
            Lending
          </button>
          <button className="px-4 py-2 bg-gray-800 text-gray-300 hover:bg-gray-700 rounded-lg text-sm font-medium transition-colors">
            Staking
          </button>
          <div className="ml-auto">
            <select className="px-4 py-2 bg-gray-800 text-white rounded-lg text-sm border border-gray-700">
              <option>Sort by: Highest APY</option>
              <option>Sort by: Lowest Risk</option>
              <option>Sort by: TVL</option>
            </select>
          </div>
        </div>

        {/* Protocol Cards */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
            <p className="text-gray-400 mt-4">Loading protocols...</p>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-500">{error}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {protocols.map((protocol) => (
              <ProtocolCard
                key={protocol.id}
                name={protocol.name}
                apy={protocol.apy}
                tvl={protocol.tvl}
                category={protocol.category}
                risk={protocol.risk}
              />
            ))}
          </div>
        )}
      </div>

      {/* Transaction Modal */}
      <TransactionModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        protocol={selectedProtocol || ''}
        type={transactionType}
        onConfirm={handleConfirmTransaction}
      />
    </div>
  );
}
