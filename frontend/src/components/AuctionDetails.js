import React, { useEffect, useState } from "react";
import { getSigner, initializeAuction, withdrawOverbid, endAuction } from "../utils/AuctionUtils";
import { useParams } from "react-router-dom";
import { useWallet } from "../utils/Context";
import { provider } from "../utils/EthersUtils";

const { ethers } = require('ethers');

const AuctionDetails = () => {
    const { wallet } = useWallet();
    const { auctionAddress } = useParams();
    const [auctionDetails, setAuctionDetails] = useState({
        highestBid: 0,
        highestBidder: "",
        itemName: "",
        itemDescription: "",
        owner: "",
        auctionEndTime: 0,
    });
    const [bidAmount, setBidAmount] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchAuctionDetails = async () => {
            try {
                const signer = await provider.getSigner();
                const auction = initializeAuction(auctionAddress, signer);

                const highestBid = await auction.highestBid();
                const highestBidder = await auction.highestBidder();
                const itemName = await auction.itemName();
                const itemDescription = await auction.itemDescription();
                const owner = await auction.owner();
                const auctionEndTime = await auction.auctionEndTime();

                setAuctionDetails({
                    highestBid,
                    highestBidder,
                    itemName,
                    itemDescription,
                    owner,
                    auctionEndTime,
                });
            } catch (err) {
                console.error("Error fetching auction details:", err);
                setError("Failed to fetch auction details. Please try again later.");
            }
        };

        fetchAuctionDetails();
    }, [auctionAddress]);

    const handleBid = async () => {
        setError(""); // Clear previous error
        try {
            const signer = await getSigner();
            const auction = initializeAuction(auctionAddress, signer);

            const tx = await auction.bid(bidAmount);
            await tx.wait();
            alert("Bid placed successfully!");
        } catch (error) {
            console.error("Bid failed:", error);
            if (error?.reason?.includes("ERC20: insufficient allowance")) {
                setError("The auction contract is not allowed to spend your points.");
            } else if (error?.reason?.includes("higher or equal bid")) {
                setError("Your bid must be higher than the current highest bid.");
            } else {
                setError("Bid failed. Please try again.");
            }
        }
    };

    const handleWithdrawOverbid = async () => {
        setError(""); // Clear previous error
        try {
            const signer = await getSigner();
            const auctionContract = initializeAuction(auctionAddress, signer);
            const txHash = await withdrawOverbid(auctionContract, signer);
            console.log("Overbid withdrawn:", txHash);
            alert("Overbid withdrawn successfully!");
        } catch (err) {
            console.error("Error withdrawing overbid:", err);
            setError("Failed to withdraw overbid.");
        }
    };

    const handleEndAuction = async () => {
        setError(""); // Clear previous error
        try {
            const signer = await getSigner();
            const auctionContract = initializeAuction(auctionAddress, signer);

            const txHash = await endAuction(auctionContract, signer);
            console.log("Auction ended:", txHash);
            alert("Auction ended successfully!");
        } catch (err) {
            console.error("Error ending auction:", err);
            if (err?.reason?.includes("The auction is still active")) {
                setError("The auction cannot be ended before the duration time.");
            } else {
                setError("Failed to end auction.");
            }
        }
    };

    const isOwner = wallet?.address?.toLowerCase() === auctionDetails.owner?.toLowerCase();
    const isAuctionEnded = Number(auctionDetails.auctionEndTime.toString()) * 1000 < Date.now(); 

    return (
        <div>
            <p>Connected Wallet: {wallet ? wallet.address : "Not Connected"}</p>
            <h2>Auction Details</h2>
            {error && <p style={{ color: "red" }}>{error}</p>}
            <p><strong>Item Name:</strong> {auctionDetails.itemName || "Loading..."}</p>
            <p><strong>Item Description:</strong> {auctionDetails.itemDescription || "Loading..."}</p>
            <p><strong>Highest Bid:</strong> {(auctionDetails.highestBid || "0")} APT</p>
            <p><strong>Highest Bidder:</strong> {auctionDetails.highestBidder || "N/A"}</p>
            <p><strong>Auction End Time:</strong> {new Date(Number(auctionDetails.auctionEndTime.toString()) * 1000).toLocaleString()} {(isAuctionEnded?<strong>ENDED</strong>:<strong>ENDED</strong>)}</p>
            <p><strong>Auction Owner:</strong> {auctionDetails.owner || "N/A"}</p>

            <input
                type="text"
                placeholder="Your Bid Amount"
                value={bidAmount}
                onChange={(e) => setBidAmount(e.target.value)}
            /><br></br>  
            <button onClick={handleBid} disabled={isAuctionEnded}>Place Bid</button>
            <button onClick={handleWithdrawOverbid}>Withdraw Overbid</button>

            {isOwner && (
                <button onClick={handleEndAuction} disabled={!isAuctionEnded}>
                    End Auction
                </button>
            )}
        </div>
    );
};

export default AuctionDetails;
