// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.6.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MyToken is ERC20 {
    constructor(uint256 initialSupply) public ERC20("Kudos Tokens", "KUD") {
        _mint(msg.sender, initialSupply);
        _setupDecimals(0);
    }
}
