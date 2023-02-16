pragma solidity >=0.6.0;

contract Intention { //types = 000, 001, ..., 110, 111. These combos will be converted from base 2 to base 10 (0,1,...,6,7) representing type combinations
    uint public parentValue;

    function setParentValue(uint _value) public {
        parentValue = _value;
    }
}

contract Research is Intention { //type = +2^0
    uint public childValue;

    function setChildValue(uint _value) public {
        childValue = _value;
    }

    function getParentValue() public view returns (uint) {
        return parentValue;
    }
}

contract Commercial is Intention { //type = +2^1
    uint public childValue;

    function setChildValue(uint _value) public {
        childValue = _value;
    }

    function getParentValue() public view returns (uint) {
        return parentValue;
    }
}

contract Teaching is Intention { //type = +2^2
    uint public childValue;

    function setChildValue(uint _value) public {
        childValue = _value;
    }

    function getParentValue() public view returns (uint) {
        return parentValue;
    }
}