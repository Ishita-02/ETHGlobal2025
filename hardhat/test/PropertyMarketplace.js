const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("PropertyMarketplace", function () {
  let marketplace;
  let propertyToken;
  let identityManager;
  let owner;
  let seller;
  let buyer;
  let verifier;

  beforeEach(async function () {
    [owner, seller, buyer, verifier] = await ethers.getSigners();

    // Deploy IdentityManager
    const IdentityManager = await ethers.getContractFactory("IdentityManager");
    identityManager = await IdentityManager.deploy();
    
    // Setup verifications
    await identityManager.addVerifier(verifier.address);
    await identityManager.connect(verifier).verifyUser(seller.address);
    await identityManager.connect(verifier).verifyUser(buyer.address);

    // Deploy PropertyToken
    const PropertyToken = await ethers.getContractFactory("PropertyToken");
    propertyToken = await PropertyToken.deploy(
      "Property Token",
      "PROP",
      "PROP123",
      "123 Main St",
      ethers.parseEther("1000000"),
      seller.address,
      await identityManager.getAddress()
    );

    // Deploy Marketplace
    const PropertyMarketplace = await ethers.getContractFactory("PropertyMarketplace");
    marketplace = await PropertyMarketplace.deploy(await identityManager.getAddress());
  });

  describe("Listing", function () {
    it("Should allow verified user to list property", async function () {
      const price = ethers.parseEther("1000000");
      await propertyToken.connect(seller).approve(await marketplace.getAddress(), ethers.parseEther("100000"));
      
      await marketplace.connect(seller).listProperty(
        await propertyToken.getAddress(),
        price,
        false, // not goodwill sale
        "random"
      );

      const property = await marketplace.properties(await propertyToken.getAddress());
      expect(property.price).to.equal(price);
      expect(property.seller).to.equal(seller.address);
    });
  });

  describe("Buying", function () {
    beforeEach(async function () {
      await propertyToken.connect(seller).approve(await marketplace.getAddress(), ethers.parseEther("100000"));
      await marketplace.connect(seller).listProperty(
        await propertyToken.getAddress(),
        ethers.parseEther("1000"),
        false,
        "random"
      );
    });

    it("Should allow verified buyer to purchase property", async function () {
      const buyAmount = ethers.parseEther("1000");
      console.log("buyer's balance", await propertyToken.balanceOf(buyer.address))
      await marketplace.connect(buyer).buyProperty(
        await propertyToken.getAddress(), 2,
        { value: buyAmount * BigInt(2) }
      );

      console.log("buyer's balance", await propertyToken.balanceOf(buyer.address))

      expect(await propertyToken.balanceOf(buyer.address)).to.equal(buyAmount);
    });

    it("Should handle goodwill sale correctly", async function () {
      // Test goodwill sale logic
      const price = ethers.parseEther("1000");
      await marketplace.connect(seller).listProperty(
        await propertyToken.getAddress(),
        price,
        true,
        "random" // goodwill sale
      );

      const discountedPrice = price.mul(90).div(100); // 10% discount
      await marketplace.connect(buyer).buyProperty(
        await propertyToken.getAddress(),
        { value: discountedPrice }
      );

      // Verify goodwill beneficiary is set
      const property = await marketplace.properties(await propertyToken.getAddress());
      expect(property.goodwillBeneficiary).to.equal(seller.address);
    });
  });
});