// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.6.0;
pragma experimental ABIEncoderV2;

//POSSIBLE IMPROVEMENTS:
//keep track of number of invalid reports from each reporter
//give reporter rep penalty after certain number of misreports ( requires new function called in attemptDecision() )
contract Rating {
    address public admin;

    struct Report {
        address defendant;
        string cid;
        address reporter;
        string reason;
        uint reportId;
        uint yes_votes;
        uint no_votes;
    }

    Report[] public reports;
    uint public reportsCount = 0;
    mapping(address => uint) public rep;
    uint public totalRep = 0;
    mapping(address => bool) public isCommittee;
    uint public numMembers = 0;

    uint constant DEFENDANT_PENALTY = 1;
    uint constant REPORTER_PENALTY = 1;
    uint constant REPORTER_REWARD = 1;
    uint constant VOTE_REWARD = 1;

    constructor() {
        admin = msg.sender; // set the contract deployer as admin
    }

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can call this function");
        _;
    }

    modifier onlyCommittee() {
        require(isCommittee[msg.sender], "Only committee member can call this function");
        _;
    }

    function getRep(address _addr) public view returns (uint) {
        return rep[_addr];
    }

    function getNumMembers() public view returns(uint) {
        return numMembers;
    }

    //REPORT LIST FUNCTIONS:::
    function createReport(address _defendant, string memory _cid, address _reporter, string memory _reason) public returns(uint) {
        reportsCount++;
        Report memory newReport = Report(_defendant, _cid, _reporter, _reason, reportsCount, 0, 0);
        reports.push(newReport);
        return reportsCount;
    }

    function addToList(Report memory _report) public {
        reportsCount++;
        _report.reportId = reportsCount;
        reports.push(_report);
    }

    function getReports() public view onlyCommittee returns(Report[] memory) {
        return reports;
    }

    function getNumReports() public view returns(uint) {
        return reportsCount;
    }

    // function removeReport(uint _reportId) public {
    //     for (uint i = 0; i < reports.length; i++) {
    //         if (reports[i].reportId == _reportId) {
    //             delete reports[i];
    //             break;
    //         }
    //     }
    // }

    //VOTING FUNCTIONS:::
    function approveOrDismiss(uint _reportId, bool _approved) public onlyCommittee {
        //Handle vote:
        if (_approved) {
            reports[_reportId].yes_votes++;
        } else {
            reports[_reportId].no_votes++;
        }
        attemptDecision(_reportId);

        //Committee Member reward:
        rep[msg.sender] += VOTE_REWARD;
        totalRep += VOTE_REWARD;
    }

    function attemptDecision(uint _reportId) public  {  //
        if(reports[_reportId].yes_votes == 3){//report validated
            rep[reports[_reportId].reporter] += REPORTER_REWARD;
            rep[reports[_reportId].defendant] -= DEFENDANT_PENALTY;
            totalRep = totalRep + REPORTER_REWARD - DEFENDANT_PENALTY;
            delete reports[_reportId];
        }else if(reports[_reportId].no_votes == 3){
            //reporter penalty?
            delete reports[_reportId];
        }
    }

    // COMMITTEE FUNCTIONS:::
    function applyCM(address _user) public returns(bool) {
        if(isCommittee[_user]){
            return false;
        }
        if(numMembers < 5){
            isCommittee[_user] = true;
            numMembers += 1;
            return true;
        }
        if(numMembers < 10 && rep[_user] >= 1){
            isCommittee[_user] = true;
            numMembers += 1;
            return true;
        }
        if(numMembers < 15 && rep[_user] >= 2){
            isCommittee[_user] = true;
            numMembers += 1;
            return true;
        }
        return false;
    }

    function addCM(address _user) public onlyAdmin {
        if(isCommittee[_user] == false){
            isCommittee[_user] = true;
            numMembers += 1;
        }
    }

    function removeCM(address _user) public onlyAdmin {
        if(isCommittee[_user]){
            isCommittee[_user] = false;
            numMembers -= 1;
        }
    }

}
