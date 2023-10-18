require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-etherscan");
//require("@atixlabs/hardhat-time-n-mine");

const { key } = require('./secret.json');
// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: {
    
    compilers: [
      {
        version: "0.7.0",
        settings: {
          // https://hardhat.org/hardhat-network/#solidity-optimizer-support
          optimizer: {
            enabled: true,
            runs: 200
          }
        }
      },  
      {
        version: "0.8.6",
        settings: {
          // https://hardhat.org/hardhat-network/#solidity-optimizer-support
          optimizer: {
            enabled: true,
            runs: 200
          }
        }
      },  
      {
        version: "0.6.0",
        settings: {
          // https://hardhat.org/hardhat-network/#solidity-optimizer-support
          optimizer: {
            enabled: true,
            runs: 200
          }
        }
      },   
    ],
  },
  networks: {
    hardhat:{
      // setTimeIncrease: {
      //   10
      // }, 
      forking: {
        url: "https://polygon-mainnet.g.alchemy.com/v2/4rVaRCBkGTHxDQcxD_AsDO2LT4lkW5oj",
        blockNumber: 27635095
        
        //url: "https://eth-mainnet.alchemyapi.io/v2/zjbTUg1cryscWQnHcvHKvU30v2U7bPQf",
        //blockNumber: 14358486
      },
    },


    rinkeby: {
      url: "https://rinkeby.infura.io/v3/0b40e4fd2cca41138c8ebbc5ee029842", //Infura url with projectId
      accounts: [key] // add the account that will deploy the contract (private key)
    },

    mainnet: {
      url: "https://mainnet.infura.io/v3/0b40e4fd2cca41138c8ebbc5ee029842", //Infura url with projectId
      accounts: [key] // add the account that will deploy the contract (private key)
    },
    local: {
			url: 'http://127.0.0.1:8545'
	  },
    mumbai: {
      url: "https://polygon-mumbai.g.alchemy.com/v2/YXmXmZ7pUHmxJQ8pzf0Ocf2MnwXyenaV",
      accounts: [key]
    },

    matic: {
      url: "https://polygon-mainnet.g.alchemy.com/v2/YXmXmZ7pUHmxJQ8pzf0Ocf2MnwXyenaV",
      accounts: [key]
    },
    testnet: {
      url: "https://data-seed-prebsc-1-s1.binance.org:8545",
      // chainId: 97,
      // gasPrice: 20000000000,
      accounts: [key]
    },



    },

   etherscan: {
    // Your API key for Etherscan to verify contracts
    // Obtain one at https://etherscan.io/
    //apiKey: "XG6QZCS4MH6SES6YC64ZXG76YSSSUAN3US"
    apiKey: "FH28YXPI8PWYYQRMGZQNA7FE7UAX8SRA46" //bsc
    //apiKey: "ZUQBXSVXNT8RWQDK7Z5NHV4395U5JJFB5M" // matic
  }


};

//for BSC deployment

// module.exports = {
//   defaultNetwork: "mainnet",
//   networks: {
//     localhost: {
//       url: "http://127.0.0.1:8545"
//     },
//     testnet: {
//       url: "https://data-seed-prebsc-1-s1.binance.org:8545/",
      
//       chainId: 97,
//       gasPrice: 20000000000,
//       accounts: [key]
//     },
//     mainnet: {
//       url: "https://bsc-dataseed.binance.org/",
//       chainId: 56,
//       gasPrice: 20000000000,
//       accounts: [key]
//     }
//   },
//   etherscan: {
//     apiKey: {
//       bscTestnet: 'FA9NTT7GJD5UMPN1E96E7RAA2K8U1YRCRQ'
//     },
//   },

//   solidity: {
//   version: "0.8.7",
//   settings: {
//     optimizer: {
//       enabled: true
//     }
//    }
//   },
//   paths: {
//     sources: "./contracts",
//     tests: "./test",
//     cache: "./cache",
//     artifacts: "./artifacts"
//   },
//   mocha: {
//     timeout: 20000
//   }
// };