"use client";

import { useEffect } from 'react';
import useWalletStore from '@/zustand/walletStore';

// Global wallet provider that initializes wallet state on app load
const WalletProvider = ({ children }) => {
  const { checkConnection } = useWalletStore();

  useEffect(() => {
    // Initialize wallet connection on app load
    const initializeWallet = async () => {
      try {
        await checkConnection();
        console.log('🔗 Wallet state initialized from localStorage');
      } catch (error) {
        console.error('❌ Failed to initialize wallet:', error);
      }
    };

    initializeWallet();
  }, [checkConnection]);

  return children;
};

export default WalletProvider;
