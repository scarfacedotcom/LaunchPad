// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./IERC20.sol";

contract LaunchPad {
    
    address public tokenA;
    address public tokenB;

    // Total number of Scar Face Tokens to be distributed
    uint public constant totalTokens = 2_000_000 * 10 ** 18; 

    // Launch pad start and end time
    uint public startTime;
    uint public endTime;

    // Mapping of user's deposited Ether and allocated Token B
    mapping(address => uint) public deposits;
    mapping(address => uint) public allocations;

    // Contract owner
    address public owner;

    constructor(
        address _tokenA,
        address _tokenB,
        uint _startTime,
        uint _endTime
    ) {
        tokenA = _tokenA;
        tokenB = _tokenB;
        startTime = _startTime;
        endTime = _endTime;
        owner = msg.sender;
    }

    // Deposit Token A to receive Token B
    function deposit(uint amount) external {
        require(
            block.timestamp >= startTime && block.timestamp <= endTime,
            "Launch pad not active"
        );
        require(amount > 0, "Amount must be greater than 0");

        // Transfer Token A from user to contract
        require(
            IERC20(tokenA).transferFrom(msg.sender, address(this), amount),
            "Token A transfer failed"
        );

        // Calculate user's allocation of Token B
        uint256 allocation = SafeMath.div(
            SafeMath.mul(amount, totalTokens),
            IERC20(tokenA).totalSupply()
        );
        allocations[msg.sender] = SafeMath.add(
            allocations[msg.sender],
            allocation
        );
        deposits[msg.sender] = SafeMath.add(deposits[msg.sender], amount);
    }

    // Withdraw allocated Token B
    function withdraw() external {
        require(block.timestamp > endTime, "Launch pad still active");
        require(allocations[msg.sender] > 0, "No allocation to withdraw");

        // Transfer Token B from contract to user
        require(
            IERC20(tokenB).transfer(msg.sender, allocations[msg.sender]),
            "Token B transfer failed"
        );
        allocations[msg.sender] = 0;
    }

    // Emergency function to withdraw all deposited Ether
    function emergencyWithdraw() external {
        require(msg.sender == owner, "Only owner can call this function");

        // Transfer all deposited Ether from contract to owner
        payable(owner).transfer(address(this).balance);
    }
}
