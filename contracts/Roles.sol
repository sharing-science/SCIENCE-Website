// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.6.0;
pragma experimental ABIEncoderV2;
import "./Libraries/AccessControl.sol";

/// @dev Implements a single role access control contract.
contract Roles is AccessControl {
    uint8 numRoles = 1;
    string[] RoleNames = ["DEFAULT_ADMIN_ROLE"];
    bytes32[] RolesEncodings = [keccak256("DEFAULT_ADMIN_ROLE")];

    /// @dev Create the community role, with `root` as a member.
    constructor(address adminAccount) public {
        _setupRole(DEFAULT_ADMIN_ROLE, adminAccount, DEFAULT_ADMIN_ROLE);
    }

    function addRole(
        string memory roleName,
        bytes32 roleEncoding,
        address account,
        bytes32 adminRole
    ) public onlyMember(adminRole) {
        ++numRoles;
        RoleNames.push(roleName);
        RolesEncodings.push(roleEncoding);
        _setupRole(roleEncoding, account, adminRole);
    }

    // View functions
    function getUsersRoles(address user)
        public
        view
        returns (bytes32[] memory)
    {
        bytes32[] memory answer;
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
        returns (bytes32[] memory)
    {
        return (RolesEncodings);
    }

    function getRolesNames() public view returns (string[] memory) {
        return (RoleNames);
    }

    // Requests
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
