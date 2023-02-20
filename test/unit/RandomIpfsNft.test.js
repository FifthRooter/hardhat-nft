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
                  const dogTokenUriZero = await randomNFT.getTokenUri(0)
                  const isInitialized = await randomNFT.getInitialized()
                  assert(dogTokenUriZero.includes("ipfs://"))
                  assert.equal(isInitialized, true)
              })
          })

          describe("requestNFT", function () {
              it("reverts if payment is not sent with the request", async function () {
                  await expect(randomNFT.requestNFT()).to.be.revertedWith(
                      "RandomIPFSNFT__NeedMoreETHSent()"
                  )
              })
              it("reverts if payment is less than the mint fee", async function () {
                  await expect(
                      randomNFT.requestNFT({
                          value: mintFee.sub(ethers.utils.parseEther("0.001")),
                      })
                  ).to.be.revertedWith("RandomIPFSNFT__NeedMoreETHSent()")
              })
              it("emits an event and kicks off a random word generator", async function () {
                  await expect(
                      randomNFT.requestNFT({ value: mintFee.toString() })
                  ).to.emit(randomNFT, "NFTRequested")
              })
          })

          describe("fulfillRandomWords", function () {
              it("mints NFT after random number is returned", async function () {
                  await new Promise(async (resolve, reject) => {
                      randomNFT.once("NFTMinted", async () => {
                          try {
                              const tokenUri = await randomNFT.getTokenUri("0")
                              const tokenCounter =
                                  await randomNFT.getTokenCounter()
                              assert.equal(
                                  tokenUri.toString().includes("ipfs://"),
                                  true
                              )
                              assert.equal(tokenCounter.toString(), "1")
                              resolve()
                          } catch (e) {
                              console.log(e)
                              reject()
                          }
                      })
                      try {
                          mintFee = await randomNFT.getMintFee()

                          const requestNftResponse = await randomNFT.requestNft(
                              {
                                  value: mintFee.toString(),
                              }
                          )
                          const requestNftReceipt =
                              await requestNftResponse.wait(1)
                          await vrfCoordinatorV2Mock.fulfillRandomWords(
                              requestNftReceipt.events[1].args.requestId,
                              randomNFT.address
                          )
                      } catch (e) {
                          console.log(e)
                          reject()
                      }
                  })
              })
          })

          describe("getBreedFromModdedRng", function () {
              it("should return pug if moddedRng < 10", async function () {
                  const expectedValue = await randomNFT.getBreedFromModdedRng(7)
                  assert.equal(expectedValue, 0)
              })
              it("should return shiba-inu if moddedRng between 10 - 39", async function () {
                  const expectedValue = await randomNFT.getBreedFromModdedRng(
                      11
                  )
                  assert.equal(expectedValue, 1)
              })
              it("should return st. bernard if moddedRng between 40 and 99", async function () {
                  const expectedValue = await randomNFT.getBreedFromModdedRng(
                      41
                  )
                  assert.equal(expectedValue, 2)
              })
              it("should revert if moddedRng > 99", async function () {
                  await expect(
                      randomNFT.getBreedFromModdedRng(100)
                  ).to.be.revertedWith("RandomIPFSNFT__RangeOutOfBounds()")
              })
          })
      })
