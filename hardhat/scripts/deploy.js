const hre = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with account:", deployer.address);

  try {
    // 1. Deploy IdentityManager
    console.log("\nDeploying IdentityManager...");
    const IdentityManager = await ethers.getContractFactory("IdentityManager");
    const identityManager = await IdentityManager.deploy();
    await identityManager.waitForDeployment();
    const identityManagerAddress = await identityManager.getAddress();
    console.log("IdentityManager deployed to:", identityManagerAddress);

    // 2. Deploy PropertyToken with exact constructor parameters
    console.log("\nDeploying PropertyToken...");
    const PropertyToken = await ethers.getContractFactory("PropertyToken");
    const propertyToken = await PropertyToken.deploy(
      "Property Token",       // _name
      "PROP",                // _symbol
      "PROP123",             // _propertyId
      "123 Main St",         // _location
      ethers.parseEther("1000000"), // _price
      deployer.address,      // _owner
      identityManagerAddress // _identityManager
    );
    await propertyToken.waitForDeployment();
    const propertyTokenAddress = await propertyToken.getAddress();
    console.log("PropertyToken deployed to:", propertyTokenAddress);

    // 3. Deploy PropertyMarketplace
    console.log("\nDeploying PropertyMarketplace...");
    const PropertyMarketplace = await ethers.getContractFactory("PropertyMarketplace");
    const marketplace = await PropertyMarketplace.deploy(identityManagerAddress);
    await marketplace.waitForDeployment();
    const marketplaceAddress = await marketplace.getAddress();
    console.log("PropertyMarketplace deployed to:", marketplaceAddress);

    // Save deployment addresses
    const deployments = {
      identityManager: identityManagerAddress,
      propertyToken: propertyTokenAddress,
      marketplace: marketplaceAddress,
      network: network.name,
      timestamp: new Date().toISOString()
    };

    require('fs').writeFileSync(
      'deployments.json',
      JSON.stringify(deployments, null, 2)
    );
    
    console.log("\nDeployment Summary:");
    console.log("-------------------");
    console.log("IdentityManager:", identityManagerAddress);
    console.log("PropertyToken:", propertyTokenAddress);
    console.log("Marketplace:", marketplaceAddress);

  } catch (error) {
    console.error("Deployment failed:", error);
    process.exit(1);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });