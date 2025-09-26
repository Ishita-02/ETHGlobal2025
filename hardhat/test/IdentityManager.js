const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("IdentityManager", function () {
  let identityManager;
  let owner;
  let verifier;
  let user;

  beforeEach(async function () {
    [owner, verifier, user] = await ethers.getSigners();
    
    const IdentityManager = await ethers.getContractFactory("IdentityManager");
    identityManager = await IdentityManager.deploy();
  });

  describe("Verifier Management", function () {
    it("Should allow owner to add verifier", async function () {
      await identityManager.addVerifier(verifier.address);
      expect(await identityManager.verifiers(verifier.address)).to.be.true;
    });

  });

  describe("User Verification", function () {
    beforeEach(async function () {
      await identityManager.addVerifier(verifier.address);
    });

    it("Should allow verifier to verify user", async function () {
      await identityManager.connect(verifier).verifyUser(
        user.address
      );
      expect(await identityManager.isUserVerified(user.address)).to.be.true;
    });
  });
});