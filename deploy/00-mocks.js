const { network, ethers } = require("hardhat")
const { developmentChains } = require("../helper.config")

module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy, log } = deployments
  const { deployer } = await getNamedAccounts()

  const BASEFEE = ethers.utils.parseEther("0.25")
  const GAS_PRICE_LINK = 1e9

  const args = [BASEFEE, GAS_PRICE_LINK]

  if (developmentChains.includes(network.name)) {
    log("Local Network Detected -- Deploying Mocks")
    await deploy("VRFCoordinatorV2Mock", {
      from: deployer,
      log: true,
      args: args,
    })
    log("=========================================")
  }
}

module.exports.tags = ["all", "mocks"]
