import React, { useEffect, useState } from "react";
import { getSigner, initializeAuctionFactory } from "../utils/AuctionUtils";
import { useNavigate } from "react-router-dom";
import {provider} from "../utils/EthersUtils";

const AuctionList = ({ factoryAddress }) => {
    const [auctions, setAuctions] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchAuctions = async () => {
            const signer = await provider.getSigner();
            const factoryAddress = '0x5d96D872e49A16f8399CacA7E9B48AE973311ECD';
            const auctionFactory = initializeAuctionFactory(factoryAddress, signer);
            const auctionAddresses = await auctionFactory.getAllAuctions();
            setAuctions(auctionAddresses);
        };

        fetchAuctions();
    }, [factoryAddress]);

    return (
        <div>
            <h2>Active Auctions</h2>
            <ul>
                {auctions.map((auction, index) => (
                    <li key={index}>
                        Auction Address: {auction}
                        <button onClick={() => navigate(`/auction/${auction}`)}>View</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default AuctionList;
