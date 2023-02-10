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
              it("sets starting values correctly", async function () {
                  const dogTokenUriZero = await randomNFT.getDogTokenUris(0)
                  const isInitialized = await randomNFT.getInitialized()
                  assert(dogTokenUriZero.includes("ipfs://"))
                  assert.equal(isInitialized, true)
              })
          })

          describe("requestNft", function () {
              it("reverts if payment is not sent with the request", async function () {
                  await expect(randomNFT.requestNft()).to.be.revertedWith(
                      "RandomIPFSNFT__NeedMoreETHSent()"
                  )
              })
              it("reverts if payment is less than the mint fee", async function () {
                  await expect(
                      randomNFT.requestNft({
                          value: mintFee.sub(ethers.utils.parseEther("0.001")),
                      })
                  ).to.be.revertedWith("RandomIPFSNFT__NeedMoreETHSent()")
              })
              it("emits an event and kicks off a random word generator", async function () {
                  await expect(
                      randomNFT.requestNft({ value: mintFee.toString() })
                  ).to.emit(randomNFT, "NftRequested")
              })
          })

          describe("fulfillRandomWords", function () {})

          describe("getBreedFromModdedRng", function () {})

          describe("withdraw", function () {})
      })
