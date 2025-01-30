// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.8.0 <0.9.0;

import "./SimpleAuction.sol";

contract AuctionFactory {
    address[] public auctions; // Store addresses of all created auctions

    event AuctionCreated(address auctionAddress, string itemName, string itemDescription, uint256 biddingTime, address auctionOwner);

    constructor() {
        
    }

    function createAuction(
        uint256 biddingTime,
        address tokenContract,
        string memory itemName,
        string memory itemDescription
    ) public {
        SimpleAuction auction = new SimpleAuction(biddingTime, tokenContract, itemName, itemDescription, msg.sender);
        auctions.push(address(auction));
        emit AuctionCreated(address(auction), itemName, itemDescription, biddingTime, msg.sender);
    }

    function getAllAuctions() public view returns (address[] memory) {
        return auctions;
    }
}
