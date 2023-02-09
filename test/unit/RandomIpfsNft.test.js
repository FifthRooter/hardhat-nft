const { assert, expect } = require("chai")
const { getNamedAccounts, ethers, network, deployments } = require("hardhat")
const {
    isCallTrace,
} = require("hardhat/internal/hardhat-network/stack-traces/message-trace")
const {
    networkConfig,
    developmentChains,
} = require("../../helper-hardhat-config")

!developmentChains.includes(network.name)
    ? describe.skip("skip this", () => {
          console.log("skipping unit tests")
      })
    : describe("RandomNFT Unit Tests", () => {
          let randomNFT, deployer, vrfCoordinatorV2Mock, mintFee

          beforeEach(async () => {
              deployer = (await getNamedAccounts()).deployer
              // what's the difference between getSigners and getNamedAccounts?
              await deployments.fixture(["randomipfs", "mocks"])
              randomNFT = await ethers.getContract("RandomIPFSNFT")
              vrfCoordinatorV2Mock = await ethers.getContract(
                  "VRFCoordinatorV2Mock"
              )
              mintFee = await randomNFT.getMintFee()
          })

          describe("constructor", function () {
              it("initializes contract correctly", async function () {
                  const name = await randomNFT.name()
                  const symbol = await randomNFT.symbol()
                  const tokenCounter = await randomNFT.getTokenCounter()
                  assert.equal(name, "Random IPFS NFT")
                  assert.equal(symbol, "RIN")
                  assert.equal(tokenCounter.toString(), "0")
              })
          })

          describe("requestNft", function () {
              it("reverts when not enough ETH to mint NFT", async function () {
                  await expect(randomNFT.requestNft()).to.be.revertedWith(
                      "RandomIPFSNFT__NeedMoreETHSent()"
                  )
              })
              it("correctly maps requestId to address of NFT owner", async function () {
                  const requestId = await randomNFT.requestNft({
                      value: mintFee,
                  })
                  const senderAddress = await randomNFT.s_requestIdToSender(
                      requestId.value
                  )
                  console.log(senderAddress)
                  assert.equal(senderAddress, deployer)
              })
          })

          describe("fulfillRandomWords", function () {})

          describe("getBreedFromModdedRng", function () {})

          describe("withdraw", function () {})
      })
