//SPDX-License-Identifier: MIT
pragma solidity ^0.8.6;

import './Interface/IERC20.sol';
import "hardhat/console.sol"; 
contract Stake {
    
    address kol; //= 0xF0708A6D7405A163CaA9559d1Ca6ecC13AAB5fA5;
    address owner; //= 0xFcce5CE96D091395bef9f9c19306983e4D812c10;

    constructor(address _owner, address _kol){
        kol = _kol;
        owner = _owner;
        emit cycleStarted(block.timestamp); 
    }
    
    mapping(address => uint256) public _balances;
    mapping(bytes32 => bool) public isUnique;
    event tokenStaked(address staker, uint256 amount, uint256 totStaked,uint256 stakedAt);
    event withDrawn(address withDrawer, uint256 amount, uint256 remainingAmount, uint256 withdrawnAt);
    event claimedReward(address[] tokens, uint256[] amounts, address recever, uint256 claimedAt, bytes sig);
    event cycleStarted(uint256 cycleStartedAt);

    modifier onlyOwner(){
        require(msg.sender == owner);
        _;
    }

    

    
    function addKolToken(address _kol) public onlyOwner {
        kol = _kol;
    }

    function updateOwner(address _owner) public onlyOwner {
        owner = _owner;
    }


    

    /**
    * @notice Stake KOL tokens.
    * @dev  transfer KOL tokens from msg.sender to this contract
    * @param token - kol token address
    * @param amount - number of tokens to stake
    * Emits a {tokenStaked} event.
    */

    
    function stakeTokens(address token, uint256 amount) external {

        require(token == kol, "Not KOL Token");

        IERC20(token).transferFrom(msg.sender, address(this), amount);
        _balances[msg.sender] = _balances[msg.sender]+amount;

        emit tokenStaked(msg.sender, amount, _balances[msg.sender],block.timestamp);
        
    }

    /**
    * @notice withdraw staked KOL tokens.
    * @dev  transfer KOL tokens from this contract to msg.sender
    * checks amount <= staked tokens 
    * @param token - kol token address
    * @param amount - number of tokens to stake
    * Emits a {withDrawn} event.
    */

    function withDraw(address token, uint256 amount) external{

        require(token == kol, "Not KOL TOKEN");
        require(amount <= _balances[msg.sender], "Invalid Amount");
        _balances[msg.sender] = _balances[msg.sender]-amount;
        IERC20(token).transfer(msg.sender, amount);     
        emit withDrawn(msg.sender, amount, _balances[msg.sender], block.timestamp);
        
    }

    /**
    * @notice Staker claim reward tokens.
    * @dev  encodePacked the tokens, amounts & recever address
    * verify that encoded data against claimed signature
    * if claimed signature matches the actual signer
    * reward will be claimed else revert the transaction
    * each time claimed signature must be unique
    * @param tokens - reward token addresses
    * @param amounts - amount array for reward
    * @param rcv - reward reciever address
    * @param claimedSig - signature for claiming reward 
    * Emits a {tokenStaked} event.
    */
    
    function claimReward(address[] calldata tokens, uint256[] calldata amounts,address rcv, bytes calldata claimedSig) external {
      
      bytes memory encodedData = encodeTightlyPacked(tokens,amounts,rcv); 
      console.logBytes(encodedData);   
      bytes32  datahash = keccak256(abi.encodePacked("\x19Ethereum Signed Message:\n32", keccak256(encodedData)));
      if (isUnique[datahash]){revert("Invalid claim");}
      address signer  = recoverSigner(claimedSig, datahash); 
        
        if(signer == owner) {

            for(uint256 i; i<tokens.length;i++){

                IERC20(tokens[i]).transfer(rcv,amounts[i]);
            }       
        }
        else{
            revert("Invalid signature");
        }
        isUnique[datahash] = true;
        emit claimedReward(tokens, amounts, rcv, block.timestamp, claimedSig);
    }

    function encodeTightlyPacked(address[] calldata _token, uint256[] calldata _amount, address _rcv ) internal pure returns(bytes memory encodedData){
        
        require(_token.length == _amount.length,"In-valid length");
        for (uint i = 0; i < _token.length; i++) {

            encodedData = abi.encodePacked(encodedData,_amount[i],_token[i]);       
        }
        encodedData = abi.encodePacked(_rcv, encodedData);
        return(encodedData);
    }    


    function recoverSigner(bytes memory sig,bytes32 _hash) //signature, hash
        internal
        pure
        returns (address)
    {

        (uint8 v, bytes32 r, bytes32 s) = splitSignature(sig);

        return ecrecover(bytes32(_hash), v, r, s);
    }

    function splitSignature(bytes memory sig)
        internal
        pure
        returns (
            uint8 v,
            bytes32 r,
            bytes32 s
        )
    {
        require(sig.length == 65);

        assembly {
            // first 32 bytes, after the length prefix.
            r := mload(add(sig, 32))
            // second 32 bytes.
            s := mload(add(sig, 64))
            // final byte (first byte of the next 32 byt (es).
            v := byte(0, mload(add(sig, 96)))
        }

        return (v, r, s);
    }


}
