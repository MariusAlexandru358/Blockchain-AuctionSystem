import React, { useState } from "react";
import { fetchTransactions } from "../utils/EthersUtils";
import { ethers } from "ethers";

const scanProvider = new ethers.EtherscanProvider("sepolia");

const Transactions = () => {
  const [account, setAccount] = useState("");
  const [transactions, setTransactions] = useState([]);

  const loadTransactions = async () => {
    const txs = await fetchTransactions(account, scanProvider);
    setTransactions(txs);
  };

  return (
    <div>
      <h1>Transactions</h1>
      <input
        type="text"
        placeholder="Enter your account address"
        value={account}
        onChange={(e) => setAccount(e.target.value)}
      />
      <button onClick={loadTransactions}>Load Transactions</button>
      <ul>
        {transactions.map((tx) => (
          <li key={tx.hash}>
            <p>Hash: {tx.hash}</p>
            <p>To: {tx.to}</p>
            <p>Value: {tx.value}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Transactions;
