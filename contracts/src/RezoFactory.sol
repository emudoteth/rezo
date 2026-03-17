// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./RezoGoal.sol";

/**
 * @title RezoFactory
 * @notice Deploys and indexes RezoGoal markets
 */
contract RezoFactory {
    // ── Base mainnet addresses ─────────────────────────────────────────────────
    address public constant USDC      = 0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913;
    address public constant A_USDC    = 0x4e65fE4DbA92790696d040ac24Aa414708F5c0AB;
    address public constant AAVE_POOL = 0xA238Dd80C259a72e81d7e4664a9801593F98d1c5;

    address public treasury;
    address public owner;

    address[] public allGoals;
    mapping(address => address[]) public goalsByResolver;

    event GoalDeployed(address indexed goal, address indexed resolver, string title, uint256 deadline);

    constructor(address _treasury) {
        treasury = _treasury;
        owner    = msg.sender;
    }

    function createGoal(
        address validator,
        string calldata title,
        string calldata description,
        string calldata successCriteria,
        string calldata evidenceRequired,
        uint256 deadline,
        uint256 category,
        uint256 stakeAmount
    ) external returns (address goal) {
        require(deadline > block.timestamp + 1 days, "deadline must be > 24h from now");
        require(stakeAmount >= 5e6, "min stake 5 USDC");
        require(bytes(title).length > 0, "title required");
        require(bytes(successCriteria).length > 10, "success criteria required");

        goal = address(new RezoGoal(
            USDC,
            A_USDC,
            AAVE_POOL,
            treasury,
            msg.sender,
            validator,
            title,
            description,
            successCriteria,
            evidenceRequired,
            deadline,
            category,
            stakeAmount
        ));

        allGoals.push(goal);
        goalsByResolver[msg.sender].push(goal);

        emit GoalDeployed(goal, msg.sender, title, deadline);
    }

    function totalGoals() external view returns (uint256) {
        return allGoals.length;
    }

    function getGoals(uint256 offset, uint256 limit) external view returns (address[] memory) {
        uint256 end   = offset + limit > allGoals.length ? allGoals.length : offset + limit;
        uint256 len   = end > offset ? end - offset : 0;
        address[] memory result = new address[](len);
        for (uint256 i = 0; i < len; i++) result[i] = allGoals[offset + i];
        return result;
    }

    function updateTreasury(address _treasury) external {
        require(msg.sender == owner, "only owner");
        treasury = _treasury;
    }
}
