// SPDX-License-Identifier: MIT
pragma solidity >=0.6.0;

contract Covid19usecase {
    uint256 clauseCount = 0;
    uint256 stateCount = 0;
    uint256 reportCount = 0;

    struct Clause {
        uint256 id;
        string content;
        bool agree;
    }

    struct State {
      uint id;
      string name;
    }

    mapping(uint => State) public ContractStates;

    string public stateName;
    uint public Number=0;

    struct Report {
      uint256 id;
      string reportType;
      string reportAccount;
      string reportReason;
    }

    mapping(uint => Report) public Reports;

    constructor() public {
        createClause(
            "For each proposed Research Project, User(s) agree(s) to submit a Data Use Request to the Data Access Committee for review and approval to access the Data."
        );
        createClause(
            "User(s) agree(s) to not attempt to contact any individuals who are the subjects of the Data, any known living relatives, any Data Contributors, or healthcare providers unless required by law to maintain public health and safety. User(s) agree to report any unauthorized access use(s) or disclosure(s) of the Data by other users (collaborator) to the Data Access Committee no later than 2 business days after discovery. The occurrence of a Data Access Incident is ground for suspension of fifteen days of any access to Data."
        );
        createClause(
            "Except as required by law, User(s) shall not grant access to the Data to any third party without the prior written permission submitted by the users to the Data Access Committee. User(s) agree to report any unauthorized access use(s) or disclosure(s) of the Data by the third party to the Data Access Committee no later than 2 business days after discovery. The occurrence of a Data Access Incident is ground for termination of any access to Data."
        );
        createClause(
            "The Data Use Request will remain in effect for a period of five (5) years from the Data Use Request Effective Date and will automatically expire at the end of this period unless terminated or renewed."
        );
        createClause(
            "User(s) agree(s) to recognize the effort that Data Contributor(s) made in collecting and providing the Data and allow the following information in the approved Data Use Request to be made publicly available: non-confidential research statement of the Research Project, Project Title, Users names and Accessing Institution(s)"
        );
        createState("NotReady");
        createState("ReadyforRequireRequest");
        createState("ReadyforSubmitRequest");
        createState("ReadyforReview");
        createState("Active");
        createState("Inactive");
        stateName=ContractStates[1].name;
    }

    mapping(uint256 => Clause) public clauses;

    event ClauseCreated(uint256 id, string content, bool agree);

    event RequestSumbitted(uint256 id);

    function getClauseCount() public view returns (uint256) {
        return clauseCount;
    }

    function getClause(uint256 num) public view returns (string memory) {
        return clauses[num].content;
    }

    function getReportCount() public view returns (uint256) {
        return reportCount;
    }

    function getReportId(uint256 num) public view returns (uint256) {
        return Reports[num].id;
    }

    function getReportType(uint256 num) public view returns (string memory) {
        return Reports[num].reportType;
    }

    function getReportAccount(uint256 num) public view returns (string memory) {
        return Reports[num].reportAccount;
    }

    function getReportReason(uint256 num) public view returns (string memory) {
        return Reports[num].reportReason;
    }
/*
    function getState() public view returns (contractState) {
        return State;
    }
*/
    function createClause(string memory _content) public {
        clauseCount++;
        clauses[clauseCount] = Clause(clauseCount, _content, false);
        emit ClauseCreated(clauseCount, _content, false);
    }

    function createState(string memory _name) public {
      stateCount ++;
      ContractStates[stateCount] = State(stateCount,_name);
    }
/*
    function agreeClause1(bool agree) public {
        if (agree) {
            State = contractState.ReadyforRequireRequest;
        }
    }*/

    function acceptClause(uint256 id) public {
        clauses[id].agree = true;
    }
/*
    function submitRequest(uint256 _id) public {
        State = contractState.ReadyforReview;
        emit RequestSumbitted(_id);
    }*/

    function getClauseStatus(uint256 id) public view returns (bool) {
        return clauses[id].agree;
    }

    function changeState(uint id) public {
      stateName=ContractStates[id].name;
      //Number=1;
    }

    function getStateName() public view returns (string memory){
      return stateName;
    }

    function getClauseAgree(uint i) public view returns (bool) {
      return clauses[i].agree;
    }

    function getNumber() public view returns (uint){
      return Number;
    }

    //Clause 2 and 3
    function AddReport(string memory _type, string memory _account, string memory _name) public{
      reportCount++;
      Reports[reportCount] = Report(clauseCount, _type, _account, _name);
    }


}
