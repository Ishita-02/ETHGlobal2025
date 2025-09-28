# 🏠 Property Tokenization Marketplace with Goodwill Chain
A revolutionary blockchain-based real estate platform that tokenizes properties using ERC-3643 compliance standards and introduces an innovative Goodwill Chain mechanism to create sustainable value sharing between buyers and sellers.
🌊 Deployed on Flow Testnet | 📁 IPFS Storage via Lighthouse SDK
## 🌟 What Makes This Project Unique?
The Goodwill Chain Innovation
When selling a tokenized property, owners have two options:

## Normal Sale 🔄

Sell at full market price
Standard one-time transaction
No future benefits


## Goodwill Sale 🤝

Accept 10% less than asking price
Enter the "Goodwill Chain"
Receive 10% of the next sale when property changes hands again



## Example Flow:
Property Value: $100,000

Normal Sale:    Seller gets $100,000 ✅ (one-time)
Goodwill Sale:  Seller gets $90,000 + future 10% royalty

When property later sells for $120,000:
→ Previous goodwill seller receives $12,000 bonus! 💰
## 🏗️ Deployed Architecture
### 📍 Flow Testnet Deployment
- ContractAddressPurposePropertyMarketplace: 0x3E5D98d46dF81f78513dFBfb63Eb43715B2EA754
- Handles property listings, sales, and goodwill chain 
- IdentityManager: 0x73b0F0bFd958b6F6119dE09A48543B2FB7264369
- Manages user verification 
- PropertyToken
- ERC-3643 compliant property tokenization
## Core Smart Contracts
### 1. PropertyMarketplace.sol
Address: 0x3E5D98d46dF81f78513dFBfb63Eb43715B2EA754

- Dual listing system (Normal vs Goodwill sales)
- Automatic discount calculation (10% for goodwill listings)
- Smart royalty distribution to previous goodwill sellers
- Comprehensive listing management (create, update, cancel)
- Integration with Lighthouse SDK for IPFS metadata storage

2. IdentityManager.sol
Address: 0x73b0F0bFd958b6F6119dE09A48543B2FB7264369

- Self Protocol integration for passport verification
- Multi-level verification system (1-5 levels)
- Compliance checking for property transactions
- KYC/AML verification management

3. PropertyToken.sol
Address: [To be added]

- ERC-3643 compliant tokenization
- Property metadata linking via IPFS
- Goodwill chain tracking for seller royalties
- Transfer restrictions based on compliance

###🌊 Flow Testnet Integration
## Why Flow Blockchain?

- Low transaction fees for frequent property transactions
- Developer-friendly Cadence smart contract language
- High throughput for marketplace operations
- Built-in account model simplifies user management

## Network Details

- Network: Flow Testnet
- Chain ID: Flow Testnet
- Currency: FLOW (testnet)
- Block Explorer: Flow Testnet Explorer

## What's Stored on IPFS

- Property Images 📸 High-resolution photos and virtual tours
- Legal Documents 📄 Deeds, certificates, compliance papers

## Benefits of Lighthouse SDK

- Permanent storage on IPFS network
- Content addressing ensures data integrity
- Global accessibility via decentralized network
- Cost-effective compared to centralized storage
- Easy integration with smart contracts

## 🔐 Security & Compliance Features
### ERC-3643 Compliance

- Identity verification required for all participants
- Transfer restrictions based on compliance rules
- Regulatory oversight capabilities
- Country-specific regulations support

## Security Measures

- ReentrancyGuard protection
- Access control with role-based permissions
- Pausable contracts for emergency situations
- Input validation and error handling
- Event logging for complete audit trails
