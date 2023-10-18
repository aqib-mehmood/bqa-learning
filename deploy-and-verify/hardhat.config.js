// require('hardhat-etherscan');
// require('@nomiclabs/hardhat-waffle');
require('@nomiclabs/hardhat-etherscan');

require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */

require('dotenv').config();

const {INFURA_API_KEY, PRIVATE_KEY} = process.env;

if(!(INFURA_API_KEY || PRIVATE_KEY)) {
  throw new Error("Please set your INFURA_API_KEY & PRIVATE_KEY in a .env file");
}

const chainIds = {
  ganache: 1337,
  goerli: 5,
  hardhat: 31337,
  kovan: 42,
  mainnet: 1,
  bscmainnet: 56,
  matic: 137,
  rinkeby: 4,
  ropsten: 3,
  bsctestnet: 97,
  mumbai:80001 ,
};

module.exports = {
  solidity: "0.8.12",
  defaultNetwork: "hardhat",
  
  networks: {
    goerli: {
      accounts: [PRIVATE_KEY],
      chainId: chainIds['goerli'],
      url: `https://goerli.infura.io/v3/${INFURA_API_KEY}`,
      gas: 2100000,
    },
    rinkeby: {
      accounts: [PRIVATE_KEY],
      chainId: chainIds['rinkeby'],
      url: `https://rinkeby.infura.io/v3/${INFURA_API_KEY}`,
      gas: 2100000,
    },
    ropsten: {
      accounts: [PRIVATE_KEY],
      chainId: chainIds['ropsten'],
      url: `https://ropsten.infura.io/v3/${INFURA_API_KEY}`,
      gas: 2100000,
    },
  },
  etherscan: {
    apiKey: "AJEFSY5AVH12AXB38DRSAGM4XEJUBK6CG1" //mainnet
    // apiKey: "ZUQBXSVXNT8RWQDK7Z5NHV4395U5JJFB5M" // matic
    // apiKey: "FFBBU5ZQ2KV1183XT3VRBKF68ZR56RWT5B" //bsc
  },
};
