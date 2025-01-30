import React, { useState, useEffect } from "react";
import { BigNumber} from "@ethersproject/bignumber";
import { useWallet } from "../utils/Context";
import {
  provider,
  initializeContract,
  getTotalSupply,
  getBalance,
  transferTokens,
  approveSpender,
  getAllowance,
  depositETHForPoints,
  withdrawPoints,
  mintTokens,
  burnTokens,
} from "../utils/EthersUtils";
import PointsContract from "../contracts/MyERC20ABI.json";
import { useLocation } from "react-router-dom";
const {ethers } = require('ethers');
// const { BigNumber } = require("ethers");
// import {utils} from "ethers";

const ERC20Interaction = () => {
  const location = useLocation();
  const { wallet, initializeWallet } = useWallet();

  const [erc20Contract, setErc20Contract] = useState(null);
  const [totalSupply, setTotalSupply] = useState("");
  const [balance, setBalance] = useState("");
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [spender, setSpender] = useState("");
  const [allowance, setAllowance] = useState("");
  const [mintAddress, setMintAddress] = useState("");
  const [mintAmount, setMintAmount] = useState("");
  const [burnAddress, setBurnAddress] = useState("");
  const [burnAmount, setBurnAmount] = useState("");
  const [isOwner, setIsOwner] = useState(false);
//   const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);

  // Get contract address from location state
  const { contractAddress } = location.state;
  const contractABI = PointsContract.abi;

  useEffect(() => {
    const initializeEthers = async () => {
      try {
        // Initialize provider and signer
        // const provider = new ethers.BrowserProvider(window.ethereum);
        const walletSigner = await provider.getSigner();

        // Set them in state
        // setProvider(provider);
        setSigner(walletSigner);

        console.log("Provider and Signer initialized");
      } catch (error) {
        console.error("Error initializing provider or signer:", error);
      }
    };

    initializeEthers(); // Call the async function
  }, []); // Only runs once on component mount

  // Initialize contract once wallet and contract address are available
  useEffect(() => {
    if (wallet && contractAddress) {
        const createContract = async () => {
      const signer = await provider.getSigner();
      const contract = initializeContract(contractAddress, contractABI, signer);
      console.log("ERC20 Contract Initialized:", contract);
      setErc20Contract(contract);
        }
      createContract();
    }
  }, [wallet, contractAddress, signer]);

  // Fetch total supply and balance when contract is ready
  useEffect(() => {
    if (erc20Contract && wallet) {
      const fetchData = async () => {
        const supply = await getTotalSupply(erc20Contract);
        setTotalSupply(supply.toString());

        const userBalance = await getBalance(erc20Contract, wallet.address);
        setBalance(userBalance.toString());
        
        const ownerAddress = await erc20Contract.contractOwner();
        setIsOwner(ownerAddress.toLowerCase() === wallet.address.toLowerCase());

        console.log("Contract Owner Address:", ownerAddress);
        console.log("Connected Wallet Address:", wallet.address);
      };
      fetchData();
    }
  }, [erc20Contract, wallet]);

//   const fetchTotalSupply = async (contract) => {
//     try {
//       const totalSupply = await contract.totalSupply(); // Calls the `totalSupply` function from the contract.
//       return ethers.utils.formatUnits(totalSupply, 0); // Format the result (0 decimals since your ERC20 has decimals = 0).
//     } catch (error) {
//       console.error("Error fetching total supply:", error);
//       throw error;
//     }
//   };

//   const fetchYourBalance = async (contract, userAddress) => {
//     try {
//       const balance = await contract.balanceOf(userAddress); // Calls the `balanceOf` function from the contract.
//       return ethers.utils.formatUnits(balance, 0); // Format the result (0 decimals since your ERC20 has decimals = 0).
//     } catch (error) {
//       console.error("Error fetching wallet balance:", error);
//       throw error;
//     }
//   };

  const handleTransfer = async () => {
    if (erc20Contract && recipient && amount) {
      try {
        await transferTokens(erc20Contract, recipient, amount);
        alert("Tokens transferred!");
        const updatedBalance = await getBalance(erc20Contract, wallet.address);
        setBalance(updatedBalance.toString());
      } catch (err) {
        console.error("Transfer failed:", err);
      }
    }
  };

  const handleApprove = async () => {
    if (erc20Contract && spender && amount) {
      try {
        await approveSpender(erc20Contract, spender, amount);
        alert("Spender approved!");
      } catch (err) {
        console.error("Approval failed:", err);
      }
    }
  };

  const fetchAllowance = async () => {
    if (erc20Contract && wallet && spender) {
      try {
        const allowed = await getAllowance(erc20Contract, wallet.address, spender);
        setAllowance(allowed.toString());
      } catch (err) {
        console.error("Fetching allowance failed:", err);
      }
    }
  };

  const handleDeposit = async () => {
    if (erc20Contract && amount) {
      try {
        // const weiAmount = ethers.utils.parseEther(amount);
        const DECIMAL = BigNumber.from(10).pow(18);
        const weiAmount = DECIMAL.mul(BigNumber.from(amount)).mul(BigNumber.from(10).pow(9));
        // const weiAmount = BigNumber.from(amount);
        await depositETHForPoints(erc20Contract, weiAmount.toString());
        alert("ETH deposited for points!");
        const updatedBalance = await getBalance(erc20Contract, wallet.address);
        setBalance(updatedBalance.toString());
      } catch (err) {
        console.error("Deposit failed:", err);
      }
    }
  };

  const handleWithdraw = async () => {
    if (erc20Contract && amount) {
      try {
        await withdrawPoints(erc20Contract, amount);
        alert("Points withdrawn!");
        const updatedBalance = await getBalance(erc20Contract, wallet.address);
        setBalance(updatedBalance.toString());
      } catch (err) {
        console.error("Withdrawal failed:", err);
      }
    }
  };

  // Mint tokens
  const handleMint = async () => {
    if (!isOwner) {
      alert("Only the contract owner can mint tokens.");
      return;
    }
    try {
      console.log("Minting Account:", recipient, "; MintAddress:", mintAddress);
      console.log("Minting Amount:", amount, "; MintAmount:", mintAmount);
        
      await mintTokens(erc20Contract, mintAddress, mintAmount);
      alert(`Successfully minted ${mintAmount} tokens to ${mintAddress}`);
      setMintAddress("");
      setMintAmount("");
    } catch (error) {
      console.error("Error in minting tokens:", error);
      alert("Minting failed!");
    }
  };

  // Burn tokens
  const handleBurn = async () => {
    if (!isOwner) {
      alert("Only the contract owner can burn tokens.");
      return;
    }
    try {
      await burnTokens(erc20Contract, burnAddress, burnAmount);
      alert(`Successfully burned ${burnAmount} tokens from ${burnAddress}`);
      setBurnAddress("");
      setBurnAmount("");
    } catch (error) {
      console.error("Error in burning tokens:", error);
      alert("Burning failed!");
    }
  };

  return (
    <div className="App">
      <div className="App-header">
        <h2>ERC-20 Interaction</h2>
        <p>Contract Address: {contractAddress}</p>
        <p>Connected Wallet: {wallet ? wallet.address : "Not Connected"}</p>

        <h3>Total Supply</h3>
        <p>{totalSupply || "Loading..."}</p>

        <h3>Your Balance</h3>
        <p>{balance || "Loading..."}</p>

        <h3>Transfer Tokens</h3>
        <input
          type="text"
          placeholder="Recipient Address"
          value={recipient}
          onChange={(e) => setRecipient(e.target.value)}
        />
        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <button onClick={handleTransfer}>Transfer</button>

        <h3>Approve Spender</h3>
        <input
          type="text"
          placeholder="Spender Address"
          value={spender}
          onChange={(e) => setSpender(e.target.value)}
        />
        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <button onClick={handleApprove}>Approve</button>

        <h3>Fetch Allowance</h3>
        <input
          type="text"
          placeholder="Spender Address"
          value={spender}
          onChange={(e) => setSpender(e.target.value)}
        />
        <button onClick={fetchAllowance}>Check Allowance</button>
        <p>Allowance: {allowance || "Not Fetched"}</p>

        <h3>Deposit ETH for Points</h3>
        <input
          type="number"
          placeholder="Points Amount (1 point = 1 GWei)"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <button onClick={handleDeposit}>Deposit</button>

        <h3>Withdraw Points</h3>
        <input
          type="number"
          placeholder="Points Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <button onClick={handleWithdraw}>Withdraw</button>

        {isOwner && (
          <div className="owner-actions">
            <h3>Owner Actions</h3>
            
            {/* Mint Section */}
            <div>
              <h4>Mint Tokens</h4>
              <input
                type="text"
                placeholder="Recipient Address"
                value={mintAddress}
                onChange={(e) => setMintAddress(e.target.value)}
              />
              <input
                type="number"
                placeholder="Amount"
                value={mintAmount}
                onChange={(e) => setMintAmount(e.target.value)}
              />
              <button onClick={handleMint}>Mint</button>
            </div>

            {/* Burn Section */}
            <div>
              <h4>Burn Tokens</h4>
              <input
                type="text"
                placeholder="Address to Burn From"
                value={burnAddress}
                onChange={(e) => setBurnAddress(e.target.value)}
              />
              <input
                type="number"
                placeholder="Amount"
                value={burnAmount}
                onChange={(e) => setBurnAmount(e.target.value)}
              />
              <button onClick={handleBurn}>Burn</button>
            </div>
          </div>
        )}
        {!isOwner && <p>You are not the contract owner. Only the owner can mint or burn tokens.</p>}
    

      </div>
    </div>
  );
};

export default ERC20Interaction;
