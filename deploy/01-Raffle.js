const { ethers } = require("hardhat");

module.exports = async ({ deployments, getNamedAccounts }) => {
  const { deployer } = await getNamedAccounts();
  const { deploy } = deployments;

  const args = [ethers.utils.parseEther("0.1")];
  console.log();
  console.log("Deploying -- Raffle Contract");

  console.log("=====================================");
  const Raffle = await deploy("Raffle", {
    from: deployer,
    args: args,
    log: true,
  });
  console.log("=====================================");
};

module.exports.tags = ["all", "Raffle"];
