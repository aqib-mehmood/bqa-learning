//assertion library
const { expect, assert } = require("chai");
const { toChecksumAddress } = require("ethereumjs-util");
const { ethers } = require("hardhat");
const web3 = require("web3");
//
const provider = waffle.provider;

describe('00 - ERC-20 Test Suite', () => {
    it("0.1- Deploy kol token", async function () {
        // getting KOLNET token contract 
        const tok = await ethers.getContractFactory("KOLNET");

        // deploying token
        token = await tok.deploy();

        // waiting for the token to deploy
        await token.deployed();

        // console.log('Yeh KOL token ha ',token.address);
    });

});
describe('01- Minting token testcases', () => {
    it("1.1- Minting Kol token", async function () {
        [owner, addr1, addr2, ...addrs] = await provider.getWallets();

        // minting token on the owner address
        await token.mint(owner.address, web3.utils.toWei("1000"));
    });

    it("1.2- Minting Kol token without any parameter", async function () {
        [owner, addr1, addr2, ...addrs] = await provider.getWallets();

        // minting token on the owner address
        await expect(token.mint()).to.be.reverted;
    });

    it("1.3- Minting Kol token without amount parameter", async function () {
        [owner, addr1, addr2, ...addrs] = await provider.getWallets();

        // minting token on the owner address
        await expect(token.mint(owner.address)).to.be.reverted;
    });

    it("1.4- Minting Kol token with 0 amount", async function () {
        [owner, addr1, addr2, ...addrs] = await provider.getWallets();

        // minting token on the owner address
        await token.mint(owner.address, web3.utils.toWei("0"));
    });

    it("1.5- Minting Kol token with negative amount", async function () {
        [owner, addr1, addr2, ...addrs] = await provider.getWallets();

        // minting token on the owner address
        await expect(token.mint(owner.address, web3.utils.toWei("-1000"))).to.be.reverted;
    });

    it("1.6- Minting Kol token with deciaml numbes", async function () {
        [owner, addr1, addr2, ...addrs] = await provider.getWallets();

        // minting token on the owner address
        await token.mint(owner.address, web3.utils.toWei("100.70"))
    });
});

describe("02- Token approval testcases", () => {
    it.skip('2.1- Give token approval before minting token', async function () {
        // giving approval
        await expect(token.approve(owner.address, web3.utils.toWei("10000"))).to.be.reverted;
    });

    it('2.2- Give token approval(normal) after minting token', async function () {
        // giving approval
        await token.approve(owner.address, web3.utils.toWei("10000"));
        const tx = await token.transferFrom(owner.address, '0x287cf34b46797570c74bd367dc081b57d2a52a88', web3.utils.toWei("50"))
    });

    it('2.3- Give token approval less and use more token', async function () {
        // run this test and transfer test with transferFrom amount >10
        // giving approval
        await token.approve(owner.address, web3.utils.toWei("10"));
        const tx = await expect(token.transferFrom(owner.address, '0x287cf34b46797570c74bd367dc081b57d2a52a88', web3.utils.toWei("50"))).to.be.revertedWith('ERC20: insufficient allowance')
    });

    it('2.4- Give token approval and use that in two transaction', async function () {
        // giving approval
        await token.approve(owner.address, web3.utils.toWei("100"));
        const tx1 = await token.transferFrom(owner.address, '0x287cf34b46797570c74bd367dc081b57d2a52a88', web3.utils.toWei("90"))
        const tx2 = await expect(token.transferFrom(owner.address, '0x287cf34b46797570c74bd367dc081b57d2a52a88', web3.utils.toWei("11"))).to.be.revertedWith('ERC20: insufficient allowance')
    });

    it('2.5- Give token approval to zero address', async function () {
        // giving approval
        await expect(token.approve('0x0000000000000000000000000000000000000000', web3.utils.toWei("100"))).to.be.revertedWith('ERC20: approve to the zero address');
        // const tx1 = await token.transferFrom(owner.address, '0x287cf34b46797570c74bd367dc081b57d2a52a88', web3.utils.toWei("90"))
        // const tx2 = await expect(token.transferFrom(owner.address, '0x287cf34b46797570c74bd367dc081b57d2a52a88', web3.utils.toWei("11"))).to.be.revertedWith('ERC20: insufficient allowance')
    });

    it('2.6- Give token approval of 0 amount', async function () {
        // giving approval
        await token.approve('0x287cf34b46797570c74bd367dc081b57d2a52a88', web3.utils.toWei("0"));
    });

    it('2.7- Give token approval of negative amount', async function () {
        // giving approval
        await expect(token.approve('0x287cf34b46797570c74bd367dc081b57d2a52a88', web3.utils.toWei("-100"))).to.be.reverted;
    });


});

