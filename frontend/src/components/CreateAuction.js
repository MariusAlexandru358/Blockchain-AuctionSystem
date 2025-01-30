// import React, { useState } from "react";
// import { getSigner, initializeAuctionFactory } from "../utils/AuctionUtils";

// const CreateAuction = ({ factoryAddress }) => {
//     const [itemName, setItemName] = useState("");
//     const [itemDescription, setItemDescription] = useState("");
//     const [biddingTime, setBiddingTime] = useState("");
//     const [tokenContract, setTokenContract] = useState("");

//     const handleCreateAuction = async () => {
//         try {
//             const signer = await getSigner();
//             const auctionFactory = initializeAuctionFactory(factoryAddress, signer);

//             const tx = await auctionFactory.createAuction(
//                 parseInt(biddingTime),
//                 tokenContract,
//                 itemName,
//                 itemDescription
//             );
//             await tx.wait();
//             alert("Auction created successfully!");
//         } catch (error) {
//             console.error("Error creating auction:", error);
//         }
//     };

//     return (
//         <div>
//             <h2>Create Auction</h2>
//             <input type="text" placeholder="Item Name" value={itemName} onChange={(e) => setItemName(e.target.value)} />
//             <textarea placeholder="Item Description" value={itemDescription} onChange={(e) => setItemDescription(e.target.value)} />
//             <input type="number" placeholder="Bidding Time (seconds)" value={biddingTime} onChange={(e) => setBiddingTime(e.target.value)} />
//             <input type="text" placeholder="Token Contract Address" value={tokenContract} onChange={(e) => setTokenContract(e.target.value)} />
//             <button onClick={handleCreateAuction}>Create Auction</button>
//         </div>
//     );
// };

// export default CreateAuction;





import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import { initializeAuctionFactory } from "../utils/AuctionUtils";
import {provider} from "../utils/EthersUtils";
import { useLocation } from "react-router-dom";

const CreateAuction = () => {
  const location = useLocation();
  const [biddingTime, setBiddingTime] = useState("");
  const [itemName, setItemName] = useState("");
  const [itemDescription, setItemDescription] = useState("");
  const [signer, setSigner] = useState(null);

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

 
  const handleCreateAuction = async () => {
    try {
      const signer = await provider.getSigner();
      const factoryAddress = '0x5d96D872e49A16f8399CacA7E9B48AE973311ECD';
      const auctionFactory = initializeAuctionFactory(factoryAddress, signer);

      // Call the createAuction function
      const tx = await auctionFactory.createAuction(
        biddingTime,
        "0x2787d3802683F26245fb289b7332a2730F58803A", // Points Contract address
        itemName,
        itemDescription,
        signer
      );

      await tx.wait();
      alert("Auction created successfully!");
    } catch (error) {
      console.error("Error creating auction:", error);
    }
  };

  return (
    <div>
      <h2>Create Auction</h2>
      <input
        type="text"
        placeholder="Bidding Time (in seconds)"
        value={biddingTime}
        onChange={(e) => setBiddingTime(e.target.value)}
      /> <br></br>
      <input
        type="text"
        placeholder="Item Name"
        value={itemName}
        onChange={(e) => setItemName(e.target.value)}
      /><br></br>
      <input
        type="text"
        placeholder="Item Description"
        value={itemDescription}
        onChange={(e) => setItemDescription(e.target.value)}
      /><br></br>
      <button onClick={handleCreateAuction}>Create Auction</button>
    </div>
  );
};

export default CreateAuction;
