
//SPDX-License-Identifier: MIT
pragma solidity ^0.8;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Collection is ERC721, Ownable {

      struct PokemonCard {
        uint256 setId;
        string name;
        string imageURI;
        //bool exists;
    }

  string public collectionName;
  uint public cardCount;
  uint public nextTokenId;
  
   mapping(uint => PokemonCard) public pokemonCards;

// Mapping pour stocker les URIs des images des cartes
  mapping(uint => string) public cardImages;

  constructor(string memory _collectionName, uint _cardCount)
   ERC721(_collectionName, "NFT") 
   Ownable(msg.sender) {
    collectionName = _collectionName;
    cardCount = _cardCount;
    nextTokenId =0;
  }


// Mint une carte Pokémon en tant que NFT
    function mintPokemonCard(
        address to, 
        uint256 _setId,
        string memory _name,
        string memory _imageURI
    ) external onlyOwner {
        require(nextTokenId < cardCount, "Toutes les cartes sont deja mintees.");
        pokemonCards[nextTokenId] = PokemonCard({
            setId: _setId,
            name: _name,
            imageURI: _imageURI
           // exists: true
        });

        _safeMint(to, nextTokenId);
        nextTokenId++;
    }

function getCardDetails(uint256 tokenId) public view returns (uint256, string memory, string memory) {
    PokemonCard memory card = pokemonCards[tokenId];
    return (card.setId, card.imageURI, card.name);
}

   // Mint une nouvelle carte (NFT) avec une image
    function mintCard(address to, string memory imgURI) external onlyOwner {
        require(nextTokenId < cardCount, "Toutes les cartes sont deja mintees.");
        _safeMint(to, nextTokenId);
        cardImages[nextTokenId] = imgURI;  // Stocke l'image de la carte (imgURI)
        nextTokenId++;
    }


// Fonction pour mint plusieurs cartes en une seule transaction
    function mintMultipleCards(address to, string[] memory imgURIs) external onlyOwner {
        require(nextTokenId + imgURIs.length <= cardCount, "Nombre de cartes exceeds cardCount.");
        
        for (uint i = 0; i < imgURIs.length; i++) {
            _safeMint(to, nextTokenId);
            cardImages[nextTokenId] = imgURIs[i];  // Stocke l'image de chaque carte
            nextTokenId++;
        }
    }


    // Récupérer l'URI de l'image de la carte
    function getCardImage(uint tokenId) public view returns (string memory) {
        return cardImages[tokenId];
    }

    // Méthode pour obtenir le solde de NFTs d'un propriétaire
    function balanceOf(address owner) public view override returns (uint256) {
        return super.balanceOf(owner); // Appelle la fonction balanceOf d'ERC721
    }

    // Récupérer l'adresse du propriétaire d'un token
    function ownerOf(uint256 tokenId) public view override returns (address) {
        return super.ownerOf(tokenId); // Appelle la fonction ownerOf d'ERC721
    }

    // Récupérer les IDs des tokens détenus par un propriétaire
    function tokensOfOwner(address owner) public view returns (uint256[] memory) {
        uint256 tokenCount = balanceOf(owner);
        uint256[] memory tokens = new uint256[](tokenCount);
        uint256 index = 0;

        for (uint256 i = 0; i < nextTokenId; i++) {
            if (ownerOf(i) == owner) {
                tokens[index] = i;
                index++;
            }
        }
        return tokens;
    }

    // Récupérer le token d'un propriétaire par index
function tokenOfOwnerByIndex(address owner, uint256 index) public view returns (uint256) {
    require(index < balanceOf(owner), "Index out of bounds");
    
    uint256 count;
    for (uint256 i = 0; i < nextTokenId; i++) {
        if (ownerOf(i) == owner) {
            if (count == index) {
                return i;
            }
            count++;
        }
    }
    revert("Token not found"); // Ne devrait pas arriver si le check de l'index est correct
}

}


