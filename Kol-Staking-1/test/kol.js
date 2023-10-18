//assertion library
const { expect, assert } = require("chai");
const { toChecksumAddress } = require("ethereumjs-util");
const { ethers } = require("hardhat");
const web3 = require("web3");
//
const provider = waffle.provider;

describe('ERC-20 Test Suite', () => {
    it("Deploy kol token", async function () {
        // getting KOLNET token contract 
        const tok = await ethers.getContractFactory("KOLNET");

        // deploying token
        token = await tok.deploy();

        // waiting for the token to deploy
        await token.deployed();

        // console.log('Yeh KOL token ha ',token.address);
    });

});
describe('Minting token testcases', () => {
    it("01- Minting Kol token", async function () {
        [owner, addr1, addr2, ...addrs] = await provider.getWallets();

        // minting token on the owner address
        await token.mint(owner.address, web3.utils.toWei("1000"));
    });

    it("02- Minting Kol token without any parameter", async function () {
        [owner, addr1, addr2, ...addrs] = await provider.getWallets();

        // minting token on the owner address
        await expect(token.mint()).to.be.reverted;
    });

    it("03- Minting Kol token without amount parameter", async function () {
        [owner, addr1, addr2, ...addrs] = await provider.getWallets();

        // minting token on the owner address
        await expect(token.mint(owner.address)).to.be.reverted;
    });

    it("04- Minting Kol token with 0 amount", async function () {
        [owner, addr1, addr2, ...addrs] = await provider.getWallets();

        // minting token on the owner address
        await token.mint(owner.address, web3.utils.toWei("0"));
    });

    it("05- Minting Kol token with negative amount", async function () {
        [owner, addr1, addr2, ...addrs] = await provider.getWallets();

        // minting token on the owner address
        await expect(token.mint(owner.address, web3.utils.toWei("-1000"))).to.be.reverted;
    });

    it("06- Minting Kol token with deciaml numbes", async function () {
        [owner, addr1, addr2, ...addrs] = await provider.getWallets();

        // minting token on the owner address
        await token.mint(owner.address, web3.utils.toWei("100.70"))
    });
});

describe("Token approval testcases", () => {
    it.skip('01- Give token approval before minting token', async function () {
        // giving approval
        await expect(token.approve(owner.address, web3.utils.toWei("10000"))).to.be.reverted;
    });

    it('02- Give token approval(normal) after minting token', async function () {
        // giving approval
        await token.approve(owner.address, web3.utils.toWei("10000"));
        const tx = await token.transferFrom(owner.address, '0x287cf34b46797570c74bd367dc081b57d2a52a88', web3.utils.toWei("50"))
    });

    it('03- Give token approval less and use more token', async function () {
        // run this test and transfer test with transferFrom amount >10
        // giving approval
        await token.approve(owner.address, web3.utils.toWei("10"));
        const tx = await expect(token.transferFrom(owner.address, '0x287cf34b46797570c74bd367dc081b57d2a52a88', web3.utils.toWei("50"))).to.be.revertedWith('ERC20: insufficient allowance')
    });

    it('04- Give token approval and use that in two transaction', async function () {
        // giving approval
        await token.approve(owner.address, web3.utils.toWei("100"));
        const tx1 = await token.transferFrom(owner.address, '0x287cf34b46797570c74bd367dc081b57d2a52a88', web3.utils.toWei("90"))
        const tx2 = await expect(token.transferFrom(owner.address, '0x287cf34b46797570c74bd367dc081b57d2a52a88', web3.utils.toWei("11"))).to.be.revertedWith('ERC20: insufficient allowance')
    });
});

describe("Burn token testcases", () => {
    it("01- Burning kol token less than balance", async function () {
        let burn = '800';
        let initial_balance = await token.balanceOf(owner.address)
        const tx = await token.burn(web3.utils.toWei(burn));
        // console.log(tx);
        let new_balance = await token.balanceOf(owner.address)
        expect((String(new_balance))).to.be.eq(web3.utils.toWei(String(initial_balance))-web3.utils.toWei(String(burn)))
        console.log('Balance: ', new_balance);
    });

    // run this before commenting the other burn function
    it.skip("02- Burning kol token equal to balance", async function () {
        const tx = await token.burn(web3.utils.toWei("1000"));
        // console.log(tx);
    });

    it("03- Burning kol token greater than balance", async function () {
        const tx = await expect(token.burn(web3.utils.toWei("1200"))).to.be.revertedWith('ERC20: burn amount exceeds balance');
        // console.log(tx);
    });

    it("04- Burning kol token in negative values", async function () {
        const tx = await expect(token.burn(web3.utils.toWei("-1200"))).to.be.reverted;
        // console.log(tx);
    });

    it("04- Burning kol token in decimal values", async function () {
        const tx = await token.burn(web3.utils.toWei("0.5"));
        // console.log(tx);
    });

});


describe.skip("Burn token testcases", () => {
    it("Transfer kol token", async function () {
        const tx = await token.transfer('0x287cf34b46797570c74bd367dc081b57d2a52a88', web3.utils.toWei("100"));
        // console.log(tx);
    });


    it("Balance of Owner address", async function () {
        const bal = await token.balanceOf(owner.address)
        console.log('Owner: ', bal);
        const bal1 = await token.balanceOf('0x287cf34b46797570c74bd367dc081b57d2a52a88')
        console.log('Receiver: ', bal1);
    });

    it("transferFrom function", async function () {
        const tx = await token.transferFrom(owner.address, '0x287cf34b46797570c74bd367dc081b57d2a52a88', web3.utils.toWei("50"))
        // console.log(tx)
    });

    it("Balance of Owner address", async function () {
        const bal = await token.balanceOf(owner.address)
        console.log(bal);
        const bal1 = await token.balanceOf('0x287cf34b46797570c74bd367dc081b57d2a52a88')
        console.log(bal1);
    });

    it("Total supply", async function () {
        const tx = await token.totalSupply()
        console.log(tx);
    });

    it("Token Decimal", async function () {
        const token_dec = await token.decimals();
        console.log(token_dec);
    });

    it("Allownce checking", async function () {
        await token.approve('0x287cf34b46797570c74bd367dc081b57d2a52a88', web3.utils.toWei("1000"));
        const allownce_check = await token.allowance(owner.address, '0x287cf34b46797570c74bd367dc081b57d2a52a88');
        console.log(allownce_check);
    });

    it("Increase Allownce checking", async function () {
        const allownce_increase = await token.increaseAllowance('0x287cf34b46797570c74bd367dc081b57d2a52a88', web3.utils.toWei("500"));
        // console.log(allownce_increase);
        const allownce_check = await token.allowance(owner.address, '0x287cf34b46797570c74bd367dc081b57d2a52a88');
        console.log(allownce_check);
    });

    it("Decrease Allownce", async function () {
        const allownce_decrease = await token.decreaseAllowance('0x287cf34b46797570c74bd367dc081b57d2a52a88', web3.utils.toWei("300"));
        // console.log(allownce_decrease);
        const allownce_check = await token.allowance(owner.address, '0x287cf34b46797570c74bd367dc081b57d2a52a88');
        console.log(allownce_check);
    });

})
