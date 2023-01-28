const { verify } = require("../utils/verify")
const { network } = require("hardhat")
const { developmentChains } = require("../helper-hardhat-config")

module.exports = async function ({ getNamedAccounts, deployments }) {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()

    const args = []
    const basicNft = await deploy("BasicNFT", {
        from: deployer,
        args,
        log: true,
        waitConfirmations: network.config.blockConfirmations | 1,
    })

    if (
        !developmentChains.includes(network.name) &&
        process.env.ETHERSCAN_API_KEY
    ) {
        log("Verifying...")
        await verify(basicNft.address, arguments)
    }
}
