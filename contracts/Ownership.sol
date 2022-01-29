// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.6.0;

contract Ownership {
    address owner;
    mapping(address => bool) public access;

    constructor(address owner_) public {
        owner = owner_;
        access[owner] = true;
    }

    /// @dev Restricted to owner
    modifier onlyOwner() {
        require(msg.sender == owner, "Restricted to Owner.");
        _;
    }

    function allowAccess(address newUser) public onlyOwner {
        access[newUser] = true;
    }

    function checkAccess(address user) public view returns (bool) {
        return access[user];
    }
}
