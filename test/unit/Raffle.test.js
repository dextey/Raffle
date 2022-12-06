const { assert, expect } = require("chai");
const { getNamedAccounts, ethers, deployments } = require("hardhat");

describe("Raffle", () => {
  let accounts, Raffle;

  beforeEach(async () => {
    accounts = await getNamedAccounts();
    await deployments.fixture("all");
    Raffle = await ethers.getContract("Raffle", accounts.deployer);
  });

  describe("Constructor", () => {
    it("Entrance Fee set to 0.1 Ether", async () => {
      const entranceFee = await Raffle.getEntranceFee();
      assert.equal(entranceFee.toString(), ethers.utils.parseEther("0.1"));
    });
  });

  describe("Raffle Entry", () => {
    it("Rejecting Low price entry", async () => {
      expect(Raffle.enterRaffle()).to.be.revertedWithCustomError(
        Raffle,
        "Raffle_NotEnoughEth"
      );
    });
    it("Adding players to player list", async () => {
      await Raffle.enterRaffle({ value: ethers.utils.parseEther("0.2") });
      const players = await Raffle.getPlayers();
      // console.log(players);
      assert.equal(players[0], accounts.deployer);
    });

    it("Raffle entry Event emitted", async () => {});
  });
});
