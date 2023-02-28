// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.6.0;

pragma experimental ABIEncoderV2;

contract Ownership {

    struct Perms{
        uint     id;
        uint256 fileID;
        address  user;
        uint104  fileType;
        bool     isTimed;
        uint256  time;
        uint256  deadline;
        bool     isAllowed;
    }
    
    uint256 fileCounter = 0;
    uint requestIDCounter = 0;
    uint constant PERM_LENGTH = 50;
    uint constant FILE_LENGTH = 50;

    mapping(uint256 => address) public isfileOwner;                         //fileID = Owner
    mapping(address => uint256[FILE_LENGTH]) public ownersFiles;            //Owner = fileID //NEEDS TO BE IMPLEMENTED EVENTUALLY
    mapping(address => uint) public ownerFilesLength;                       //Owner = number of files owned
    
    mapping(uint256 => Perms[PERM_LENGTH]) public fileRequests;             //fileID = requests
    mapping(uint256 => uint) public fileRequestCounter;                     //fileID = requestsCounter

    mapping(uint256 => Perms[PERM_LENGTH]) public fileAllowed;              //fileID = allowedUsers
    mapping(uint256 => uint104) public fileAllowedCounter;                  //fileID = allowedCounter

    mapping(address => mapping(uint => uint256)) public filesAccessed;      //Address = FileID[i] (List of users files)
    mapping(address => uint) public fileAccessCounter;                      //Address = counter


    //Test testing push from desktop to pull on remote
    //ownersFiles[0x1e53025688ca6e730139a97d6830b02ee9323760][0] = 1; 

    /// @dev Restricted to owner
    modifier onlyOwner(uint256 _fileID) {
        require(msg.sender == isfileOwner[_fileID], "Restricted to Account's Owner.");
        _;
    }

    function getFileOwner(uint256 _fileID) public view returns (address) {
        return isfileOwner[_fileID];
    }

    function getOwnerFileLength() public view returns (uint) {
        return ownerFilesLength[msg.sender];
    }

    function getOwnersFiles() public view returns (uint256[FILE_LENGTH] memory) {
        return ownersFiles[msg.sender];
    }

    function getFileRequestLength(uint256 _fileID) public view returns (uint) {
        return fileRequestCounter[_fileID];
    }
    
    function getFileRequest(uint256 _fileID, uint _requestID)
        public
        view
        returns (Perms memory)
    {
        Perms memory answer = fileRequests[_fileID][_requestID];
        return answer;
    }

    function getFileAllowedLength(uint256 _fileID) public view returns (uint) {
        return fileAllowedCounter[_fileID];
    }
    
    function getFileAllowed(uint256 _fileID, uint _requestID)
        public
        view
        returns (Perms memory)
    {
        Perms memory answer = fileAllowed[_fileID][_requestID];
        return answer;
    }

    function getFileCounter() public view returns (uint){
        return fileCounter;
    }

    function getAllRequests() public view returns (Perms[] memory){
        uint256[FILE_LENGTH] memory files = getOwnersFiles();
        uint fileLength = getOwnerFileLength();
        uint totalPermsCount = 0;

        //Get number of total Perms under owner
        for (uint i = 0; i < fileLength; ++i) {
            uint currentFile = files[i];
            uint fileRequestLength = getFileRequestLength(currentFile);
            totalPermsCount += fileRequestLength;
        }

        //Combine all Perms into answer
        Perms[] memory answer = new Perms[](totalPermsCount);
        uint index = 0;
        for (uint i = 0; i < fileLength; ++i) {
            uint currentFile = files[i];
            uint fileRequestLength = getFileRequestLength(currentFile);
            for(uint requestID = 0; requestID < fileRequestLength; ++requestID){
                answer[index] = getFileRequest(currentFile, requestID);
                index++;
            }
        }
        return answer;
    }

    function getAllAllowed() public view returns (Perms[] memory) {
        uint256[FILE_LENGTH] memory files = getOwnersFiles();
        uint fileLength = getOwnerFileLength();
        uint totalPermsCount = 0;

        //Get number of total Perms under owner
        for (uint i = 0; i < fileLength; ++i) {
            uint currentFile = files[i];
            uint fileAllowedLength = getFileAllowedLength(currentFile);
            totalPermsCount += fileAllowedLength;
        }

        //Combine all Perms into answer
        Perms[] memory answer = new Perms[](totalPermsCount);
        uint index = 0;
        for (uint i = 0; i < fileLength; ++i) {
            uint currentFile = files[i];
            uint fileRequestLength = getFileAllowedLength(currentFile);
            for(uint requestID = 0; requestID < fileRequestLength; ++requestID){
                answer[index] = getFileAllowed(currentFile, requestID);
                index++;
            }
        }
        return answer;
    }

    //Takes user and owner address
    //Returns all the files user has once gotten from owner
    function getUserOwnerAccessed(address _user, address _owner) public view returns(uint256[] memory) {
        //Get number of matches
        uint matches = 0;
        //Go through all files _user accesses
        for(uint i = 0; i < fileAccessCounter[_user]; i++) {
            uint256 currentUserFile = filesAccessed[_user][i];
            //Go through all files of _owner
            for(uint h = 0; h < ownerFilesLength[_owner]; h++){
                uint currentOwnerFile = ownersFiles[_owner][h];
                //If match user file with owner file
                if(currentUserFile == currentOwnerFile){
                    matches++;
                }
            }
        }

        //Get list of fileIDs _user owes _owner
        uint256[] memory answer = new uint256[](matches);
        uint index = 0;
        //Go through all files _user accesses
        for(uint i = 0; i < fileAccessCounter[_user]; i++) {
            uint256 currentUserFile = filesAccessed[_user][i];
            //Go through all files of _owner
            for(uint h = 0; h < ownerFilesLength[_owner]; h++){
                uint currentOwnerFile = ownersFiles[_owner][h];
                //If match user file with owner file
                if(currentUserFile == currentOwnerFile){
                    answer[index++] = currentUserFile;
                }
            }
        }
        return answer;
    }

    //Takes _user address
    //Returns all fileID's given to _user
    function getAllUserAccessed(address _user) public view returns(uint256[] memory) {
        uint256[] memory answer = new uint256[](fileAccessCounter[_user]);
        for(uint i = 0; i < fileAccessCounter[_user]; i++) {
            answer[i] = filesAccessed[_user][i];
        }
        return answer;
    }

    function newFile(uint256 _fileID) public returns(bool) { //take in HashID argument
        if(ownerFilesLength[msg.sender] == FILE_LENGTH){
            return false;
        }
        isfileOwner[_fileID] = msg.sender;
        // fileRequests[_fileID] = new Perms[](0);
        // fileAllowed[_fileID] = new Perms[](0);

        fileRequestCounter[_fileID] = 0;
        fileAllowedCounter[_fileID] = 0;
        
        ownersFiles[msg.sender][ownerFilesLength[msg.sender]] = _fileID;
        ++ownerFilesLength[msg.sender];
        ++fileCounter;
        return true;
    }

    //Update allowedUsers list in file
    function addAllowedPerm(uint256 _fileID, Perms memory _newPerm) public returns(bool) {
        //Add new Perm
        if(fileAllowedCounter[_fileID] < PERM_LENGTH){
            fileAllowed[_fileID][fileAllowedCounter[_fileID]++] = _newPerm;
            //Store for user side
            filesAccessed[_newPerm.user][fileAccessCounter[_newPerm.user]++] = _fileID;
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
            fileID: _fileID,
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
            fileID: _fileID,
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
            fileID: _fileID,
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
            fileID: _fileID,
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