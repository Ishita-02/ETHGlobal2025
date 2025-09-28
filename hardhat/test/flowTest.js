// const { expect } = require("chai");
// const { ethers } = require("hardhat");

// describe("User-Driven Goodwill and Resale Flow", function () {
//   let marketplace, identityManager;
//   let owner, verifier, user1, user2, user3;
//   let PropertyTokenFactory; // We will use this to deploy the token inside the test

//   // Enum values from the contract for ListingType
//   const ListingType = {
//     Normal: 0,
//     Goodwill: 1,
//   };

//   beforeEach(async function () {
//     // 1. SETUP ACCOUNTS & ESSENTIAL CONTRACTS
//     [owner, verifier, user1, user2, user3] = await ethers.getSigners();

//     // Deploy core infrastructure contracts
//     const IdentityManager = await ethers.getContractFactory("IdentityManager");
//     identityManager = await IdentityManager.deploy();

//     const PropertyMarketplace = await ethers.getContractFactory("PropertyMarketplace");
//     marketplace = await PropertyMarketplace.deploy(await identityManager.getAddress());

//     // Get the factory for the PropertyToken, so we can deploy it later
//     PropertyTokenFactory = await ethers.getContractFactory("PropertyToken");
    
//     console.log("--- Initial Setup Complete ---");
//     console.log("Owner/Verifier:", owner.address);
//     console.log("IdentityManager:", await identityManager.getAddress());
//     console.log("Marketplace:", await marketplace.getAddress());
//   });

//   it("should allow a user to tokenize, list, and facilitate a goodwill sale and resale", async function () {
//     const marketplaceAddress = await marketplace.getAddress();

//     // --- STEP 1: Verify all users ---
//     console.log("\n--- Step 1: Verifying Users ---");
//     await identityManager.connect(owner).verifyUser(user1.address);
//     await identityManager.connect(owner).verifyUser(user2.address);
//     await identityManager.connect(owner).verifyUser(user3.address);
//     console.log("User1, User2, and User3 have been verified.");

//     console.log("user 1 address", user1.address)
//     console.log("user 2 address", user2.address)
//     console.log("user 3 address", user3.address)

//     // --- STEP 2: User1 creates their PropertyToken ---
//     console.log("\n--- Step 2: User1 Tokenizes their Property ---");
//     const propertyToken = await PropertyTokenFactory.connect(user1).deploy(
//       "User1's Lakeside Cabin", // _name
//       "LSC",                     // _symbol
//       "123 Forest Lane",         // _location
//       ethers.parseEther("10"),   // _price (10 ETH per token)
//       user1.address,             // _owner
//       await identityManager.getAddress() // _identityManager
//     );
//     await propertyToken.waitForDeployment();
//     const propertyTokenAddress = await propertyToken.getAddress();

//     console.log(`User1 deployed new PropertyToken at: ${propertyTokenAddress}`);
//     const initialBalanceUser1 = await propertyToken.balanceOf(user1.address);
//     console.log(`User1's initial token balance: ${ethers.formatUnits(initialBalanceUser1, 18)} LSC`);

//     // --- STEP 3: User1 lists the property on a Goodwill basis ---
//     console.log("\n--- Step 3: User1 Lists Property for Goodwill Sale ---");
//     await propertyToken.connect(user1).approve(marketplaceAddress, initialBalanceUser1);
//     console.log("User1 approved marketplace to spend all their LSC tokens.");

//     await marketplace.connect(user1).listProperty(
//       propertyTokenAddress,
//       ethers.parseEther("10"), // Price per token
//       ListingType.Goodwill,
//       "ipfs://user1-property-data"
//     );
//     console.log("User1 has listed the property as a Goodwill sale.");

//     // --- STEP 4: User2 buys tokens from User1 ---
//     console.log("\n--- Step 4: User2 Buys Tokens from User1 ---");
//     const initialPrice = ethers.parseEther("10");
//     const tokensToBuy = 2; // User input: 2 tokens (not in decimals)

