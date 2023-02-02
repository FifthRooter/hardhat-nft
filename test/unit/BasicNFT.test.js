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

          beforeEach(async () => {
              accounts = await ethers.getSigners()
              deployer = accounts[0]
              await deployments.fixture(["basicnft"])
              basicNft = await ethers.getContract("BasicNFT")
          })

          describe("constructor", function () {
              it("initializes contract correctly", async function () {
                  const name = await basicNft.name()
                  const symbol = await basicNft.symbol()
                  const tokenCounter = await basicNft.getTokenCounter()
                  assert.equal(name, "Doggie")
                  assert.equal(symbol, "DOG")
                  assert.equal(tokenCounter.toString(), "0")
              })
          })

          describe("mintNFT", function () {
              beforeEach(async () => {
                  const txResponse = await basicNft.mintNFT()
                  await txResponse.wait(1)
              })
              it("checks if minted NFT's token URI matches declared URI", async function () {
                  const tokenUri = await basicNft.tokenURI(0)
                  const declaredTokenURI = await basicNft.TOKEN_URI()
                  assert.equal(tokenUri, declaredTokenURI)
              })
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
              it("shows the correct balance and owner of an NFT", async function () {
                  const deployerAddress = deployer.address
                  const deployerBalance = await basicNft.balanceOf(
                      deployerAddress
                  )
                  const owner = await basicNft.ownerOf("0")

                  assert.equal(owner, deployerAddress)
                  assert.equal(deployerBalance.toString(), "1")
              })
          })
      })
