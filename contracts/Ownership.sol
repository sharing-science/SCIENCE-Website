// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.6.0;

contract Ownership {
    uint256 fileCounter;
    mapping(uint256 => address) public owners;
    mapping(uint256 => uint256) public requestCounters;
    mapping(uint256 => mapping(address => bool)) public access;
    mapping(uint256 => mapping(address => uint256)) public deadline;
    mapping(uint256 => mapping(uint256 => address)) public requests;
    mapping(uint256 => mapping(uint256 => uint256)) public requestTime;

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

    function getFileRequestDays(uint256 fileID)
        public
        view
        returns (uint256[] memory)
    {
        uint256[] memory answer = new uint256[](requestCounters[fileID]);
        for (uint256 i = 0; i < requestCounters[fileID]; ++i){
            answer[i] = requestTime[fileID][i];
        }
        return answer;
    }

    //Owner grants newUser permission without request
    function allowAccess(uint256 fileID, address newUser, uint256 numberOfDays)
        public
        onlyOwner(fileID)
    {
        access[fileID][newUser] = true;
        deadline[fileID][newUser] = now + (numberOfDays * 1 days);
    }

    //Owner addresses request
    function fulfillRequest(
        uint256 fileID,
        uint256 requestID,
        bool approve
    ) public onlyOwner(fileID) {
        if (approve) {
            access[fileID][requests[fileID][requestID]] = true;
            deadline[fileID][requests[fileID][requestID]] = now + (requestTime[fileID][requestID] * 1 days);
        }
        delete requests[fileID][requestID];
        delete requestTime[fileID][requestID];
    }

    //Msg.sender checks access of specified user for given fileID
    function checkAccess(uint256 fileID, address user)
        public
        returns (bool)
    {
        if(access[fileID][user]){
            if(deadline[fileID][user] >= now){
                return true;
            }
            //if access is true but past deadline, update access
            access[fileID][user] = false;
        }
        return false;
    }

    //Msg.sender checks the days remaining of specified user's access for given fileID
    function checkDaysRemaining(uint256 fileID, address user)
        public
        returns (uint256)
    {
        if(checkAccess(fileID, user)){
            return (deadline[fileID][user] - now) / 1 days;
        }
        return 0;
    }

    //Msg.sender requests access to fileID for numberOfDays
    function requestAccess(uint256 fileID, uint256 numberOfDays) public {
        requests[fileID][requestCounters[fileID]] = msg.sender;
        requestTime[fileID][requestCounters[fileID]] = numberOfDays;
        ++requestCounters[fileID];
    }
}
