"use client";

import { useEffect, useState } from 'react';
import useProductionWallet from '@/app/hooks/useProductionWallet';

// Example of a production-safe component
const ProductionSafeComponent = () => {
  const { account, isConnected, displayAddress, canTransact } = useProductionWallet();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Prevent hydration mismatch
  if (!mounted) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-4 border rounded">
      <h3>Production-Safe Wallet Component</h3>
      <p>Connected: {isConnected ? 'Yes' : 'No'}</p>
      <p>Address: {displayAddress || 'Not connected'}</p>
      <p>Can Transact: {canTransact ? 'Yes' : 'No'}</p>
    </div>
  );
};

export default ProductionSafeComponent;
