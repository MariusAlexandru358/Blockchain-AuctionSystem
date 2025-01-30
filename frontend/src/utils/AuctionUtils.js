import { ethers } from "ethers";
import AuctionFactoryABI from "../contracts/AuctionFactory.json";
import SimpleAuctionABI from "../contracts/SimpleAuction.json";

export const provider = new ethers.BrowserProvider(window.ethereum);

export const getSigner = async () => {
    await provider.send("eth_requestAccounts", []);
    return provider.getSigner();
};

export const initializeAuctionFactory = (factoryAddress, signer) => {
    if (!factoryAddress || !signer) {
        console.log(factoryAddress, signer);
        throw new Error("Invalid parameters for initializing the contract");
      }
    return new ethers.Contract(factoryAddress, AuctionFactoryABI.abi, signer);
};

export const initializeAuction = (auctionAddress, signer) => {
    if (!auctionAddress || !signer) {
        console.log(auctionAddress, signer);
        throw new Error("Invalid parameters for initializing the contract");
      }
    return new ethers.Contract(auctionAddress, SimpleAuctionABI.abi, signer);
};

export const withdrawOverbid = async (auctionContract, signer) => {
    try {
      const tx = await auctionContract.withdraw({ from: signer.address });
      await tx.wait();
      return tx.hash;
    } catch (err) {
      console.error("Error withdrawing overbid:", err);
      throw err;
    }
  };
  
export const endAuction = async (auctionContract, signer) => {
    try {
      const tx = await auctionContract.endAuction({ from: signer.address });
      await tx.wait();
      return tx.hash;
    } catch (err) {
      console.error("Error ending auction:", err);
      throw err;
    }
  };