describe("03- Burn token testcases", () => {
    it("3.1- Burning kol token less than balance", async function () {
        let burn = '100';
        let initial_balance = await token.balanceOf(owner.address) // before burning
        // console.log('Initial balance: ', Math.round((web3.utils.fromWei(String(initial_balance)))))
        const tx = await token.burn(web3.utils.toWei(burn));
        // console.log(tx);
        let new_balance = await token.balanceOf(owner.address)
        // console.log('New balance: ', (web3.utils.fromWei(String(new_balance))))
        const final_balance = web3.utils.fromWei(String(initial_balance)) - burn
        expect(Math.round(web3.utils.fromWei(String(new_balance)))).to.be.equals(Math.round(final_balance))
        // console.log('Balance: ', Math.round(final_balance));
    });

    // run this before commenting the other burn function
    it("3.2- Burning kol token equal to balance", async function () {
        const total_blance = await token.balanceOf(owner.address)
        // console.log(total_blance)
        const tx = await token.burn(total_blance);
        // console.log(tx);
    });

    it("3.3- Burning kol token greater than balance", async function () {
        const tx = await expect(token.burn(web3.utils.toWei("1200"))).to.be.revertedWith('ERC20: burn amount exceeds balance');
        // console.log(tx);
    });

    it("3.4- Burning kol token in negative values", async function () {
        const tx = await expect(token.burn(web3.utils.toWei("-1200"))).to.be.reverted;
        // console.log(tx);
    });

    it("3.5- Burning kol token in decimal values", async function () {
        await token.mint(owner.address, web3.utils.toWei("1000"));
        const tx1 = await token.burn(web3.utils.toWei("0.5"));
        // console.log(tx);
    });

    it("3.6- Burning 0 kol token", async function () {
        const tx1 = await token.burn(web3.utils.toWei("0"));
        // console.log(tx);
    });

});


