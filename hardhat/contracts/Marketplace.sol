// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

import "./IdentityManager.sol";

interface IERC20 {
    function balanceOf(address account) external view returns (uint256);
    function transferFrom(address sender, address recipient, uint256 amount) external returns (bool);
    function decimals() external view returns (uint8);
}

contract PropertyMarketplace is Ownable, ReentrancyGuard {

    enum SaleType { Normal, Goodwill }

    IdentityManager public immutable identityManager;
    
    struct SellOffer {
        address seller;
        uint256 pricePerToken;
        uint256 tokensAvailable;
        SaleType saleType;
        bool isActive;
        uint256 offerId;
    }

    struct PropertyInfo {
        address originalOwner;        // The person who first tokenized the property
        address goodwillBeneficiary; // Current goodwill beneficiary (gets 10% on goodwill resales)
        string dataURI;
        bool hasGoodwillHistory;     // True if this property was ever sold via goodwill
    }

    uint256 private constant GOODWILL_PERCENTAGE = 10;
    uint256 private nextOfferId = 1;
    
    // propertyToken address => PropertyInfo
    mapping(address => PropertyInfo) public properties;
    
    // offerId => SellOffer
    mapping(uint256 => SellOffer) public sellOffers;
    
    // propertyToken => array of active offer IDs
    mapping(address => uint256[]) public activeOffers;
    
    // seller => array of their offer IDs
    mapping(address => uint256[]) public userOffers;

    event PropertyTokenized(
        address indexed propertyToken,
        address indexed originalOwner,
        string dataURI
    );

    event SellOfferCreated(
        uint256 indexed offerId,
        address indexed propertyToken,
        address indexed seller,
        uint256 pricePerToken,
        uint256 tokensAvailable,
        SaleType saleType
    );

    event TokensPurchased(
        uint256 indexed offerId,
        address indexed propertyToken,
        address indexed buyer,
        address seller,
        uint256 tokensBought,
        uint256 totalPaid,
        uint256 goodwillPaid,
        SaleType saleType
    );

    event SellOfferCancelled(
        uint256 indexed offerId,
        address indexed seller
    );

    constructor(address _identityManager) Ownable(msg.sender) {
        identityManager = IdentityManager(_identityManager);
    }

    /**
     * @dev Register a property token (called once when property is first tokenized)
     */
    function registerProperty(
        address propertyToken,
        string memory dataURI
    ) external {
        require(identityManager.verifiedUsers(msg.sender), "User not verified");
        require(properties[propertyToken].originalOwner == address(0), "Property already registered");
        
        IERC20 token = IERC20(propertyToken);
        require(token.balanceOf(msg.sender) > 0, "Must own property tokens");

        properties[propertyToken] = PropertyInfo({
            originalOwner: msg.sender,
            goodwillBeneficiary: address(0),
            dataURI: dataURI,
            hasGoodwillHistory: false
        });

        emit PropertyTokenized(propertyToken, msg.sender, dataURI);
    }

    /**
     * @dev Create a sell offer for property tokens
     */
    function createSellOffer(
        address propertyToken,
        uint256 pricePerToken,
        uint256 numTokens,
        SaleType saleType
    ) external {
        require(identityManager.verifiedUsers(msg.sender), "User not verified");
        require(properties[propertyToken].originalOwner != address(0), "Property not registered");
        require(pricePerToken > 0, "Invalid price");
        require(numTokens > 0, "Invalid token amount");

        IERC20 token = IERC20(propertyToken);
        uint8 decimals = token.decimals();
        uint256 tokenAmount = numTokens * (10 ** decimals);
        
        require(token.balanceOf(msg.sender) >= tokenAmount, "Insufficient tokens");

        uint256 offerId = nextOfferId++;
        
        sellOffers[offerId] = SellOffer({
            seller: msg.sender,
            pricePerToken: pricePerToken,
            tokensAvailable: numTokens,
            saleType: saleType,
            isActive: true,
            offerId: offerId
        });

        activeOffers[propertyToken].push(offerId);
        userOffers[msg.sender].push(offerId);

        emit SellOfferCreated(
            offerId,
            propertyToken,
            msg.sender,
            pricePerToken,
            numTokens,
            saleType
        );
    }

    /**
     * @dev Buy tokens from a specific sell offer
     */
    function buyTokens(
        address propertyToken,
        uint256 offerId,
        uint256 numTokens
    ) external payable nonReentrant {
        require(identityManager.verifiedUsers(msg.sender), "User not verified");
        
        SellOffer storage offer = sellOffers[offerId];
        require(offer.isActive, "Offer not active");
        require(offer.seller != msg.sender, "Cannot buy own tokens");
        require(numTokens > 0 && numTokens <= offer.tokensAvailable, "Invalid token amount");

        IERC20 token = IERC20(propertyToken);
        uint8 decimals = token.decimals();
        uint256 tokenAmount = numTokens * (10 ** decimals);
        
        // Verify seller still has the tokens
        require(token.balanceOf(offer.seller) >= tokenAmount, "Seller insufficient balance");

        PropertyInfo storage propInfo = properties[propertyToken];
        
        uint256 fullPrice = offer.pricePerToken * numTokens;
        uint256 buyerPays = fullPrice;
        uint256 goodwillAmount = 0;

        // Apply discount if this is a goodwill sale
        if (offer.saleType == SaleType.Goodwill) {
            buyerPays = (fullPrice * (100 - GOODWILL_PERCENTAGE)) / 100;
        }

        require(msg.value == buyerPays, "Incorrect payment amount");

        // Pay goodwill beneficiary if this is a goodwill sale and there is a beneficiary
        if (offer.saleType == SaleType.Goodwill && propInfo.goodwillBeneficiary != address(0)) {
            goodwillAmount = (fullPrice * GOODWILL_PERCENTAGE) / 100;
            
            (bool goodwillSent,) = propInfo.goodwillBeneficiary.call{value: goodwillAmount}("");
            require(goodwillSent, "Goodwill payment failed");
        }

        // Calculate seller proceeds
        uint256 sellerProceeds = buyerPays - goodwillAmount;
        
        // Pay seller
        if (sellerProceeds > 0) {
            (bool sent,) = offer.seller.call{value: sellerProceeds}("");
            require(sent, "Payment to seller failed");
        }

        // Transfer tokens
        require(
            token.transferFrom(offer.seller, msg.sender, tokenAmount),
            "Token transfer failed"
        );

        // Update offer
        offer.tokensAvailable -= numTokens;
        if (offer.tokensAvailable == 0) {
            offer.isActive = false;
        }

        // Update property info if this was a goodwill sale
        if (offer.saleType == SaleType.Goodwill) {
            propInfo.goodwillBeneficiary = offer.seller; // Seller becomes next beneficiary
            propInfo.hasGoodwillHistory = true;
        }

        emit TokensPurchased(
            offerId,
            propertyToken,
            msg.sender,
            offer.seller,
            numTokens,
            buyerPays,
            goodwillAmount,
            offer.saleType
        );
    }

    /**
     * @dev Cancel a sell offer
     */
    function cancelSellOffer(uint256 offerId) external {
        SellOffer storage offer = sellOffers[offerId];
        require(offer.seller == msg.sender, "Not your offer");
        require(offer.isActive, "Offer not active");
        
        offer.isActive = false;
        
        emit SellOfferCancelled(offerId, msg.sender);
    }

    /**
     * @dev Update sell offer price
     */
    function updateOfferPrice(uint256 offerId, uint256 newPricePerToken) external {
        SellOffer storage offer = sellOffers[offerId];
        require(offer.seller == msg.sender, "Not your offer");
        require(offer.isActive, "Offer not active");
        require(newPricePerToken > 0, "Invalid price");
        
        offer.pricePerToken = newPricePerToken;
    }

    /**
     * @dev Get all active offers for a property
     */
    function getActiveOffers(address propertyToken) external view returns (uint256[] memory) {
        uint256[] memory allOffers = activeOffers[propertyToken];
        uint256 activeCount = 0;
        
        // Count active offers
        for (uint256 i = 0; i < allOffers.length; i++) {
            if (sellOffers[allOffers[i]].isActive) {
                activeCount++;
            }
        }
        
        // Create array of active offers
        uint256[] memory result = new uint256[](activeCount);
        uint256 index = 0;
        
        for (uint256 i = 0; i < allOffers.length; i++) {
            if (sellOffers[allOffers[i]].isActive) {
                result[index] = allOffers[i];
                index++;
            }
        }
        
        return result;
    }

    /**
     * @dev Get user's active offers
     */
    function getUserOffers(address user) external view returns (uint256[] memory) {
        uint256[] memory allOffers = userOffers[user];
        uint256 activeCount = 0;
        
        // Count active offers
        for (uint256 i = 0; i < allOffers.length; i++) {
            if (sellOffers[allOffers[i]].isActive) {
                activeCount++;
            }
        }
        
        // Create array of active offers
        uint256[] memory result = new uint256[](activeCount);
        uint256 index = 0;
        
        for (uint256 i = 0; i < allOffers.length; i++) {
            if (sellOffers[allOffers[i]].isActive) {
                result[index] = allOffers[i];
                index++;
            }
        }
        
        return result;
    }

    /**
     * @dev Helper function to get token decimals
     */
    function getTokenDecimals(address propertyToken) external view returns (uint8) {
        return IERC20(propertyToken).decimals();
    }
}