//     // Calculate the same way as the contract (price is per whole token)
//     const fullTotalPrice = initialPrice * BigInt(tokensToBuy);
//     const salePrice = (fullTotalPrice * BigInt(90)) / BigInt(100); // 10% discount

//     console.log(`User2 is buying ${tokensToBuy} tokens for a total of ${ethers.formatEther(salePrice)} ETH.`);

//     await marketplace.connect(user2).buyProperty(
//     propertyTokenAddress,
//     tokensToBuy,
//     { value: salePrice }
//     );

//     console.log("User2's purchase successful.");

//     console.log("User2's purchase successful.");
//     const balanceUser1 = await propertyToken.balanceOf(user1.address);
//     const balanceUser2 = await propertyToken.balanceOf(user2.address);
//     console.log(`User1's new balance: ${ethers.formatUnits(balanceUser1, 18)} LSC`);
//     console.log(`User2's new balance: ${ethers.formatUnits(balanceUser2, 18)} LSC`);

//     expect(balanceUser2).to.equal(ethers.parseUnits("2", 18));
    
//     // After the first sale, User1 is still the "official" seller on the marketplace listing
//     // but also becomes the goodwill beneficiary
//     const propertyStateAfterSale1 = await marketplace.properties(propertyTokenAddress);
//     console.log(propertyStateAfterSale1)
//     expect(propertyStateAfterSale1.goodwillBeneficiary).to.equal(user1.address);
//     console.log(`Goodwill Beneficiary is now User1: ${user1.address}`);

//     // --- STEP 5: User3 buys tokens (now owned by User2, but sold via User1's listing) ---
//     // This demonstrates the goodwill mechanism. User1's listing is still active.
//     // User2 needs to approve the marketplace to allow the transfer of the tokens they now own.
//     console.log("\n--- Step 5: User3 Buys Tokens from the Listing ---");
    
//     // CRITICAL: User2 must approve the marketplace to transfer the tokens they just bought
//     await propertyToken.connect(user2).approve(marketplaceAddress, balanceUser2);
//     console.log("User2 has approved the marketplace to spend their tokens for the upcoming sale.");
    
//     const tokensToBuy2 = 1; // User input: 1 token (not in decimals)
//     const paymentAmount2 = salePrice / BigInt(tokensToBuy); // Still at the discounted price from User1's listing
    
//     const goodwillBeneficiaryBalanceBefore = await ethers.provider.getBalance(user1.address);
//     const sellerBalanceBefore = await ethers.provider.getBalance(user1.address); // User1 is still the seller in the contract's eyes

//     console.log(`User3 is buying ${tokensToBuy2} token for ${ethers.formatEther(paymentAmount2)} ETH.`);

//     await marketplace.connect(user3).sellTokens(
//         propertyTokenAddress,
//         tokensToBuy2,
//         { value: paymentAmount2 }
//     );

//     console.log("User3's purchase successful!");

//     const goodwillBeneficiaryBalanceAfter = await ethers.provider.getBalance(user1.address);

//     const balanceUser2After = await propertyToken.balanceOf(user2.address);
//     const balanceUser3 = await propertyToken.balanceOf(user3.address);

//     console.log(`User2's final balance: ${ethers.formatUnits(balanceUser2After, 18)} LSC`);
//     console.log(`User3's final balance: ${ethers.formatUnits(balanceUser3, 18)} LSC`);
//     expect(balanceUser3).to.equal(ethers.parseUnits("1", 18));
    
//     // Check that User1 (the original seller) received the payment.
//     expect(goodwillBeneficiaryBalanceAfter).to.be.gt(goodwillBeneficiaryBalanceBefore);
//     console.log("user 1 balacne", await propertyToken.balanceOf(user1.address))
//     console.log("User1 (original seller) successfully received payment from User3's purchase.");
//   });
// });


