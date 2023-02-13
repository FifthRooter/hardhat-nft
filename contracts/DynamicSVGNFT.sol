// DynamicSVGNFT.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "base64-sol/base64.sol";

contract DynamicSVGNFT is ERC721 {
    // mint
    // store SVG somewhere
    // logic to perform "show X image" or "show Y image "

    uint256 private s_tokenCounter;
    string private i_lowImageUri;
    string private i_highImageUri;
    string private constant base64EncodedSvgPrefix =
        "data:image/svg+xml;base64,";

    constructor(
        string memory lowSVG,
        string memory highSVG
    ) ERC721("Dynamic SVG NFT", "DSN") {}

    function mintNFT() public {
        _safeMint(msg.sender, s_tokenCounter);
        s_tokenCounter = s_tokenCounter + 1;
    }

    function svgToImageUri(
        string memory svg
    ) public pure returns (string memory) {
        // Use Base64 binary-to-text encoding library
        string memory svgBase64Encoded = Base64.encode(
            bytes(string(abi.encodePacked(svg)))
        );
        return
            string(abi.encodePacked(base64EncodedSvgPrefix, svgBase64Encoded));
    }
}
