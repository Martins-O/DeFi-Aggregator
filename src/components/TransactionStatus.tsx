'use client';

import { useTransactionStatus } from '@/hooks/useTransactionStatus';
import { LoadingSpinner } from './Loading';

interface TransactionStatusProps {
  txId: string | null;
  onComplete?: () => void;
}

export default function TransactionStatus({ txId, onComplete }: TransactionStatusProps) {
  const { status, loading } = useTransactionStatus(txId);

  if (!txId) return null;

  const statusConfig = {
    pending: {
      color: 'text-yellow-500',
      bg: 'bg-yellow-500/20',
      border: 'border-yellow-500/50',
      message: 'Transaction pending...',
      icon: <LoadingSpinner size="sm" />,
    },
    success: {
      color: 'text-green-500',
      bg: 'bg-green-500/20',
      border: 'border-green-500/50',
      message: 'Transaction successful!',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      ),
    },
    failed: {
      color: 'text-red-500',
      bg: 'bg-red-500/20',
      border: 'border-red-500/50',
      message: 'Transaction failed',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      ),
    },
    unknown: {
      color: 'text-gray-500',
      bg: 'bg-gray-500/20',
      border: 'border-gray-500/50',
      message: 'Checking transaction...',
      icon: <LoadingSpinner size="sm" />,
    },
  };

  const config = statusConfig[status];

  return (
    <div className={`flex items-center gap-3 p-4 rounded-lg border ${config.bg} ${config.border}`}>
      <div className={config.color}>{config.icon}</div>
      <div className="flex-1">
        <p className={`font-medium ${config.color}`}>{config.message}</p>
        <p className="text-xs text-gray-400 mt-1 font-mono">
          {txId.slice(0, 8)}...{txId.slice(-8)}
        </p>
      </div>
      {status === 'success' && onComplete && (
        <button
          onClick={onComplete}
          className="px-3 py-1 bg-green-600 hover:bg-green-700 rounded text-sm transition-colors"
        >
          Done
        </button>
      )}
    </div>
  );
}
