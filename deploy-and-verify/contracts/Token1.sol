// SPDX-License-Identifier: GPL-3.0

pragma solidity 0.8.12;
import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Token1 is ERC20 {
    constructor() ERC20("TOKEN1", "TOK1") {

    }
    function mint(address account, uint256 amount) external  {
        _mint(account, amount);
    }
    function burn(address account, uint256 amount) external {
        _burn(account, amount);
    }
}
contract Token2 is ERC20 {
    constructor() ERC20("TOKEN2", "TOK2") {

    }
    function mint(address account, uint256 amount) external {
        _mint(account, amount);
    }
    function burn(address account, uint256 amount) external {
        _burn(account, amount);
    }
}
contract Token3 is ERC20 {
    constructor() ERC20("TOKEN3", "TOK3") {

    }
    function mint(address account, uint256 amount) external {
        _mint(account, amount);
    }
    function burn(address account, uint256 amount) external {
        _burn(account, amount);
    }
}
contract Token4 is ERC20 {
    constructor() ERC20("TOKEN4", "TOK4") {

    }
    function mint(address account, uint256 amount) external {
        _mint(account, amount);
    }
    function burn(address account, uint256 amount) external {
        _burn(account, amount);
    }
}
