// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.6.0;

contract ResearcherRoles {
    enum Role {
        FirstRole,
        SecondRole,
        ThirdRole
    }
    mapping(address => Role) Roles;

    function getAccountRole(address addr) public view returns (string memory) {
        string memory role;
        if (Roles[addr] == Role.FirstRole) role = "FirstRole";
        if (Roles[addr] == Role.SecondRole) role = "SecondRole";
        if (Roles[addr] == Role.ThirdRole) role = "ThirdRole";
        return role;
    }

    function changeAccountRole(uint256 new_role) public {
        if (new_role == 1) {
            Roles[address(msg.sender)] = Role.FirstRole;
        } else if (new_role == 2) {
            Roles[address(msg.sender)] = Role.SecondRole;
        } else if (new_role == 3) {
            Roles[address(msg.sender)] = Role.ThirdRole;
        }
    }
}
