const { verify } = require("../utils/verify")
const { network } = require("hardhat")
const { developmentChains, networkConfig } = require("../helper-hardhat-config")
const fs = require("fs")

module.exports = async function ({ getNamedAccounts, deployments }) {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()

    const chainId = network.config.chainId
    let ethUsdPriceFeedAddress, args

    if (developmentChains.includes(network.name)) {
        const ethUsdAggregator = await ethers.getContract("MockV3Aggregator")
        ethUsdPriceFeedAddress = ethUsdAggregator.address
    } else {
        ethUsdPriceFeedAddress = networkConfig[chainId].ethUsdPriceFeed
    }

    const lowSvg = await fs.readFileSync("./img/svg/frown.svg", {
        encoding: "utf8",
    })
    const highSvg = await fs.readFileSync("./img/svg/happy.svg", {
        encoding: "utf8",
    })

    args = [ethUsdPriceFeedAddress, lowSvg, highSvg]
    const dynamicSvgNft = await deploy("DynamicSVGNFT", {
        from: deployer,
        log: true,
        args: args,
        waitConfirmations: network.config.blockConfirmations || 1,
    })

    if (
        !developmentChains.includes(network.name) &&
        process.env.ETHERSCAN_API_KEY
    ) {
        log("Verifying...")
        await verify(dynamicSvgNft.address, args)
    }
}

module.exports.tags = ["all", "dynamicnft", "main"]
