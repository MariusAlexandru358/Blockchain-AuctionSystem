const ethers = require('ethers');
//const { BigNumber } = require("ethers");

const provider = new ethers.BrowserProvider(window.ethereum);

const scanprovider = new ethers.EtherscanProvider("sepolia");

const connectWalletMetamask = async (accountChangedHandler) => {
  if (window.ethereum) {
    try {
      await provider.send("eth_requestAccounts", []);
      
      let signer;
      
      while (!signer) {
        signer = await provider.getSigner().catch(() => null);
        if (signer) {
          accountChangedHandler(signer);
          break;
        } else {
          await new Promise(resolve => setTimeout(resolve, 100));
        }
      }
    } catch (err) {
      console.log("Error while requesting accounts or retrieving signer:", err);
    }
  } else {
    console.log("Ethereum provider not found");
  }
}

const initializeContract = (contractAddress, abi, signerOrProvider) => {
  if (!contractAddress || !abi || !signerOrProvider) {
    throw new Error("Invalid parameters for initializing the contract");
  }
  // Return a new contract instance
  return new ethers.Contract(contractAddress, abi, signerOrProvider);
};

// const fetchTransactions = async (account) => {
//   return [];
// };


// const fetchProposals = async (votingContract) => {
//   const eventFilter = votingContract.filters.ProposalAdded();
//   const fromBlock = 0;
//   const toBlock = 'latest';

//   const events = await votingContract.queryFilter(eventFilter, fromBlock, toBlock);
//   return events.map(event => ({
//     proposer: event.args.proposer,
//     participant1: event.args.participant1,
//     participant2: event.args.participant2,
//     teamName: event.args.teamName    
//   }));
// }


// ERC20 Contract Functions
const getTotalSupply = async (contract) => {
  try {
    return await contract.totalSupply();
  } catch (err) {
    console.error("Error fetching total supply:", err);
    throw err;
  }
};

const getBalance = async (contract, account) => {
  try {
    return await contract.balanceOf(account);
  } catch (err) {
    console.error("Error fetching balance:", err);
    throw err;
  }
};

const transferTokens = async (contract, to, amount) => {
  try {
    const tx = await contract.transfer(to, amount);
    await tx.wait();
    return tx.hash;
  } catch (err) {
    console.error("Error transferring tokens:", err);
    throw err;
  }
};

const approveSpender = async (contract, spender, amount) => {
  try {
    const tx = await contract.approve(spender, amount);
    await tx.wait();
    return tx.hash;
  } catch (err) {
    console.error("Error approving spender:", err);
    throw err;
  }
};

const getAllowance = async (contract, owner, spender) => {
  try {
    return await contract.allowance(owner, spender);
  } catch (err) {
    console.error("Error fetching allowance:", err);
    throw err;
  }
};

const transferFrom = async (contract, from, to, amount) => {
  try {
    const tx = await contract.transferFrom(from, to, amount);
    await tx.wait();
    return tx.hash;
  } catch (err) {
    console.error("Error performing transferFrom:", err);
    throw err;
  }
};

const depositETHForPoints = async (contract, amountInWei) => {
  try {
    const tx = await contract.deposit({ amountInWei });
    await tx.wait();
    console.log("Deposit Transaction Successful: ", tx.hash);
    return tx.hash;
  } catch (err) {
    console.error("Error depositing ETH:", err);
    throw err;
  }
};

const withdrawPoints = async (contract, points) => {
  try {
    const tx = await contract.withdraw(points);
    await tx.wait();
    return tx.hash;
  } catch (err) {
    console.error("Error withdrawing points:", err);
    throw err;
  }
};

const mintTokens = async (contract, account, amount) => {
  try {
      const tx = await contract.mint(account, amount); 
      console.log("Transaction sent:", tx);
      await tx.wait(); 
      return tx;
  } catch (error) {
      console.error("Error minting tokens:", error);
      throw error;
  }
};

const burnTokens = async (contract, account, amount) => {
  try {
    const tx = await contract.burn(account, amount);
    await tx.wait();
    return tx.hash;
  } catch (err) {
    console.error("Error burning tokens:", err);
    throw err;
  }
};

module.exports = {
  provider,
  connectWalletMetamask,
  initializeContract,
  getTotalSupply,
  getBalance,
  transferTokens,
  approveSpender,
  getAllowance,
  transferFrom,
  depositETHForPoints,
  withdrawPoints,
  mintTokens,
  burnTokens,
};








// module.exports = {
//   provider,
//   connectWalletMetamask,
//   fetchTransactions,
//   fetchProposals,
//   initializeContract
// };
