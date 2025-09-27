"use client";

import { useEffect, useState } from 'react';
import useWalletStore from '@/zustand/walletStore';

// Production-safe wallet hook that handles SSR and hydration
export const useProductionWallet = () => {
  const [isClient, setIsClient] = useState(false);
  const walletStore = useWalletStore();

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Return safe defaults during SSR
  if (!isClient) {
    return {
      account: '',
      isConnected: false,
      isLoading: false,
      error: null,
      displayAddress: '',
      isReady: false,
      canTransact: false,
      connectWallet: () => {},
      disconnectWallet: () => {},
      checkConnection: () => Promise.resolve(false),
      formatAddress: () => '',
      getShortAddress: () => '',
      getWalletInfo: () => ({ address: '', isConnected: false, isReady: false })
    };
  }

  // Return actual wallet state on client-side
  return {
    // Wallet state
    account: walletStore.account,
    isConnected: walletStore.isConnected,
    isLoading: walletStore.isLoading,
    error: walletStore.error,
    
    // Wallet actions
    connectWallet: walletStore.connectWallet,
    disconnectWallet: walletStore.disconnectWallet,
    checkConnection: walletStore.checkConnection,
    
    // Helper functions
    formatAddress: walletStore.formatAddress,
    displayAddress: walletStore.formatAddress(walletStore.account),
    isReady: !walletStore.isLoading && (walletStore.isConnected || !walletStore.account),
    
    // Utility functions
    getShortAddress: (address) => {
      if (!address) return '';
      return `${address.slice(0, 6)}...${address.slice(-4)}`;
    },
    
    // Check if wallet is connected and ready
    canTransact: walletStore.isConnected && !walletStore.isLoading && walletStore.account,
    
    // Get wallet info for API calls
    getWalletInfo: () => ({
      address: walletStore.account,
      isConnected: walletStore.isConnected,
      isReady: !walletStore.isLoading && (walletStore.isConnected || !walletStore.account)
    })
  };
};

export default useProductionWallet;
