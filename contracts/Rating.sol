// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.6.0;
pragma experimental ABIEncoderV2;

contract Rating {

    struct Report {
        address defendant;
        string cid;
        address reporter;
        string reason;
        uint reportId;
    }

    Report[] public reports;
    mapping(address => uint) public rep;
    uint public reportsCount = 0;

    function createReport(address _defendant, string memory _cid, address _reporter, string memory _reason) public returns(uint) {
        reportsCount++;
        Report memory newReport = Report(_defendant, _cid, _reporter, _reason, reportsCount);
        reports.push(newReport);
        return reportsCount;
    }

    function addToList(Report memory _report) public {
        reportsCount++;
        _report.reportId = reportsCount;
        reports.push(_report);
    }

    function getList() public view returns (Report[] memory) {
        return reports;
    }

    function remove(uint _reportId) public {
        for (uint i = 0; i < reports.length; i++) {
            if (reports[i].reportId == _reportId) {
                delete reports[i];
                break;
            }
        }
    }

    function approveOrDismiss(uint _reportId, bool _approved) public {
        address defendant = reports[_reportId].defendant;
        if (_approved) {
            rep[defendant]++;
        } else {
            rep[defendant]--;
        }
        remove(_reportId);
    }

    function getRep(address _addr) public view returns (uint) {
        return rep[_addr];
    }
    
}
