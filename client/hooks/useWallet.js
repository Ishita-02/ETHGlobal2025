import useWalletStore from '@/zustand/walletStore';

// Custom hook to access wallet state from anywhere in the app
export const useWallet = () => {
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

  return {
    account,
    isConnected,
    isLoading,
    error,
    connectWallet,
    disconnectWallet,
    checkConnection,
    formatAddress,
    // Helper to get formatted address
    displayAddress: formatAddress(account),
    // Helper to check if wallet is ready
    isReady: !isLoading && (isConnected || !account)
  };
};

export default useWallet;
