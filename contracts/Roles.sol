// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.6.0;
import "./Libraries/AccessControl.sol";

/// @dev Implements a single role access control contract.
contract Roles is AccessControl {
    string[2] RoleNames = ["TEST_ADMIN_ROLE", "TEST_ROLE"];
    bytes32[2] RolesList = [
        keccak256("TEST_ADMIN_ROLE"),
        keccak256("TEST_ROLE")
    ];

    /// @dev Create the community role, with `root` as a member.
    constructor(address test_admin_role_root, address test_role_root) public {
        _setupRole(RolesList[0], test_admin_role_root, DEFAULT_ADMIN_ROLE);
        _setupRole(RolesList[1], test_role_root, RolesList[0]);
    }

    function getRolesList() public view returns (bytes32[2] memory) {
        return (RolesList);
    }

    function requestJoin(bytes32 role) public {
        _requestJoin(role);
    }

    function getRequests(bytes32 role) public view returns (address[] memory) {
        return (_getRequests(role));
    }

    function acceptRequest(bytes32 role, uint256 index) public onlyAdmin(role) {
        _acceptRequest(role, index);
    }

    function testFunction()
        public
        view
        onlyMember(RolesList[1])
        returns (bool)
    {
        return true;
    }

    function testAdminFunction()
        public
        view
        onlyAdmin(RolesList[1])
        returns (bool)
    {
        return true;
    }
}
