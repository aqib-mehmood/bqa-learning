// scripts/create-box.js
const { ethers } = require("hardhat");
require("dotenv").config();

async function main() {
	const provider = ethers.provider;

	let privateKey = process.env.PRIVATE_KEY;
	let owner = new ethers.Wallet(privateKey, provider);

	let balance = await owner.getBalance();
	console.log("Owner Balance: @", owner.address, balance / 1e18);

	// //assign address
	// let ZYGStaker = "0x86BBc990334205c122c46Cee563c7ECf2beC0F32";
	// let rewardToken = "0x8f877316573a19bd3eca0faa64121e101ef07592";

	let rinkebyAddress = {
		ZYGToken: "0x8f877316573a19bd3eca0faa64121e101ef07592",
		rewardToken: "0x8f877316573a19bd3eca0faa64121e101ef07592",
		rewardDistributor: "0x9f466c2659f6e434c21ac2ff6fd6363a62b61845",
		lpTokenStaker: "0x5FD3f0bEB5de583606a6d56Ac6c4f51478eA7F2C",
	};

	// //liquidity mining contracts deployment
	const RewardDistributor = await ethers.getContractFactory("RewardDistribution");
	const LpTokenStaker = await ethers.getContractFactory("LpStaker");
	const ZYGTokenLocker = await ethers.getContractFactory("ZYGLocking");

	// let rewardDistributor = await RewardDistributor.deploy(rinkebyAddress.rewardToken);
	// let lpTokenStaker = await LpTokenStaker.deploy(rinkebyAddress.rewardToken, rinkebyAddress.rewardDistributor);
	let zygStaker = await ZYGTokenLocker.deploy(rinkebyAddress.ZYGToken, rinkebyAddress.rewardToken, rinkebyAddress.rewardDistributor);

	// console.log("rewardDistributor: ", rewardDistributor.address);
	// console.log("lpTokenStaker: ", lpTokenStaker.address);
	console.log("zygStaker: ", zygStaker.address);
}
(async () => {
	try {
		await main();
	} catch (error) {
		console.error(error);
		process.exit(1);
	}
})();
