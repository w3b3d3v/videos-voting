require("@nomicfoundation/hardhat-toolbox");

let config = {
  defaultNetwork: "testing",
  solidity: "0.8.1",
  settings: {
    optimizer: {
      enabled: false,
      runs: 200
    }
  },
  networks: {
    testing: {
      url: "http://127.0.0.1:8545/",
    }
  }
};

module.exports = config;