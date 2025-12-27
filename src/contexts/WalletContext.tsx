'use client';

import React, { createContext, useContext, ReactNode } from 'react';
import { useStacksWallet } from '@/hooks/useStacksWallet';
import { UserSession } from '@stacks/connect';
import { StacksNetwork } from '@stacks/network';

interface WalletContextType {
  isConnected: boolean;
  address: string | null;
  network: 'testnet' | 'mainnet';
  userData: any | null;
  connectWallet: () => void;
  disconnectWallet: () => void;
  getNetwork: () => StacksNetwork;
  userSession: UserSession;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export function WalletProvider({ children }: { children: ReactNode }) {
  const wallet = useStacksWallet();

  return (
    <WalletContext.Provider value={wallet}>
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
}
