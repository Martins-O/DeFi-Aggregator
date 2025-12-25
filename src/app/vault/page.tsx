'use client';

import { useState, useEffect } from 'react';
import WalletConnect from '@/components/WalletConnect';
import { useVault } from '@/hooks/useVault';

export default function VaultPage() {
  const { vaults, loading, createVault, depositToVault } = useVault();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedStrategy, setSelectedStrategy] = useState('max-yield');

  const strategies = [
    {
      id: 'max-yield',
      name: 'Maximum Yield',
      description: 'Automatically rebalance to highest APY protocol',
      risk: 'High',
      targetAPY: '14-18%'
    },
    {
      id: 'balanced',
      name: 'Balanced',
      description: 'Balance between yield and risk',
      risk: 'Medium',
      targetAPY: '10-14%'
    },
    {
      id: 'conservative',
      name: 'Conservative',
      description: 'Focus on established protocols with lower risk',
      risk: 'Low',
      targetAPY: '7-10%'
    }
  ];

  const handleCreateVault = async () => {
    const vaultId = await createVault(selectedStrategy);
    if (vaultId !== null) {
      setShowCreateModal(false);
      console.log('Vault created:', vaultId);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black">
      {/* Header */}
      <header className="border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white">Auto-Rebalancing Vaults</h1>
              <p className="text-gray-400 mt-1">Set it and forget it - optimize yields automatically</p>
            </div>
            <WalletConnect />
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6">
            <p className="text-gray-400 text-sm mb-2">Your Vaults</p>
            <p className="text-2xl font-bold text-white">{vaults.length}</p>
          </div>
          <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6">
            <p className="text-gray-400 text-sm mb-2">Total Deposited</p>
            <p className="text-2xl font-bold text-white">0.00 sBTC</p>
          </div>
          <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6">
            <p className="text-gray-400 text-sm mb-2">Average Vault APY</p>
            <p className="text-2xl font-bold text-orange-500">0.00%</p>
          </div>
        </div>

        {/* Create Vault Button */}
        <div className="mb-8">
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-medium transition-colors"
          >
            + Create New Vault
          </button>
        </div>

        {/* Available Strategies */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-white mb-4">Available Strategies</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {strategies.map((strategy) => (
              <div
                key={strategy.id}
                className="border border-gray-700 rounded-lg p-6 bg-gray-800/50"
              >
                <h3 className="text-lg font-semibold text-white mb-2">{strategy.name}</h3>
                <p className="text-gray-400 text-sm mb-4">{strategy.description}</p>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-400 text-sm">Risk Level:</span>
                  <span className={`text-sm px-2 py-1 rounded ${
                    strategy.risk === 'Low' ? 'text-green-500 bg-green-500/10' :
                    strategy.risk === 'Medium' ? 'text-yellow-500 bg-yellow-500/10' :
                    'text-red-500 bg-red-500/10'
                  }`}>
                    {strategy.risk}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 text-sm">Target APY:</span>
                  <span className="text-orange-500 font-semibold">{strategy.targetAPY}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Your Vaults */}
        <div>
          <h2 className="text-xl font-bold text-white mb-4">Your Vaults</h2>
          {vaults.length === 0 ? (
            <div className="border border-gray-700 rounded-lg p-12 text-center bg-gray-800/50">
              <p className="text-gray-400">You don't have any vaults yet.</p>
              <p className="text-gray-500 text-sm mt-2">Create a vault to start earning optimized yields automatically.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {vaults.map((vault) => (
                <div
                  key={vault.id}
                  className="border border-gray-700 rounded-lg p-6 bg-gray-800/50"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-white">
                        Vault #{vault.id}
                      </h3>
                      <p className="text-gray-400 text-sm mt-1">
                        Strategy: {vault.strategy}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-400">Current APY</p>
                      <p className="text-xl font-bold text-orange-500">{vault.apy}%</p>
                    </div>
                  </div>
                  <div className="mt-4 grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-400">Total Deposited</p>
                      <p className="text-white font-medium">{vault.totalDeposited}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Status</p>
                      <p className={`font-medium ${vault.active ? 'text-green-500' : 'text-red-500'}`}>
                        {vault.active ? 'Active' : 'Inactive'}
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 flex gap-2">
                    <button className="flex-1 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-sm font-medium transition-colors">
                      Deposit
                    </button>
                    <button className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-sm font-medium transition-colors">
                      Withdraw
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Create Vault Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 max-w-lg w-full mx-4">
            <h2 className="text-xl font-bold text-white mb-4">Create New Vault</h2>

            <div className="space-y-4 mb-6">
              <p className="text-gray-400 text-sm">Select your preferred strategy:</p>
              {strategies.map((strategy) => (
                <label
                  key={strategy.id}
                  className={`flex items-start p-4 border rounded-lg cursor-pointer transition-colors ${
                    selectedStrategy === strategy.id
                      ? 'border-orange-500 bg-orange-500/10'
                      : 'border-gray-700 hover:border-gray-600'
                  }`}
                >
                  <input
                    type="radio"
                    name="strategy"
                    value={strategy.id}
                    checked={selectedStrategy === strategy.id}
                    onChange={(e) => setSelectedStrategy(e.target.value)}
                    className="mt-1"
                  />
                  <div className="ml-3">
                    <p className="font-semibold text-white">{strategy.name}</p>
                    <p className="text-sm text-gray-400">{strategy.description}</p>
                    <div className="flex gap-4 mt-2">
                      <span className="text-xs text-gray-500">Risk: {strategy.risk}</span>
                      <span className="text-xs text-orange-500">APY: {strategy.targetAPY}</span>
                    </div>
                  </div>
                </label>
              ))}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowCreateModal(false)}
                className="flex-1 px-4 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateVault}
                className="flex-1 px-4 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-medium transition-colors"
              >
                Create Vault
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
