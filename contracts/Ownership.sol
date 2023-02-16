// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.6.0;

pragma experimental ABIEncoderV2;

contract Ownership {

    struct Perms{
        uint     id;
        address  user;
        uint104  fileType;
        bool     isTimed;
        uint256  time;
        uint256  deadline;
        bool     isAllowed;
    }
    
    uint256 fileCounter = 0;  //Do i need to initialize?!?!?!!
    uint requestIDCounter = 0;
    uint constant PERM_LENGTH = 50;
    mapping(uint256 => address) public isfileOwner;                         //fileID = Owner
    //mapping(address => uint256[]) public ownersFiles;                     //Owner = fileID //NEEDS TO BE IMPLEMENTED EVENTUALLY
    
    mapping(uint256 => Perms[PERM_LENGTH]) public fileRequests;                      //fileID = requests
    mapping(uint256 => uint104) public fileRequestCounter;                  //fileID = requestsCounter

    mapping(uint256 => Perms[PERM_LENGTH]) public fileAllowed;                       //fileID = allowedUsers
    mapping(uint256 => uint104) public fileAllowedCounter;                  //fileID = allowedCounter

    mapping(address => uint256) public ownerFilesLength;                    //Owner = number of files owned


    // constructor() public {
    //     fileCounter = 0;
    // }

    /// @dev Restricted to owner
    modifier onlyOwner(uint256 _fileID) {
        require(msg.sender == isfileOwner[_fileID], "Restricted to Account's Owner.");
        _;
    }

    function getFileOwner(uint256 _fileID) public view returns (address) {
        return isfileOwner[_fileID];
    }

    
    function newFile(uint256 _fileID) public { //take in HashID argument
        isfileOwner[_fileID] = msg.sender;
        // fileRequests[_fileID] = new Perms[](0);
        // fileAllowed[_fileID] = new Perms[](0);

        fileRequestCounter[_fileID] = 0;
        fileAllowedCounter[_fileID] = 0;

       ++ownerFilesLength[msg.sender];
        ++fileCounter;
    }

    //Not necessary for operations
    function getFileCounter() public view returns (uint256) {
        return fileCounter;
    }


    function getFileRequests(uint256 _fileID)
        public
        view
        returns (Perms[50] memory)
    {
        //address owner = getFileOwner(_fileID);
        Perms[50] memory answer = fileRequests[_fileID];
        return answer;
    }

    //Update allowedUsers list in file
    function addAllowedPerm(uint256 _fileID, Perms memory _newPerm) public returns(bool) {
        //Add new Perm
        if(fileAllowedCounter[_fileID] < PERM_LENGTH){
            fileAllowed[_fileID][fileAllowedCounter[_fileID]++] = _newPerm;
            return true;
        }
        return false;
    }

    //Update requests list in file
    function addRequestPerm(uint256 _fileID, Perms memory _newPerm) public returns(bool) {
        if(fileRequestCounter[_fileID] < PERM_LENGTH){
            fileRequests[_fileID][fileRequestCounter[_fileID]++] = _newPerm;
            return true;
        }
        return false;
        // //Create new list with +1 len
        // Perms[] memory newRequests = new Perms[](fileRequests[_fileID].length + 1);

        // //Copy old list into new list
        // for (uint i = 0; i < fileRequests[_fileID].length; i++) {
        //     newRequests[i] = fileRequests[_fileID][i];
        // }
        // //Add new Perm
        // newRequests[fileRequests[_fileID].length] = _newPerm;
        
        // //Update Original List
        // delete fileRequests[_fileID];
        // fileRequests[_fileID] = newRequests;
    }

    //Owner grants newUser permission without request
    function allowAccess(uint256 _fileID, address _user, uint104 _type)
        public
        onlyOwner(_fileID)
        returns(bool)
    {
        //Create new Perm
        Perms memory newPerm = Perms({
            id: requestIDCounter++, //will this do what I want?!?!?!
            user: _user,
            fileType: _type,
            isTimed: false,
            time: 0,
            deadline: 0,
            isAllowed: true
        });
        return addAllowedPerm(_fileID, newPerm);
    }

    //Owner grants newUser timed permission without request
    function allowLimitedAccess(uint256 _fileID, address _user, uint256 _numberOfDays, uint104 _type)
        public
        onlyOwner(_fileID)
        returns(bool)
    {
        Perms memory newPerm = Perms({
            id: requestIDCounter++, //will this do what I want?!?!?!
            user: _user,
            fileType: _type,
            isTimed: true,
            time: _numberOfDays,
            deadline: ( block.timestamp + (_numberOfDays * 1 days) ),
            isAllowed: true
        });
        return addAllowedPerm(_fileID, newPerm);
    }

    //Owner removes newUser permission
    function removeAccess(uint256 _fileID, address _user)
        public          onlyOwner(_fileID)
        returns(bool)
    {
        for (uint i = 0; i < fileAllowed[_fileID].length; i++) {
            if (fileAllowed[_fileID][i].user == _user) {
                //Replace this with end, delete end: [i] = [counter], delete [counter]
                fileAllowed[_fileID][i] = fileAllowed[_fileID][(--fileAllowedCounter[_fileID])];
                delete fileAllowed[_fileID][fileAllowedCounter[_fileID]];
                return true;
            }
        }
        return false;
    }

    //Owner addresses request
    function fulfillRequest(uint256 _fileID, uint256 _requestID, bool _approve)
        public        onlyOwner(_fileID)
        returns(bool)
    {
        bool answer = false;
        //Find request
        for (uint i = 0; i < fileRequests[_fileID].length; i++) {
            if (fileRequests[_fileID][i].id == _requestID) { //Request found
                if(_approve){
                    fileRequests[_fileID][i].isAllowed = true;
                    //If timed, start timer
                    if(fileRequests[_fileID][i].isTimed){
                        fileRequests[_fileID][i].deadline = block.timestamp + (fileRequests[_fileID][i].time * 1 days);
                    }
                    //Try to move perm from requests to Allowed
                    answer = addAllowedPerm(_fileID, fileRequests[_fileID][i]);
                }
                //Remove request Perm regardless of if it was accepted and able to be added or not; we are done with the request
                fileRequests[_fileID][i] = fileRequests[_fileID][(--fileRequestCounter[_fileID])];
                delete fileRequests[_fileID][fileRequestCounter[_fileID]];
                break;
            }
        }
        return answer;
    }

    //Msg.sender checks access of specified user for given fileID
    function checkAccess(uint256 _fileID, address _user)
        public        returns (bool)
    {
        for (uint i = 0; i < fileAllowed[_fileID].length; i++) {
            if (fileAllowed[_fileID][i].user == _user) {
                if(fileAllowed[_fileID][i].isTimed){
                    if(fileAllowed[_fileID][i].deadline >= block.timestamp){
                        return true;
                    }
                    fileAllowed[_fileID][i] = fileAllowed[_fileID][(--fileAllowedCounter[_fileID])];
                    delete fileAllowed[_fileID][fileAllowedCounter[_fileID]];
                    return false;
                }
                return true;
            }
        }
        //If here, couldnt find
        return false;
    }

    //Msg.sender checks the days remaining of specified user's access for given fileID
    //Returns zero if no days remaining or 100000 if not timed
    function checkDaysRemaining(uint256 _fileID, address _user)
        public        returns (uint256)
    {
        for (uint i = 0; i < fileAllowed[_fileID].length; i++) {
            if (fileAllowed[_fileID][i].user == _user) {
                if(fileAllowed[_fileID][i].isTimed){
                    if(fileAllowed[_fileID][i].deadline >= block.timestamp){
                        //If allowed timed and not past deadine:
                        return (fileAllowed[_fileID][i].deadline - block.timestamp) / 1 days;
                    }
                    //If Allowed timed but past deadline:
                    fileAllowed[_fileID][i] = fileAllowed[_fileID][(--fileAllowedCounter[_fileID])];
                    delete fileAllowed[_fileID][fileAllowedCounter[_fileID]];
                    return 0;
                }
                //If allowed but not timed:
                return 100000;
            }
        }
        //If not in allowed:
        return 0;
    }

    //Msg.sender requests access to fileID for numberOfDays
    function requestAccess(uint256 _fileID, uint104 _type) public returns(bool) {
        Perms memory newPerm = Perms({
            id: requestIDCounter++, //will this do what I want?!?!?!
            user: msg.sender,
            fileType: _type,
            isTimed: false,
            time: 0,
            deadline: 0,
            isAllowed: false
        });
        return addRequestPerm(_fileID, newPerm);
    }

    //Msg.sender requests limited access to fileID for numberOfDays
    function requestLimitedAccess(uint256 _fileID, uint256 _numberOfDays, uint104 _type) public returns(bool) {
        Perms memory newPerm = Perms({
            id: requestIDCounter++, //will this do what I want?!?!?!
            user: msg.sender,
            fileType: _type,
            isTimed: true,
            time: _numberOfDays,
            deadline: 0,
            isAllowed: false
        });
        return addRequestPerm(_fileID, newPerm);
    }
}