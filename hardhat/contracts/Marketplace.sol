// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

import "./IdentityManager.sol";

interface IERC20 {
        function balanceOf(address account) external view returns (uint256);
        function transferFrom(address sender, address recipient, uint256 amount) external returns (bool);
    }

contract PropertyMarketplace is Ownable, ReentrancyGuard {

    
    event TokensSold(
        address indexed propertyToken,
        address indexed seller,
        address indexed buyer,
        uint256 numTokens,
        uint256 totalPrice,
        uint256 goodwillAmount
    );

    IdentityManager public immutable identityManager;
    struct Property {
        uint256 price;
        address seller;
        bool isListed;
        bool isGoodwillSale;
        address goodwillBeneficiary;
        string dataURI;
    }

    uint256 private constant GOODWILL_PERCENTAGE = 10;
    
    // propertyToken address => Property details
    mapping(address => Property) public properties;
    
    event PropertyListed(
        address indexed propertyToken,
        address indexed seller,
        uint256 price,
        bool isGoodwillSale
    );
    
    event PropertySold(
        address indexed propertyToken,
        address indexed seller,
        address indexed buyer,
        uint256 price,
        uint256 goodwillAmount
    );

    constructor(address _identityManager) Ownable(msg.sender) {
        identityManager = IdentityManager(_identityManager);
    }

    function listProperty(
        address propertyToken,
        uint256 price,
        bool isGoodwillSale,
        string memory dataURI
    ) external {
        require(identityManager.isUserVerified(msg.sender), "User not verified");
        require(price > 0, "Invalid price");
        require(!properties[propertyToken].isListed, "Already listed");
        
        IERC20 token = IERC20(propertyToken);
        require(
            token.balanceOf(msg.sender) > 0,
            "Must own property tokens"
        );

        properties[propertyToken] = Property({
            price: price,
            seller: msg.sender,
            isListed: true,
            isGoodwillSale: isGoodwillSale,
            goodwillBeneficiary: address(0),
            dataURI: dataURI
        });

        emit PropertyListed(
            propertyToken,
            msg.sender,
            price,
            isGoodwillSale
        );
    }

    function buyProperty(address propertyToken, uint256 numTokens) external payable nonReentrant {
        require(identityManager.isUserVerified(msg.sender), "User not verified");
        Property storage property = properties[propertyToken];
        require(property.isListed, "Property not listed");
        require(msg.sender != property.seller, "Cannot buy own property");

        IERC20 token = IERC20(propertyToken);
        require(
            token.transferFrom(property.seller, msg.sender, numTokens),
            "Transfer not allowed by ERC3643"
        );

        uint256 fullTotalPrice = property.price * numTokens;
        uint256 salePrice = fullTotalPrice;
        uint256 goodwillAmount = 0;

        // Calculate prices for goodwill sale
        if (property.isGoodwillSale) {
            salePrice = (property.price * (100 - GOODWILL_PERCENTAGE)) / 100;
        }

        // Check correct payment amount
        require(msg.value == salePrice, "Incorrect payment amount");

        // Handle previous goodwill beneficiary payment
        if (property.goodwillBeneficiary != address(0)) {
            goodwillAmount = (salePrice * GOODWILL_PERCENTAGE) / 100;
            (bool goodwillSent,) = property.goodwillBeneficiary.call{value: goodwillAmount}("");
            require(goodwillSent, "Goodwill payment failed");
        }

        // Transfer payment to seller
        (bool sent,) = property.seller.call{value: salePrice - goodwillAmount}("");
        require(sent, "Payment transfer failed");

        // Transfer property token
        require(
            token.transferFrom(property.seller, msg.sender, numTokens),
            "Property transfer failed"
        );

        // Update property state
        property.seller = msg.sender;
        if (token.balanceOf(property.seller) == 0) {
            property.isListed = false; 
        }
        if (property.isGoodwillSale) {
            property.goodwillBeneficiary = property.seller;
        }

        emit PropertySold(
            propertyToken,
            property.seller,
            msg.sender,
            salePrice,
            goodwillAmount
        );
    }

    function cancelListing(address propertyToken) external {
        Property storage property = properties[propertyToken];
        require(property.isListed, "Not listed");
        require(property.seller == msg.sender, "Not the seller");
        
        property.isListed = false;
    }

    function updatePrice(address propertyToken, uint256 newPrice) external onlyOwner{
        Property storage property = properties[propertyToken];
        require(property.isListed, "Not listed");
        require(property.seller == msg.sender, "Not the seller");
        require(newPrice > 0, "Invalid price");

        property.price = newPrice;
    }


    // sell function
    function sellTokens(address propertyToken, uint256 numTokens) external payable nonReentrant {
        require(identityManager.isUserVerified(msg.sender), "User not verified");
        Property storage property = properties[propertyToken];
        require(property.isListed, "Property not listed");

        address seller = property.seller;
        address buyer = msg.sender;
        require(buyer != seller, "Cannot buy own property");

        IERC20 token = IERC20(propertyToken);
        require(token.balanceOf(seller) >= numTokens, "Seller has insufficient tokens");

        uint256 fullTotalPrice = property.price * numTokens;
        uint256 salePrice = fullTotalPrice;
        uint256 goodwillAmount = 0;

        if (property.isGoodwillSale) {
            salePrice = (fullTotalPrice * (100 - GOODWILL_PERCENTAGE)) / 100;
        }

        require(msg.value == salePrice, "Incorrect payment amount");

        if (property.goodwillBeneficiary != address(0)) {
            goodwillAmount = (fullTotalPrice * GOODWILL_PERCENTAGE) / 100;
            (bool goodwillSent,) = property.goodwillBeneficiary.call{value: goodwillAmount}("");
            require(goodwillSent, "Goodwill payment failed");
        }

        uint256 sellerProceeds = salePrice - goodwillAmount;
        if (sellerProceeds > 0) {
             (bool sent,) = seller.call{value: sellerProceeds}("");
             require(sent, "Payment transfer failed");
        }

        require(token.transferFrom(seller, buyer, numTokens), "Token transfer failed");

        if (token.balanceOf(seller) == 0) {
            property.isListed = false; 
        }


        if (property.isGoodwillSale) {
            property.goodwillBeneficiary = seller;
        } else {
            property.goodwillBeneficiary = address(0);
        }

        emit TokensSold(
            propertyToken,
            seller,
            buyer,
            numTokens,
            salePrice,
            goodwillAmount
        );
    }
}