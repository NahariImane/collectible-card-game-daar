// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";

contract BoosterNFT is Ownable {
    struct PokemonCard {
        uint256 setId;
        string name;
        string imageURI;
    }

    struct Booster {
        string boosterName;
        PokemonCard[] cards;
    }

    mapping(uint256 => Booster) public boosters;
    uint256 public boosterCount;

    event BoosterCreated(uint256 indexed boosterId, string boosterName);
    event CardAddedToBooster(uint256 indexed boosterId, uint256 cardIndex, string cardName);

    constructor() Ownable(msg.sender) {}

    function createBooster(string calldata boosterName) external onlyOwner returns (uint256) {
        require(bytes(boosterName).length > 0, "Le nom du booster est requis.");

        Booster storage newBooster = boosters[boosterCount];
        newBooster.boosterName = boosterName;

        emit BoosterCreated(boosterCount, boosterName);
        return boosterCount++;
    }

    function addCardToBooster(
        uint256 boosterId,
        uint256 setId,
        string calldata name,
        string calldata imageURI
    ) external onlyOwner {
        require(boosterId < boosterCount, "Booster inexistant.");

        Booster storage booster = boosters[boosterId];
        booster.cards.push(PokemonCard(setId, name, imageURI));

        emit CardAddedToBooster(boosterId, booster.cards.length - 1, name);
    }

    function getBooster(uint256 boosterId) public view returns (Booster memory) {
        require(boosterId < boosterCount, "Booster inexistant.");
        return boosters[boosterId];
    }
}
