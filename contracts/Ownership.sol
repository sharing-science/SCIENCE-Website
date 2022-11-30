// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.6.0;

contract Ownership {
    uint256 fileCounter;
    mapping(uint256 => address) public owners;
    mapping(uint256 => uint256) public requestCounters;
    mapping(uint256 => mapping(address => bool)) public access;
    mapping(uint256 => mapping(address => bool)) public isTimedAccess;
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
        //isTimedAccess[fileCounter][msg.sender] = false;
        //deadline[fileCounter][msg.sender] = 0;
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

    //NOT CURRENTLY IN USE
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
    function allowAccess(uint256 fileID, address newUser)
        public
        onlyOwner(fileID)
    {
        access[fileID][newUser] = true;
    }

    //NOT CURRENTLY IN USE
    //Owner grants newUser timed permission without request
    function allowLimitedAccess(uint256 fileID, address newUser, uint256 numberOfDays)
        public
        onlyOwner(fileID)
    {
        access[fileID][newUser] = true;
        isTimedAccess[fileID][newUser] = true;
        deadline[fileID][newUser] = block.timestamp + (numberOfDays * 1 days);
    }

    //Owner addresses request
    function fulfillRequest(
        uint256 fileID,
        uint256 requestID,
        bool approve
    ) public onlyOwner(fileID) {
        address requester = requests[fileID][requestID];
        if (approve) {
            access[fileID][requester] = true;
            if(isTimedAccess[fileID][requester] == true){
                deadline[fileID][requester] = block.timestamp + (requestTime[fileID][requestID] * 1 days);
            }
        }
        if(isTimedAccess[fileID][requester] == true) {delete requestTime[fileID][requestID];}
        delete requests[fileID][requestID];
    }

    //Msg.sender checks access of specified user for given fileID
    function checkAccess(uint256 fileID, address user)
        public
        returns (bool)
    {
        if(access[fileID][user]){
            if(isTimedAccess[fileID][user] == true){
                if(deadline[fileID][user] >= block.timestamp){
                    return true;
                }
                access[fileID][user] = false;
                return false;
            }     
            return true;       
        }
        return false;
    }

    //NOT CURRENTLY IN USE
    //Msg.sender checks the days remaining of specified user's access for given fileID
    function checkDaysRemaining(uint256 fileID, address user)
        public
        returns (uint256)
    {
        if(checkAccess(fileID, user) && isTimedAccess[fileID][user] == true){
            return (deadline[fileID][user] - block.timestamp) / 1 days;
        }
        return 0;
    }

    //Msg.sender requests access to fileID for numberOfDays
    function requestAccess(uint256 fileID) public {
        requests[fileID][requestCounters[fileID]] = msg.sender;
        isTimedAccess[fileID][msg.sender] = false;  //not totally necessary because automatically set to false
        ++requestCounters[fileID];
    }

    //Msg.sender requests limited access to fileID for numberOfDays
    function requestLimitedAccess(uint256 fileID, uint256 numberOfDays) public {
        requestTime[fileID][requestCounters[fileID]] = numberOfDays;
        requests[fileID][requestCounters[fileID]] = msg.sender;
        isTimedAccess[fileID][msg.sender] = true;
        ++requestCounters[fileID];
    }
}