describe("04- Transfer token testcases", () => {
    it("4.1- Transfer kol token", async function () {
        let transerAmount = '100';
        let initial_balance = await token.balanceOf(owner.address) // before transfer
        // console.log('Initial balance: ', Math.round((web3.utils.fromWei(String(initial_balance)))))
        const tx = await token.transfer('0x287cf34b46797570c74bd367dc081b57d2a52a88', web3.utils.toWei(transerAmount));
        // console.log(tx);
        let new_balance = await token.balanceOf(owner.address)
        // console.log('New balance: ', (web3.utils.fromWei(String(new_balance))))
        const final_balance = web3.utils.fromWei(String(initial_balance)) - transerAmount
        expect(Math.round(web3.utils.fromWei(String(new_balance)))).to.be.equals(Math.round(final_balance))
        // console.log('Balance: ', Math.round(final_balance));
    });

    it("4.2- Transfer amount more than balance", async function () {
        const tx = await expect(token.transfer('0x287cf34b46797570c74bd367dc081b57d2a52a88', web3.utils.toWei("10000000"))).to.be.revertedWith('ERC20: transfer amount exceeds balance');
        // const tx = await token.transfer('0x287cf34b46797570c74bd367dc081b57d2a52a88', web3.utils.toWei('10000'));
        // console.log(tx);
    });

    // run this before commenting the other burn function
    it("4.3- Transfer kol token equal to balance", async function () {
        const total_blance = await token.balanceOf(owner.address)
        const tx = await token.transfer('0x287cf34b46797570c74bd367dc081b57d2a52a88', total_blance);
        // console.log(tx);
    });


    it("4.4- Transfer kol token in negative values", async function () {
        const tx = await expect(token.transfer('0x287cf34b46797570c74bd367dc081b57d2a52a88', web3.utils.toWei('-100'))).to.be.reverted;
        // console.log(tx);
   });

    it("4.5- Transfer kol token in decimal values", async function () {
        await token.mint(owner.address, web3.utils.toWei("1000"));
        const tx = await token.transfer('0x287cf34b46797570c74bd367dc081b57d2a52a88', web3.utils.toWei('0.5'));
        // console.log(tx);
    });

    it("4.6- Transfer 0 kol token", async function () {
        const tx = await token.transfer('0x287cf34b46797570c74bd367dc081b57d2a52a88', web3.utils.toWei('0'));
        // console.log(tx);
    });

    it("4.7- Transfer kol token without any value", async function () {
        const tx = await expect(token.transfer('0x287cf34b46797570c74bd367dc081b57d2a52a88')).to.be.reverted;
        // console.log(tx);
    });

    it("4.8- Transfer kol token without any params", async function () {
        const tx = await expect(token.transfer()).to.be.reverted;
        // console.log(tx);
    });

    it("4.9- Transfer kol token to zero address", async function () {
        const tx = await expect(token.transfer('0x0000000000000000000000000000000000000000', web3.utils.toWei('10'))).to.be.revertedWith('ERC20: transfer to the zero address');
        // console.log(tx);
    });

})

describe("05- Allownce Checking testcases", () => {
    it("5.1- Allownce checking for approved address", async function () {
        const allownce_value = '1000'
        await token.approve('0x287cf34b46797570c74bd367dc081b57d2a52a88', web3.utils.toWei(allownce_value));
        const allownce_check = await token.allowance(owner.address, '0x287cf34b46797570c74bd367dc081b57d2a52a88');
        console.log('Current Allownce: ', web3.utils.fromWei(String(allownce_check)));
    });

    it("5.2- Allownce checking for unapproved address", async function () {
        const allownce_check = await token.allowance(owner.address, '0x156e5fe0ebf977d9e330c17ca1c202bb159c166b');
        expect(allownce_check).to.be.eq(0)
        // console.log('Current Allownce: ', web3.utils.fromWei(String(allownce_check)));
    });

    it("5.3- Allownce checking for zero address", async function () {
        const allownce_check = await token.allowance(owner.address, '0x0000000000000000000000000000000000000000');
        // console.log('Current Allownce: ', web3.utils.fromWei(String(allownce_check)));
        expect(allownce_check).to.be.eq(0)
    });

    it("5.4- Increase Allownce and check", async function () {
        const before_increase = await token.allowance(owner.address, '0x287cf34b46797570c74bd367dc081b57d2a52a88');
        // console.log(before_increase);
        const allownce_increase = await token.increaseAllowance('0x287cf34b46797570c74bd367dc081b57d2a52a88', web3.utils.toWei("500"));
        // console.log(allownce_increase);
        const after_increase = await token.allowance(owner.address, '0x287cf34b46797570c74bd367dc081b57d2a52a88');
        // console.log(after_increase);

    });

    it("5.5- Decrease Allownce", async function () {
        const allownce_decrease = await token.decreaseAllowance('0x287cf34b46797570c74bd367dc081b57d2a52a88', web3.utils.toWei("300"));
        // console.log(allownce_decrease);
        const allownce_check = await token.allowance(owner.address, '0x287cf34b46797570c74bd367dc081b57d2a52a88');
        // console.log(allownce_check);
    });


})
describe("06- Other testcases", () => {
    it("6.1- Total supply", async function () {
        const tx = await token.totalSupply()
        console.log(tx);
    });

    it("6.2- Token Decimal", async function () {
        const token_dec = await token.decimals();
        console.log(token_dec);
    });
})
