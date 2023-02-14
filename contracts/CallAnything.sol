// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

// - In order to call a function using only the data field of the call, we need to encode to binary:
// 	- Function name
// 	- Parameters to be added

// A contract assigns a function ID to each function, known as the "function selector"
// The function selector is the first 4 bytes of the function signature
// The function signature is the string that defines the function name & parameters

contract CallAnything {
    address public s_someAddress;
    uint256 public s_amount;

    function transfer(address someAddress, uint256 amount) public {
        s_someAddress = someAddress;
        s_amount = amount;
    }

    function getSelectorOne() public pure returns (bytes4 selector) {
        selector = bytes4(keccak256(bytes("transfer(address, uint256)")));
    }

    function getDataToCalTransfer(
        address someAddress,
        uint256 amount
    ) public pure returns (bytes memory) {
        return abi.encodeWithSelector(getSelectorOne(), someAddress, amount);
    }

    function callTransferFunctionWithBinary(
        address someAddress,
        uint256 amount
    ) public returns (bytes4, bool) {
        (bool success, bytes memory returnData) = address(this).call(
            abi.encodeWithSelector(getSelectorOne(), someAddress, amount)
        );
        return (bytes4(returnData), success);
    }

    // abi.encodeWithSignature does exactly the same as the getSelector(), only easier
    function callTransferFunctionWithBinarySign(
        address someAddress,
        uint256 amount
    ) public returns (bytes4, bool) {
        (bool success, bytes memory returnData) = address(this).call(
            abi.encodeWithSignature(
                "transfer(address, uint256)",
                someAddress,
                amount
            )
        );
        return (bytes4(returnData), success);
    }
}
