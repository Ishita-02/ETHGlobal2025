const propertyMarketplaceABI =  [
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_identityManager",
          "type": "address"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "owner",
          "type": "address"
        }
      ],
      "name": "OwnableInvalidOwner",
      "type": "error"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "account",
          "type": "address"
        }
      ],
      "name": "OwnableUnauthorizedAccount",
      "type": "error"
    },
    {
      "inputs": [],
      "name": "ReentrancyGuardReentrantCall",
      "type": "error"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "previousOwner",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "newOwner",
          "type": "address"
        }
      ],
      "name": "OwnershipTransferred",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "propertyToken",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "originalOwner",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "string",
          "name": "dataURI",
          "type": "string"
        }
      ],
      "name": "PropertyTokenized",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "offerId",
          "type": "uint256"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "seller",
          "type": "address"
        }
      ],
      "name": "SellOfferCancelled",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "offerId",
          "type": "uint256"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "propertyToken",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "seller",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "pricePerToken",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "tokensAvailable",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "enum PropertyMarketplace.SaleType",
          "name": "saleType",
          "type": "uint8"
        }
      ],
      "name": "SellOfferCreated",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "offerId",
          "type": "uint256"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "propertyToken",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "buyer",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "address",
          "name": "seller",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "tokensBought",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "totalPaid",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "goodwillPaid",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "enum PropertyMarketplace.SaleType",
          "name": "saleType",
          "type": "uint8"
        }
      ],
      "name": "TokensPurchased",
      "type": "event"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "activeOffers",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "propertyToken",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "offerId",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "numTokens",
          "type": "uint256"
        }
      ],
      "name": "buyTokens",
      "outputs": [],
      "stateMutability": "payable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "offerId",
          "type": "uint256"
        }
      ],
      "name": "cancelSellOffer",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "propertyToken",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "pricePerToken",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "numTokens",
          "type": "uint256"
        },
        {
          "internalType": "enum PropertyMarketplace.SaleType",
          "name": "saleType",
          "type": "uint8"
        }
      ],
      "name": "createSellOffer",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "propertyToken",
          "type": "address"
        }
      ],
      "name": "getActiveOffers",
      "outputs": [
        {
          "internalType": "uint256[]",
          "name": "",
          "type": "uint256[]"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "propertyToken",
          "type": "address"
        }
      ],
      "name": "getTokenDecimals",
      "outputs": [
        {
          "internalType": "uint8",
          "name": "",
          "type": "uint8"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "user",
          "type": "address"
        }
      ],
      "name": "getUserOffers",
      "outputs": [
        {
          "internalType": "uint256[]",
          "name": "",
          "type": "uint256[]"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "identityManager",
      "outputs": [
        {
          "internalType": "contract IdentityManager",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "owner",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "name": "properties",
      "outputs": [
        {
          "internalType": "address",
          "name": "originalOwner",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "goodwillBeneficiary",
          "type": "address"
        },
        {
          "internalType": "string",
          "name": "dataURI",
          "type": "string"
        },
        {
          "internalType": "bool",
          "name": "hasGoodwillHistory",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "propertyToken",
          "type": "address"
        },
        {
          "internalType": "string",
          "name": "dataURI",
          "type": "string"
        }
      ],
      "name": "registerProperty",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "renounceOwnership",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "sellOffers",
      "outputs": [
        {
          "internalType": "address",
          "name": "seller",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "pricePerToken",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "tokensAvailable",
          "type": "uint256"
        },
        {
          "internalType": "enum PropertyMarketplace.SaleType",
          "name": "saleType",
          "type": "uint8"
        },
        {
          "internalType": "bool",
          "name": "isActive",
          "type": "bool"
        },
        {
          "internalType": "uint256",
          "name": "offerId",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "newOwner",
          "type": "address"
        }
      ],
      "name": "transferOwnership",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "offerId",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "newPricePerToken",
          "type": "uint256"
        }
      ],
      "name": "updateOfferPrice",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "userOffers",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    }
  ]

  export default propertyMarketplaceABI;