// SPDX-License-Identifier:MIT

pragma solidity ^0.8.7;

error Raffle_NotEnoughEth();

contract Raffle {
    // Able to enter raffle by a fee
    // Able to pick a Random winner
    // Automate picking winner by time

    uint256 private immutable i_entrance_fee;
    address payable[] private s_players;

    constructor(uint256 entrance_fee) {
        i_entrance_fee = entrance_fee;
    }

    function enterRaffle() public payable {
        if (msg.value < i_entrance_fee) revert Raffle_NotEnoughEth();

        s_players.push(payable(msg.sender));
    }

    // View / pure function

    function getEntranceFee() public view returns (uint256) {
        return i_entrance_fee;
    }

    function getPlayers() public view returns (address payable[] memory) {
        return s_players;
    }
}
