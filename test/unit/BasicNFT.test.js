const { assert, expect } = require("chai")
const { getNamedAccounts, ethers, network, deployments } = require("hardhat")
const {
    developmentChains,
    networkConfig,
} = require("../../helper-hardhat-config")

!developmentChains.includes(network.name)
    ? describe.skip("skip this", () => {
          console.log("skipping unit tests...")
      })
    : describe("BasicNFT Unit Tests", () => {
          let basicNft, deployer
          const chainId = network.config.chainId

          beforeEach(async () => {
              deployer = (await getNamedAccounts()).deployer
              basicNft = await ethers.getContract("BasicNFT", deployer)
          })

          describe("constructor", function () {
              it("initializes contract correctly", async function () {
                  const tokenCounter = await basicNft.getTokenCounter()
                  assert.equal(tokenCounter.toString(), "0")
              })
          })

          describe("mintNFT", function () {
              it("increments tokenCounter after minting new token", async function () {
                  const initTokenCounter = await basicNft.getTokenCounter()
                  const updatedTokenCounter =
                      await basicNft.callStatic.mintNFT()
                  assert.equal(
                      updatedTokenCounter.toNumber() -
                          initTokenCounter.toNumber(),
                      1
                  )
              })
          })
      })
