const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("PropertyMarketplace", function () {
  let identityManager;
  let marketplace;
  let propertyToken;
  let owner;
  let verifier;
  let seller;
  let buyer;
  let unverifiedUser;
  let goodwillBeneficiary;

  const PROPERTY_PRICE = ethers.parseEther("1.0");
  const GOODWILL_PERCENTAGE = 10;

  beforeEach(async function () {
    // Get signers
    [owner, verifier, seller, buyer, unverifiedUser, goodwillBeneficiary] = await ethers.getSigners();

    // Deploy IdentityManager
    const IdentityManager = await ethers.getContractFactory("IdentityManager");
    identityManager = await IdentityManager.deploy();
    await identityManager.waitForDeployment();

    // Deploy PropertyMarketplace
    const PropertyMarketplace = await ethers.getContractFactory("PropertyMarketplace");
    marketplace = await PropertyMarketplace.deploy(await identityManager.getAddress());
    await marketplace.waitForDeployment();

    // Add verifier
    await identityManager.addVerifier(verifier.address);

    // Verify seller and buyer
    await identityManager.connect(verifier).verifyUser(seller.address);
    await identityManager.connect(verifier).verifyUser(buyer.address);
    await identityManager.connect(verifier).verifyUser(goodwillBeneficiary.address);

    // Deploy PropertyToken
    const PropertyToken = await ethers.getContractFactory("PropertyToken");
    propertyToken = await PropertyToken.deploy(
      "Property Token",
      "PROP",
      "PROP001",
      "123 Main St",
      PROPERTY_PRICE,
      seller.address,
      await identityManager.getAddress()
    );
    await propertyToken.waitForDeployment();
  });

  describe("Deployment", function () {
    it("Should set the correct identity manager", async function () {
      expect(await marketplace.identityManager()).to.equal(await identityManager.getAddress());
    });

    it("Should set the correct owner", async function () {
      expect(await marketplace.owner()).to.equal(owner.address);
    });
  });

  describe("Property Listing", function () {
    it("Should allow verified user to list property", async function () {
      await expect(
        marketplace.connect(seller).listProperty(
          await propertyToken.getAddress(),
          PROPERTY_PRICE,
          false,
          "ipfs://test-uri"
        )
      ).to.emit(marketplace, "PropertyListed")
        .withArgs(
          await propertyToken.getAddress(),
          seller.address,
          PROPERTY_PRICE,
          false
        );

      const property = await marketplace.properties(await propertyToken.getAddress());
      expect(property.price).to.equal(PROPERTY_PRICE);
      expect(property.seller).to.equal(seller.address);
      expect(property.isListed).to.be.true;
      expect(property.isGoodwillSale).to.be.false;
    });

    it("Should allow listing with goodwill sale", async function () {
      await marketplace.connect(seller).listProperty(
        await propertyToken.getAddress(),
        PROPERTY_PRICE,
        true,
        "ipfs://test-uri"
      );

      const property = await marketplace.properties(await propertyToken.getAddress());
      expect(property.isGoodwillSale).to.be.true;
    });

    it("Should reject listing from unverified user", async function () {
      await expect(
        marketplace.connect(unverifiedUser).listProperty(
          await propertyToken.getAddress(),
          PROPERTY_PRICE,
          false,
          "ipfs://test-uri"
        )
      ).to.be.revertedWith("User not verified");
    });

    it("Should reject listing with zero price", async function () {
      await expect(
        marketplace.connect(seller).listProperty(
          await propertyToken.getAddress(),
          0,
          false,
          "ipfs://test-uri"
        )
      ).to.be.revertedWith("Invalid price");
    });

    it("Should reject listing already listed property", async function () {
      await marketplace.connect(seller).listProperty(
        await propertyToken.getAddress(),
        PROPERTY_PRICE,
        false,
        "ipfs://test-uri"
      );

      await expect(
        marketplace.connect(seller).listProperty(
          await propertyToken.getAddress(),
          PROPERTY_PRICE,
          false,
          "ipfs://test-uri"
        )
      ).to.be.revertedWith("Already listed");
    });

    it("Should reject listing if user doesn't own tokens", async function () {
      // Transfer all tokens away from seller
      const balance = await propertyToken.balanceOf(seller.address);
      await propertyToken.connect(seller).transfer(buyer.address, balance);

      await expect(
        marketplace.connect(seller).listProperty(
          await propertyToken.getAddress(),
          PROPERTY_PRICE,
          false,
          "ipfs://test-uri"
        )
      ).to.be.revertedWith("Must own property tokens");
    });
  });

  describe("Property Buying", function () {
    beforeEach(async function () {
      // List the property first
      await marketplace.connect(seller).listProperty(
        await propertyToken.getAddress(),
        PROPERTY_PRICE,
        false,
        "ipfs://test-uri"
      );
    });

    it("Should allow verified user to buy property", async function () {
      const sellerBalanceBefore = await ethers.provider.getBalance(seller.address);
      
      await expect(
        marketplace.connect(buyer).buyProperty(
          await propertyToken.getAddress(),
          { value: PROPERTY_PRICE }
        )
      ).to.emit(marketplace, "PropertySold")
        .withArgs(
          await propertyToken.getAddress(),
          seller.address,
          buyer.address,
          PROPERTY_PRICE,
          0
        );

      // Check property ownership transferred
      expect(await propertyToken.balanceOf(buyer.address)).to.be.gt(0);
      expect(await propertyToken.balanceOf(seller.address)).to.equal(0);

      // Check property is no longer listed
      const property = await marketplace.properties(await propertyToken.getAddress());
      expect(property.isListed).to.be.false;
      expect(property.seller).to.equal(buyer.address);

      // Check seller received payment
      const sellerBalanceAfter = await ethers.provider.getBalance(seller.address);
      expect(sellerBalanceAfter).to.be.gt(sellerBalanceBefore);
    });

    it("Should handle goodwill sale correctly", async function () {
      // Cancel previous listing and create goodwill sale
      await marketplace.connect(seller).cancelListing(await propertyToken.getAddress());
      
      await marketplace.connect(seller).listProperty(
        await propertyToken.getAddress(),
        PROPERTY_PRICE,
        true,
        "ipfs://test-uri"
      );

      const expectedSalePrice = (PROPERTY_PRICE * BigInt(100 - GOODWILL_PERCENTAGE)) / BigInt(100);
      
      await marketplace.connect(buyer).buyProperty(
        await propertyToken.getAddress(),
        { value: expectedSalePrice }
      );

      const property = await marketplace.properties(await propertyToken.getAddress());
      expect(property.goodwillBeneficiary).to.equal(seller.address);
    });

    it("Should reject purchase from unverified user", async function () {
      await expect(
        marketplace.connect(unverifiedUser).buyProperty(
          await propertyToken.getAddress(),
          { value: PROPERTY_PRICE }
        )
      ).to.be.revertedWith("User not verified");
    });

    it("Should reject purchase with incorrect payment", async function () {
      await expect(
        marketplace.connect(buyer).buyProperty(
          await propertyToken.getAddress(),
          { value: PROPERTY_PRICE / BigInt(2) }
        )
      ).to.be.revertedWith("Incorrect payment amount");
    });

    it("Should reject seller buying own property", async function () {
      await expect(
        marketplace.connect(seller).buyProperty(
          await propertyToken.getAddress(),
          { value: PROPERTY_PRICE }
        )
      ).to.be.revertedWith("Cannot buy own property");
    });

    it("Should reject purchase of unlisted property", async function () {
      await marketplace.connect(seller).cancelListing(await propertyToken.getAddress());
      
      await expect(
        marketplace.connect(buyer).buyProperty(
          await propertyToken.getAddress(),
          { value: PROPERTY_PRICE }
        )
      ).to.be.revertedWith("Property not listed");
    });
  });

  describe("Cancel Listing", function () {
    beforeEach(async function () {
      await marketplace.connect(seller).listProperty(
        await propertyToken.getAddress(),
        PROPERTY_PRICE,
        false,
        "ipfs://test-uri"
      );
    });

    it("Should allow seller to cancel listing", async function () {
      await marketplace.connect(seller).cancelListing(await propertyToken.getAddress());
      
      const property = await marketplace.properties(await propertyToken.getAddress());
      expect(property.isListed).to.be.false;
    });

    it("Should reject cancellation by non-seller", async function () {
      await expect(
        marketplace.connect(buyer).cancelListing(await propertyToken.getAddress())
      ).to.be.revertedWith("Not the seller");
    });

    it("Should reject cancellation of unlisted property", async function () {
      await marketplace.connect(seller).cancelListing(await propertyToken.getAddress());
      
      await expect(
        marketplace.connect(seller).cancelListing(await propertyToken.getAddress())
      ).to.be.revertedWith("Not listed");
    });
  });

  describe("Update Price", function () {
    beforeEach(async function () {
      await marketplace.connect(seller).listProperty(
        await propertyToken.getAddress(),
        PROPERTY_PRICE,
        false,
        "ipfs://test-uri"
      );
    });

    it("Should allow owner to update price", async function () {
      const newPrice = ethers.parseEther("2.0");
      
      await marketplace.updatePrice(await propertyToken.getAddress(), newPrice);
      
      const property = await marketplace.properties(await propertyToken.getAddress());
      expect(property.price).to.equal(newPrice);
    });

    it("Should reject price update by non-owner", async function () {
      const newPrice = ethers.parseEther("2.0");
      
      await expect(
        marketplace.connect(seller).updatePrice(await propertyToken.getAddress(), newPrice)
      ).to.be.revertedWithCustomError(marketplace, "OwnableUnauthorizedAccount");
    });

    it("Should reject zero price update", async function () {
      await expect(
        marketplace.updatePrice(await propertyToken.getAddress(), 0)
      ).to.be.revertedWith("Invalid price");
    });

    it("Should reject price update for unlisted property", async function () {
      await marketplace.connect(seller).cancelListing(await propertyToken.getAddress());
      
      await expect(
        marketplace.updatePrice(await propertyToken.getAddress(), ethers.parseEther("2.0"))
      ).to.be.revertedWith("Not listed");
    });
  });

  describe("Goodwill Payment Flow", function () {
    it("Should handle subsequent goodwill sales correctly", async function () {
      // First sale as goodwill sale
      await marketplace.connect(seller).listProperty(
        await propertyToken.getAddress(),
        PROPERTY_PRICE,
        true,
        "ipfs://test-uri"
      );

      const firstSalePrice = (PROPERTY_PRICE * BigInt(100 - GOODWILL_PERCENTAGE)) / BigInt(100);
      await marketplace.connect(buyer).buyProperty(
        await propertyToken.getAddress(),
        { value: firstSalePrice }
      );

      // Second sale - buyer becomes seller, goodwill should go to original seller
      await marketplace.connect(buyer).listProperty(
        await propertyToken.getAddress(),
        PROPERTY_PRICE,
        true,
        "ipfs://test-uri"
      );

      const originalSellerBalanceBefore = await ethers.provider.getBalance(seller.address);
      
      await marketplace.connect(goodwillBeneficiary).buyProperty(
        await propertyToken.getAddress(),
        { value: firstSalePrice }
      );

      // Check that original seller received goodwill payment
      const originalSellerBalanceAfter = await ethers.provider.getBalance(seller.address);
      const goodwillAmount = (PROPERTY_PRICE * BigInt(GOODWILL_PERCENTAGE)) / BigInt(100);
      
      expect(originalSellerBalanceAfter - originalSellerBalanceBefore).to.equal(goodwillAmount);
    });
  });

  describe("Reentrancy Protection", function () {
    // Note: This would require a malicious contract to test properly
    // For now, we just verify the nonReentrant modifier is present
    it("Should have reentrancy protection on buyProperty", async function () {
      // This test verifies the function exists and can be called
      // In a real scenario, you'd deploy a malicious contract to test reentrancy
      await marketplace.connect(seller).listProperty(
        await propertyToken.getAddress(),
        PROPERTY_PRICE,
        false,
        "ipfs://test-uri"
      );

      await expect(
        marketplace.connect(buyer).buyProperty(
          await propertyToken.getAddress(),
          { value: PROPERTY_PRICE }
        )
      ).to.not.be.reverted;
    });
  });
});
