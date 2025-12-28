'use client';

import { useState } from 'react';
import { useWallet } from '@/contexts/WalletContext';
import { useAccountBalance } from '@/hooks/useAccountBalance';

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  protocol: string;
  type: 'deposit' | 'withdraw';
  onConfirm: (amount: string) => Promise<void>;
}

export default function TransactionModal({
  isOpen,
  onClose,
  protocol,
  type,
  onConfirm
}: TransactionModalProps) {
  const [amount, setAmount] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const { isConnected, connectWallet } = useWallet();
  const { unlocked } = useAccountBalance();

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isConnected) {
      connectWallet();
      return;
    }

    const amountNum = parseFloat(amount);
    if (type === 'deposit' && amountNum > unlocked) {
      alert('Insufficient balance');
      return;
    }

    setIsProcessing(true);
    try {
      await onConfirm(amount);
      setAmount('');
      onClose();
    } catch (error) {
      console.error('Transaction failed:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const setMaxAmount = () => {
    if (type === 'deposit' && unlocked > 0) {
      setAmount(unlocked.toString());
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold">
            {type === 'deposit' ? 'Deposit' : 'Withdraw'} sBTC
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm text-gray-400 mb-2">
              Protocol
            </label>
            <div className="px-4 py-3 bg-gray-700 rounded-lg">
              <p className="font-medium">{protocol}</p>
            </div>
          </div>

          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm text-gray-400">
                Amount (sBTC)
              </label>
              {isConnected && type === 'deposit' && (
                <button
                  type="button"
                  onClick={setMaxAmount}
                  className="text-xs text-orange-500 hover:text-orange-400"
                >
                  Max: {unlocked.toFixed(4)} STX
                </button>
              )}
            </div>
            <input
              type="number"
              step="0.00000001"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.0"
              className="w-full px-4 py-3 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              required
            />
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg font-medium transition-colors"
              disabled={isProcessing}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-3 bg-orange-500 hover:bg-orange-600 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isProcessing}
            >
              {!isConnected
                ? 'Connect Wallet'
                : isProcessing
                ? 'Processing...'
                : 'Confirm'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
