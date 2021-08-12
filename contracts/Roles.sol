// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.6.0;
pragma experimental ABIEncoderV2;
import "./Libraries/AccessControl.sol";

/// @dev Implements a single role access control contract.
contract Roles is AccessControl {
    uint8 constant numRoles = 2;
    string[numRoles] RoleNames = ["TEST_ADMIN_ROLE", "TEST_ROLE"];
    bytes32[numRoles] RolesEncodings = [
        keccak256("TEST_ADMIN_ROLE"),
        keccak256("TEST_ROLE")
    ];

    /// @dev Create the community role, with `root` as a member.
    constructor(address test_admin_role_root, address test_role_root) public {
        _setupRole(RolesEncodings[0], test_admin_role_root, DEFAULT_ADMIN_ROLE);
        _setupRole(RolesEncodings[1], test_role_root, RolesEncodings[0]);
    }

    function getUsersRoles(address user)
        public
        view
        returns (bytes32[numRoles] memory)
    {
        bytes32[numRoles] memory answer;
        uint8 position = 0;
        for (uint256 i = 0; i < RolesEncodings.length; ++i) {
            if (hasRole(RolesEncodings[i], user)) {
                answer[position] = RolesEncodings[i];
                ++position;
            }
        }
        return answer;
    }

    function getRolesEncodings()
        public
        view
        returns (bytes32[numRoles] memory)
    {
        return (RolesEncodings);
    }

    function getRolesNames() public view returns (string[numRoles] memory) {
        return (RoleNames);
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
        onlyMember(RolesEncodings[1])
        returns (bool)
    {
        return true;
    }

    function testAdminFunction()
        public
        view
        onlyAdmin(RolesEncodings[1])
        returns (bool)
    {
        return true;
    }
}
