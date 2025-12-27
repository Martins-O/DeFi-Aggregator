import { useEffect, useState } from 'react';
import { AppConfig, UserSession, showConnect } from '@stacks/connect';
import { StacksTestnet, StacksMainnet } from '@stacks/network';

const appConfig = new AppConfig(['store_write', 'publish_data']);
const userSession = new UserSession({ appConfig });

interface WalletState {
  isConnected: boolean;
  address: string | null;
  network: 'testnet' | 'mainnet';
  userData: any | null;
}

export function useStacksWallet() {
  const [walletState, setWalletState] = useState<WalletState>({
    isConnected: false,
    address: null,
    network: (process.env.NEXT_PUBLIC_NETWORK as 'testnet' | 'mainnet') || 'testnet',
    userData: null,
  });

  useEffect(() => {
    if (userSession.isUserSignedIn()) {
      const userData = userSession.loadUserData();
      setWalletState({
        isConnected: true,
        address: userData.profile.stxAddress.testnet,
        network: 'testnet',
        userData,
      });
    }
  }, []);

  const connectWallet = () => {
    showConnect({
      appDetails: {
        name: 'sBTC DeFi Aggregator',
        icon: '/logo.png',
      },
      redirectTo: '/',
      onFinish: () => {
        const userData = userSession.loadUserData();
        setWalletState({
          isConnected: true,
          address: userData.profile.stxAddress.testnet,
          network: 'testnet',
          userData,
        });
      },
      userSession,
    });
  };

  const disconnectWallet = () => {
    userSession.signUserOut();
    setWalletState({
      isConnected: false,
      address: null,
      network: 'testnet',
      userData: null,
    });
  };

  const getNetwork = () => {
    return walletState.network === 'mainnet'
      ? new StacksMainnet()
      : new StacksTestnet();
  };

  return {
    ...walletState,
    connectWallet,
    disconnectWallet,
    getNetwork,
    userSession,
  };
}
