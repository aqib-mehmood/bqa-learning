//assertion library
const { expect, assert } = require("chai");
const { toChecksumAddress, zeroAddress } = require("ethereumjs-util");
const { ethers } = require("hardhat");
const web3 = require("web3");
//
const provider = waffle.provider;

const mymeta = '0x287cf34b46797570c74BD367dC081B57d2A52A88'
const zero_address = '0x0000000000000000000000000000000000000000'
const solana_address = 'HeRxXNHFaPuE6oi1Y2uNjuDcHTXgZVMANRNd4yvLFrBC'
const max_id = '115792089237316195423570985008687907853269984665640564039457584007913129639935'

describe('ERC-721 Test Suite', () => {
    describe('00- Deploy token', () => {
        it("0.1- Deploy SVN21 token", async function () {
            // getting KOLNET token contract 
            let tok = await ethers.getContractFactory("SEVEN21");

            // deploying token
            token = await tok.deploy();

            // waiting for the token to deploy
            await token.deployed();

            // console.log('Yeh SVN21 token ha ',token.address);

        });

    });

    describe('01- Minting token testcases', () => {
        it("1.1- Minting SVN21 token to owner", async function () {
            [owner, addr1, addr2, ...addrs] = await provider.getWallets();
            // minting token on the owner address
            const tx = await token.mint(owner.address, 100000);
            // const tx0 = await token.mint(owner.address, '0');
            const tx2 = await token.mint(owner.address, '888');
            const tx3 = await token.mint(owner.address, '777');
            const tx4 = await token.mint(owner.address, '666');
            const tx5 = await token.mint(owner.address, '555');
            const tx6 = await token.mint(owner.address, '444');
            const tx7 = await token.mint(owner.address, '333');
            const tx8 = await token.mint(owner.address, '222');
            const tx9 = await token.mint(owner.address, '111');
            // console.log(tx)
        })

        it("1.2- Minting token to address other than owner", async function () {
            [owner, addr1, addr2, ...addrs] = await provider.getWallets();
            // minting token on the owner address
            const tx = await token.mint(addr1.address, '202');
            // console.log(tx)
        })

        it("1.3- Minting token with same ID to other address", async function () {
            [owner, addr1, addr2, ...addrs] = await provider.getWallets();
            // minting token on the owner address
            const tx1 = await token.mint(owner.address, '999');
            // console.log(tx1)

            // minting same token on the other address
            const txx = await expect(token.mint(addr2.address, '999')).to.be.revertedWith("ERC721: token already minted");
            // console.log(txx)
        })

        it('1.4- Minting token with max tokenID', async function () {
            await token.mint(owner.address, max_id);
        })

        it('1.5- Minting token with min tokenID', async function () {
            await token.mint(owner.address, '1');
        })

        it('1.6- Minting token with decimal tokenID', async function () {
            await expect(token.mint(owner.address, '0.5')).to.be.reverted;
        })

        it('1.7- Minting token with negative tokenID', async function () {
            await expect(token.mint(owner.address, '-888')).to.be.reverted;
        })

    })


    describe('02- Tokens information testcases', () => {
        it("2.1- Verify token name", async function () {
            const name = await token.name()
            expect(name).to.be.eq('SEVEN21')
            // console.log('Token Name: ', name)
        })

        it("2.2- Verify token symbol", async function () {
            const symbol = await token.symbol()
            expect(symbol).to.be.eq('SVN21')
            // console.log('Token Symbol: ', symbol)
        })

        it("2.3- Verify token URI", async function () {
            let tokenuri = await token.tokenURI(100000)
            // console.log("base URI= ", tokenuri)
        })
    })


    describe('03- Balance of function testcases', () => {
        it("3.1- Check Balance of owner", async function () {
            const owner_balance = await token.balanceOf(owner.address)
            // console.log(owner_balance)
        })

        it("3.2- Check Balance of address other than owner", async function () {
            const other_bal = await token.balanceOf(mymeta)
            // console.log(other_bal)
        })

        it("3.3- Check Balance of zero address", async function () {
            const zeroadd_bal = await expect(token.balanceOf(zero_address)).to.be.revertedWith('ERC721: address zero is not a valid owner');
            // console.log(zeroadd_bal)
        })

        it("3.4- Check Balance of address other than 0x", async function () {
            const solana_bal = await expect(token.balanceOf(solana_address)).to.be.reverted;
            // console.log(solana_bal)
        })
    })


    describe('04- Owner of token testcases', () => {
        it("4.1- Verify ownership of 100000 token ID", async function () {
            const tok_owner = await token.ownerOf(100000)
            expect(tok_owner).to.be.eq(owner.address)
            // console.log(tok_owner)
        })

        it("4.2- Check the function with invalid id", async function () {
            await expect(token.ownerOf('000011')).to.be.revertedWith('invalid token ID')
        })

        // Zero address owner is showing wrong.
        it("4.3- Check owner of zero address", async function () {
            const zeroadd_owner = await expect(token.ownerOf(zero_address)).to.be.revertedWith('ERC721: invalid token ID');
            // console.log(zeroadd_owner)
        })

        it("4.4- Check function by passing 0x address", async function () {
            const zeroadd_owner = await expect(token.ownerOf(mymeta)).to.be.revertedWith('ERC721: invalid token ID');
            // console.log(zeroadd_owner)
        })
    })

    describe('05- Giving token approval testcases', () => {
        it("5.1- Giving approval tokenId=999 to addr1", async function () {
            // giving token approval to the address
            const approval = await token.approve(addr1.address, '999')
            // console.log(approval)

            // now checking if the approval has been given or not
            const getapproved = await token.getApproved('999')
            expect(getapproved).to.be.eq(addr1.address)


            // now use the transfer from
            // the transferFrom is currently not working for address other than woner bcz it is mentioned in the contract
            // const transferfrom = await token.transferFrom(addr1.address, mymeta, '999')
            // console.log(transferfrom)
        })

        it("5.2- Giving approval tokenId=Not exist to mymeta", async function () {
            // giving token approval to the address
            const approval = await expect(token.approve(mymeta, '6566565656565656565')).to.be.revertedWith('ERC721: invalid token ID')
            // console.log(approval)

        })

        it("5.3- Giving approval tokenId=zeroaddress", async function () {
            // giving token approval to the address
            const approval = await expect(token.approve(mymeta, '0')).to.be.revertedWith('ERC721: invalid token ID')
            // console.log(approval)
        })

        it("5.4- Giving approval tokenId=888 to owner itself", async function () {
            // giving token approval to the address
            const approval = await expect(token.approve(owner.address, '888')).to.be.revertedWith('ERC721: approval to current owner')
            // console.log(approval)
        })

        it("5.5- Giving approval tokenId=888 to zeroAddress", async function () {
            // giving token approval to the address
            const approval = await token.approve(zero_address, '888')
            const getapproval = await token.getApproved('888')
            expect(getapproval).to.be.eq(zero_address)
            // console.log(getapproval)
        })

        it("5.6- Giving single token approval after giving approval for all", async function () {
            // give approval for all tokens to the address
            const aprroveall = await token.setApprovalForAll(addr2.address, true)
            // giving token approval to the address
            const approval = await token.approve(addr2.address, '777')
        })
    })


    describe('06- Checking the approved owner of the token', () => {
        it("6.1- Verfiy Approved owner of the tokenid = 777 ", async function () {
            // checking the approval status of the token
            const getapproved2 = await token.getApproved('777')
            expect(getapproved2).to.be.eq(addr2.address)
        })

        it("6.2- Verify Approved owner of the token id = 0", async function () {
            // checking the approval status of the token
            const getapproved2 = await expect(token.getApproved('0')).to.be.revertedWith('ERC721: invalid token ID')
            // console.log(getapproved2)
            // expect(getapproved2).to.be.eq(addr2.address)
        })

        it("6.3-  Verify Approved owner of the token id = not exist", async function () {
            // checking the approval status of the token
            const getapproved2 = await expect(token.getApproved('0')).to.be.revertedWith('ERC721: invalid token ID')
            // console.log(getapproved2)
            // expect(getapproved2).to.be.eq(addr2.address)
        })

        it("6.4-  Verify Approved owner of the token id = ethereum address", async function () {
            // checking the approval status of the token
            const getapproved2 = await expect(token.getApproved(mymeta)).to.be.revertedWith('ERC721: invalid token ID')
            // console.log(getapproved2)
            // expect(getapproved2).to.be.eq(addr2.address)
        })
    })



    describe('07- Set approvalForAll token testcases', () => {
        it("7.1- Giving token approvalForAll to addr2", async function () {
            // give approval for all tokens to the address
            const aprroveall = await token.setApprovalForAll(addr2.address, true)
            // console.log(aprroveall)
            // verifying that approval has been given
            const checkapproveall = await token.isApprovedForAll(owner.address, addr2.address)
            expect(checkapproveall).to.be.eq(true)
            // console.log(checkapproveall)
        })

        it("7.2- Giving token approvalForAll to owner address", async function () {
            // give approval for all tokens to the address
            const aprroveall = await expect(token.setApprovalForAll(owner.address, true)).to.be.revertedWith('ERC721: approve to caller')
            // console.log(aprroveall)

        })

        it("7.3- Rejecting token approvalForAll to addr2", async function () {
            // give approval for all tokens to the address
            const aprroveall = await token.setApprovalForAll(addr2.address, false)
            // console.log(aprroveall)

             // verifying that approval has been cancelled
             const checkapproveall = await token.isApprovedForAll(owner.address, addr2.address)
             expect(checkapproveall).to.be.eq(false)
             // console.log(checkapproveall)
        })

        it("7.4- Rejecting token approvalForAll to owner address", async function () {
            // give approval for all tokens to the address
            const aprroveall = await expect(token.setApprovalForAll(owner.address, false)).to.be.revertedWith('ERC721: approve to caller')
            // console.log(aprroveall)
        })

        it("7.5- Giving token approvalForAll to burnable address", async function () {
            // give approval for all tokens to the address
            const aprroveall = await token.setApprovalForAll(zero_address, true);
            // console.log(aprroveall)

             // verifying that approval has been given
             const checkapproveall = await token.isApprovedForAll(owner.address, zero_address)
             expect(checkapproveall).to.be.eq(true)
             // console.log(checkapproveall)
        })

        it("7.6- Rejecting token approvalForAll to zeroAddress", async function () {
            // give approval for all tokens to the address
            const aprroveall = await token.setApprovalForAll(zero_address, false)
            // console.log(aprroveall)

             // verifying that approval has been cancelled
             const checkapproveall = await token.isApprovedForAll(owner.address, zero_address)
             expect(checkapproveall).to.be.eq(false)
             // console.log(checkapproveall)
        })

        it("7.7-  Giving token approvalForAll to tokenID", async function () {
            // give approval for all tokens to the address
            const aprroveall = await expect(token.setApprovalForAll(max_id, false)).to.be.reverted;
            // console.log(aprroveall)
        })
    })


    describe('08- Check approval for all token testcases', () => {
        it("8.1- Check isApprovedForAll for addr2", async function () {
            await token.setApprovalForAll(addr2.address, true)
            // check the approval for all tokens given to address or not
            const checkapproveall = await token.isApprovedForAll(owner.address, addr2.address)
            expect(checkapproveall).to.be.eq(true)
            // console.log(checkapproveall)
        })

        it("8.2- Check isApprovedForAll for owner address", async function () {
            // check the approval for all tokens given to address or not
            const checkapproveall = await token.isApprovedForAll(owner.address, owner.address)
            expect(checkapproveall).to.be.eq(false)
            // console.log(checkapproveall)
        })

        it("8.3- Check isApprovedForAll for zero address", async function () {
            await token.setApprovalForAll(zero_address, true)
            // check the approval for all tokens given to address or not
            const checkapproveall = await token.isApprovedForAll(owner.address, zero_address)
            expect(checkapproveall).to.be.eq(true)
            // console.log(checkapproveall)
        })

        it("8.4- Check isApprovedForAll by using wrong parameter", async function () {
            // check the approval for all tokens given to address or not
            const checkapproveall = await token.isApprovedForAll(addr1.address, addr2.address)
            expect(checkapproveall).to.be.eq(false)
            // console.log(checkapproveall)
        })
    })


    describe('09- Transfer testcases', () => {
        it("9.1- Transfer token having id = max_id", async function () {
            // first check the recipient balance of the recipient address
            const rec_bal_before = await token.balanceOf(mymeta)
            // console.log(rec_bal_before)
            const sen_bal_before = await token.balanceOf(owner.address)
            // console.log(sen_bal_before)

            // simple transfer function
            const tx = await token.transfer(owner.address, mymeta, max_id)
            // console.log(tx)

            // Recipient balance after receiving
            const rec_bal_after = await token.balanceOf(mymeta)
            // console.log(rec_bal_after)

            // sender balance after transfer
            const sen_bal_after = await token.balanceOf(owner.address)
            // console.log(sen_bal_after)

            // assertion for balance
            expect(rec_bal_after).to.be.equal(rec_bal_before+1)
            expect(sen_bal_after).to.be.equal(sen_bal_before-1)

            // assertion for ownership
            const ownership = await token.ownerOf(max_id)
            expect(ownership).to.be.eq(mymeta)
        })

        it("9.2- Transfer token having id = min_id", async function () {
            // first check the recipient balance of the recipient address
            let rec_bal_before = 0, rec_bal_after  = 0, sen_bal_after = 0, sen_bal_before = 0;
            rec_bal_before = await token.balanceOf(mymeta)
            // console.log(rec_bal_before)
            sen_bal_before = await token.balanceOf(owner.address)
            // console.log(sen_bal_before)

            // simple transfer function
            let tx = await token.transfer(owner.address, mymeta, '1')
            // console.log(tx)

            // Recipient balance after receiving
            rec_bal_after = await token.balanceOf(mymeta)
            // console.log(rec_bal_after)

            // sender balance after transfer
            sen_bal_after = await token.balanceOf(owner.address)
            // console.log(sen_bal_after)

            // assertion for balance
            // expect(rec_bal_after).to.be.equal(rec_bal_before + 1)
            // expect(sen_bal_after).to.be.equal(sen_bal_before - 1)

            // assertion for ownership
            let ownership = await token.ownerOf('1')
            expect(ownership).to.be.eq(mymeta)
        })

        it("9.3- Transfer token having id = not exist", async function () {
            // simple transfer function
            let tx = await expect(token.transfer(owner.address, mymeta, '0328124')).to.be.revertedWith('ERC721: invalid token ID')
            // console.log(tx)
        })

        it("9.4- Transfer token having id = 0", async function () {
            // simple transfer function
            let tx = await expect(token.transfer(owner.address, mymeta, '0')).to.be.revertedWith('ERC721: invalid token ID')
            // console.log(tx)
        })


        it("9.5- Transfer token having id = zero address", async function () {
            // simple transfer function
            let tx = await expect(token.transfer(owner.address, zero_address, '666')).to.be.revertedWith('ERC721: transfer to the zero address')
            // console.log(tx)
        })

        it("9.6- Transfer token from address that you dont own", async function () {
            // simple transfer function
            let tx = await expect(token.transfer(addr1.address, addr2.address, '666')).to.be.revertedWith('ERC721: transfer from incorrect owner')
            // console.log(tx)
        })
    })


    describe('10- TransferFrom testcases', () => {
        it("10.1- Tansfer from function", async function () {
            // transferFrom is working without giving token approval to owner
            const transferfrom = await token.transferFrom(owner.address, addr1.address, '111')
            // console.log(transferfrom)

            // // the below code is not giving approval to address1
            // const approval3 = await token.approve(addr1.address, '0')
            // const transferfrom2 = await token.transferFrom(addr1.address, owner.address, '0')


            // after transfer the ownership of the token will change
            // let ownr = await token.ownerOf('1')
            // console.log(ownr) 

        })
    })


    describe('11- Burn token testcases', () => {
        it("11.1- Normal token burn", async function () {
            // burning token
            const burned = await token.burn('333')
            // console.log(burned)

            // verify burning
            const ownership = await expect(token.ownerOf('333')).to.be.revertedWith('ERC721: invalid token ID')
            // console.log(ownership)

            // verify approval has been cancelled
            await expect(token.getApproved('333')).to.be.revertedWith('ERC721: invalid token ID')
        })

        it("11.2- Burn token that you don't own", async function () {
            const burned = await expect(token.burn('98766541')).to.be.revertedWith('ERC721: invalid token ID')
            // console.log(burned)
        })

        it("11.3- Burn token having id= 0", async function () {
            const burned = await expect(token.burn('0')).to.be.revertedWith('ERC721: invalid token ID')
            // console.log(burned)
        })

        it("11.4- Burn token having id= token address", async function () {
            const burned = await expect(token.burn(mymeta)).to.be.revertedWith('ERC721: invalid token ID')
            // console.log(burned)
        })
    })
})