// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://hardhat.org/ignition

const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");


module.exports = buildModule("FactoryModule2", (m) => {
  
  const factoryContract = m.contract("AuctionFactory");

  return { factoryContract };
});
