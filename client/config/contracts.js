// Contract configuration for the application
export const CONTRACT_ADDRESSES = {
  // Identity Manager Contract
  IDENTITY_MANAGER: "0x73b0F0bFd958b6F6119dE09A48543B2FB7264369",
  
  // Property Marketplace Contract
  PROPERTY_MARKETPLACE: "0x3E5D98d46dF81f78513dFBfb63Eb43715B2EA754",
  
  // Network Configuration
  NETWORK: "flow_testnet",
  RPC_URL: "https://flow-testnet.g.alchemy.com/v2/aPDm94kJp0lgvlIMHTE6T_TYvl2JrnG0",
  CHAIN_ID: 123, // Flow testnet chain ID
};

// Environment-specific configuration
export const getContractAddresses = () => {
  if (typeof window === 'undefined') {
    // Server-side: use environment variables or defaults
    return {
      IDENTITY_MANAGER: process.env.NEXT_PUBLIC_IDENTITY_MANAGER_ADDRESS || CONTRACT_ADDRESSES.IDENTITY_MANAGER,
      PROPERTY_MARKETPLACE: process.env.NEXT_PUBLIC_PROPERTY_MARKETPLACE_ADDRESS || CONTRACT_ADDRESSES.PROPERTY_MARKETPLACE,
      NETWORK: process.env.NEXT_PUBLIC_NETWORK_NAME || CONTRACT_ADDRESSES.NETWORK,
      RPC_URL: process.env.NEXT_PUBLIC_RPC_URL || CONTRACT_ADDRESSES.RPC_URL,
    };
  }
  
  // Client-side: use the configured addresses
  return CONTRACT_ADDRESSES;
};

export default CONTRACT_ADDRESSES;
