//assertion library
const { expect } = require("chai");
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
  // it("should pause staking", async function(){
  //   await stake.pause();
  // });
  // it("should pause staking", async function(){
  //   await stake.pause();
  // });
  // it("should unpause staking", async function(){
  //   await stake.unpause();
  // });
  // it("should update owner", async function(){
  //   await stake.updateOwner("0xFcce5CE96D091395bef9f9c19306983e4D812c10");
  // });
  it("should update KOL token address", async function(){
    stake.addKolToken(addr1.address);
  });
  it("should stake KOL TOKENS", async function() {
    //await stake.stakeTokens("0x0000000000000000000000000000000000000000", web3.utils.toWei("100"));//1e^18
    await stake.stakeTokens(token.address, web3.utils.toWei("100"));//1e^18
    const tx1 = await token.balanceOf(stake.address);
    console.log(tx1);
  });
  // it("should stake diffterent KOL TOKENS", async function() {
  //   await stake.stakeTokens(UNItoken.address, web3.utils.toWei("100"));//1e^18
  // });
  // it("should unStake kol tokens", async function (){
  //   await stake.withDraw(token.address, web3.utils.toWei("10"));
  //   const tx1 = await token.balanceOf(owner.address);
  //   console.log(tx1);
  // });
  it("should revert ", async function (){
    await expect(stake.withDraw(token.address, web3.utils.toWei("100"))).to.be.revertedWith('Invalid Amount');
  });
  it("should revert", async function (){
    await expect(stake.connect(addr2).withDraw(token.address, 1)).to.be.revertedWith('Invalid Amount');
  });
  // it("should call distribute Reward", async function(){
  //   [owner, addr1, addr2, ...addrs] = await provider.getWallets();
  //   await stake.claimReward(["0x70997970c51812dc3a010c7d01b50e0d17dc79c8"],[12],"0x70997970c51812dc3a010c7d01b50e0d17dc79c8",'0x24dc95c841dd03de136db3f5e17608fe41cc681f1078a91e90c23b35e83088ea49d818023f6d69f0a29d6ec2a565e533c66da05f30a13f2137148c05f7d2945d1c');
  //   //await stake.distributeReward(["0xaEF3f63978946bD65D489A061aA8a390531Df68e"],[1],addr1.address,'0x04c6ba31d638fa61827ce79850462aa4e415be30ffeb0deed1a8c06f2cc8a1f216f4f622d987f29c3c2dd052c2ab68ab708166f64974f43dcb166fe95f5f01c71b');
  // })
  it("should call distribute Reward", async function(){
    //[owner, addr1, addr2, ...addrs] = await provider.getWallets();
    await stake.claimReward(["0x998D98e9480A8f52A5252Faf316d129765773294", "0x086ce0Da44C88Dac96cF0Dc4c5b2237eACca2E71"],[web3.utils.toWei('10'),web3.utils.toWei('12')],'0x70997970c51812dc3a010c7d01b50e0d17dc79c8','0x756f9eec468ca4ed3834e0a629e65eccaf2d9bad33b0652c6868106fa48a30142ce4c19a520e740eb4f694a822b183a7031851b4318f2acb5610923d50c23d041b');
    //await stake.distributeReward(["0xaEF3f63978946bD65D489A061aA8a390531Df68e"],[1],addr1.address,'0x04c6ba31d638fa61827ce79850462aa4e415be30ffeb0deed1a8c06f2cc8a1f216f4f622d987f29c3c2dd052c2ab68ab708166f64974f43dcb166fe95f5f01c71b');
  })
  it("should call distribute Reward", async function(){
    //[owner, addr1, addr2, ...addrs] = await provider.getWallets();
    await stake.claimReward(["0x998D98e9480A8f52A5252Faf316d129765773294", "0x086ce0Da44C88Dac96cF0Dc4c5b2237eACca2E71", "0xa00F03Ea2d0a6e4961CaAFcA61A78334049c1848"],[web3.utils.toWei('10'),web3.utils.toWei('12'),web3.utils.toWei('9')],'0x70997970c51812dc3a010c7d01b50e0d17dc79c8','0x477620bf12bcd3c99ad6768fd0e54f2ceb6fb12ba6bbe679261381f0e74f4aa963b1a2fadcca8f30316d90bc224f1497581b3332ba2d19907cd03eba58df33771b');
    //await stake.distributeReward(["0xaEF3f63978946bD65D489A061aA8a390531Df68e"],[1],addr1.address,'0x04c6ba31d638fa61827ce79850462aa4e415be30ffeb0deed1a8c06f2cc8a1f216f4f622d987f29c3c2dd052c2ab68ab708166f64974f43dcb166fe95f5f01c71b');
  })
  it("should fail to distribute Reward", async function(){
    //await stake.distributeReward(["0xaEF3f63978946bD65D489A061aA8a390531Df68e"],[1],addr1.address,'0x04c6ba31d638fa61827ce79850462aa4e415be30ffeb0deed1a8c06f2cc8a1f216f4f622d987f29c3c2dd052c2ab68ab708166f64974f43dcb166fe95f5f01c71b');
    //console.log(IERC20('0x998D98e9480A8f52A5252Faf316d129765773294').balanceOf('0x70997970c51812dc3a010c7d01b50e0d17dc79c8'));
    await stake.claimReward(["0x998D98e9480A8f52A5252Faf316d129765773294"],[web3.utils.toWei('10')],"0x70997970c51812dc3a010c7d01b50e0d17dc79c8",'0xe45879d582ead6a20a4d7fcb04c6c9dd41714cd293c89819c112ab47df11ff5d74286a0d0f1d08d5b454bb95341ff517eea809f7c64e3fd55c9ae7b455bea0ff1c');
  })
  // it("should call distribute Reward", async function(){
  //   await stake.claimReward([
  //     '0x40e6a5e0ecf33781a6cc68c60dc46dd0064d4b68',
  //     '0xd9ba894e0097f8cc2bbc9d24d308b98e36dc6d02',
  //     '0x521855aa99a80cb467a12b1881f05cf9440c7023'
  //   ],[
  //     "11335428122545167000",
  //     "455852156057494850",
  //     "113554987212276230000"
  //     ],'0x09050568ed00123da7d9250c8a57ad393eed8307','0x51f8301341f2cfd57409653bc16e4261e57c3ae347900863b63f58d5e22ed20456ec196fbe574231cceed27de38fc7132803888b2253c40c7fa6c6ad81a5c44f1c');
  // //const tx = await stake.recoverSigner("0x649310d3e046de90f998d14eace3b0493713c364e5311422f9650f20bbf723b90e3cbf7e840bed0b58970b932dd8f589d6253b7171db96102500f43837e4623e1c","0xe550b43c6fc6c8b0795359feaeb603491a64715179f976df06402ed9e877d830");
  //   console.log(tx);
  // })
});
// describe("Greeter", function (){
//   it("",async ()=>{
//     await token.mint(owner.address, web3.utils.toWei("200"));
//   })
//})