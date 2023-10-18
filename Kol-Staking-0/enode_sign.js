var Web3 = require('web3');
let web3 = new Web3("https://rinkeby.infura.io/v3/0b40e4fd2cca41138c8ebbc5ee029842");
const BigNumber = require('bignumber.js')
const encode1 = async () =>{
    let data = rcver;
    for(i=0;i<amounts.length;i++){
        amounts[i] = new BigNumber(amounts[i])
        //amounts[i] = parseInt(amounts[i],10);
        console.log("Aroon",amounts[i]);
        amounts[i] = amounts[i].toString(16);
        console.log('hex', amounts[i]);
        console.log(amounts[i]);
        amounts[i] = String(amounts[i]).padStart(64, '0');
        
        data = data.concat(amounts[i]);
        addrs[i] = addrs[i].slice(2,42);
        data = data.concat(addrs[i]);
    }
    console.log(data); 
    hash = web3.utils.keccak256(data);
    const tx=web3.eth.accounts.sign(hash, '859e925c4a8173a9ffea74ad1d93fc8b2392f7175be6ec8b9140af61d9d1f16c');
    console.log(tx);
}

var addrs = [
    '0x40e6a5e0ecf33781a6cc68c60dc46dd0064d4b68',
    '0xd9ba894e0097f8cc2bbc9d24d308b98e36dc6d02',
    '0x521855aa99a80cb467a12b1881f05cf9440c7023'
  ];
//let amounts = [web3.utils.toWei('10'),web3.utils.toWei('12'), web3.utils.toWei('9'), web3.utils.toWei('0.00001')];
let amounts = [
    '11335428122545167000',
    '455852156057494850',
    '113554987212276230000'
    ]
//var addrs = ["0x998D98e9480A8f52A5252Faf316d129765773294", "0x086ce0Da44C88Dac96cF0Dc4c5b2237eACca2E71","0xa00F03Ea2d0a6e4961CaAFcA61A78334049c1848"];
//let amounts = [web3.utils.toWei('10'),web3.utils.toWei('12'), web3.utils.toWei('9')];

//var addrs = ["0x998D98e9480A8f52A5252Faf316d129765773294", "0x086ce0Da44C88Dac96cF0Dc4c5b2237eACca2E71"];
//let amounts = [web3.utils.toWei('10'),web3.utils.toWei('12')];

//var addrs = ["0x998D98e9480A8f52A5252Faf316d129765773294"];
//let amounts = [web3.utils.toWei('10')];


let rcver = "0x09050568ed00123da7d9250c8a57ad393eed8307"; 
encode1();
module.exports = {
    encode1
}