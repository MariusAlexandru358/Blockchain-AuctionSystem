import React, { useState } from "react";
import { connectWalletMetamask } from "../utils/EthersUtils";

const Home = () => {
  const [account, setAccount] = useState(null);

  const connectWallet = () => {
    connectWalletMetamask(setAccount).catch(console.error);
  };

  return (
    <div>
      <h1>Welcome to the Auction System</h1>
      {!account ? (
        <button onClick={connectWallet}>Connect Wallet</button>
      ) : (
        <p>Connected Account: {account}</p>
      )}
    </div>
  );
};

export default Home;
