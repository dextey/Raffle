const { ethers, network } = require("hardhat")
const { developmentChains, networkConfig } = require("../helper.config")

module.exports = async ({ deployments, getNamedAccounts }) => {
  const { deployer } = await getNamedAccounts()
  const { deploy, log } = deployments

  let vrfCoordinatorV2Address
  let subscriptionId

  if (developmentChains.includes(network.name)) {
    const vrfCoordinatorV2Mock = await ethers.getContract("VRFCoordinatorV2Mock")
    vrfCoordinatorV2Address = vrfCoordinatorV2Mock.address
    const txResponse = await vrfCoordinatorV2Mock.createSubscription()
    const txReceipt = await txResponse.wait(1)
    subscriptionId = txReceipt.events[0].args.subId

    await vrfCoordinatorV2Mock.fundSubscription(subscriptionId, ethers.utils.parseEther("5"))
  } else {
    vrfCoordinatorV2Address = networkConfig[network.config.chainId]["vrfCoordinatorV2"]
    subscriptionId = networkConfig[network.config.chainId]["subscriptionId"]
  }

  const entranceFee = networkConfig[network.config.chainId]["entranceFee"]
  const gasLane = networkConfig[network.config.chainId]["gasLane"]
  const callbackGasLimit = networkConfig[network.config.chainId]["callbackGasLimit"]
  const interval = networkConfig[network.config.chainId]["interval"]

  // uint64 subscriptionId,
  // uint32 callbackGasLimit,
  // uint256 interval

  const args = [
    vrfCoordinatorV2Address,
    entranceFee,
    gasLane,
    subscriptionId,
    callbackGasLimit,
    interval,
  ]

  log("Deploying -- Raffle Contract")
  log("=====================================")
  await deploy("Raffle", {
    from: deployer,
    args: args,
    log: true,
    waitConfirmations: network.config.blockConfirmations || 1,
  })
  log("=====================================")
}

module.exports.tags = ["all", "Raffle"]
