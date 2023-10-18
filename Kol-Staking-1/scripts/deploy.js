// scripts/create-box.js
const { expect, assert } = require("chai");
const { toChecksumAddress } = require("ethereumjs-util");
const { ethers, waffle } = require("hardhat");
const web3 = require("web3");
//

async function main() {
  const provider = waffle.provider;

  [owner, accountOne, accountTwo, accountThree, accountFour, accountFive] = await ethers.getSigners();
  //get owner wllet ethers balance
  let ownerBalance = await provider.getBalance(owner.address);
  console.log("Owner Balance: ", ownerBalance/ 1e18);


  let ZYGToken;
  let rewardToken;

  // //lp tokens deployment
  // let factoryFetched = ["Token1", "Token2", "Token3", "Token4"].map((tok) => ethers.getContractFactory(tok));
  // resTemp = await Promise.all(factoryFetched);
  // const factoryDeployed = resTemp.map((tok) => tok.deploy());
  // const deployedFinal = await Promise.all(factoryDeployed);

  // //lp tokens assignment to variables
  // deployedFinal.forEach((tok, index) => {
  //     tokens[`tok${index + 1}`].instance = tok;
  //     tokens[`tok${index + 1}`].address = tok.address;
  // });
  
  //assign address
  // ZYGToken = tokens.tok1.instance;
  // rewardToken = tokens.tok2.instance;
  // ZYGToken.address = tokens.tok1.address;
  ZYGToken = "0x8f877316573A19bd3ECA0faA64121e101Ef07592"
  rewardToken = "0x8f877316573A19bd3ECA0faA64121e101Ef07592"
  console.log("ZYG Token: ", ZYGToken);
  console.log("reward Token: ", rewardToken);


  
  //liquidity mining contracts deployment
  const RewardDistributor = await ethers.getContractFactory("RewardDistribution");
  const LpTokenStaker = await ethers.getContractFactory("LpStaker");
  const ZYGTokenLocker = await ethers.getContractFactory("ZYGLocking");

  rewardDistributor = await RewardDistributor.deploy(ZYGToken);
  lpTokenStaker = await LpTokenStaker.deploy(ZYGToken, rewardDistributor.address);
  zygStaker = await ZYGTokenLocker.deploy(ZYGToken, rewardToken, rewardDistributor.address);

  console.log("lpTokenStaker: ", lpTokenStaker.address);
  console.log("zygStaker: ", zygStaker.address);
  console.log("rewardDistributor: ", rewardDistributor.address);

  // console.log("token1: ", tokens.tok1.address);
  // console.log("token2: ", tokens.tok2.address);
  // console.log("token3: ", tokens.tok3.address);
  // console.log("token4: ", tokens.tok4.address);


  // console.log(Object.entries(tokens).map(([key, value]) => `${key}: ${value.address}`));
  
}

main();