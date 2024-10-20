// SPDX-License-Identifier: MIT
pragma solidity ^0.8;

import "./Collection.sol";

contract Main {
  uint private count;
  mapping(uint => Collection) private collections;



  constructor() {
    count = 0;
  }

  function createCollection(string calldata name, uint cardCount) external {
     Collection newCollection = new Collection(name, cardCount);
    collections[count++] = newCollection;
  }

  // Mint une carte dans une collection donnée
    function mintInCollection(uint collectionId, address to, string calldata imgURI) external {
        require(collectionId < count, "Collection inexistante");
        Collection selectedCollection = collections[collectionId];
        selectedCollection.mintCard(to, imgURI);  // Mint la carte dans la collection sélectionnée

      
    
    }

    // Obtenir une collection par son ID
    function getCollection(uint collectionId) public view returns (address) {
        require(collectionId < count, "Collection inexistante");
        return address(collections[collectionId]);
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
}
