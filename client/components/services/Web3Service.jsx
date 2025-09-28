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
    this.propertyTokenBytecode = "0x60a06040818152346200085c576200155b803803809162000021828662000861565b8439820160c0838203126200085c5782516001600160401b03908181116200085c578262000051918601620008aa565b90602091828601518281116200085c57846200006f918801620008aa565b9385870151908382116200085c576200008a918801620008aa565b91606087015194608097620000af60a0620000a78b840162000905565b920162000905565b9380519484861162000759576003948554966001938489811c9916801562000851575b8b8a10146200083b5781908b601f9a8b8111620007e2575b50508b908a83116001146200077b576000926200076f575b505060001982891b1c191690841b1786555b8451818111620007595760049586548581811c911680156200074e575b8c8210146200073957908b828b859411620006e0575b50508b908a831160011462000679576000926200066d575b505060001982891b1c191690841b1785555b6001600160a01b039384169586156200065657908b9392918d86600554948a8260018060a01b031999828b8a16176005555197167f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e0600080a3169052606083018381108382111762000641578d528983528c8b8401938d855201938885528a5192831162000641576006548181811c9116801562000636575b8d8210146200062157908c828c8a989796959411620005c2575b50508c8b84116001146200053e576000929184918262000532575b501b92600019911b1c1916176006555b5160075551169060085416176008556002549169152d02c7e14af6800000928381018091116200051d57908792916002558460005260008352896000208481540190558460008b518681527fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef958691a3818b51168a5192838a816371aff1b360e11b94858252338783015260249788915afa9081156200051257600091620004f0575b5015620004ae5789908d511691848d518094819382528a878301525afa908115620004a3576000916200046f575b50156200042f5733156200041b573360005260008852896000205491848310620003fa575050927f1cb0c09f0d5c4590072d4083af336ac3d611d87b5dfe50889e16d0ab65c6f4e19796949281928b9795336000526000885269152d02c7e14af67fffff19018b60002055826000528a6000208281540190558a51918252863392a3875195869460608652620003c5855180968160608a0152838a8a01910162000885565b8501528784015201601f19168101030190a151610c269182620009358339518181816101da0152818161041c015261054a0152f35b60649285918c519363391434e360e21b855233908501528301526044820152fd5b60008a5191634b637e8f60e11b8352820152fd5b6015606492898c519362461bcd60e51b85528401528201527f5265636569766572206e6f7420766572696669656400000000000000000000006044820152fd5b620004949150893d8b116200049b575b6200048b818362000861565b8101906200091a565b3862000320565b503d6200047f565b8b513d6000823e3d90fd5b50506013606492898c519362461bcd60e51b85528401528201527f53656e646572206e6f74207665726966696564000000000000000000000000006044820152fd5b6200050b91508b3d8d116200049b576200048b818362000861565b38620002f2565b8d513d6000823e3d90fd5b601182634e487b7160e01b6000525260246000fd5b8e01519350386200023f565b918d9193928d601f19851690600660005284600020946000915b838310620005955750505084116200057a575b505050811b016006556200024f565b8d01519060f884600019921b161c191690553880806200056b565b88999a9b509584829495989992939697015181550195019201908f918f928c9a9998979695949362000558565b909192939495965060066000528b826000209181870160051c830193871062000617575b908a98979695949392910160051c01905b81811062000608578e915062000224565b600081558997508201620005f7565b92508192620005e6565b602289634e487b7160e01b6000525260246000fd5b90607f16906200020a565b604188634e487b7160e01b6000525260246000fd5b8b51631e4fbdf760e01b8152600081880152602490fd5b0151905038806200015f565b60008981528d8120889550929190601f198516908f5b828210620006c85750508411620006af575b505050811b01855562000171565b0151600019838b1b60f8161c19169055388080620006a1565b8385015186558a979095019493840193018f6200068f565b90919250886000528a826000209181860160051c83019386106200072f575b918891869594930160051c01915b8281106200071f57508d915062000147565b600081558594508891016200070d565b92508192620006ff565b602288634e487b7160e01b6000525260246000fd5b90607f169062000131565b634e487b7160e01b600052604160045260246000fd5b01519050388062000102565b60008a81528d8120889550929190601f198516908f5b828210620007ca5750508411620007b1575b505050811b01865562000114565b0151600019838b1b60f8161c19169055388080620007a3565b8385015186558a979095019493840193018f62000791565b90919250896000528a826000209181860160051c830193861062000831575b918891869594930160051c01915b8281106200082157508d9150620000ea565b600081558594508891016200080f565b9250819262000801565b634e487b7160e01b600052602260045260246000fd5b98607f1698620000d2565b600080fd5b601f909101601f19168101906001600160401b038211908210176200075957604052565b60005b838110620008995750506000910152565b818101518382015260200162000888565b81601f820112156200085c5780516001600160401b038111620007595760405192620008e1601f8301601f19166020018562000861565b818452602082840101116200085c5762000902916020808501910162000885565b90565b51906001600160a01b03821682036200085c57565b908160209103126200085c575180151581036200085c579056fe6080604081815260048036101561001557600080fd5b600092833560e01c9081627dc3721461087d5750806306fdde0314610788578063095ea7b3146106df57806318160ddd146106c057806323b872dd146104fb578063313ce567146104df57806370a08231146104a8578063715018a61461044b57806375495e90146104075780638da5cb5b146103de57806395d89b41146102c3578063a9059cbb1461019b578063dd62ed3e1461014e5763f2fde38b146100bc57600080fd5b3461014a57602036600319011261014a576100d5610a17565b906100de610a48565b6001600160a01b03918216928315610134575050600554826bffffffffffffffffffffffff60a01b821617600555167f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e08380a380f35b51631e4fbdf760e01b8152908101849052602490fd5b8280fd5b5050346101975780600319360112610197578060209261016c610a17565b610174610a32565b6001600160a01b0391821683526001865283832091168252845220549051908152f35b5080fd5b5091346102c057816003193601126102c0576101b5610a17565b82516371aff1b360e11b8082523382870152602095929392916001600160a01b0391907f00000000000000000000000000000000000000000000000000000000000000008316908881602481855afa9081156102b657916102238a9594926024948991610299575b50610a8c565b8851958694859384528916908301525afa91821561028e5761025a93926102509290610261575b50610ace565b6024359033610b12565b5160018152f35b6102819150863d8811610287575b610279818361099f565b810190610a74565b3861024a565b503d61026f565b8451903d90823e3d90fd5b6102b09150873d891161028757610279818361099f565b3861021d565b88513d88823e3d90fd5b80fd5b5091346102c057806003193601126102c05781519181845492600184811c918186169586156103d4575b60209687851081146103c1579087899a92868b999a9b52918260001461039757505060011461033c575b858861033889610329848a038561099f565b519282849384528301906109d7565b0390f35b815286935091907f8a35acfbc15ff81a39ae7d344fd709f28e8600b4aa8c65c6b64bfe7fe36bd19b5b82841061037f575050508201018161032961033838610317565b8054848a018601528895508794909301928101610365565b60ff19168882015294151560051b8701909401945085935061032992506103389150389050610317565b634e487b7160e01b835260228a52602483fd5b92607f16926102ed565b50503461019757816003193601126101975760055490516001600160a01b039091168152602090f35b505034610197578160031936011261019757517f00000000000000000000000000000000000000000000000000000000000000006001600160a01b03168152602090f35b83346102c057806003193601126102c057610464610a48565b600580546001600160a01b0319811690915581906001600160a01b03167f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e08280a380f35b5050346101975760203660031901126101975760209181906001600160a01b036104d0610a17565b16815280845220549051908152f35b5050346101975781600319360112610197576020905160128152f35b50903461014a57606036600319011261014a57610516610a17565b61051e610a32565b82516371aff1b360e11b8082526001600160a01b038085168388018190526020976044359694909391927f000000000000000000000000000000000000000000000000000000000000000081169290918a81602481875afa908c82156106b5576024928d959492610594929161069e5750610a8c565b8a51948593849283528a16888301525afa90811561069457906105bd918a9161067d5750610ace565b808852600187528588203389528752858820549160001983106105e9575b5050509061025a9291610b12565b85831061065157811561063a57331561062357509484889261025a9783999a5260018a528284203385528a520391205585949338806105db565b8651634a1406b160e11b8152908101899052602490fd5b865163e602df0560e01b8152908101899052602490fd5b8651637dc7a0d960e11b8152339181019182526020820193909352604081018690528291506060010390fd5b6102819150893d8b1161028757610279818361099f565b87513d8b823e3d90fd5b6102b09150863d881161028757610279818361099f565b8b51903d90823e3d90fd5b5050346101975781600319360112610197576020906002549051908152f35b503461014a578160031936011261014a576106f8610a17565b602435903315610771576001600160a01b031691821561075a57508083602095338152600187528181208582528752205582519081527f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925843392a35160018152f35b8351634a1406b160e11b8152908101859052602490fd5b835163e602df0560e01b8152808401869052602490fd5b5091346102c057806003193601126102c0578151918160035492600184811c91818616958615610873575b60209687851081146103c1578899509688969785829a52918260001461084c5750506001146107f0575b505050610338929161032991038561099f565b9190869350600383527fc2575a0e9e593c00f959f8c92f12db2869c3395a3b0502d05e2516446f71f85b5b82841061083457505050820101816103296103386107dd565b8054848a01860152889550879490930192810161081b565b60ff19168782015293151560051b86019093019350849250610329915061033890506107dd565b92607f16926107b3565b9290503461099b578360031936011261099b57600654600181811c9186908281168015610991575b602096878610821461097e575084885290811561095c5750600114610905575b5050506108d7836108fa95038461099f565b6007549060018060a01b03600854169181519586956060875260608701906109d7565b938501528301520390f35b9550600686527ff652222313e28459528d920b65115c16c04f3efc82aaedc97be59f3f377c0d3f5b828710610949575050506108d783836108fa96820101956108c5565b805486880186015295840195810161092d565b60ff191686880152505050151560051b8301820193506108d7836108fa6108c5565b634e487b7160e01b845260229052602483fd5b93607f16936108a5565b8380fd5b90601f8019910116810190811067ffffffffffffffff8211176109c157604052565b634e487b7160e01b600052604160045260246000fd5b919082519283825260005b848110610a03575050826000602080949584010152601f8019910116010190565b6020818301810151848301820152016109e2565b600435906001600160a01b0382168203610a2d57565b600080fd5b602435906001600160a01b0382168203610a2d57565b6005546001600160a01b03163303610a5c57565b60405163118cdaa760e01b8152336004820152602490fd5b90816020910312610a2d57518015158103610a2d5790565b15610a9357565b60405162461bcd60e51b815260206004820152601360248201527214d95b99195c881b9bdd081d995c9a599a5959606a1b6044820152606490fd5b15610ad557565b60405162461bcd60e51b8152602060048201526015602482015274149958d95a5d995c881b9bdd081d995c9a599a5959605a1b6044820152606490fd5b916001600160a01b03808416928315610bd75716928315610bbe5760009083825281602052604082205490838210610b8c575091604082827fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef958760209652828652038282205586815220818154019055604051908152a3565b60405163391434e360e21b81526001600160a01b03919091166004820152602481019190915260448101839052606490fd5b60405163ec442f0560e01b815260006004820152602490fd5b604051634b637e8f60e11b815260006004820152602490fdfea264697066735822122022f87901839a5bea38dedff365e7c807b69212f934687c8057e181ec6997363f64736f6c63430008140033",

    
    // Replace with your deployed contract address
    this.propertyMarketplace = "0x3E5D98d46dF81f78513dFBfb63Eb43715B2EA754";

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

  async registerProperty(propertyToken, dataURI, imageURI) {
    try {
      const tx = await this.propertyMarketplaceContract.methods
        .registerProperty(propertyToken, dataURI, imageURI)
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

  async deployPropertyToken({ name, symbol, location, price }) {
    if (!this.web3 || !this.account) {
      throw new Error("Web3Service is not initialized. Call init() first.");
    }

    try {
      console.log("Deploying Property Token with data:", { name, symbol, location, price });
      
      const contract = new this.web3.eth.Contract(this.propertyTokenABI);
      
      const deployTx = contract.deploy({
        data: this.propertyTokenBytecode,
        arguments: [
          name,
          symbol,
          location,
          this.web3.utils.toWei(price.toString(), 'ether'), // Convert price to Wei
          this.account,         // _owner
          this.identityManager  // _identityManager
        ]
      });

      console.log("Estimating gas for deployment...");
      const gasEstimate = await deployTx.estimateGas({ from: this.account });
      console.log(`Gas estimate: ${gasEstimate}`);

      console.log("Sending deployment transaction...");
      const deployedContract = await deployTx.send({
        from: this.account,
        gas: gasEstimate.toString() // Use the estimated gas
      });

      const contractAddress = deployedContract.options.address;
      console.log(`Contract deployed successfully at address: ${contractAddress}`);
      
      return contractAddress;

    } catch (error) {
      console.error('Error deploying property token contract:', error);
      // Re-throw the error so the UI component can catch it and display a message
      throw error;
    }
  }

}

export default Web3Service;