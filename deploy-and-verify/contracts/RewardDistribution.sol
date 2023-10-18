// SPDX-License-Identifier: MIT

pragma solidity 0.8.12;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

interface IZygnusLocker {
    function accumulatePenalty(uint256 _amount) external;
}

contract RewardDistribution is Ownable {
    using SafeERC20 for IERC20;

    IERC20 public rewardToken; // Zygnus token
    IZygnusLocker public zygLocker; // Zygnus locker contract address

    struct LockedBalance {
        uint256 amount; // Amount staked
        uint256 unlockTime; // Amount staked time
    }

    address public lpStaker; // LP staker contract address
    uint256 public constant LOCK_DURATION = 86400 * 7 * 13; //3 months

    // Private mappings for balance data
    mapping(address => uint256) private earnedBalance;
    mapping(address => LockedBalance[]) private userEarnings;

    event RewardsLocked(address indexed user, uint256 amount);
    event Withdrawn(address indexed user, uint256 amount);

    constructor(address _rewardToken) Ownable() {
        rewardToken = IERC20(_rewardToken);
    }

    // ONLY OWNER FUNCTIONS

    // Set LP staker contract address
    function setLpStakerAddress(address _lpStaker) external onlyOwner {
        require(_lpStaker != address(0), "ZERO ADDRESS");
        require(lpStaker == address(0), "LP Staker already set");
        lpStaker = _lpStaker;
    }

    // Set the address of the Zygnus locker contract
    function setZygLockerAndApprove(IZygnusLocker _zygLocker)
        external
        onlyOwner
    {
        require(address(_zygLocker) != address(0), "ZERO ADDRESS");
        require(address(zygLocker) == address(0), "Zyg Locker already set");
        zygLocker = _zygLocker;
        rewardToken.approve(address(_zygLocker), type(uint256).max);
    }

    // GETTER FUNCTIONS

    // Information on a user's locked balances
    function getUserLockedBalance(address user)
        external
        view
        returns (LockedBalance[] memory)
    {
        return userEarnings[user];
    }

    // User total earned balance, may include penalty
    function getTotalEarnedBalance(address user)
        external
        view
        returns (uint256)
    {
        return earnedBalance[user];
    }

    function withdrawableBalance(address user)
        public
        view
        returns (
            uint256 amount,
            uint256 penaltyAmount,
            uint256 amountWithoutPenalty
        )
    {
        if (earnedBalance[user] > 0) {
            uint256 length = userEarnings[user].length;
            for (uint256 i = 0; i < length; i++) {
                uint256 earnedAmount = userEarnings[user][i].amount;
                if (earnedAmount == 0) continue;
                if (userEarnings[user][i].unlockTime > block.timestamp) {
                    break;
                }
                // Amount at which no penalty is applied
                amountWithoutPenalty += earnedAmount;
            }
            // Stores penalty user has to pay upon withdrawing complete reward
            penaltyAmount = (earnedBalance[user] - amountWithoutPenalty) / 2;
        }
        // Amount includes penalty free amount and 50% of the early claim reward
        amount = earnedBalance[user] - penaltyAmount;
    }

    // SETTER FUNCTIONS

    // Can only be called by the LP staker contract
    // Starts vesting the reward for 3 months
    function distribute(address user, uint256 amount) external {
        require(msg.sender == lpStaker, "Unauthorized Caller");
        earnedBalance[user] += amount;
        uint256 unlockTime = block.timestamp + LOCK_DURATION;
        LockedBalance[] storage earnings = userEarnings[user];
        uint256 idx = earnings.length;

        if (idx == 0 || earnings[idx - 1].unlockTime < unlockTime) {
            earnings.push(
                LockedBalance({amount: amount, unlockTime: unlockTime})
            );
        } else {
            earnings[idx - 1].amount += amount;
        }
        rewardToken.safeTransferFrom(msg.sender, address(this), amount);
        emit RewardsLocked(user, amount);
    }

    function withdraw(uint256 _amount) external {
        // Local copy to save gas
        address _msgSender = msg.sender;
        (
            uint256 amount,
            uint256 penalty,
            uint256 amountEarnedWithoutPenalty
        ) = withdrawableBalance(msg.sender);

        require(_amount > 0, "Cannot withdraw 0");
        require(amount >= _amount, "Insufficient balance after penalty");

        uint256 penaltyToPay;

        // If user withdraw amount is more than user unlocked balance then deduct penalty
        if (_amount > amountEarnedWithoutPenalty) {
            penaltyToPay = _amount - amountEarnedWithoutPenalty;
        }

        // Subtracting withdraw amount plus penalty from user earned balance
        earnedBalance[_msgSender] -= _amount + penaltyToPay;

        // Total amount user has to pay including penalty in order to withdraw desired amount
        uint256 remaining = _amount + penaltyToPay;

        // Updating user locked balances information
        for (uint256 i = 0; ; i++) {
            uint256 earnedAmount = userEarnings[_msgSender][i].amount;
            if (earnedAmount == 0) continue;
            if (earnedAmount >= remaining) {
                userEarnings[_msgSender][i].amount -= remaining;
                if (userEarnings[_msgSender][i].amount == 0) {
                    delete userEarnings[_msgSender][i];
                }
                break;
            } else {
                remaining -= userEarnings[_msgSender][i].amount;
                delete userEarnings[_msgSender][i];
            }
        }

        rewardToken.safeTransfer(_msgSender, _amount);
        if (penaltyToPay != 0) {
            zygLocker.accumulatePenalty(penaltyToPay);
        }
    }
}
