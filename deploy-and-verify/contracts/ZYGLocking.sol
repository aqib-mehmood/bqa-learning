// SPDX-License-Identifier: MIT
pragma solidity 0.8.12;

import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract ZYGLocking is Ownable {
    using SafeERC20 for IERC20;
    
    IERC20 public immutable rewardToken;  // Reward token to distribute among lockers
    IERC20 public immutable lockToken;  // Zygnus token
    IERC20 public immutable RewardDistribution; // Contract which sends the penalty amount
    
    struct Lock {
        uint256 total; // Total amount locked so far
        uint256 amount; // Amount locked per transaction
        uint256 unlockTime; // Time when 'amount' will be unlocked
    }
    
    uint256 public lockedSupply;  // TVL of locked tokens so far
    uint256 public rewardPerToken;  // Stores reward per locked token
    uint256 public accumulatedPenalty;  // Total penalty received so far

    uint256 public constant LOCK_DURATION = (86400 * 7) * 13; // 3 months
    uint256 public constant ONE = 1 ether; 
    
    mapping(address => Lock[]) public userLocks; 
    mapping(address => uint256) public userDebts; 

    event Locked(address indexed user, uint256 amount, uint256 reward);
    event UnLocked(
        address indexed user,
        uint256 unlockTime,
        uint256 amount,
        uint256 reward
    );
    event RewardPaid(
        address indexed user,
        address indexed rewardsToken,
        uint256 reward
    );

    // CONSTRUCTOR
    constructor(
        IERC20 _lockToken,
        IERC20 _rewardToken,
        IERC20 _rewardDistribution
    ) {
        lockToken = _lockToken;
        rewardToken = _rewardToken;
        RewardDistribution = _rewardDistribution;
    }

    // GETTER FUNCTIONS
    
    function withdrawableBalance(address user)
        external
        view
        returns (
            uint256 total,
            uint256 locked,
            uint256 unlocked,
            Lock[] memory lockData
        )
    {
        Lock[] memory locks = userLocks[user];
        uint256 idx;
        for (uint256 i = 0; i < locks.length; i++) {
            if (locks[i].unlockTime > block.timestamp) {
                if (idx == 0) {
                    lockData = new Lock[](locks.length - i);
                }
                lockData[idx] = locks[i];
                locked += locks[i].amount;
                idx++;
            } else {
                unlocked += locks[i].amount;
            }
        }
        total = locks[locks.length - 1].total;
    }

    function claimableReward(address user)
        external
        view
        returns (uint256 pending)
    {
        uint256 idx = userLocks[msg.sender].length;
        uint256 _total = idx > 0
            ? userLocks[msg.sender][idx - 1].total
            : 0;
        uint256 _debt = userDebts[user];
        pending = (rewardPerToken * _total) / ONE;
        if (pending != 0) {
            pending -= _debt;
        }
    }

    // SETTER FUNCTIONS
    function accumulatePenalty(uint256 amount) external {
        require(msg.sender == address(RewardDistribution), "Unauthorized Caller");
        rewardToken.safeTransferFrom(msg.sender, address(this), amount);
        accumulatedPenalty += amount;

        if (lockedSupply > 0) { 
            uint256 newRewardPerToken = (amount * ONE) / lockedSupply;
            rewardPerToken += newRewardPerToken;
        }
    }
    
    // Lock tokens for 'lockDuration' to receive penalty
    /// @notice locked tokens cannot be withdrawn before 'LOCK_DURATION'
    function lock(uint256 amount) external {
        require(amount > 0, "Amount must be greater than 0");
        // Local copy to save gas
        address user = msg.sender;
        uint256 idx = userLocks[user].length;
        uint256 _total = idx > 0 ? userLocks[user][idx - 1].total : 0;
        uint256 pending = resolvePendings(_total, userDebts[user], amount, true);
        lockedSupply += amount;
        if (idx == 0 || userLocks[user][idx - 1].unlockTime < block.timestamp) {
            userLocks[user].push(
                Lock({
                    total: _total + amount,
                    amount: amount,
                    unlockTime: block.timestamp + LOCK_DURATION
                })
            );
        } else {
            userLocks[user][idx - 1].total += amount;
            userLocks[user][idx - 1].amount += amount;
        }
        lockToken.safeTransferFrom(user, address(this), amount);
        emit Locked(user, amount, pending);
    }

    // Withdraw all currently locked tokens where the unlock time has passed
    function withdrawExpiredLocks() external {
        // Local copy to save gas
        address user = msg.sender;
        Lock[] storage locks = userLocks[user];
        uint256 idx = userLocks[user].length;
        uint256 _total = idx > 0 ? userLocks[user][idx - 1].total : 0;
        uint256 amount;
        uint256 pending = resolvePendings(_total, userDebts[user], amount, false);
        for (uint256 i = 0; i < idx; i++) {
            if (locks[i].unlockTime > block.timestamp) break;
            amount += locks[i].amount;
            // Deletes entry of unlocked amount where unlock time has passed
            delete locks[i];
        }
        if (idx != 0 && locks[idx - 1].total != 0) {
            locks[idx - 1].total -= amount;
        }
        lockedSupply -= amount;
        if (amount > 0) lockToken.safeTransfer(user, amount);
        emit UnLocked(user, block.timestamp, amount, pending);
    }

    // Claim all pending rewards
    function claimPenalty() external {
        // Local copy to save gas
        address user = msg.sender;
        uint256 idx = userLocks[user].length;
        uint256 _total = idx > 0 ? userLocks[user][idx - 1].total : 0;
        uint256 pending = resolvePendings(_total, userDebts[user], 0, false);
        emit RewardPaid(user, address(rewardToken), pending);
    }

    /// @notice All previous penalties (if any) will be transferred to the first locker
    function resolvePendings(
        uint256 total,
        uint256 debt,
        uint256 amount,
        bool forceCalculate
    ) internal returns (uint256 pending) {
        // Total pending rewards so far lesser than debt, than the difference is transfered to user
        pending = (rewardPerToken * total) / ONE;
        if (lockedSupply == 0) {
            if (accumulatedPenalty != 0) {
                rewardToken.safeTransfer(msg.sender, accumulatedPenalty);
            }
        }
        // Set userDebt on every lock regardless if pending is greater or equal to debt
        if (forceCalculate) {
            userDebts[msg.sender] = (rewardPerToken * (total + amount)) / ONE;
        }else if(pending >= debt){
            userDebts[msg.sender] = (rewardPerToken * (total + amount)) / ONE;
            pending -= debt;
        }
        if (pending > 0) {
            rewardToken.safeTransfer(msg.sender, pending);
        }
        return pending;
    }
}
