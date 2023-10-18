let axios = require("axios");
const Web3 = require('web3');
const web3 = new Web3("https://rinkeby.infura.io/v3/0b40e4fd2cca41138c8ebbc5ee029842");
const BigNumber = require('bignumber.js')
const {encode1} = require("../test/utils/StakingSignature")
let rcver = "0x70997970c51812dc3a010c7d01b50e0d17dc79c8"
// const {encode} = require("test/Staking.js")
const getRewardShare = async(id, stakerAddress) =>{
  console.log("Id:",id)
  try {
    let result2 = await axios({
      url: "https://api.thegraph.com/subgraphs/name/devleed/kolnet-staking-mumbai",
      method: "post",
      data: {
        query:
          ` {
            stakers(where:{id:"`+stakerAddress+`"} ) {
                id
                totalStakedAmount
                totalUnstakedAmount
                lastCycleIdClaimed
                cycles (where :{cycleId_lt:"`+id+`"} orderBy:id){
                  id
                  cycleId
                  stakedAmount
                  unstakedAmount
                  previousStaked
                }
          }
          cycles(where:{id_lt:"`+id+`"} orderBy:id) {
            id
            cummulativeStaked
            presaleTokens
            presaleAmounts
            timestamp
            previousStaked
          }
        }
          `,
      },
    });
    if(result2.data.data==null){
      return 0
    }
    if(result2?.data.data.stakers[0]?.cycles?.length == 0){
      return 0;
    }
    rewardShare = 0;
      const staker = result2.data.data?.stakers[0].cycles[result2.data.data.stakers[0].cycles.length - 1]
      const cycle = result2.data.data?.cycles[result2.data.data.cycles.length - 1];
      if(!cycle){
          return 0
      }
      // console.log(result2.data.data.cycles)
    //  console.log({stakerAmt:staker.stakedAmount- staker.unstakedAmount, cummulativeStaked:cycle.cummulativeStaked})
      stakedReward = (staker.stakedAmount - staker.unstakedAmount)/(cycle.cummulativeStaked)
      rewardShare = Number.isFinite(stakedReward)?stakedReward:0
    // console.log("Reward Share in rewardShare Function:",rewardShare)
    return rewardShare;
  } catch (err) {
    console.log("Error is:",err);
    return null;
  }
}
const getRewardMatic = async(stakerAddress) =>{
  try {
    let result = await axios({
      url: "https://api.thegraph.com/subgraphs/name/devleed/kolnet-staking-mumbai",
      method: "post",
      data: {
        query:
          ` {
            stakers(where:{id:"`+stakerAddress+`"} ) {
                id
                totalStakedAmount
                totalUnstakedAmount
                lastCycleIdClaimed
                cycles {
                  id
                  cycleId
                  stakedAmount
                  unstakedAmount
                  previousStaked
                }
          }
          cycles (orderBy: timestamp) {
            id
            cummulativeStaked
            presaleTokens
            presaleAmounts
            timestamp
            previousStaked
          }
        }
          `,
      },
    });
    if(result.data.data == null){
      return 0;
    }
    if(result.data.data?.stakers.length == 0){
      return 0;
    }
    console.log(result.data)
    const Tokens = new Map();
    startIdx = result.data.data.stakers[0].lastCycleIdClaimed == null ? 0:result.data.data.stakers[0].lastCycleIdClaimed
    cummReward = 0
    length = result.data.data.cycles.length - 1
    maxId = result.data.data.cycles[length].id
    maxId = Number(maxId)
    // console.log(maxId)
    for(let i = startIdx; i<=maxId; i++){
      const cycle = result.data.data?.cycles.find((o => o.id === String(i)))
      if(!cycle){
        continue
      }
      rewardShare = await getRewardShare(i, stakerAddress)
      // console.log("Reward Share:",i,rewardShare)
      Reward = cycle.presaleAmounts.map(function(x){ console.log("In Function Pre Sale Amount and Reward Share:",x,rewardShare)
      return x * rewardShare; });
      // console.log("Reward Array :",i,Reward)
      for(let i = 0; i < cycle.presaleTokens.length; i++){
        tokenAmt = Reward[i]
        tokenAmt += Tokens.get(cycle.presaleTokens[i])==null?0:Tokens.get(cycle.presaleTokens[i])
        Tokens.set(cycle.presaleTokens[i],tokenAmt)
      }
  }
  // console.log(Tokens)
  TokensArray = []
  AmountsArray = []
  for (const x of Tokens.keys()) {
    TokensArray.push(x)
    console.log("String of:",typeof(web3.utils.toWei(String(Tokens.get(x)))))
    AmountsArray.push(web3.utils.toWei(String(Tokens.get(x))))
  }
  return {TokensArray,AmountsArray}
  } catch (err) {
    console.log("Error is:",err);
    return null;
  }
}
const getRewardEth = async(stakerAddress) =>{
  try {
    let result = await axios({
      url: "https://api.thegraph.com/subgraphs/name/devleed/kolnet-staking-rinkeby",
      method: "post",
      data: {
        query:
          ` {
            stakers(where:{id:"`+stakerAddress+`"} ) {
                id
                totalStakedAmount
                totalUnstakedAmount
                lastCycleIdClaimed
                cycles {
                  id
                  cycleId
                  stakedAmount
                  unstakedAmount
                  previousStaked
                }
          }
          cycles (orderBy: timestamp) {
            id
            cummulativeStaked
            presaleTokens
            presaleAmounts
            timestamp
            previousStaked
          }
        }
          `,
      },
    });
    if(result?.data.data?.stakers.length == 0){
      return 0;
    }
    // console.log(result.data.data.cycles)
    const Tokens = new Map();
    startIdx = result.data.data.stakers[0].lastCycleIdClaimed == null ? 0:result.data.data.stakers[0].lastCycleIdClaimed
    cummReward = 0
    length = result.data.data.cycles.length - 1
    maxId = result.data.data.cycles[length].id
    maxId = Number(maxId)
    console.log(maxId)
    for(let i = startIdx; i<=maxId; i++){
      const cycle = result.data.data?.cycles.find((o => o.id === String(i)))
      if(!cycle){
        continue
      }
      rewardShare = await getRewardShare(i, stakerAddress)
      // console.log("Reward Share:",i,rewardShare)
      Reward = cycle.presaleAmounts.map(function(x){ console.log("In Function Pre Sale Amount and Reward Share:",x,rewardShare)
      return x * rewardShare; });
      console.log("Reward Array :",i,Reward)
      for(let i = 0; i < cycle.presaleTokens.length; i++){
        tokenAmt = Reward[i]
        tokenAmt += Tokens.get(cycle.presaleTokens[i])==null?0:Tokens.get(cycle.presaleTokens[i])
        Tokens.set(cycle.presaleTokens[i],tokenAmt)
      }
  }
  // console.log(Tokens)
  TokensArray = []
  AmountsArray = []
  for (const x of Tokens.keys()) {
    TokensArray.push(x)
    AmountsArray.push(web3.utils.toWei(String(Tokens.get(x))))
  }
  return {TokensArray,AmountsArray}
  // console.log({TokensArray:TokensArray, AmountsArray:AmountsArray})
  } catch (err) {
    console.log("Error is:",err);
    return null;
  }
}
const getRewardBinance = async(stakerAddress) =>{
  try {
    let result = await axios({
      url: "https://api.thegraph.com/subgraphs/name/devleed/kolnet-staking-rinkeby",
      method: "post",
      data: {
        query:
          ` {
            stakers(where:{id:"`+stakerAddress+`"} ) {
                id
                totalStakedAmount
                totalUnstakedAmount
                lastCycleIdClaimed
                cycles {
                  id
                  cycleId
                  stakedAmount
                  unstakedAmount
                  previousStaked
                }
          }
          cycles (orderBy: timestamp) {
            id
            cummulativeStaked
            presaleTokens
            presaleAmounts
            timestamp
            previousStaked
          }
        }
          `,
      },
    });
    if(result?.data.data?.stakers.length == 0){
      return 0;
    }
    // console.log(result.data.data.cycles)
    const Tokens = new Map();
    startIdx = result.data.data.stakers[0].lastCycleIdClaimed == null ? 0:result.data.data.stakers[0].lastCycleIdClaimed
    cummReward = 0
    length = result.data.data.cycles.length - 1
    maxId = result.data.data.cycles[length].id
    maxId = Number(maxId)
    console.log(maxId)
    for(let i = startIdx; i<=maxId; i++){
      const cycle = result.data.data?.cycles.find((o => o.id === String(i)))
      if(!cycle){
        continue
      }
      rewardShare = await getRewardShare(i, stakerAddress)
      // console.log("Reward Share:",i,rewardShare)
      Reward = cycle.presaleAmounts.map(function(x){ console.log("In Function:",x,rewardShare)
      return x * rewardShare; });
      console.log("Reward Array :",i,Reward)
      for(let i = 0; i < cycle.presaleTokens.length; i++){
        tokenAmt = Reward[i]
        tokenAmt += Tokens.get(cycle.presaleTokens[i])==null?0:Tokens.get(cycle.presaleTokens[i])
        Tokens.set(cycle.presaleTokens[i],tokenAmt)
      }
  }
  // console.log(Tokens)
  TokensArray = []
  AmountsArray = []
  for (const x of Tokens.keys()) {
    TokensArray.push(x)
    AmountsArray.push(web3.utils.toWei(String(Tokens.get(x))))
  }
  return {TokensArray,AmountsArray}
  // console.log({TokensArray:TokensArray, AmountsArray:AmountsArray})
  } catch (err) {
    console.log("Error is:",err);
    return null;
  }
}
const main =async()=>{
const reward =  await getRewardMatic("0x09050568ed00123da7d9250c8a57ad393eed8307")
console.log("Reward Array:",reward)
sign = await encode1("0x09050568ed00123da7d9250c8a57ad393eed8307", reward.TokensArray, reward.AmountsArray)
console.log("Signature:",sign)
// const rewardShr =  await getRewardShare("6", "0x5acca90b4e5cf2d283cd0b5bff9dc1cea51e0bf0")
// console.log("Reward Share:", rewardShr)
}
main()