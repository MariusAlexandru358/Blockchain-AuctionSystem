import React, { useState } from "react";
import { initializeContract } from "../utils/EthersUtils";
import contractABI from "../utils/MyERC20ABI.json";
import { ethers } from "ethers";

const CONTRACT_ADDRESS = "YOUR_DEPLOYED_CONTRACT_ADDRESS";

const ContractInteraction = () => {
  const [amount, setAmount] = useState("");
  const [status, setStatus] = useState("");
  const contract = initializeContract(CONTRACT_ADDRESS, contractABI);

  const handleDeposit = async () => {
    try {
      const tx = await contract.deposit({ value: ethers.parseEther(amount) });
      await tx.wait();
      setStatus("Deposit successful!");
    } catch (err) {
      setStatus("Error depositing: " + err.message);
    }
  };

  const handleWithdraw = async () => {
    try {
      const tx = await contract.withdraw(ethers.parseEther(amount));
      await tx.wait();
      setStatus("Withdrawal successful!");
    } catch (err) {
      setStatus("Error withdrawing: " + err.message);
    }
  };

  return (
    <div>
      <h1>Contract Interaction</h1>
      <input
        type="text"
        placeholder="Amount in ETH"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />
      <button onClick={handleDeposit}>Deposit</button>
      <button onClick={handleWithdraw}>Withdraw</button>
      <p>{status}</p>
    </div>
  );
};

export default ContractInteraction;
