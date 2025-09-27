// Web3 Service for interacting with the DataMarketplace smart contract
import Web3 from 'web3';
import identityManagerABI from '@/app/abis/IdentityManager';
import propertyMarketplaceABI from '@/app/abis/PropertyMarketplace';
import propertyTokenABI from '@/app/abis/PropertyToken';

class Web3Service {
  constructor() {

    this.propertyTokenContract = null;
    this.identityManagerContract = null;
    this.propertyMarketplaceContract = null;
    
    this.account = null;
    this.identityManager = "0x73b0F0bFd958b6F6119dE09A48543B2FB7264369"
    this.propertyMarketplaceABI = propertyMarketplaceABI;
    this.identityManagerABI = identityManagerABI;
    this.propertyTokenABI = propertyTokenABI;
    
    // Replace with your deployed contract address
    this.propertyMarketplace = "0x892289a0cBc5A41e2bD46b462310546cEf46cc97";

  }

  
  async init() {
    if (typeof window.ethereum !== 'undefined') {
      // Modern dapp browsers
      this.web3 = new Web3("https://flow-testnet.g.alchemy.com/v2/aPDm94kJp0lgvlIMHTE6T_TYvl2JrnG0"); 
      
      try {
        // Request account access
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        const accounts = await this.web3.eth.getAccounts();
        this.account = accounts[0];
        console.log("account", this.account)

        window.ethereum.on('accountsChanged', (newAccounts) => {
          console.log("Wallet account changed to:", newAccounts[0]);
         
          window.location.reload(); 
        });
        
        // Initialize contract
        this.propertyMarketplaceContract = new this.web3.eth.Contract(this.propertyMarketplaceABI, this.propertyMarketplace);
        this.identityManagerContract = new this.web3.eth.Contract(this.identityManagerABI, this.identityManager);
        
        return true;
      } catch (error) {
        console.error("User denied account access");
        return false;
      }
    } else {
      console.error("No ethereum provider detected");
      return false;
    }
  }

  async connectWallet() {
    if (typeof window.ethereum === 'undefined') {
      throw new Error("No Ethereum provider found. Please install MetaMask.");
    }
    
    this.web3 = new Web3(window.ethereum);
    
    // This triggers the MetaMask pop-up for the user to select an account
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    if (accounts.length === 0) {
      throw new Error("No accounts found. Please connect an account in MetaMask.");
    }
    
    this.account = accounts[0]; // Set the account to the one the user selected

    // Initialize contracts with the user's provider and account
    this.contract = new this.web3.eth.Contract(this.contractABI, this.contractAddress);
    this.tokenContract = new this.web3.eth.Contract(this.tokenContractABI, this.tokenAddress);
    
    console.log("Web3Service connected to account:", this.account);
    return this.account;
  }

  async isConnected() {
    if (typeof window.ethereum === 'undefined') {
      return false;
    }
    this.web3 = new Web3(window.ethereum);
    // eth_accounts returns an array of accounts if already connected, or empty if not
    const accounts = await this.web3.eth.getAccounts();
    return accounts.length > 0;
  }

  getAccount() {
    return this.account;
  }

  async registerProperty(propertyToken, dataURI) {
    try {
      const tx = await this.propertyMarketplaceContract.methods
        .registerProperty(propertyToken, dataURI)
        .send({ from: this.account });
      return tx.transactionHash;
    } catch (error) {
      console.error("Error registering property:", error);
      throw error;
    }
  }

  async createSellOffer(propertyToken, pricePerToken, numTokens, saleType) {
    try {
      const priceWei = this.web3.utils.toWei(pricePerToken.toString(), 'ether');
      
      // Check and approve if needed
      await this.checkAndApproveTokens(propertyToken, numTokens);
      
      const tx = await this.propertyMarketplaceContract.methods
        .createSellOffer(propertyToken, priceWei, numTokens, saleType)
        .send({ from: this.account });
      return tx.transactionHash;
    } catch (error) {
      console.error("Error creating sell offer:", error);
      throw error;
    }
  }

  async buyTokens(propertyToken, offerId, numTokens, paymentAmount) {
    try {
      const paymentWei = this.web3.utils.toWei(paymentAmount.toString(), 'ether');
      
      const tx = await this.propertyMarketplaceContract.methods
        .buyTokens(propertyToken, offerId, numTokens)
        .send({ 
          from: this.account,
          value: paymentWei 
        });
      return tx.transactionHash;
    } catch (error) {
      console.error("Error buying tokens:", error);
      throw error;
    }
  }

