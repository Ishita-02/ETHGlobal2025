const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("PropertyToken", function () {
  let propertyToken;
  let identityManager;
  let owner;
  let buyer;
  let verifier;

  const INITIAL_SUPPLY = ethers.parseEther("100000"); // 100,000 tokens with 18 decimals

  beforeEach(async function () {
    [owner, buyer, verifier] = await ethers.getSigners();
    
    // Deploy IdentityManager
    const IdentityManager = await ethers.getContractFactory("IdentityManager");
    identityManager = await IdentityManager.deploy();
    
    // Add verifier and verify users
    await identityManager.addVerifier(verifier.address);
    await identityManager.connect(verifier).verifyUser(owner.address);
    await identityManager.connect(verifier).verifyUser(buyer.address);

    // Deploy PropertyToken
    const PropertyToken = await ethers.getContractFactory("PropertyToken");
    propertyToken = await PropertyToken.deploy(
      "Property Token",
      "PROP",
      "PROP123",
      "123 Main St",
      ethers.parseEther("1000000"), // listing price
      owner.address,
      await identityManager.getAddress()
    );
  });

  describe("Token Initialization", function () {
    it("Should set correct initial balance for owner", async function () {
      const ownerBalance = await propertyToken.balanceOf(owner.address);
      expect(ownerBalance).to.equal(INITIAL_SUPPLY);
    });

    it("Should set correct property details", async function () {
      const details = await propertyToken.propertyDetails();
      expect(details.propertyId).to.equal("PROP123");
      expect(details.location).to.equal("123 Main St");
      expect(details.price).to.equal(ethers.parseEther("1000000"));
      expect(details.owner).to.equal(owner.address);
    });

    it("Should set correct token metadata", async function () {
      expect(await propertyToken.name()).to.equal("Property Token");
      expect(await propertyToken.symbol()).to.equal("PROP");
    });
  });

  describe("Token Transfers", function () {
    const transferAmount = ethers.parseEther("1000");

    beforeEach(async function () {
      // Ensure buyer is verified before testing transfers
      await identityManager.connect(verifier).verifyUser(
        buyer.address
      );
    });

    // it("Should allow transfer between verified users", async function () {
    //   await propertyToken.transfer(buyer.address, transferAmount);
    //   expect(await propertyToken.balanceOf(buyer.address)).to.equal(transferAmount);
    // });

    it("Should reject transfer to unverified user", async function () {
      const [, , , unverified] = await ethers.getSigners();
      await expect(
        propertyToken.transfer(unverified.address, transferAmount)
      ).to.be.revertedWith("Receiver not verified");
    });

    it("Should update balances correctly after transfer", async function () {
      const initialOwnerBalance = await propertyToken.balanceOf(owner.address);
      
      await propertyToken.transfer(buyer.address, transferAmount);
      
      expect(await propertyToken.balanceOf(owner.address))
        .to.equal(initialOwnerBalance - transferAmount);
      expect(await propertyToken.balanceOf(buyer.address))
        .to.equal(transferAmount);
    });
  });

  describe("Owner Functions", function () {
    
    // it("Should prevent non-owner from updating price", async function () {
    //   const newPrice = ethers.parseEther("1200000");
    //   await expect(
    //     propertyToken.connect(buyer).updatePrice(newPrice)
    //   ).to.be.revertedWith("Ownable: caller is not the owner");
    // });
  });
});