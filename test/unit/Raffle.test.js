const { assert, expect } = require("chai")
const { getNamedAccounts, ethers, deployments, network } = require("hardhat")

const { developmentChains } = require("../../helper.config")

!developmentChains.includes(network.name)
  ? describe.skip
  : describe("Raffle", () => {
      let accounts, Raffle, vrfCoordinatorV2Mock

      beforeEach(async () => {
        accounts = await getNamedAccounts()
        await deployments.fixture(["all"])
        Raffle = await ethers.getContract("Raffle", accounts.deployer)
        vrfCoordinatorV2Mock = await ethers.getContract("VRFCoordinatorV2Mock", accounts.deployer)
      })

      describe("Constructor", () => {
        it("Raffle is open initally", async () => {
          const raffleState = await Raffle.getRaffleState()
          assert.equal(raffleState.toString(), "0")
        })
        it("Entrance Fee set to 0.1 Ether", async () => {
          const entranceFee = await Raffle.getEntranceFee()
          assert.equal(entranceFee.toString(), ethers.utils.parseEther("0.01"))
        })
      })

      describe("Raffle Entry", () => {
        it("Rejecting Low price entry", async () => {
          expect(Raffle.enterRaffle()).to.be.revertedWithCustomError(Raffle, "Raffle_NotEnoughEth")
        })
        it("Adding players to player list", async () => {
          await Raffle.enterRaffle({ value: ethers.utils.parseEther("0.2") })
          const players = await Raffle.getPlayers()
          // console.log(players);
          assert.equal(players[0], accounts.deployer)
        })

        it("Raffle entry Event emitted on player entry", async () => {
          await expect(Raffle.enterRaffle({ value: ethers.utils.parseEther("0.2") })).to.emit(
            Raffle,
            "RaffleEnter"
          )
        })

        it("Doesn't allow to enter Raffle when calculation", async () => {
          await Raffle.enterRaffle({ value: ethers.utils.parseEther("0.2") })
          await network.provider.send("evm_increaseTime", [30 + 1])
          await network.provider.send("evm_mine", [])

          await Raffle.performUpkeep([])
          await expect(
            Raffle.enterRaffle({ value: ethers.utils.parseEther("0.2") })
          ).to.be.revertedWithCustomError(Raffle, "Raffle_NotOpen")
        })
      })

      describe("CheckUpkeep", () => {
        it("return False when Contract has 0 balance", async () => {
          await network.provider.send("evm_increaseTime", [31])
          await network.provider.send("evm_mine", [])
          const { upkeepNeeded } = await Raffle.callStatic.checkUpkeep([])
          assert(!upkeepNeeded)
        })
        it("return False when Raffle is not open", async () => {
          await Raffle.enterRaffle({ value: ethers.utils.parseEther("0.2") })
          await network.provider.send("evm_increaseTime", [31])
          await network.provider.send("evm_mine", [])
          await Raffle.performUpkeep([])
          const raffleState = await Raffle.getRaffleState()
          const { upkeepNeeded } = await Raffle.callStatic.checkUpkeep([])
          assert.equal(upkeepNeeded, false)
          assert.equal(raffleState.toString(), "1")
        })
        it("return False when enough time hasn't passes", async () => {
          await Raffle.enterRaffle({ value: ethers.utils.parseEther("0.2") })
          const { upkeepNeeded } = await Raffle.callStatic.checkUpkeep([])
          assert(!upkeepNeeded)
        })
        it("Returns True when time has passes, has players, has enough eth", async () => {
          await Raffle.enterRaffle({ value: ethers.utils.parseEther("0.2") })
          await network.provider.send("evm_increaseTime", [30])
          await network.provider.send("evm_mine", [])
          const { upkeepNeeded } = await Raffle.callStatic.checkUpkeep([])
          assert(upkeepNeeded)
        })
      })

      describe("Perform Upkeep", () => {
        it("Can only run when checkup keep returns true", async () => {
          await Raffle.enterRaffle({ value: ethers.utils.parseEther("0.2") })
          await network.provider.send("evm_increaseTime", [31])
          await network.provider.send("evm_mine", [])
          const tx = await Raffle.performUpkeep([])
          assert(tx)
        })
        it("Reverts when checkupKeep is false", async () => {
          await expect(Raffle.performUpkeep([]))
            .to.be.revertedWithCustomError(Raffle, `Raffle_UpkeepNotNeeded`)
            .withArgs("0", "0", "0")
        })
      })
    })
