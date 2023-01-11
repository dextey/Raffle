const { ethers, network } = require("hardhat")

const fs = require("fs")

const CLIENT_ADDRESS_FILE = "client/constants/contractAddress.json"
const CLIENT_ABI_FILE = "client/constants/abi.json"

module.exports = async () => {
  console.log("=========================================")
  updateContractAddress()
  updateAbi()
  console.log("=========================================")
}

async function updateContractAddress() {
  console.log("Updating Contract Address")
  const raffle = await ethers.getContract("Raffle")
  const currentAddress = await JSON.parse(fs.readFileSync(CLIENT_ADDRESS_FILE, "utf8"))
  console.log("Address", currentAddress)

  currentAddress[network.config.chainId.toString()] = [raffle.address]
  fs.writeFileSync(CLIENT_ADDRESS_FILE, JSON.stringify(currentAddress))
}

async function updateAbi() {
  console.log("Updating ABI")
  const raffle = await ethers.getContract("Raffle")
  fs.writeFileSync(CLIENT_ABI_FILE, raffle.interface.format(ethers.utils.FormatTypes.json))
}

module.exports.tags = ["all", "updateScript"]
