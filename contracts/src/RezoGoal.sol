// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title RezoGoal
 * @notice On-chain accountability market on Base
 *
 * Flow:
 *   1. Resolver creates goal, stakes USDC → deposited into Aave V3 (earns yield)
 *   2. Betting opens: anyone bets YES or NO with USDC
 *   3. Deadline passes; only the named validator can attest
 *   4. Resolution:
 *      - YES (goal achieved):  resolver gets principal+yield; YES bettors split NO pool
 *      - NO  (goal failed):    resolver gets yield only;     NO bettors split YES pool + resolver principal
 *
 * Yield always returns to the resolver regardless of outcome.
 */

interface IERC20 {
    function transfer(address to, uint256 amount) external returns (bool);
    function transferFrom(address from, address to, uint256 amount) external returns (bool);
    function balanceOf(address account) external view returns (uint256);
    function approve(address spender, uint256 amount) external returns (bool);
}

interface IAavePool {
    function supply(address asset, uint256 amount, address onBehalfOf, uint16 referralCode) external;
    function withdraw(address asset, uint256 amount, address to) external returns (uint256);
}

contract RezoGoal {
    // ── Addresses ─────────────────────────────────────────────────────────────
    IERC20    public immutable usdc;
    IERC20    public immutable aUsdc;
    IAavePool public immutable aavePool;

    // ── Goal metadata ─────────────────────────────────────────────────────────
    address public resolver;
    address public validator;
    string  public title;
    string  public description;
    string  public successCriteria;   // binary-resolvable requirement
    string  public evidenceRequired;  // what the validator must review
    uint256 public deadline;
    uint256 public category;          // 0=Health 1=Skills 2=Finance 3=Habits 4=Custom

    // ── Stake ─────────────────────────────────────────────────────────────────
    uint256 public stakeAmount;       // resolver's original USDC deposit

    // ── Betting pools ─────────────────────────────────────────────────────────
    mapping(address => uint256) public yesBets;
    mapping(address => uint256) public noBets;
    address[] public yesBettors;
    address[] public noBettors;
    uint256 public yesPool;
    uint256 public noPool;

    // ── State ─────────────────────────────────────────────────────────────────
    bool public bettingOpen;
    bool public resolved;
    bool public outcome;              // true = YES (goal achieved)

    // ── Platform fee ─────────────────────────────────────────────────────────
    address public immutable treasury;
    uint256 public constant FEE_BPS = 200; // 2%

    // ── Events ────────────────────────────────────────────────────────────────
    event GoalCreated(address indexed resolver, address indexed validator, uint256 stake, uint256 deadline);
    event BetPlaced(address indexed bettor, bool isYes, uint256 amount);
    event Resolved(bool outcome);
    event Claimed(address indexed user, uint256 amount);

    constructor(
        address _usdc,
        address _aUsdc,
        address _aavePool,
        address _treasury,
        address _resolver,
        address _validator,
        string memory _title,
        string memory _description,
        string memory _successCriteria,
        string memory _evidenceRequired,
        uint256 _deadline,
        uint256 _category,
        uint256 _stakeAmount
    ) {
        usdc          = IERC20(_usdc);
        aUsdc         = IERC20(_aUsdc);
        aavePool      = IAavePool(_aavePool);
        treasury      = _treasury;
        resolver      = _resolver;
        validator     = _validator;
        title         = _title;
        description   = _description;
        successCriteria  = _successCriteria;
        evidenceRequired = _evidenceRequired;
        deadline      = _deadline;
        category      = _category;
        stakeAmount   = _stakeAmount;

        // Pull stake from resolver and supply to Aave
        require(usdc.transferFrom(_resolver, address(this), _stakeAmount), "stake transfer failed");
        usdc.approve(address(aavePool), _stakeAmount);
        aavePool.supply(address(usdc), _stakeAmount, address(this), 0);

        bettingOpen = true;
        emit GoalCreated(_resolver, _validator, _stakeAmount, _deadline);
    }

    // ── Betting ───────────────────────────────────────────────────────────────

    function betYes(uint256 amount) external {
        require(bettingOpen && block.timestamp < deadline, "betting closed");
        require(amount >= 1e6, "min bet 1 USDC");
        usdc.transferFrom(msg.sender, address(this), amount);
        if (yesBets[msg.sender] == 0) yesBettors.push(msg.sender);
        yesBets[msg.sender] += amount;
        yesPool += amount;
        emit BetPlaced(msg.sender, true, amount);
    }

    function betNo(uint256 amount) external {
        require(bettingOpen && block.timestamp < deadline, "betting closed");
        require(amount >= 1e6, "min bet 1 USDC");
        usdc.transferFrom(msg.sender, address(this), amount);
        if (noBets[msg.sender] == 0) noBettors.push(msg.sender);
        noBets[msg.sender] += amount;
        noPool += amount;
        emit BetPlaced(msg.sender, false, amount);
    }

    // ── Resolution ────────────────────────────────────────────────────────────

    function resolve(bool _outcome) external {
        require(msg.sender == validator, "only validator");
        require(block.timestamp >= deadline, "deadline not reached");
        require(!resolved, "already resolved");

        bettingOpen = false;
        resolved    = true;
        outcome     = _outcome;

        // Withdraw everything from Aave
        uint256 aBalance = aUsdc.balanceOf(address(this));
        aavePool.withdraw(address(usdc), aBalance, address(this));

        uint256 usdcBalance   = usdc.balanceOf(address(this));
        uint256 yield         = usdcBalance > stakeAmount + yesPool + noPool
            ? usdcBalance - stakeAmount - yesPool - noPool
            : 0;

        uint256 totalPool     = yesPool + noPool;
        uint256 fee           = (totalPool * FEE_BPS) / 10000;
        usdc.transfer(treasury, fee);

        uint256 netPool = totalPool - fee;

        if (_outcome) {
            // YES: resolver gets principal + yield; YES bettors split NO pool
            usdc.transfer(resolver, stakeAmount + yield);
            if (yesPool > 0 && noPool > 0) {
                uint256 winnings = (noPool * (10000 - FEE_BPS)) / 10000;
                for (uint i = 0; i < yesBettors.length; i++) {
                    address b = yesBettors[i];
                    uint256 share = (yesBets[b] * winnings) / yesPool;
                    usdc.transfer(b, yesBets[b] + share);
                }
            } else if (yesPool > 0) {
                // No one bet No — refund Yes bettors
                for (uint i = 0; i < yesBettors.length; i++) {
                    address b = yesBettors[i];
                    usdc.transfer(b, yesBets[b]);
                }
            }
            // No bettors lose their funds (stay in contract for treasury sweep or already fee'd)
        } else {
            // NO: resolver gets yield only; NO bettors split (yesPool + resolverPrincipal)
            if (yield > 0) usdc.transfer(resolver, yield);
            uint256 noWinnings = yesPool + stakeAmount - fee;
            if (noPool > 0) {
                for (uint i = 0; i < noBettors.length; i++) {
                    address b = noBettors[i];
                    uint256 share = noPool > 0 ? (noBets[b] * noWinnings) / noPool : 0;
                    usdc.transfer(b, noBets[b] + share);
                }
            }
            // Yes bettors lose
        }

        emit Resolved(_outcome);
    }

    // ── Views ─────────────────────────────────────────────────────────────────

    function getOdds() external view returns (uint256 yesPct, uint256 noPct) {
        uint256 total = yesPool + noPool + stakeAmount;
        if (total == 0) return (50, 50);
        yesPct = (yesPool * 100) / total;
        noPct  = 100 - yesPct;
    }

    function timeLeft() external view returns (uint256) {
        return block.timestamp >= deadline ? 0 : deadline - block.timestamp;
    }

    function currentYield() external view returns (uint256) {
        uint256 aBalance = aUsdc.balanceOf(address(this));
        return aBalance > stakeAmount ? aBalance - stakeAmount : 0;
    }
}
