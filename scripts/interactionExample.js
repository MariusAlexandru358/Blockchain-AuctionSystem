// require("@nomiclabs/hardhat-ethers");
const { ethers } = require("hardhat");

async function main() {
    const [account1, account2] = await ethers.getSigners();
    const erc20Address = "0x5FbDB2315678afecb367f032d93F642f64180aa3"; // Replace with your deployed ERC20 contract address
    const SimpleAuction = await ethers.getContractFactory("SimpleAuction");

    // Attach MyERC20 contract
    const MyERC20 = await ethers.getContractAt("MyERC20", erc20Address);

    console.log("Starting flow...");

    // Both account1 and account2 deposit 10 ETH into MyERC20 to receive points
    console.log("Account1 deposits 10 ETH...");
    await MyERC20.connect(account1).deposit({ value: ethers.utils.parseEther("10") });
    console.log("Account2 deposits 10 ETH...");
    await MyERC20.connect(account2).deposit({ value: ethers.utils.parseEther("10") });

    console.log("Account1 balance (points):", await MyERC20.balanceOf(account1.address));
    console.log("Account2 balance (points):", await MyERC20.balanceOf(account2.address));

    // Account1 creates an auction
    const biddingTime = 600; //3600; // 1 hour
    const itemName = "Rare Collectible";
    const itemDescription = "A unique item up for auction.";
    console.log("Deploying SimpleAuction contract...");
    const simpleAuction = await SimpleAuction.connect(account1).deploy(
        biddingTime,
        erc20Address,
        itemName,
        itemDescription
    );
    await simpleAuction.deployed();
    console.log("SimpleAuction deployed at:", simpleAuction.address);

    // Account2 approves the auction contract to spend points on its behalf
    const approveAmount = 2000; // Approving enough for two bids
    console.log("Account2 approves SimpleAuction to spend points...");
    await MyERC20.connect(account2).approve(simpleAuction.address, approveAmount);

    // Account1 approves the auction contract to spend points on its behalf
    console.log("Account1 approves SimpleAuction to spend points...");
    await MyERC20.connect(account1).approve(simpleAuction.address, approveAmount);

    // Account2 places the first bid
    console.log("Account2 places the first bid...");
    await simpleAuction.connect(account2).bid(400); // Bidding 400 points
    console.log(
        "Highest bid:",
        (await simpleAuction.highestBid()).toString(),
        "by",
        await simpleAuction.highestBidder()
    );

    // Account1 places a bid
    console.log("Account1 places a bid...");
    await simpleAuction.connect(account1).bid(600); // Bidding 600 points
    console.log(
        "Highest bid:",
        (await simpleAuction.highestBid()).toString(),
        "by",
        await simpleAuction.highestBidder()
    );

    // Account2 places another bid
    console.log("Account2 places another bid...");
    await simpleAuction.connect(account2).bid(800); // Bidding 800 points
    console.log(
        "Highest bid:",
        (await simpleAuction.highestBid()).toString(),
        "by",
        await simpleAuction.highestBidder()
    );

    // Account2 places the final bid
    console.log("Account2 places the final bid...");
    await simpleAuction.connect(account2).bid(1000); // Bidding 1000 points
    console.log(
        "Highest bid:",
        (await simpleAuction.highestBid()).toString(),
        "by",
        await simpleAuction.highestBidder()
    );

    // Simulate waiting for the auction time to end
    console.log("Simulating auction time end...");
    await ethers.provider.send("evm_increaseTime", [biddingTime]); // Fast-forward time
    await ethers.provider.send("evm_mine"); // Mine a block to reflect time change

    // Account1 ends the auction
    console.log("Ending auction...");
    await simpleAuction.connect(account1).auctionEnd();

    console.log("Auction ended. Account1 should have received the funds.");
    console.log("Account1 balance (points):", await MyERC20.balanceOf(account1.address));
    console.log("Account2 balance (points):", await MyERC20.balanceOf(account2.address));
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