  async cancelSellOffer(offerId) {
    try {
      const tx = await this.propertyMarketplaceContract.methods
        .cancelSellOffer(offerId)
        .send({ from: this.account });
      return tx.transactionHash;
    } catch (error) {
      console.error("Error canceling offer:", error);
      throw error;
    }
  }

  async updateOfferPrice(offerId, newPrice) {
    try {
      const priceWei = this.web3.utils.toWei(newPrice.toString(), 'ether');
      
      const tx = await this.propertyMarketplaceContract.methods
        .updateOfferPrice(offerId, priceWei)
        .send({ from: this.account });
      return tx.transactionHash;
    } catch (error) {
      console.error("Error updating price:", error);
      throw error;
    }
  }

  async getPropertyInfo(propertyToken) {
    try {
      const info = await this.propertyMarketplaceContract.methods
        .properties(propertyToken)
        .call();
      return {
        originalOwner: info.originalOwner,
        goodwillBeneficiary: info.goodwillBeneficiary,
        dataURI: info.dataURI,
        hasGoodwillHistory: info.hasGoodwillHistory
      };
    } catch (error) {
      console.error("Error getting property info:", error);
      throw error;
    }
  }

  async getSellOffer(offerId) {
    try {
      const offer = await this.propertyMarketplaceContract.methods
        .sellOffers(offerId)
        .call();
      return {
        seller: offer.seller,
        pricePerToken: this.web3.utils.fromWei(offer.pricePerToken, 'ether'),
        tokensAvailable: offer.tokensAvailable,
        saleType: offer.saleType,
        isActive: offer.isActive,
        offerId: offer.offerId
      };
    } catch (error) {
      console.error("Error getting offer:", error);
      throw error;
    }
  }

  async getActiveOffers(propertyToken) {
    try {
      const offerIds = await this.propertyMarketplaceContract.methods
        .getActiveOffers(propertyToken)
        .call();
      return offerIds;
    } catch (error) {
      console.error("Error getting active offers:", error);
      throw error;
    }
  }

  async getUserOffers(userAddress = null) {
    try {
      const address = userAddress || this.account;
      const offerIds = await this.propertyMarketplaceContract.methods
        .getUserOffers(address)
        .call();
      return offerIds;
    } catch (error) {
      console.error("Error getting user offers:", error);
      throw error;
    }
  }

  // Helper function to check allowance and approve tokens
  async checkAndApproveTokens(tokenAddress, amount) {
    try {
      const tokenContract = this.getPropertyTokenContract(tokenAddress);
      const decimals = await tokenContract.methods.decimals().call();
      const amountWei = amount * (10 ** decimals);
      
      // Check current allowance
      const allowance = await tokenContract.methods
        .allowance(this.account, this.propertyMarketplace)
        .call();
      
      // If allowance is insufficient, approve
      if (BigInt(allowance) < BigInt(amountWei)) {
        console.log("Approving token spending...");
        const maxAmount = '115792089237316195423570985008687907853269984665640564039457584007913129639935';
        await tokenContract.methods
          .approve(this.propertyMarketplace, maxAmount)
          .send({ from: this.account });
        console.log("Token spending approved");
      }
    } catch (error) {
      console.error("Error checking/approving tokens:", error);
      throw error;
    }
  }

   async isUserVerified(userAddress = null) {
    try {
      const address = userAddress || this.account;
      const userIdentity = await this.identityManagerContract.methods
        .verifiedUsers(address)
        .call();
      return userIdentity.isVerified;
    } catch (error) {
      console.error('Error checking verification status:', error);
      throw error;
    }
  }

  async verifyUser(userAddress) {
    try {
      const tx = await this.identityManagerContract.methods
        .verifyUser(userAddress)
        .send({ from: this.account });
      return tx.transactionHash;
    } catch (error) {
      console.error('Error verifying user:', error);
      throw error;
    }
  }

  async getAllVerifiedUsers() {
    try {
      const verifiedUsers = await this.identityManagerContract.methods
        .getAllVerifiedUsers()
        .call();
      return verifiedUsers;
    } catch (error) {
      console.error('Error getting all verified users:', error);
      throw error;
    }
  }

  async isVerifier(address = null) {
    try {
      const checkAddress = address || this.account;
      const isVerifier = await this.identityManagerContract.methods
        .verifiers(checkAddress)
        .call();
      return isVerifier;
    } catch (error) {
      console.error('Error checking verifier status:', error);
      throw error;
    }
  }

  async getIdentityManagerOwner() {
    try {
      const owner = await this.identityManagerContract.methods
        .owner()
        .call();
      return owner;
    } catch (error) {
      console.error('Error getting identity manager owner:', error);
      throw error;
    }
  }

}