// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://hardhat.org/ignition

const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

// const TOKENS = 1000;

// module.exports = buildModule("ERCModule", (m) => {
//   const tokens = m.getParameter("tokens", TOKENS);
  
//   const erc20 = m.contract("MyERC20");

//   return { erc20 };
// });

// module.exports = buildModule("SimpleAuctionModule", (m) => {
//     const tokenContractAddress = m.getParameter("tokens", TOKENS);
    
//     const contractSimpleAuction = m.contract("SimpleAuction");
  
//     return { contractSimpleAuction };
//   });
  

// module.exports = buildModule("SimpleAuctionModule", (m) => {
//     // Retrieve the ERC20 contract from the ERCModule
//     const { erc20 } = m.useModule("ERCModule");
  
//     // Parameters for the auction (e.g., auction time)
//     const biddingTime = m.getParameter("biddingTime", 3600); // 1 hour as an example
  
//     // Deploy the SimpleAuction contract, passing the biddingTime and the MyERC20 contract address
//     const simpleAuction = m.contract("SimpleAuction", biddingTime, erc20.artifact.address);
  
//     return { simpleAuction };
//   });
  
  
// const myerc20pointscontract = '0x5FbDB2315678afecb367f032d93F642f64180aa3';
// const myerc20pointscontract = '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512'; // localhost
const myerc20pointscontract = '0x2787d3802683F26245fb289b7332a2730F58803A'; // sepolia
module.exports = buildModule("SimpleAuctionModule", (m) => {
    const biddingTime = m.getParameter("biddingTime", 3600);
    const _tokenContract = m.getParameter("_tokenContract", myerc20pointscontract);
    const itemName = m.getParameter("itemName", "Default Item Name"); // Default value for itemName
    const itemDescription = m.getParameter("itemDescription", "Default Item Description"); // Default value for itemDescription

    const simpleAuction = m.contract("SimpleAuction", [
        biddingTime,
        _tokenContract,
        itemName,
        itemDescription,
    ]);

    return { simpleAuction };
});





// module.exports = buildModule("SimpleAuctionModule", (m) => {
//   // Retrieve the already deployed MyERC20 contract from the ERC20Module
//     const erc20 = m.useModule("ERC20Module");
//     console.log("ERC20 Address:", erc20.address);
//     console.log("ERC20 Artifact:", erc20.artifact);

  
//     const biddingTime = m.getParameter("biddingTime", 3600);

//   // Deploy the Auction contract, passing the MyERC20 address as an argument
//     const auction = m.contract("SimpleAuction", biddingTime, erc20.artifact);

//     return { auction }; // Return the deployed contract
// });
