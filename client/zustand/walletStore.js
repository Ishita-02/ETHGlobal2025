import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useWalletStore = create(
  persist(
    (set, get) => ({
      // Wallet state
      account: '',
      isConnected: false,
      isLoading: false,
      error: null,
      
      // Actions
      setAccount: (account) => set({ account }),
      setIsConnected: (isConnected) => set({ isConnected }),
      setIsLoading: (isLoading) => set({ isLoading }),
      setError: (error) => set({ error }),
      
      // Connect wallet
      connectWallet: async () => {
        set({ isLoading: true, error: null });
        
        try {
          if (typeof window === 'undefined' || !window.ethereum) {
            throw new Error('MetaMask is not installed');
          }

          const accounts = await window.ethereum.request({
            method: 'eth_requestAccounts',
          });

          if (accounts.length > 0) {
            set({ 
              account: accounts[0], 
              isConnected: true, 
              isLoading: false,
              error: null 
            });
            return accounts[0];
          }
        } catch (error) {
          set({ 
            error: error.message, 
            isLoading: false,
            isConnected: false,
            account: ''
          });
          throw error;
        }
      },
      
      // Disconnect wallet
      disconnectWallet: () => {
        set({ 
          account: '', 
          isConnected: false, 
          isLoading: false,
          error: null 
        });
      },
      
      // Check existing connection
      checkConnection: async () => {
        if (typeof window === 'undefined' || !window.ethereum) {
          return false;
        }

        try {
          const accounts = await window.ethereum.request({
            method: 'eth_accounts',
          });
          
          if (accounts.length > 0) {
            set({ 
              account: accounts[0], 
              isConnected: true,
              error: null 
            });
            return true;
          }
        } catch (error) {
          console.error('Error checking connection:', error);
        }
        
        return false;
      },
      
      // Format address for display
      formatAddress: (address) => {
        if (!address) return '';
        return `${address.slice(0, 6)}...${address.slice(-4)}`;
      }
    }),
    {
      name: 'wallet-storage', // unique name for localStorage key
      partialize: (state) => ({ 
        account: state.account, 
        isConnected: state.isConnected 
      }), // only persist these fields
    }
  )
);

export default useWalletStore;
