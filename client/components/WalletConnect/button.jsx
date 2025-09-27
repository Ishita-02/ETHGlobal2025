
"use client";

import { useEffect } from 'react';
import useWalletStore from '@/zustand/walletStore';

// Spinner component
const Spinner = () => (
  <svg 
    className="animate-spin h-4 w-4 text-white" 
    xmlns="http://www.w3.org/2000/svg" 
    fill="none" 
    viewBox="0 0 24 24"
  >
    <circle 
      className="opacity-25" 
      cx="12" 
      cy="12" 
      r="10" 
      stroke="currentColor" 
      strokeWidth="4"
    />
    <path 
      className="opacity-75" 
      fill="currentColor" 
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
    />
  </svg>
);

const ConnectButton = () => {
  const {
    account,
    isConnected,
    isLoading,
    error,
    connectWallet,
    disconnectWallet,
    checkConnection,
    formatAddress
  } = useWalletStore();

  // Check if MetaMask is installed
  const isMetaMaskInstalled = () => {
    return typeof window !== 'undefined' && typeof window.ethereum !== 'undefined';
  };

  // Handle connect wallet
  const handleConnect = async () => {
    if (!isMetaMaskInstalled()) {
      alert('Please install MetaMask to use this feature!');
      return;
    }

    try {
      await connectWallet();
    } catch (error) {
      console.error('Error connecting to MetaMask:', error);
      alert('Failed to connect to MetaMask. Please try again.');
    }
  };

  // Check existing connection and listen for changes
  useEffect(() => {
    const initializeWallet = async () => {
      await checkConnection();
    };

    initializeWallet();

    // Listen for account changes
    if (isMetaMaskInstalled()) {
      const handleAccountsChanged = (accounts) => {
        if (accounts.length > 0) {
          useWalletStore.getState().setAccount(accounts[0]);
          useWalletStore.getState().setIsConnected(true);
        } else {
          useWalletStore.getState().disconnectWallet();
        }
      };

      window.ethereum.on('accountsChanged', handleAccountsChanged);

      // Cleanup listener on unmount
      return () => {
        if (window.ethereum.removeListener) {
          window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        }
      };
    }
  }, [checkConnection]);

  return (
    <div className="flex items-center space-x-4">
      {!isConnected ? (
        <button
          onClick={handleConnect}
          disabled={isLoading}
          className="px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex items-center space-x-2"
        >
          {isLoading ? (
            <>
              <Spinner />
              <span>Connecting...</span>
            </>
          ) : (
            'Connect Wallet'
          )}
        </button>
      ) : (
        <div className="flex items-center space-x-3">
          <div className="px-4 py-2 bg-green-100 text-green-800 rounded-lg">
            <span className="font-medium">Connected:</span>
            <span className="ml-2 font-mono">{formatAddress(account)}</span>
          </div>
          <button
            onClick={disconnectWallet}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-200"
          >
            Disconnect
          </button>
        </div>
      )}
    </div>
  );
};

export default ConnectButton;