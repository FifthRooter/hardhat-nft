// SPDX-License-Identifier: SEE LICENSE IN LICENSE
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

pragma solidity ^0.8.7;

contract BasicNFT is ERC721 {
    uint256 private s_tokenCounter;
    string public constant TOKEN_URI =
        "ipfs://bafybeiak7brovwgi73nn2uaopjq52lg662u2a2elh2nm3rpnpuedwdkovq/";

    constructor() ERC721("Doggie", "DOG") {
        s_tokenCounter = 0;
    }

    function mintNFT() public returns (uint256) {
        _safeMint(msg.sender, s_tokenCounter);
        s_tokenCounter = s_tokenCounter + 1;
        return s_tokenCounter;
    }

    /* View functions */
    function tokenURI(
        uint256 /* tokenId */
    ) public view override returns (string memory) {
        return TOKEN_URI;
    }

    function getTokenCounter() public view returns (uint256) {
        return s_tokenCounter;
    }
}
