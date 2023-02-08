const { verify } = require("../utils/verify")
const { network, ethers } = require("hardhat")
const { developmentChains, networkConfig } = require("../helper-hardhat-config")
const { storeImages } = require("../utils/uploadToPinata")

const imagesLocation = "./img/"

module.exports = async function ({ getNamedAccounts, deployments }) {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    const chainId = network.config.chainId
    let tokenUris

    let VRFCoordinatorV2Address

    if (process.env.UPLOAD_TO_PINATA == "true") {
        tokenUris = await handleTokenUris()
    }

    if (developmentChains.includes(network.name)) {
        const VRFCoordinatorV2Mock = await ethers.getContract(
            "VRFCoordinatorV2Mock"
        )
        VRFCoordinatorV2Address = VRFCoordinatorV2Mock.address
        const tx = await VRFCoordinatorV2Mock.createSubscription()
        const txReceipt = await tx.wait(1)
        subscriptionId = txReceipt.events[0].args.subId
    } else {
        VRFCoordinatorV2Address = networkConfig[chainId].VRFCoordinatorV2
        subscriptionId = networkConfig[chainId].subscription
    }

    // const args = [
    //     VRFCoordinatorV2Address,
    //     subscriptionId,
    //     networkConfig[chainId].gasLane,
    //     networkConfig[chainId].callbackGasLimit,
    //     networkConfig[chainId].mintFee,
    // ]

    await storeImages(imagesLocation)
}

async function handleTokenUris() {
    tokenUris = []
    // store the image in ipfs
    // store metadata in ipfs

    return tokenUris
}

module.exports.tags = ["all", "randomipfs", "main"]
