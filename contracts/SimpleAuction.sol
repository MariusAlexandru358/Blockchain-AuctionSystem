// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.8.0 <0.9.0;

import "./MyERC20.sol"; // Import the MyERC20 contract

contract SimpleAuction {
    address public owner;
    MyERC20 public tokenContract; // Reference to the MyERC20 token contract
    uint256 public auctionEndTime;
    address public highestBidder;
    uint256 public highestBid;

    string public itemName; // e.g., "Rare Painting"
    string public itemDescription; // e.g., "Oil painting by Artist X"
    

    mapping(address => uint256) public pendingReturns; // Points to refund
    bool public ended;

    event HighestBidIncreased(address bidder, uint256 amount);
    event AuctionEnded(address winner, uint256 amount);

    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner can call this function");
        _;
    }

    modifier auctionActive() {
        require(block.timestamp < auctionEndTime, "The auction has already ended");
        _;
    }

    modifier auctionEnded() {
        require(block.timestamp >= auctionEndTime, "The auction is still active");
        _;
    }

    constructor(uint256 _biddingTime, address _tokenContract, string memory _itemName, string memory _itemDescription, address _auctionowner) {
        owner = _auctionowner;
        auctionEndTime = block.timestamp + _biddingTime;
        itemName = _itemName;
        itemDescription = _itemDescription;
        tokenContract = MyERC20(_tokenContract); // Initialize with the deployed MyERC20 contract address
    }

    /// @notice Place a bid using MyERC20 points
    /// @param bidAmount The amount of points to bid
    function bid(uint256 bidAmount) external auctionActive {
        require(
            bidAmount > highestBid,
            "There already is a higher or equal bid"
        );

        // Transfer the bid amount to the contract
        require(
            tokenContract.transferFrom(msg.sender, address(this), bidAmount),
            "Token transfer failed"
        );

        if (highestBid != 0) {
            // Refund the previous highest bid to the respective bidder
            pendingReturns[highestBidder] += highestBid;
        }

        highestBidder = msg.sender;
        highestBid = bidAmount;

        emit HighestBidIncreased(msg.sender, bidAmount);
    }

    /// @notice Withdraw any overbid points
    function withdraw() external {
        uint256 amount = pendingReturns[msg.sender];
        require(amount > 0, "No pending returns");

        pendingReturns[msg.sender] = 0;

        // Refund the overbid points to the bidder
        require(
            tokenContract.transfer(msg.sender, amount),
            "Token transfer failed"
        );
    }

    /// @notice End the auction and send the highest bid to the auction owner
    function endAuction() external auctionEnded onlyOwner {
        require(!ended, "The auction has already been ended");

        ended = true;
        emit AuctionEnded(highestBidder, highestBid);

        // Transfer the highest bid to the auction owner
        require(
            tokenContract.transfer(owner, highestBid),
            "Token transfer to owner failed"
        );
    }
}
