import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import Web3Service from '../components/services/Web3Service'; // Adjust path as needed

const useWalletStore = create(
  persist(
    (set, get) => ({
      // Wallet state
      account: '',
      isConnected: false,
      isLoading: false,
      error: null,
      web3Service: null, // Add web3Service to state
      
      // Actions
      setAccount: (account) => set({ account }),
      setIsConnected: (isConnected) => set({ isConnected }),
      setIsLoading: (isLoading) => set({ isLoading }),
      setError: (error) => set({ error }),
      setWeb3Service: (service) => set({ web3Service: service }),
      
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
            // Initialize Web3Service after successful wallet connection
            try {
              const web3ServiceInstance = new Web3Service();
              const account = await web3ServiceInstance.connectWallet();
              set({ 
                account: account, 
                isConnected: true, 
                isLoading: false,
                error: null,
                web3Service: web3ServiceInstance
              });
              return account;
            } catch (web3Error) {
              console.error('Web3Service initialization failed:', web3Error);
              // Still set wallet as connected even if Web3Service fails
              set({ 
                account: accounts[0], 
                isConnected: true, 
                isLoading: false,
                error: `Wallet connected but Web3Service failed: ${web3Error.message}`,
                web3Service: null
              });
              return accounts[0];
            }
          }
        } catch (error) {
          set({ 
            error: error.message, 
            isLoading: false,
            isConnected: false,
            account: '',
            web3Service: null
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
          error: null,
          web3Service: null
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
            // Try to initialize Web3Service if wallet is already connected
            try {
              const web3ServiceInstance = new Web3Service();
              await web3ServiceInstance.connectWallet();
              set({ 
                account: accounts[0], 
                isConnected: true,
                error: null,
                web3Service: web3ServiceInstance
              });
            } catch (web3Error) {
              console.error('Web3Service initialization failed on reconnect:', web3Error);
              set({ 
                account: accounts[0], 
                isConnected: true,
                error: null,
                web3Service: null
              });
            }
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
      },

      // Initialize Web3Service manually (if needed)
      initWeb3Service: async () => {
        try {
          const web3ServiceInstance = new Web3Service();
          await web3ServiceInstance.connectWallet();
          set({ web3Service: web3ServiceInstance, error: null });
          return web3ServiceInstance;
        } catch (error) {
          set({ error: `Web3Service initialization failed: ${error.message}` });
          throw error;
        }
      }
    }),
    {
      name: 'wallet-storage',
      partialize: (state) => ({ 
        account: state.account, 
        isConnected: state.isConnected 
      }), // Don't persist web3Service as it needs to be reinitialized
    }
  )
);

export default useWalletStore;