// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract KOLNET is ERC20 {
    constructor() ERC20("KOLNET", "KOL") {}

    function mint(address to, uint256 amount) public {
        _mint(to, amount);
    }
    function burn(uint256 amount) external {
        _burn(msg.sender, amount);
    }


    
}