const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Basic Goodwill Payment Flow", function () {
  let marketplace, identityManager;
  let owner, user1, user2, user3;
  let PropertyTokenFactory;
  let propertyToken;

  // Sale types
  const SaleType = {
    Normal: 0,
    Goodwill: 1,
  };

  beforeEach(async function () {
    console.log("=".repeat(60));
    console.log("🚀 SETTING UP TEST ENVIRONMENT");
    console.log("=".repeat(60));

    // Get signers
    [owner, user1, user2, user3] = await ethers.getSigners();
    
    console.log("👤 Test Accounts:");
    console.log(`   Owner: ${owner.address}`);
    console.log(`   User1: ${user1.address}`);
    console.log(`   User2: ${user2.address}`);
    console.log(`   User3: ${user3.address}`);

    // Deploy contracts
    const IdentityManager = await ethers.getContractFactory("IdentityManager");
    identityManager = await IdentityManager.deploy();
    console.log(`📋 IdentityManager deployed: ${await identityManager.getAddress()}`);

    const PropertyMarketplace = await ethers.getContractFactory("PropertyMarketplace");
    marketplace = await PropertyMarketplace.deploy(await identityManager.getAddress());
    console.log(`🏪 Marketplace deployed: ${await marketplace.getAddress()}`);

    // Get PropertyToken factory
    PropertyTokenFactory = await ethers.getContractFactory("PropertyToken");

    // Verify all users
    console.log("\n✅ Verifying all users...");
    await identityManager.connect(owner).verifyUser(user1.address);
    await identityManager.connect(owner).verifyUser(user2.address);
    await identityManager.connect(owner).verifyUser(user3.address);
    console.log("   All users verified!");
    
    console.log("\n");
  });

  it("Complete Goodwill Payment Flow with Price Updates", async function () {
    
    // ==========================================
    // STEP 1: USER1 TOKENIZES PROPERTY
    // ==========================================
    console.log("📝 STEP 1: User1 Tokenizes Property");
    console.log("-".repeat(40));

    propertyToken = await PropertyTokenFactory.connect(user1).deploy(
      "Beachside Villa",                    
      "BV",                              
      "456 Ocean Drive, Miami",           
      ethers.parseEther("10"),             
      user1.address,                      
      await identityManager.getAddress()  
    );
    await propertyToken.waitForDeployment();
    const propertyTokenAddress = await propertyToken.getAddress();

    console.log(`🏠 PropertyToken deployed: ${propertyTokenAddress}`);
    
    // Check User1's initial balance
    const user1InitialBalance = await propertyToken.balanceOf(user1.address);
    const decimals = await propertyToken.decimals();
    console.log(`💰 User1's initial balance: ${ethers.formatUnits(user1InitialBalance, decimals)} BV tokens`);
    console.log(`🔢 Token decimals: ${decimals}`);

    // Register property in marketplace
    await marketplace.connect(user1).registerProperty(
      propertyTokenAddress,
      "ipfs://QmPropertyMetadataHash123",
      "ipfs://QmaPROPERTYIMAGEURI"
    );
    console.log("📋 Property registered in marketplace");

    // Verify property registration
    const propertyInfo = await marketplace.properties(propertyTokenAddress);
    expect(propertyInfo.originalOwner).to.equal(user1.address);
    expect(propertyInfo.goodwillBeneficiary).to.equal(ethers.ZeroAddress);
    expect(propertyInfo.hasGoodwillHistory).to.be.false;
    console.log(`✅ Original Owner: ${propertyInfo.originalOwner}`);
    console.log(`✅ Goodwill Beneficiary: ${propertyInfo.goodwillBeneficiary} (should be zero address initially)`);

    // ==========================================
    // STEP 2: USER1 CREATES GOODWILL SELL OFFER
    // ==========================================
    console.log("\n🏷️ STEP 2: User1 Creates Goodwill Sell Offer");
    console.log("-".repeat(45));

    const initialPricePerToken = ethers.parseEther("15"); // 15 ETH per token
    const tokensToSell = 5; // 5 tokens

    const marketplaceAddress = await marketplace.getAddress();
    const totalTokenAmountToSell = ethers.parseUnits(tokensToSell.toString(), decimals);
    await propertyToken.connect(user1).approve(marketplaceAddress, totalTokenAmountToSell);
    console.log(`   APPROVAL: User1 approved marketplace to spend ${tokensToSell} BV tokens.`);


    await marketplace.connect(user1).createSellOffer(
      propertyTokenAddress,
      initialPricePerToken,
      tokensToSell,
      SaleType.Goodwill
    );
    
    console.log(`💰 Price per token: ${ethers.formatEther(initialPricePerToken)} ETH`);
    console.log(`📦 Tokens for sale: ${tokensToSell}`);
    console.log(`🎁 Sale type: Goodwill (10% discount)`);

    
    // Get the offer details
    const offer1 = await marketplace.sellOffers(1);
    expect(offer1.seller).to.equal(user1.address);
    expect(offer1.pricePerToken).to.equal(initialPricePerToken);
    expect(offer1.tokensAvailable).to.equal(tokensToSell);
    expect(offer1.saleType).to.equal(SaleType.Goodwill);
    expect(offer1.isActive).to.be.true;

    console.log(`✅ Offer created with ID: ${offer1.offerId}`);

    // ==========================================
    // STEP 3: USER2 BUYS TOKENS (FIRST GOODWILL SALE)
    // ==========================================
    console.log("\n🛒 STEP 3: User2 Buys Tokens (First Goodwill Sale)");
    console.log("-".repeat(50));

    const tokensToBuy1 = 2;
    const fullPrice1 = initialPricePerToken * BigInt(tokensToBuy1);
    const discountedPrice1 = (fullPrice1 * BigInt(90)) / BigInt(100); // 10% discount

    console.log(`🛍️ User2 buying ${tokensToBuy1} tokens`);
    console.log(`💵 Full price: ${ethers.formatEther(fullPrice1)} ETH`);
    console.log(`🎁 Discounted price (10% off): ${ethers.formatEther(discountedPrice1)} ETH`);
    console.log(`💸 User2 saves: ${ethers.formatEther(fullPrice1 - discountedPrice1)} ETH`);

    // Record balances before
    const user1BalanceBefore = await ethers.provider.getBalance(user1.address);
    const user2BalanceBefore = await ethers.provider.getBalance(user2.address);

    // User2 buys tokens
    const tx1 = await marketplace.connect(user2).buyTokens(
      propertyTokenAddress,
      1, // offer ID
      tokensToBuy1,
      { value: discountedPrice1 }
    );
    const receipt1 = await tx1.wait();
    const gasUsed1 = receipt1.gasUsed * receipt1.gasPrice;

    // Record balances after
    const user1BalanceAfter = await ethers.provider.getBalance(user1.address);
    const user2BalanceAfter = await ethers.provider.getBalance(user2.address);
    const user2TokenBalance = await propertyToken.balanceOf(user2.address);

    console.log(`✅ Transaction successful! Gas used: ${ethers.formatEther(gasUsed1)} ETH`);
    console.log(`💰 User1 received: ${ethers.formatEther(user1BalanceAfter - user1BalanceBefore)} ETH`);
    console.log(`💰 User2 paid: ${ethers.formatEther(user2BalanceBefore - user2BalanceAfter - gasUsed1)} ETH`);
    console.log(`🪙 User2's token balance: ${ethers.formatUnits(user2TokenBalance, decimals)} BV tokens`);

    // Verify token transfer
    expect(user2TokenBalance).to.equal(ethers.parseUnits(tokensToBuy1.toString(), decimals));

    // Verify User1 became goodwill beneficiary
    const propertyInfoAfterSale1 = await marketplace.properties(propertyTokenAddress);
    expect(propertyInfoAfterSale1.goodwillBeneficiary).to.equal(user1.address);
    expect(propertyInfoAfterSale1.hasGoodwillHistory).to.be.true;

    console.log(`🎁 User1 is now the goodwill beneficiary!`);
    console.log(`📈 Property now has goodwill history`);

    // Check updated offer
    const updatedOffer1 = await marketplace.sellOffers(1);
    expect(updatedOffer1.tokensAvailable).to.equal(tokensToSell - tokensToBuy1);
    console.log(`📦 Remaining tokens in offer: ${updatedOffer1.tokensAvailable}`);

    // ==========================================
    // STEP 4: USER1 UPDATES OFFER PRICE
    // ==========================================
    console.log("\n💰 STEP 4: User1 Updates Offer Price");
    console.log("-".repeat(40));

    const newPricePerToken = ethers.parseEther("18"); // Increase to 18 ETH per token
    
    await marketplace.connect(user1).updateOfferPrice(1, newPricePerToken);
    
    console.log(`📈 Price updated from ${ethers.formatEther(initialPricePerToken)} ETH to ${ethers.formatEther(newPricePerToken)} ETH per token`);
    
    // Verify price update
    const updatedOffer = await marketplace.sellOffers(1);
    expect(updatedOffer.pricePerToken).to.equal(newPricePerToken);
    console.log(`✅ Price update confirmed`);

    // ==========================================
    // STEP 5: USER2 CREATES NEW GOODWILL OFFER
    // ==========================================
    console.log("\n🏷️ STEP 5: User2 Creates New Goodwill Offer");
    console.log("-".repeat(45));

    const user2PricePerToken = ethers.parseEther("20"); // 20 ETH per token
    const user2TokensToSell = 1;

    const user2TokenAmountToSell = ethers.parseUnits(user2TokensToSell.toString(), decimals);
    await propertyToken.connect(user2).approve(marketplaceAddress, user2TokenAmountToSell);
    console.log(`   APPROVAL: User2 approved marketplace to spend ${user2TokensToSell} BV tokens.`);

    await marketplace.connect(user2).createSellOffer(
      propertyTokenAddress,
      user2PricePerToken,
      user2TokensToSell,
      SaleType.Goodwill
    );

    console.log(`💰 User2's price per token: ${ethers.formatEther(user2PricePerToken)} ETH`);
    console.log(`📦 User2's tokens for sale: ${user2TokensToSell}`);
    console.log(`🎁 Sale type: Goodwill (10% discount)`);

    const offer2 = await marketplace.sellOffers(2);
    expect(offer2.seller).to.equal(user2.address);
    console.log(`✅ User2's offer created with ID: ${offer2.offerId}`);

    // ==========================================
    // STEP 6: USER3 BUYS FROM USER2 (GOODWILL CHAIN)
    // ==========================================
    console.log("\n🛒 STEP 6: User3 Buys from User2 (Goodwill Chain Activated!)");
    console.log("-".repeat(60));

    const tokensToBuy2 = 1;
    const fullPrice2 = user2PricePerToken * BigInt(tokensToBuy2); // 20 ETH
    const discountedPrice2 = (fullPrice2 * BigInt(90)) / BigInt(100); // 18 ETH (10% discount)
    const goodwillPayment = (fullPrice2 * BigInt(10)) / BigInt(100); // 2 ETH to beneficiary

    console.log(`🛍️ User3 buying ${tokensToBuy2} token from User2`);
    console.log(`💵 Full price: ${ethers.formatEther(fullPrice2)} ETH`);
    console.log(`🎁 User3 pays (discounted): ${ethers.formatEther(discountedPrice2)} ETH`);
    console.log(`🎁 User1 (beneficiary) receives: ${ethers.formatEther(goodwillPayment)} ETH`);
    console.log(`💰 User2 (seller) receives: ${ethers.formatEther(discountedPrice2 - goodwillPayment)} ETH`);

    // Record balances before second purchase
    const user1BalanceBefore2 = await ethers.provider.getBalance(user1.address);
    const user2BalanceBefore2 = await ethers.provider.getBalance(user2.address);
    const user3BalanceBefore2 = await ethers.provider.getBalance(user3.address);

    // User3 buys from User2's offer
    const tx2 = await marketplace.connect(user3).buyTokens(
      propertyTokenAddress,
      2, // User2's offer ID
      tokensToBuy2,
      { value: discountedPrice2 }
    );
    const receipt2 = await tx2.wait();
    const gasUsed2 = receipt2.gasUsed * receipt2.gasPrice;

    // Record balances after second purchase
    const user1BalanceAfter2 = await ethers.provider.getBalance(user1.address);
    const user2BalanceAfter2 = await ethers.provider.getBalance(user2.address);
    const user3BalanceAfter2 = await ethers.provider.getBalance(user3.address);
    const user3TokenBalance = await propertyToken.balanceOf(user3.address);

    console.log(`✅ Second transaction successful! Gas used: ${ethers.formatEther(gasUsed2)} ETH`);
    
    // Calculate actual transfers
    const user1Received = user1BalanceAfter2 - user1BalanceBefore2;
    const user2Received = user2BalanceAfter2 - user2BalanceBefore2;
    const user3Paid = user3BalanceBefore2 - user3BalanceAfter2 - gasUsed2;

    console.log(`🎁 User1 (beneficiary) received: ${ethers.formatEther(user1Received)} ETH`);
    console.log(`💰 User2 (seller) received: ${ethers.formatEther(user2Received)} ETH`);
    console.log(`💸 User3 (buyer) paid: ${ethers.formatEther(user3Paid)} ETH`);
    console.log(`🪙 User3's token balance: ${ethers.formatUnits(user3TokenBalance, decimals)} BV tokens`);

    // Verify payments are correct
    expect(user1Received).to.be.closeTo(goodwillPayment, ethers.parseEther("0.001")); // Allow small rounding
    expect(user3Paid).to.be.closeTo(discountedPrice2, ethers.parseEther("0.001"));

    // Verify User2 became new goodwill beneficiary
    const propertyInfoAfterSale2 = await marketplace.properties(propertyTokenAddress);
    expect(propertyInfoAfterSale2.goodwillBeneficiary).to.equal(user2.address);

    console.log(`🎁 User2 is now the new goodwill beneficiary!`);

    // ==========================================
    // FINAL VERIFICATION
    // ==========================================
    console.log("\n📊 FINAL STATE VERIFICATION");
    console.log("-".repeat(40));

    // Check all token balances
    const finalUser1Tokens = await propertyToken.balanceOf(user1.address);
    const finalUser2Tokens = await propertyToken.balanceOf(user2.address);
    const finalUser3Tokens = await propertyToken.balanceOf(user3.address);

    console.log(`🪙 Final Token Balances:`);
    console.log(`   User1: ${ethers.formatUnits(finalUser1Tokens, decimals)} BV`);
    console.log(`   User2: ${ethers.formatUnits(finalUser2Tokens, decimals)} BV`);
    console.log(`   User3: ${ethers.formatUnits(finalUser3Tokens, decimals)} BV`);

    // Verify token conservation
    const totalTokens = finalUser1Tokens + finalUser2Tokens + finalUser3Tokens;
    expect(totalTokens).to.equal(user1InitialBalance);
    console.log(`✅ Token conservation verified: ${ethers.formatUnits(totalTokens, decimals)} BV total`);

    // Check active offers
    const activeOffers = await marketplace.getActiveOffers(propertyTokenAddress);
    console.log(`📋 Active offers: ${activeOffers.length}`);
    for (let i = 0; i < activeOffers.length; i++) {
      const offer = await marketplace.sellOffers(activeOffers[i]);
      if (offer.isActive) {
        console.log(`   Offer ${activeOffers[i]}: ${offer.tokensAvailable} tokens @ ${ethers.formatEther(offer.pricePerToken)} ETH each`);
      }
    }

    // Final property state
    const finalPropertyInfo = await marketplace.properties(propertyTokenAddress);
    console.log(`🏠 Property State:`);
    console.log(`   Original Owner: ${finalPropertyInfo.originalOwner}`);
    console.log(`   Current Goodwill Beneficiary: ${finalPropertyInfo.goodwillBeneficiary}`);
    console.log(`   Has Goodwill History: ${finalPropertyInfo.hasGoodwillHistory}`);

    console.log("\n🎉 GOODWILL FLOW COMPLETE!");
    console.log("=".repeat(60));
  });
});