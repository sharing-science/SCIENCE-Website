// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.6.0;

contract Ownership {

    struct File {
        uint256 fileID;
        Perms[] requests;
        Perms[] allowedUsers;
    }

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
    mapping(uint256 => address) public isfileOwner;                         //fileID = Owner
    mapping(address => uint256) public ownerFilesLength;                    //Owner = number of files owned
    mapping(uint256 => File)    public idToFile;                            //fileID = File
    mapping(address => mapping(uint256 => File) ) public ownersFiles;        //Owner, fileID = File


    //mapping(uint256 => uint256) public requestCounters;                     //fileID, Counter       //replaced
    //mapping(uint256 => mapping(address => bool)) public access;             //fileID, User, T/F     //replaced
    //mapping(uint256 => mapping(address => bool)) public isTimedAccess;      //fileID, User, T/F     //replaced
    //mapping(uint256 => mapping(address => uint256)) public deadline;        //fileID, User, Time    //replaced
    //mapping(uint256 => mapping(uint256 => address)) public requests;        //fileId, requestID, requesterAddress   //replaced
    //mapping(uint256 => mapping(uint256 => uint256)) public requestTime;     //fileID, requestID, Time               //replaced
    //mapping(uint256 => mapping(address => uint104)) public typeAccess;      //fileID, User, Type    //replaced


    constructor()  {
        fileCounter = 0;
    }

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
        File memory file = File({
            fileID: _fileID,
            requests: new Perms[](0),
            allowedUsers: new Perms[](0)
        });
        idToFile[_fileID] = file;
        ownersFiles[msg.sender][_fileID] = file;
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
        returns (Perms[] memory)
    {
        address owner = getFileOwner(_fileID);
        File memory file = idToFile[_fileID];
        Perms[] memory answer = file.requests;
        return answer;

        // address[] memory answer = new address[](requestCounters[fileID]);
        // for (uint256 i = 0; i < requestCounters[fileID]; ++i){
        //     answer[i] = requests[fileID][i];
        // }
        // return answer;
    }

    //Update allowedUsers list in file
    function addAllowedPerm(uint256 _fileID, Perms memory _newPerm) public {
        //Get File
        File memory file = idToFile[_fileID];
        
        //Create new list with +1 len
        Perms[] memory newAllowedUsers = new Perms[](file.allowedUsers.length + 1);
        //Copy old list into new list
        for (uint i = 0; i < file.allowedUsers.length; i++) {
            newAllowedUsers[i] = file.allowedUsers[i];
        }
        //Add new Perm
        newAllowedUsers[file.allowedUsers.length] = _newPerm;
        
        //Update Original List
        file.allowedUsers = newAllowedUsers;
    }

    //Update requests list in file
    function addRequestPerm(uint256 _fileID, Perms memory _newPerm) public {
        //Get File
        File memory file = idToFile[_fileID];
        
        //Create new list with +1 len
        Perms[] memory newRequests = new Perms[](file.requests.length + 1);
        //Copy old list into new list
        for (uint i = 0; i < file.requests.length; i++) {
            newRequests[i] = file.requests[i];
        }
        //Add new Perm
        newRequests[file.requests.length] = _newPerm;
        
        //Update Original List
        file.requests = newRequests;
    }

    //Owner grants newUser permission without request
    function allowAccess(uint256 _fileID, address _user, uint104 _type)
        public
        onlyOwner(_fileID)
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
        addAllowedPerm(_fileID, newPerm);
    }

    //Owner grants newUser timed permission without request
    function allowLimitedAccess(uint256 _fileID, address _user, uint256 _numberOfDays, uint104 _type)
        public
        onlyOwner(_fileID)
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
        addAllowedPerm(_fileID, newPerm);
    }

    //Owner removes newUser permission
    function removeAccess(uint256 _fileID, address _user)
        public          view          onlyOwner(_fileID)
    {
        File memory file = idToFile[_fileID];
        for (uint i = 0; i < file.allowedUsers.length; i++) {
            if (file.allowedUsers[i].user == _user) {
                delete file.allowedUsers[i];
                break;
            }
        }
    }

    //Owner addresses request
    function fulfillRequest(uint256 _fileID, uint256 _requestID, bool _approve)
        public
        onlyOwner(_fileID)
    {
        File memory file = idToFile[_fileID];
        //Find request
        for (uint i = 0; i < file.requests.length; i++) {
            if (file.requests[i].id == _requestID) { //Request found
                if(_approve){
                    file.requests[i].isAllowed = true;
                    if(file.requests[i].isTimed){
                        file.requests[i].deadline = block.timestamp + (file.requests[i].time * 1 days);
                    }
                    addAllowedPerm(_fileID, file.requests[i]);
                }
                delete file.requests[i]; //Will this delete the Perm moved to isAllowed list as well?!?!?! if so: make copy, delete OG, push copy to isAllowed
                break;
            }
        }
    }

    //Msg.sender checks access of specified user for given fileID
    function checkAccess(uint256 _fileID, address _user)
        public
        returns (bool)
    {
        File memory file = idToFile[_fileID];
        for (uint i = 0; i < file.allowedUsers.length; i++) {
            if (file.allowedUsers[i].user == _user) {
                if(file.allowedUsers[i].isTimed){
                    if(file.allowedUsers[i].deadline >= block.timestamp){
                        return true;
                    }
                    delete file.allowedUsers[i];
                    return false;
                }
                return true;
            }
        }
        return false;
    }

    //NEEDS ADJUSTMENT!!!!!!!!!!!!!!!!
    //Msg.sender checks the days remaining of specified user's access for given fileID
    function checkDaysRemaining(uint256 _fileID, address _user)
        public
        returns (uint256)
    {
        if(checkAccess(_fileID, _user) && true/*isTimedAccess[fileID][user] == true*/){ //needs adjustment!!!!!!!
            return (block.timestamp/*deadline[fileID][user]*/ - block.timestamp) / 1 days;
        }
        return 0;
    }

    //Msg.sender requests access to fileID for numberOfDays
    function requestAccess(uint256 _fileID, uint104 _type) public {
        Perms memory newPerm = Perms({
            id: requestIDCounter++, //will this do what I want?!?!?!
            user: msg.sender,
            fileType: _type,
            isTimed: false,
            time: 0,
            deadline: 0,
            isAllowed: false
        });
        addRequestPerm(_fileID, newPerm);
    }

    //Msg.sender requests limited access to fileID for numberOfDays
    function requestLimitedAccess(uint256 _fileID, uint256 _numberOfDays, uint104 _type) public {
        Perms memory newPerm = Perms({
            id: requestIDCounter++, //will this do what I want?!?!?!
            user: msg.sender,
            fileType: _type,
            isTimed: true,
            time: _numberOfDays,
            deadline: 0,
            isAllowed: false
        });
        addRequestPerm(_fileID, newPerm);
    }
}