// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.8.0 <0.9.0;

contract MyERC20 {

    uint256 public totalTokens;   
    address public contractOwner; 
    uint256 public constant POINTS_PER_ETH = 10**9; // Points per 1 ETH
    uint256 public constant WEI_PER_ETH = 10**18; // Conversion factor: 1 ETH = 10^18 Wei

    mapping(address => uint256) public balances;
    mapping(address => mapping(address => uint256)) public spendLimit;

    string public name = "Auction Points MyERC20";               
    uint8 public decimals = 0;   // Define decimals (e.g., 3 decimals)
    uint256 public baseUnit = 10 ** uint256(decimals);  // Calculate base unit (10^decimals)

    string public symbol = "myAPT";  

    event Approval(address indexed tokenOwner, address indexed spender, uint256 tokens);
    event Transfer(address indexed from, address indexed to, uint256 tokens);

    modifier onlyOwner() {
        require(msg.sender == contractOwner, "Only the owner can call this function");
        _;
    }

    modifier checkBalance(address owner, uint256 tokens) {
        require(tokens <= balances[owner], "Insufficient funds!");
        _;
    }

    modifier checkApproval(address owner, address delegate, uint256 tokens) {
        require(tokens <= spendLimit[owner][delegate], "Insufficient allowance!");
        _;
    }

    constructor() {
        totalTokens = 0;
        contractOwner = msg.sender;
    }

    function totalSupply() public view returns (uint256) { 
        return totalTokens;
    }

    function balanceOf(address tokenOwner) public view returns (uint256) { 
        return balances[tokenOwner]; 
    }

    function transfer(address receiver, uint256 tokens) 
        public 
        checkBalance(msg.sender, tokens) 
        returns (bool) 
    {   
        require(tokens % baseUnit == 0, "Tokens must be in whole units of baseUnit");
        balances[msg.sender] -= tokens;
        balances[receiver] += tokens;
        emit Transfer(msg.sender, receiver, tokens);
        return true;    
    }

    function approve(address spender, uint256 tokens) public returns (bool) {
        spendLimit[msg.sender][spender] = tokens;
        emit Approval(msg.sender, spender, tokens);
        return true;
    }

    function allowance(address tokenOwner, address spender) 
        public 
        view 
        returns (uint256) 
    {
        return spendLimit[tokenOwner][spender];
    }

    function transferFrom(address from, address to, uint256 tokens) 
        public 
        checkBalance(from, tokens) 
        checkApproval(from, msg.sender, tokens) 
        returns (bool) 
    {
        require(tokens % baseUnit == 0, "Tokens must be in whole units of baseUnit");
        balances[from] -= tokens;
        spendLimit[from][msg.sender] -= tokens;
        balances[to] += tokens;
        emit Transfer(from, to, tokens);
        return true;
    }

    /// @notice Deposit ETH to receive points
    function deposit() external payable {
        uint256 pointsToMint = (msg.value * POINTS_PER_ETH * baseUnit) / WEI_PER_ETH; // Scale msg.value (Wei) to ETH
        totalTokens += pointsToMint;
        balances[msg.sender] += pointsToMint;
        emit Transfer(address(0), msg.sender, pointsToMint);
    }

    /// @notice Withdraw ETH by converting unused points
    function withdraw(uint256 points) external checkBalance(msg.sender, points) {
        uint256 weiToReturn = (points * WEI_PER_ETH) / (POINTS_PER_ETH * baseUnit); // Convert points to Wei
        require(address(this).balance >= weiToReturn, "Insufficient contract balance");

        balances[msg.sender] -= points;
        totalTokens -= points;

        emit Transfer(msg.sender, address(0), points);

        payable(msg.sender).transfer(weiToReturn);
    }

    /// @notice Mint new points (only for admin or owner, if implemented)
    function mint(address account, uint256 amount) external onlyOwner {
        totalTokens += amount;
        balances[account] += amount;
        emit Transfer(address(0), account, amount);
    }

    /// @notice Burn points (admin or custom use case)
    function burn(address account, uint256 amount) external onlyOwner {
        require(balances[account] >= amount, "Insufficient balance");
        balances[account] -= amount;
        totalTokens -= amount;
        emit Transfer(account, address(0), amount);
    }
}
