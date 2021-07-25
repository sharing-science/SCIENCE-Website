// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.6.0;
import "@openzeppelin/contracts/access/AccessControl.sol";

/// @dev Implements a single role access control contract.
contract Community is AccessControl {
    string private roleName;

    /// @dev Create the community role, with `root` as a member.
    constructor(address root, string memory _roleName) public {
        _setupRole(DEFAULT_ADMIN_ROLE, root);
        roleName = _roleName;
    }

    /// @dev Restricted to members of the community.
    modifier onlyMember() {
        require(isMember(msg.sender), "Restricted to members.");
        _;
    }

    /// @dev Return `true` if the `account` belongs to the community.
    function isMember(address account) public view virtual returns (bool) {
        return hasRole(DEFAULT_ADMIN_ROLE, account);
    }

    /// @dev Add a member of the community.
    function addMember(address account) public virtual onlyMember {
        grantRole(DEFAULT_ADMIN_ROLE, account);
    }

    /// @dev Remove oneself as a member of the community.
    function leaveCommunity() public virtual {
        renounceRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }

    function returnRoleName() public view returns (string memory) {
        return roleName;
    }
}
