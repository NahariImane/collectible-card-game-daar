
//SPDX-License-Identifier: MIT
pragma solidity ^0.8;

import "./Collection.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./BoosterNFT.sol";

contract Main is Ownable {

 struct PokemonSet {
        string setName;
        uint256 cardCount;
        //bool exists;
 }


    uint private count;
    mapping(uint => Collection) private collections;
    mapping(uint => address) public collectionCreators; // Mapping to store the creator of each collection

    mapping(uint256 => PokemonSet) public pokemonSets; // Gestion des sets
    uint256 public pokemonSetCount;
    uint256[] public setIds;
    BoosterNFT private boosterNFT;




  constructor() Ownable(msg.sender) {
    count = 0;
    pokemonSetCount = 0;
    boosterNFT = new BoosterNFT();
  }

event CollectionCreated(uint256 indexed collectionId, address creator);
 event PokemonSetAdded(uint256 indexed setId, string setName, uint256 cardCount);
 

   function addSet(uint256 setId, string memory _setName, uint256 _cardCount) public onlyOwner {
    require(pokemonSets[setId].cardCount == 0, "Set deja existant");
    pokemonSets[setId] = PokemonSet(_setName, _cardCount);
    setIds.push(setId);
    emit PokemonSetAdded(setId, _setName, _cardCount);
}

 
 function createCollection(string calldata name, uint cardCount) external onlyOwner returns (uint256) {
        Collection newCollection = new Collection(name, cardCount);
        collections[count] = newCollection;
        collectionCreators[count] = msg.sender;
        emit CollectionCreated(count++, msg.sender);
        return count - 1; 
    }

  // Mint une carte dans une collection donnée
    function mintInCollection(uint collectionId, address to, string calldata imgURI) external onlyOwner {
        require(collectionId < count, "Collection inexistante");
        Collection selectedCollection = collections[collectionId];
        selectedCollection.mintCard(to, imgURI);  // Mint la carte dans la collection sélectionnée
    
    }

    // Mint plusieurs cartes dans une collection donnée
    function mintMultipleInCollection(uint collectionId, address to, string[] calldata imgURIs) external onlyOwner {
        require(collectionId < count, "Collection inexistante");
        Collection selectedCollection = collections[collectionId];
        selectedCollection.mintMultipleCards(to, imgURIs);  // Mint multiple cartes
    }


    // Obtenir l'adresse d'une collection par son ID
    function getCollection(uint collectionId) public view returns (address) {
        require(collectionId < count, "Collection inexistante");
        return address(collections[collectionId]);
    }

    //  obtenir toutes les collections
    function getAllCollections() public view returns (address[] memory) {
    address[] memory collectionAddresses = new address[](count); // Crée un tableau de la taille de `count`
    for (uint i = 0; i < count; i++) {
        collectionAddresses[i] = address(collections[i]); // Ajoute l'adresse de chaque collection au tableau
    }
    return collectionAddresses;
}


 // Obtenir le propriétaire d'une carte NFT dans une collection
    function ownerOf(uint collectionId, uint tokenId) public view returns (address) {
        require(collectionId < count, "Collection inexistante");
        Collection selectedCollection = collections[collectionId];
        return selectedCollection.ownerOf(tokenId);  // Appel à la méthode ownerOf du contrat Collection
    }

    // Obtenir l'image associée à une carte NFT dans une collection
    function getCardImage(uint collectionId, uint tokenId) public view returns (string memory) {
        require(collectionId < count, "Collection inexistante");
        Collection selectedCollection = collections[collectionId];
        return selectedCollection.getCardImage(tokenId);  // Appel à la méthode getCardImage du contrat Collection
    }

// Obtenir le solde de NFTs d'un propriétaire dans une collection
function balanceOfInCollection(uint collectionId, address owner) public view returns (uint256) {
    require(collectionId < count, "Collection inexistante");
    Collection selectedCollection = collections[collectionId];
    return selectedCollection.balanceOf(owner);  // Appel à la méthode balanceOf du contrat Collection
}
      // Obtenir tous les tokens d'un propriétaire dans une collection
    function tokensOfOwnerInCollection(uint collectionId, address owner) public view returns (uint256[] memory) {
        require(collectionId < count, "Collection inexistante");
        Collection selectedCollection = collections[collectionId];
        return selectedCollection.tokensOfOwner(owner);  // Appel à la méthode tokensOfOwner
    }


// Fonction dans Main pour appeler mintPokemonCard sur une collection spécifique
function mintPokemonCardInCollection(
    uint collectionId,
    address to,
    uint256  setId,
    string calldata name,
    string calldata imageURI
) external onlyOwner {
    require(collectionId < count, "Collection inexistante");
    Collection selectedCollection = collections[collectionId];
    selectedCollection.mintPokemonCard(to, setId, name, imageURI);
}

/*function createBooster(
    string memory boosterName,
    BoosterNFT.PokemonCard[] memory cards
) external onlyOwner returns (uint256) {
    // Passer directement le tableau en mémoire
    return boosterNFT.createBooster(boosterName, cards);
}*/
function createBooster(
    string memory boosterName,
    BoosterNFT.PokemonCard[] calldata cards
) external onlyOwner returns (uint256) {
    uint256 boosterId = boosterNFT.createBooster(boosterName);

    // Ajouter les cartes une par une
    for (uint256 i = 0; i < cards.length; i++) {
        boosterNFT.addCardToBooster(
            boosterId,
            cards[i].setId,
            cards[i].name,
            cards[i].imageURI
        );
    }

    return boosterId;
}




    function getBooster(uint256 boosterId) public view returns (BoosterNFT.Booster memory) {
        return boosterNFT.getBooster(boosterId);
    }
}


