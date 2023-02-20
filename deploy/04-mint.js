const { ethers, network } = require("hardhat")
const { developmentChains } = require("../helper-hardhat-config")

module.exports = async function ({ getNamedAccounts, deployments }) {
    const { deployer } = await getNamedAccounts()

    /* Basic NFT */
    const basicNFT = await ethers.getContract("BasicNFT", deployer)
    const basicMintTx = await basicNFT.mintNFT()
    await basicMintTx.wait(1)
    console.log(`Basic NFT index 0 has tokenURI: ${await basicNFT.tokenURI(0)}`)

    /* Random IPFS NFT */
    const randomIPFSNFT = await ethers.getContract("RandomIPFSNFT", deployer)
    const mintFee = await randomIPFSNFT.getMintFee()

    await new Promise(async (resolve, reject) => {
        setTimeout(resolve, 300000) // 5min
        randomIPFSNFT.once("NFTMinted", async function () {
            resolve()
        })
        const randomIPFSNFTMintTx = await randomIPFSNFT.requestNFT({
            value: mintFee.toString(),
        })
        const randomIPFSNFTMintTxReceipt = await randomIPFSNFTMintTx.wait(1)
        if (developmentChains.includes(network.name)) {
            const requestId =
                randomIPFSNFTMintTxReceipt.events[1].args.requestId.toString()
            const vrfCoordinatorV2Mock = await ethers.getContract(
                "VRFCoordinatorV2Mock",
                deployer
            )
            await vrfCoordinatorV2Mock.fulfillRandomWords(
                requestId,
                randomIPFSNFT.address
            )
        }
    })
    console.log(
        `Random IPFS NFT index 0 tokenURI: ${await randomIPFSNFT.tokenURI(0)}`
    )

    /* Dynamic SVG NFT */
    const highValue = ethers.utils.parseEther("4000")
    const dynamicSvgNft = await ethers.getContract("DynamicSVGNFT", deployer)
    const dynamicSvgNftMintTx = await dynamicSvgNft.mintNFT(
        highValue.toString()
    )
    await dynamicSvgNftMintTx.wait(1)
    console.log(
        `Dynamic SVG NFT index 0 tokenURI: ${await dynamicSvgNft.tokenURI(0)}`
    )
}
