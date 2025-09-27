"use client";

import { useEffect, useState } from 'react';
import useWalletStore from '@/zustand/walletStore';

// Production-safe wallet provider that handles SSR and hydration
const ProductionWalletProvider = ({ children }) => {
  const { checkConnection } = useWalletStore();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // Mark as client-side
    setIsClient(true);
    
    // Initialize wallet connection on app load
    const initializeWallet = async () => {
      try {
        await checkConnection();
        console.log('🔗 Wallet state initialized from localStorage');
      } catch (error) {
        console.error('❌ Failed to initialize wallet:', error);
      }
    };

    // Only initialize on client-side
    if (typeof window !== 'undefined') {
      initializeWallet();
    }
  }, [checkConnection]);

  // Prevent hydration mismatch by not rendering wallet-dependent content on server
  if (!isClient) {
    return children;
  }

  return children;
};

export default ProductionWalletProvider;
