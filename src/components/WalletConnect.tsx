'use client';

import { useEffect, useState } from 'react';

export default function WalletConnect() {
  const [isConnected, setIsConnected] = useState(false);
  const [address, setAddress] = useState<string | null>(null);

  const connectWallet = async () => {
    try {
      // Placeholder for Reown AppKit integration
      // Will be implemented with actual Reown AppKit setup
      console.log('Connecting wallet...');
      setIsConnected(true);
      setAddress('SP2...');
    } catch (error) {
      console.error('Failed to connect wallet:', error);
    }
  };

  const disconnectWallet = () => {
    setIsConnected(false);
    setAddress(null);
  };

  return (
    <div className="flex items-center gap-4">
      {!isConnected ? (
        <button
          onClick={connectWallet}
          className="px-6 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-medium transition-colors"
        >
          Connect Wallet
        </button>
      ) : (
        <div className="flex items-center gap-3">
          <div className="px-4 py-2 bg-gray-800 rounded-lg">
            <p className="text-sm text-gray-400">Connected</p>
            <p className="text-sm font-mono">{address?.slice(0, 8)}...{address?.slice(-6)}</p>
          </div>
          <button
            onClick={disconnectWallet}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-sm transition-colors"
          >
            Disconnect
          </button>
        </div>
      )}
    </div>
  );
}
