const pinataSDK = require("@pinata/sdk")
const path = require("path")
const fs = require("fs")
require("dotenv").config()

const pinataApiKey = process.env.PINATA_API_KEY
const pinataSecret = process.env.PINATA_SECRET
const pinata = new pinataSDK(pinataApiKey, pinataSecret)

async function storeImages(imagesFilePath) {
    const fullImagesPath = path.resolve(imagesFilePath)
    const files = fs.readdirSync(fullImagesPath)
    let responses = []
    console.log("Uploading to IPFS...")
    for (fileIndex in files) {
        const readableStreamForFile = fs.createReadStream(
            `${fullImagesPath}/${files[fileIndex]}`
        )
        const indexForNaming = readableStreamForFile.path.lastIndexOf("/")
        const options = {
            pinataMetadata: {
                name: readableStreamForFile.path.slice(indexForNaming + 1),
            },
        }
        try {
            await pinata
                .pinFileToIPFS(readableStreamForFile, options)
                .then((result) => {
                    responses.push(result)
                })
                .catch((e) => {
                    console.log(e)
                })
        } catch (e) {
            console.log(e)
        }
    }
    return { responses, files }
}

module.exports = { storeImages }
