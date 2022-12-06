const { ethers, network } = require("hardhat");
const {
  developmentChains,
  networkConfig,
} = require("../helper-hardhat-config");

module.exports = async ({ deployments, getNamedAccounts }) => {
  const { deployer } = await getNamedAccounts();
  const { deploy, log } = deployments;

  const entranceFee = ethers.utils.parseEther("0.1");

  let vrfCoordinatorv2Address;

  if (developmentChains.includes(network.name)) {
    const vrfCoordinatorv2Mock = await ethers.getContract(
      "VRFCoordinatorV2Mock"
    );
    vrfCoordinatorv2Address = vrfCoordinatorV2Mock.address;
  } else {
    vrfCoordinatorv2Address =
      networkConfig[network.config.chainId]["vrfCoordinatorV2"];
  }

  const args = [entranceFee];

  log("Deploying -- Raffle Contract");
  log("=====================================");
  await deploy("Raffle", {
    from: deployer,
    args: args,
    log: true,
    waitConfirmations: network.config.blockConfirmations || 1,
  });
  log("=====================================");
};

module.exports.tags = ["all", "Raffle"];
