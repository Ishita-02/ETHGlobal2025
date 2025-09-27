"use client";

import useWallet from '@/hooks/useWallet';

// Example component showing how to use wallet state anywhere in the app
const WalletInfo = () => {
  const { account, isConnected, isLoading, displayAddress } = useWallet();

  if (isLoading) {
    return (
      <div className="p-4 bg-blue-50 rounded-lg">
        <p className="text-blue-600">Loading wallet...</p>
      </div>
    );
  }

  if (!isConnected) {
    return (
      <div className="p-4 bg-gray-50 rounded-lg">
        <p className="text-gray-600">Wallet not connected</p>
      </div>
    );
  }

  return (
    <div className="p-4 bg-green-50 rounded-lg">
      <p className="text-green-600">
        Wallet connected: <span className="font-mono">{displayAddress}</span>
      </p>
    </div>
  );
};

export default WalletInfo;
