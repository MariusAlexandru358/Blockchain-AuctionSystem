// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://hardhat.org/ignition

const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

const TOKENS = 1000;

module.exports = buildModule("ERCModule", (m) => {
  const tokens = m.getParameter("tokens", TOKENS);
  
  const erc20 = m.contract("MyERC20");

  return { erc20 };
});
