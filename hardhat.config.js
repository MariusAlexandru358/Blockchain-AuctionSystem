require("@nomicfoundation/hardhat-toolbox");
// require("@nomiclabs/hardhat-ethers");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.28",
  networks: {
    hardhat: {
      gas: "auto",
      mining: {
        auto: true,
        interval: 2000, //ms
      },
      // accounts: [
      //     {
      //       privateKey: "0xYourPrivateKey1",
      //       balance: "100000000000000000000" // 100 ETH
      //     },
      //     {
      //       privateKey: "0xYourPrivateKey2",
      //       balance: "100000000000000000000" // 100 ETH
      //     },
      //   ],
    },
    sepolia: {
      url: "https://sepolia.infura.io/v3/4930e40b524a4c9bbad4bbf398a856af",
      accounts: ["ec42da251ed509deb4e8ce013c6eb43c3da94f51e88c3fa19b0f09c5c737c891", "0297b730f3ce438bae774a7a3c7a02ad5df205928ee61bb5cbb8945342f86238"]
    }
  },
};
