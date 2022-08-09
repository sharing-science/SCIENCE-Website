// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.6.0;

contract Ownership {
    uint256 fileCounter;
    mapping(uint256 => address) public owners;
    mapping(uint256 => uint256) public requestCounters;
    mapping(uint256 => mapping(address => bool)) public access;
    mapping(uint256 => mapping(uint256 => address)) public requests;

    constructor() public {
        fileCounter = 0;
    }

    /// @dev Restricted to owner
    modifier onlyOwner(uint256 fileID) {
        require(msg.sender == owners[fileID], "Restricted to Account's Owner.");
        _;
    }

    function getFileOwner(uint256 fileID) public view returns (address) {
        return owners[fileID];
    }

    function newFile() public {
        owners[fileCounter] = msg.sender;
        requestCounters[fileCounter] = 0;
        access[fileCounter][msg.sender] = true;
        ++fileCounter;
    }

    function getFileCounter() public view returns (uint256) {
        return fileCounter;
    }

    function getFileRequests(uint256 fileID)
        public
        view
        returns (address[] memory)
    {
        address[] memory answer = new address[](requestCounters[fileID]);
        for (uint256 i = 0; i < requestCounters[fileID]; ++i){
            answer[i] = requests[fileID][i];
        }
        return answer;
    }

    function allowAccess(uint256 fileID, address newUser)
        public
        onlyOwner(fileID)
    {
        access[fileID][newUser] = true;
    }

    function fulfillRequest(
        uint256 fileID,
        uint256 requestID,
        bool approve
    ) public onlyOwner(fileID) {
        if (approve) {
            access[fileID][requests[fileID][requestID]] = true;
        }
        delete requests[fileID][requestID];
    }

    function checkAccess(uint256 fileID, address user)
        public
        view
        returns (bool)
    {
        return access[fileID][user];
    }

    function requestAccess(uint256 fileID) public {
        requests[fileID][requestCounters[fileID]] = msg.sender;
        ++requestCounters[fileID];
    }
}
