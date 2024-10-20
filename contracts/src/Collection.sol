//SPDX-License-Identifier: MIT
pragma solidity ^0.8;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Collection is ERC721, Ownable {
  string public collectionName;
  uint public cardCount;
  uint public nextTokenId;

  mapping(uint => string) public cardImages;

  constructor(string memory _collectionName, uint _cardCount)
   ERC721(_collectionName, "NFT") 
   Ownable(msg.sender) {
    collectionName = _collectionName;
    cardCount = _cardCount;
    nextTokenId =0;
  }

   // Mint une nouvelle carte (NFT) avec une image
    function mintCard(address to, string memory imgURI) external onlyOwner {
        require(nextTokenId < cardCount, "Toutes les cartes sont deja mintees.");
        _safeMint(to, nextTokenId);
        cardImages[nextTokenId] = imgURI;  // Stocke l'image de la carte (imgURI)
        nextTokenId++;
    }

    // Récupérer l'URI de l'image de la carte
    function getCardImage(uint tokenId) public view returns (string memory) {
        return cardImages[tokenId];
    }

}


