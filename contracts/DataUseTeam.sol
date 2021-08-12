// SPDX-License-Identifier: MIT
pragma solidity ^0.6.0;

//this contract is for controlling other members in the same team with the Covid19usecase contract creator.
//which is a sub-contract of Covid19usecase.
contract DataUseTeam {
    struct Collaborator {
      uint256 id;
      string account;
      string state;
    }
    mapping(uint => Collaborator) public Collaborators;
    

    uint256 collaboratorCount=0;

    function AddCollaborator(string memory _account, string memory _state) public {
      collaboratorCount++;
      Collaborators[collaboratorCount] = Collaborator(collaboratorCount, _account, _state);
    }

    function getCollaboratorAccount(uint256 num) public view returns (string memory) {
        return Collaborators[num].account;
    }

    function getCollaboratorState(uint256 num) public view returns (string memory) {
        return Collaborators[num].state;
    }

    function getTeamCount() public view returns (uint256) {
        return collaboratorCount;
    }

    function changeMemberState(uint256 _id, string memory _state) public {
      Collaborators[_id].state=_state;
    }
}