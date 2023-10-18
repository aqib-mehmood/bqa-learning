//assertion library
const { expect, assert } = require("chai");
const { toChecksumAddress } = require("ethereumjs-util");
const { ethers } = require("hardhat");
const web3 = require("web3");
//
const provider = waffle.provider;
describe("staking", function () {
  it("Should deploy staking", async function () {
    [owner, addr1, addr2, ...addrs] = await provider.getWallets();
    const tok = await ethers.getContractFactory("KOLNET");
    token = await tok.deploy();
    await token.deployed();
    const dai = await ethers.getContractFactory("Dai");
    daitoken = await tok.deploy();
    const UNI = await ethers.getContractFactory("UNI");
    UNItoken = await tok.deploy();
    const USDC = await ethers.getContractFactory("USDC");
    USDCtoken = await tok.deploy();
    const bal = await ethers.getContractFactory("BAL");
    baltoken = await bal.deploy();
    const project = await ethers.getContractFactory("Stake");
    stake = await project.deploy("0xFcce5CE96D091395bef9f9c19306983e4D812c10", token.address);
    //stake = await pro.deploy(owner.address, token.address);
    await stake.deployed();
  });
  
  it("get tokens", async function (){
    [owner, addr1, addr2, ...addrs] = await provider.getWallets();
    await token.mint(owner.address, web3.utils.toWei("200"));
    await UNItoken.mint(owner.address, web3.utils.toWei("200"));//UNI token mint to owner address
    await UNItoken.mint(stake.address, web3.utils.toWei("200"));
    await daitoken.mint(stake.address, web3.utils.toWei("200"));
    await USDCtoken.mint(stake.address, web3.utils.toWei("200"));
    await baltoken.mint(stake.address, web3.utils.toWei("200"));
    console.log('Yeh KOL token ha ',token.address);
    console.log(UNItoken.address);
    console.log(daitoken.address);
    console.log(USDCtoken.address);
    console.log(baltoken.address);
    await token.approve(stake.address, web3.utils.toWei("1000"));
  });


//   // -------------------------- my test cases start for staking---------------------------
    it.skip("Stake - correct KOL token address and amount less than the token balance", async function () {
      await stake.stakeTokens(token.address, web3.utils.toWei("100"));//1e^18
      const tx1 = await token.balanceOf(stake.address);
      console.log(tx1);
    });

    it.skip("Stake - correct KOL token address and amount equals to the token balance", async function () {
      await stake.stakeTokens(token.address, web3.utils.toWei("200"));//1e^18
      const tx1 = await token.balanceOf(stake.address);
      console.log(tx1);
    });

    it.skip("Stake - providing the incorrect KOL token address", async function () {
      // await stake.stakeTokens(daitoken.address, web3.utils.toWei("100"));//1e^18
      await expect(stake.stakeTokens(daitoken.address, web3.utils.toWei("200"))).to.be.revertedWith('Not KOL Token')
    });

    it("Stake - correct token address and amount greater than the token balance", async function () {
      await expect(stake.stakeTokens(token.address, web3.utils.toWei("300"))).to.be.revertedWith('ERC20: transfer amount exceeds balance');//1e^18
      const tx1 = await token.balanceOf(stake.address);
      console.log(tx1);
    });

    it.skip("Stake - correct token address and amount less than the token balance in decimal", async function () {
      await stake.stakeTokens(token.address, web3.utils.toWei("10.5"));//1e^18
      const tx1 = await token.balanceOf(stake.address);
      console.log(tx1);
    });

    it.skip("Stake - without providing any input/parameters", async function () {
      
      await expect(stake.stakeTokens())
      const tx1 = await token.balanceOf(stake.address);
      console.log(tx1);
  
    });

    it.skip("Stake - without providing amount but provide the token address", async function () {
      await stake.stakeTokens(token.address);//1e^18
      const tx1 = await token.balanceOf(stake.address);
      console.log(tx1);
    });

    it.skip("Stake - without providing token address but provide the amount", async function () {
      await stake.stakeTokens(web3.utils.toWei("10.5"));//1e^18
      const tx1 = await token.balanceOf(stake.address);
      console.log(tx1);
    });

    it("Stake - correct token address but provide the amount in negative", async function () {
      await stake.stakeTokens(token.address, web3.utils.toWei("-100"));//1e^18
      const tx1 = await token.balanceOf(stake.address);
      console.log(tx1);
    });

    // it("staked amount(balance) should increased after staking", async function() {
    //   await stake.stakeTokens(token.address, web3.utils.toWei("100"));//1e^18
    //   // const tx1 = await token.balanceOf(stake.address);
    //   const tx1 = await token.balanceOf(stake.address);
    //   console.log(tx1);
    // })

//--------------------------------------- my test cases end for staking---------------------------




//---------------------------------------- my test cases start for withdraw---------------------------
    it.skip("Unstake - correct KOL token address and amount less than the staked token amount", async function () {
      await stake.withDraw(token.address, web3.utils.toWei("10"));//1e^18
      const tx1 = await token.balanceOf(stake.address);
      console.log(tx1);
    });

    it.skip("Unstake - correct KOL token address and amount equal to the staked token amount", async function () {
      await stake.withDraw(token.address, web3.utils.toWei("100"));//1e^18
      const tx1 = await token.balanceOf(stake.address);
      console.log(tx1);
    });

    it.skip("Unstake - incorrect token address", async function () {
      // await stake.withDraw(USDCtoken.address, web3.utils.toWei("20"));//1e^18
      await expect(stake.withDraw(daitoken.address, web3.utils.toWei("200"))).to.be.revertedWith('Not KOL Token')
      const tx1 = await token.balanceOf(stake.address);
      console.log(tx1);
    });

    it.skip("Unstake - correct token address and amount greater than the staked amount", async function () {
      // await stake.withDraw(token.address, web3.utils.toWei("1500"));//1e^18
      await expect(stake.withDraw(token.address, web3.utils.toWei("1300"))).to.be.revertedWith('ERC20: transfer amount exceeds balance');//1e^18
    });

    it.skip("Unstake - correct token address and amount less than the staked amount in decimal", async function () {
      await stake.withDraw(token.address, web3.utils.toWei("5.5"));//1e^18
      const tx1 = await token.balanceOf(stake.address);
      console.log(tx1);
    });

    it.skip("Unstake - without providing any input/parameters", async function () {
      await stake.withDraw();
      const tx1 = await token.balanceOf(stake.address);
      console.log(tx1);
    });

    it.skip("Unstake - without providing amount but provide the token address", async function () {
      await stake.withDraw(token.address);//1e^18
      const tx1 = await token.balanceOf(stake.address);
      console.log(tx1);
    });

    it.skip("Unstake - without providing token address but provide the amount", async function () {
      await stake.withDraw(web3.utils.toWei("10.5"));//1e^18
      const tx1 = await token.balanceOf(stake.address);
      console.log(tx1);
    });

    it.skip("Unstake - correct token address but provide the amount in negative", async function () {
      await stake.withDraw(token.address, web3.utils.toWei("-100"));//1e^18
      const tx1 = await token.balanceOf(stake.address);
      console.log(tx1);
    });

    it.skip("Unstake - staked amount(balance) should decreased after staking", async function() {
      await stake.withDraw(token.address, web3.utils.toWei("100"));//1e^18
      const tx1 = await token.balanceOf(stake.address);
      console.log(tx1);
    })

//   // -------------------------- my test cases end for withdraw---------------------------

// // -------------------------- my test cases start for claim reward---------------------------


// // -------------------------- my test cases end for claim reward---------------------------

});