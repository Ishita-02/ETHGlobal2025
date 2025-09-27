require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: "0.8.20",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      },
      viaIR: true 
    }
  },
  networks: {
    localhost: {
      url: "http://127.0.0.1:8545",
      chainId: 31337,
    },
    hardhat: {
      chainId: 31337
    },
    flow_testnet: {
      url: "https://flow-testnet.g.alchemy.com/v2/aPDm94kJp0lgvlIMHTE6T_TYvl2JrnG0",
      chainId: 545,
      accounts:["ddc1aeec0aa629e7901f9854cbdf36a7b77c9c464773a6b87e63b89ae28a5613"]
    },
    sepolia_testnet: {
      url: "https://eth-sepolia.g.alchemy.com/v2/aPDm94kJp0lgvlIMHTE6T_TYvl2JrnG0",
      chainId: 11155111,
      accounts:["ddc1aeec0aa629e7901f9854cbdf36a7b77c9c464773a6b87e63b89ae28a5613"]
    }
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts"
  }
};