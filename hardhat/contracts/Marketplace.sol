// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

/**
 * @title Marketplace
 * @dev Manages sales with a choice between a "Normal Sale" and a "Goodwill Sale".
 * The Goodwill Sale involves a seller taking a 10% price cut in exchange for
 * receiving a 10% royalty on the *next* sale of those tokens.
 */
contract Marketplace is Ownable, ReentrancyGuard {
    address public immutable usdcTokenAddress;

    // For each property, tracks the wallet address of the seller who chose the 
    // Goodwill option and is waiting for their 10% royalty from the next sale.
    mapping(address => address) public goodwillBeneficiary;

    event TokensSold(
        address indexed propertyToken,
        address indexed buyer,
        address indexed seller,
        uint256 numTokens,
        uint256 pricePerToken,
        bool isGoodwillSale,
        uint256 royaltyPaid
    );
     event PropertyListed(
        address indexed propertyToken,
        uint256 initialPricePerToken
    );

    constructor(address _usdcTokenAddress) Ownable(msg.sender) {
        usdcTokenAddress = _usdcTokenAddress;
    }

    /**
     * @notice Lists a new property for its initial sale.
     * @dev Called by the platform owner (backend) after a property is tokenized.
     */
    function listInitialProperty(
        address _propertyToken,
        uint256 _initialPrice
    ) external onlyOwner {
        require(goodwillBeneficiary[_propertyToken] == address(0), "Marketplace: Property already has a beneficiary, cannot re-list this way.");
        emit PropertyListed(_propertyToken, _initialPrice);
    }

    /**
     * @notice The core function for a user to sell tokens to a buyer.
     * @dev Handles both Normal and Goodwill sale logic.
     * @param _seller The address of the token seller (msg.sender).
     * @param _buyer The address of the token buyer.
     * @param _propertyToken The address of the token being sold.
     * @param _numTokens The number of tokens being sold.
     * @param _pricePerToken The sale price for each token.
     * @param _isGoodwillSale A boolean indicating if the seller chose the Goodwill option.
     */
    function sellTokens(
        address _seller,
        address _buyer,
        address _propertyToken,
        uint256 _numTokens,
        uint256 _pricePerToken,
        bool _isGoodwillSale
    ) external nonReentrant {
        require(_seller == msg.sender, "Marketplace: Caller must be the seller.");
        require(_seller != _buyer, "Marketplace: Buyer and seller cannot be the same.");

        uint256 totalCost = _numTokens * _pricePerToken;
        IERC20 usdc = IERC20(usdcTokenAddress);
        IERC20 propertyToken = IERC20(_propertyToken);

        // --- 1. Pay the previous Goodwill Seller (if any) ---
        address previousBeneficiary = goodwillBeneficiary[_propertyToken];
        uint256 royaltyPaid = 0;

        if (previousBeneficiary != address(0)) {
            // Calculate and pay the 10% royalty on the current sale price.
            royaltyPaid = (totalCost * 10) / 100;
            
            // Pull total funds from the buyer first
            require(usdc.transferFrom(_buyer, address(this), totalCost), "Marketplace: Buyer USDC transfer failed.");
            
            // Pay the royalty
            require(usdc.transfer(previousBeneficiary, royaltyPaid), "Marketplace: Royalty payment failed.");
        } else {
            // If there's no previous beneficiary, just pull the funds directly.
            require(usdc.transferFrom(_buyer, _seller, totalCost), "Marketplace: Direct USDC transfer failed.");
        }
        
        // --- 2. Set up the *next* Goodwill Beneficiary (if applicable) ---
        if (_isGoodwillSale) {
            // The current seller chose the Goodwill option. They are the beneficiary of the *next* sale.
            goodwillBeneficiary[_propertyToken] = _seller;
        } else {
            // This was a normal sale, so we clear any previous beneficiary.
            // The check in step 1 ensures they were already paid.
            goodwillBeneficiary[_propertyToken] = address(0);
        }

        // --- 3. Distribute funds and tokens ---
        if (previousBeneficiary != address(0)) {
            // If royalty was paid, send the remainder to the current seller
            uint256 sellerProceeds = totalCost - royaltyPaid;
            if (sellerProceeds > 0) {
                 require(usdc.transfer(_seller, sellerProceeds), "Marketplace: Seller payment failed.");
            }
        }
        
        // Transfer the property tokens from the seller to the buyer
        require(propertyToken.transferFrom(_seller, _buyer, _numTokens), "Marketplace: PropertyToken transfer failed.");
        
        emit TokensSold(_propertyToken, _buyer, _seller, _numTokens, _pricePerToken, _isGoodwillSale, royaltyPaid);
    }
}

