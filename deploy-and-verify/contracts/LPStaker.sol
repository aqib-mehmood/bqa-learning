// SPDX-License-Identifier: MIT

pragma solidity 0.8.12;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

// Reward distributor contract to transfer reward and penalty, if any.
interface IDistributor {
    function distribute(address _receiver, uint256 _amount) external;
}

contract LpStaker is Ownable {
    using SafeERC20 for IERC20;

    IDistributor public rewardDistributor;
    IERC20 public rewardToken; // ZYG token

    struct UserInfo {
        uint256 amount; // LP Tokens staked amount
        uint256 rewardDebt; // Reward debt
    }

    struct PoolInfo {
        IERC20 lpToken; // LP Token address
        uint256 allocPoint; // Allocation points assigned to this pool
        uint256 lastRewardTime; // Last second that reward distribution occurs.
        uint256 accRewardPerShare; // Accumulated rewards per share of this pool
    }

    // Information of each pool
    PoolInfo[] public poolInfo;

    // Rewards to distribute per second in the next 30 days, based on 1% of ZYG token balance of this contract.
    uint256 public rewardsPerSecond;

    // Sum of alloction points of each pool
    uint256 public totalAllocPoint;

    // Time at which taking started
    uint256 public startTime;

    // Tracks total unclaimed of lp stakers
    uint256 public totalUnclaimedRewards;

    uint256 constant RECALCULATION_PERIOD = 30 days;
    uint256 constant ONE = 1 ether;
    uint256 constant ONE_PERCENT = 0.01 ether;

    // Info of each user that stakes LP tokens.
    mapping(uint256 => mapping(address => UserInfo)) public userInfo;

    // Check for not adding the same LPToken pool twice
    mapping(address => bool) public validLpTokens;

    event Deposit(address indexed user, uint256 indexed pid, uint256 amount);
    event RewardPaid(
        address indexed user,
        address indexed rewardToken,
        uint256 reward
    );
    event Withdrawn(address indexed user, uint256 _pid, uint256 amount);

    constructor(IERC20 _rewardToken, IDistributor _rewardDistributor) {
        require(
            address(_rewardToken) != address(0) &&
                address(_rewardDistributor) != address(0),
            "Zero Address"
        );
        rewardDistributor = _rewardDistributor;
        rewardToken = _rewardToken;
        rewardsPerSecond = calculateRewardsPerSecond();
        // Approval is given because we need to transfer ZYG token on the fly to the rewardDistribution contract
        rewardToken.approve(address(_rewardDistributor), type(uint256).max);
    }

    //=========================================== MODIFIERS ==============================================================
    modifier onlyIfStarted() {
        require(startTime != 0, "Staking is not yet Live");
        _;
    }

    //======================================= ONLY OWNER FUNCTIONS =======================================================
    // Starts the staking
    function start() external onlyOwner {
        require(startTime == 0, "Staking already started");
        startTime = block.timestamp;
    }

    // To update per second distribution reward
    function updateRewardPerSecond() external onlyOwner {
        // Mass update to set 'pool.accRewardPerShare' before updating 'rewardPerSecond'
        _massUpdatePools();
        rewardsPerSecond = calculateRewardsPerSecond();
    }

    //======================================= VIEW FUNCTIONS ==============================================================
    // Calculates the new per second reward, based on 1% of available ZYG tokens (minus rewards distributed) divided by 30 days
    function calculateRewardsPerSecond() internal view returns (uint256) {
        // Available ZYG balance of contract minus distributed rewards
        uint256 rewardDistributionAmount = rewardToken.balanceOf(
            address(this)
        ) - calculateUnclaimedRewards();
        uint256 onePercentOfRewardDistributionAmount = (rewardDistributionAmount *
                ONE_PERCENT) / ONE;
        return (onePercentOfRewardDistributionAmount / RECALCULATION_PERIOD);
    }

    // Returns rewards claimable by the user over the staked LP tokens
    function claimableReward(uint256 _pid, address _user)
        external
        view
        returns (uint256)
    {
        PoolInfo memory pool = poolInfo[_pid];
        UserInfo memory user = userInfo[_pid][_user];
        uint256 accRewardPerShare = pool.accRewardPerShare;
        // Amount of LPTokens this contract holds
        uint256 lpSupply = pool.lpToken.balanceOf(address(this));
        if (lpSupply != 0 && totalAllocPoint != 0) {
            uint256 duration = block.timestamp - pool.lastRewardTime;

            // Amount of reward tokens the pool should distribute
            uint256 reward = ((duration * rewardsPerSecond) *
                poolInfo[_pid].allocPoint) / totalAllocPoint;

            accRewardPerShare += ((reward * ONE) / lpSupply);
            return ((user.amount * accRewardPerShare) / ONE) - user.rewardDebt;
        } else {
            return 0;
        }
    }

    // Returns total tracked + untracked unclaimed rewards
    function calculateUnclaimedRewards() public view returns (uint256) {
        // Declaring outside to save gas
        PoolInfo memory pool;
        uint256 untrackedUnclaimedRewards;

        if (totalAllocPoint != 0) {
            for (uint256 pid; pid < poolInfo.length; pid++) {
                pool = poolInfo[pid];
                uint256 lpSupply = pool.lpToken.balanceOf(address(this));
                if (lpSupply == 0 || pool.allocPoint == 0) {
                    continue;
                }
                uint256 duration = block.timestamp - pool.lastRewardTime;
                uint256 reward = ((duration * rewardsPerSecond) *
                    pool.allocPoint) / totalAllocPoint;
                untrackedUnclaimedRewards += reward;
            }
        }
        return (totalUnclaimedRewards + untrackedUnclaimedRewards);
    }

    // ========================================== MUTATIVE FUNCTIONS =======================================================
    // To whitelist a pool
    function add(uint256 _allocPoint, IERC20 _lpToken) external onlyOwner {
        require(address(_lpToken) != address(0), "Zero Address");
        require(
            !validLpTokens[address(_lpToken)],
            "Lp token pool already exists"
        );
        validLpTokens[address(_lpToken)] = true;
        // To preserve the previous accRewardPerShare and update lastRewardTime to latest
        _massUpdatePools();
        totalAllocPoint += _allocPoint;
        poolInfo.push(
            PoolInfo({
                lpToken: _lpToken,
                allocPoint: _allocPoint,
                lastRewardTime: block.timestamp,
                accRewardPerShare: 0
            })
        );
    }

    // To update allocation points of a pool
    function set(uint256 _pid, uint256 _allocPoint) external onlyOwner {
        // To preserve the previous accRewardPerShare and update lastRewardTime to latest
        _massUpdatePools();
        uint256 prevAllocPoint = poolInfo[_pid].allocPoint;
        require(
            prevAllocPoint != _allocPoint,
            "Cannot set previous Allocation Point"
        );
        // Update AP and totalAllocPoint
        poolInfo[_pid].allocPoint = _allocPoint;
        totalAllocPoint = (totalAllocPoint - prevAllocPoint) + _allocPoint;
    }

    // Deposit LP tokens, also triggers reward claim
    function deposit(uint256 _pid, uint256 _amount) external onlyIfStarted {
        // Local copy to save gas
        address _msgSender = msg.sender;
        PoolInfo memory pool = _updatePool(_pid);
        UserInfo storage user = userInfo[_pid][_msgSender];
        if (user.amount > 0) {
            uint256 pending = ((user.amount * pool.accRewardPerShare) / ONE) -
                user.rewardDebt;
            if (pending > 0) {
                totalUnclaimedRewards -= pending;

                // Rewards are not directly sent to the user but are sent to the rewardDistribution contract for a vesting period of 3 months
                rewardDistributor.distribute(_msgSender, pending);
            }
        }
        if (_amount > 0) {
            pool.lpToken.safeTransferFrom(_msgSender, address(this), _amount);
            user.amount += _amount;
        }
        user.rewardDebt = (user.amount * pool.accRewardPerShare) / ONE;
        emit Deposit(_msgSender, _pid, _amount);
    }

    // Withdraw Staked LP Tokens, also triggers reward claim
    function withdraw(uint256 _pid, uint256 _amount) external onlyIfStarted {
        // Local copy to save gas
        address _msgSender = msg.sender;
        PoolInfo memory pool = _updatePool(_pid);
        UserInfo storage user = userInfo[_pid][_msgSender];
        require(user.amount >= _amount, "Withdraw amount exceeds deposit");
        uint256 pending = ((user.amount * pool.accRewardPerShare) / ONE) -
            user.rewardDebt;
        if (pending > 0) {
            totalUnclaimedRewards -= pending;
            rewardDistributor.distribute(_msgSender, pending);
        }
        user.amount -= _amount;
        user.rewardDebt = (user.amount * pool.accRewardPerShare) / ONE;
        if (_amount > 0) {
            pool.lpToken.safeTransfer(_msgSender, _amount);
        }
        emit Withdrawn(_msgSender, _pid, _amount);
    }

    // To claim the reward
    function claim(uint256[] calldata _pids) external onlyIfStarted {
        uint256 pending;
        for (uint256 i = 0; i < _pids.length; i++) {
            PoolInfo memory pool = poolInfo[_pids[i]];
            UserInfo storage user = userInfo[_pids[i]][msg.sender];
            pending += (((user.amount * pool.accRewardPerShare) / ONE) -
                user.rewardDebt);
            user.rewardDebt = (user.amount * pool.accRewardPerShare) / ONE;
        }
        if (pending > 0) {
            totalUnclaimedRewards -= pending;
            rewardDistributor.distribute(msg.sender, pending);
        }
    }

    // Called whenever a pool is added or updated
    function _massUpdatePools() internal {
        for (uint256 pid = 0; pid < poolInfo.length; pid++) {
            _updatePool(pid);
        }
    }

    // Update reward variables of the given pool to be up-to-date.
    function _updatePool(uint256 _pid) internal returns (PoolInfo memory pool) {
        pool = poolInfo[_pid];
        if (block.timestamp <= pool.lastRewardTime) {
            return pool;
        }
        uint256 lpSupply = pool.lpToken.balanceOf(address(this));
        if (lpSupply == 0 || totalAllocPoint == 0) {
            pool.lastRewardTime = block.timestamp;
            return pool;
        }
        uint256 duration = block.timestamp - pool.lastRewardTime;
        uint256 reward = ((duration * rewardsPerSecond) * pool.allocPoint) /
            totalAllocPoint;
        totalUnclaimedRewards += reward;
        pool.accRewardPerShare += ((reward * ONE) / lpSupply);
        pool.lastRewardTime = block.timestamp;
        poolInfo[_pid] = pool;
    }
}
