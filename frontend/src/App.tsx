import { ChangeEvent, useEffect, useState } from 'react';
import { connect, getMainContract } from './lib/ethereum';
import styles from './styles.module.css';
import { ethers } from 'ethers';
import NftViewer from './components/NftViewer';

interface MintedNFT {
  tokenId: number;
  tokenURI: string;
  name: string; 
  image: string; 
  
}



export const App = () => {
  const [wallet, setWallet] = useState<any | null>(null);
  const [collectionId, setCollectionId] = useState<number>(0);
  const [nfts, setNfts] = useState<any[]>([]);
  const [collections, setCollections] = useState<string[]>([]);
  const [numberOfCards, setNumberOfCards] = useState<number>(1); //  nombre de cartes
  const [imgURIs, setImgURIs] = useState<string[]>([]); // les URI des images
  // Nouvel état pour les cartes Pokémon
  const [pokemonCards, setPokemonCards] = useState<any[]>([]);
  const [loadingPokemon, setLoadingPokemon] = useState<boolean>(false);

  const [pokemonSets, setPokemonSets] = useState<any[]>([]);
  const [mintedNFTs, setMintedNFTs] = useState<MintedNFT[]>([]);

  const [selectedCard, setSelectedCard] = useState<any | null>(null); // Carte Pokémon sélectionnée
  const [boosterMessage, setBoosterMessage] = useState<string>('');

  const [boosterName, setBoosterName] = useState<string>(''); // Nom du booster
  const [selectedCardsForBooster, setSelectedCardsForBooster] = useState<any[]>([]); // Cartes sélectionnées pour le booster



  // Connexion à Metamask
  useEffect(() => {
    const initWallet = async () => {
      const wallet_ = await connect();
      if (wallet_) {
        setWallet(wallet_);
        console.log('Connecté avec le compte:', wallet_.account);
      } else {
        alert('Erreur lors de la connexion à MetaMask.');
      }
    };
    initWallet();
  }, []);

   // Load Pokémon cards from the API
   const loadPokemonCards = async () => {
    setLoadingPokemon(true);
    try {
      const response = await fetch('https://api.pokemontcg.io/v2/cards');
      const data = await response.json();
      setPokemonCards(data.data);
    } catch (error) {
      console.error('Error loading Pokémon cards:', error);
    } finally {
      setLoadingPokemon(false);
    }
  };

  useEffect(() => {
    loadPokemonCards();
  }, []);


  //-------------------Booster --------------------
  // Créer un booster
  /*const createBooster = async () => {
    const boosterData = {
        boosterName: "Starter Pack",
        cards: [
            {
                cardId: "xy7-54",
                cardName: "Pikachu",
                imageURI: "https://example.com/pikachu.png",
                rarity: "Common",
                set: "XY - Ancient Origins",
                hp: 60,
                cardType: "Electric"
            },
            {
                cardId: "xy7-55",
                cardName: "Charmander",
                imageURI: "https://example.com/charmander.png",
                rarity: "Uncommon",
                set: "XY - Ancient Origins",
                hp: 50,
                cardType: "Fire"
            }
        ]
    };

    try {
        const response = await fetch(`http://localhost:3001/api/createBooster`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(boosterData)
        });

        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.error || 'Erreur lors de la création du booster');
        }

        setBoosterMessage('Booster créé avec succès: ' + JSON.stringify(data));
    } catch (error) {
        // Utilisation de la vérification de type
        if (error instanceof Error) {
            console.error('Erreur:', error);
            setBoosterMessage('Erreur lors de la création du booster: ' + error.message);
        } else {
            // Dans le cas où l'erreur n'est pas une instance de Error
            console.error('Erreur inconnue:', error);
            setBoosterMessage('Erreur lors de la création du booster: une erreur inconnue s\'est produite.');
        }
    }
};*/

// Créer un booster basé sur les cartes sélectionnées
/*const createBooster = async () => {
  if (selectedCardsForBooster.length === 0) {
    alert('Veuillez sélectionner au moins une carte pour créer un booster.');
    return;
  }

  const boosterData = {
    boosterName,
    cards: selectedCardsForBooster.map(card => ({
      cardId: card.id,
      cardName: card.name,
      imageURI: card.images.large,
      rarity: card.rarity || 'Unknown',
      set: card.set.name || 'Unknown Set',
      hp: card.hp || 0,
      cardType: card.types ? card.types.join(', ') : 'Unknown',
    })),
  };

  try {
    const response = await fetch(`http://localhost:3001/api/createBooster`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(boosterData),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'Erreur lors de la création du booster');
    }

    setBoosterMessage('Booster créé avec succès: ' + JSON.stringify(data));
    // Réinitialiser après création
    setBoosterName('');
    setSelectedCardsForBooster([]);
  } catch (error) {
    if (error instanceof Error) {
      console.error('Erreur:', error);
      setBoosterMessage('Erreur lors de la création du booster: ' + error.message);
    } else {
      console.error('Erreur inconnue:', error);
      setBoosterMessage('Erreur lors de la création du booster: une erreur inconnue s\'est produite.');
    }
  }
};*/

const createBooster = async () => {
  if (selectedCardsForBooster.length === 0) {
    alert('Veuillez sélectionner au moins une carte pour créer un booster.');
    return;
  }

  const boosterData = {
    boosterName,
    cards: selectedCardsForBooster.map(card => ({
      cardId: card.id,
      cardName: card.name,
      imageURI: card.images.large,
      rarity: card.rarity || 'Unknown',
      set: card.set.name || 'Unknown Set',
      hp: card.hp || 0,
      cardType: card.types ? card.types.join(', ') : 'Unknown',
    })),
  };

  // Ajoute ce log pour voir les données envoyées
  console.log('Données du booster envoyées:', boosterData);

  try {
    const response = await fetch(`http://localhost:3001/api/createBooster`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(boosterData),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'Erreur lors de la création du booster');
    }

    setBoosterMessage('Booster créé avec succès: ' + JSON.stringify(data));
    setBoosterName('');
    setSelectedCardsForBooster([]);
  } catch (error) {
    if (error instanceof Error) {
      console.error('Erreur:', error);
      setBoosterMessage('Erreur lors de la création du booster: ' + error.message);
    } else {
      console.error('Erreur inconnue:', error);
      setBoosterMessage('Erreur lors de la création du booster: une erreur inconnue s\'est produite.');
    }
  }
};


 // Gérer la sélection des cartes pour le booster
 const toggleCardSelection = (card: any) => {
  if (selectedCardsForBooster.includes(card)) {
    setSelectedCardsForBooster(selectedCardsForBooster.filter(c => c !== card));
  } else {
    setSelectedCardsForBooster([...selectedCardsForBooster, card]);
  }
};





  const loadPokemonSets = async () => {
    try {
      const response = await fetch('https://api.pokemontcg.io/v2/sets');
      const data = await response.json();
      setPokemonSets(data.data);
    } catch (error) {
      console.error('Erreur lors de la récupération des sets Pokémon:', error);
    }
  };
 
  

  /// Créer une nouvelle collection
const createCollection = async () => {
  const contract = getMainContract();
  if (!contract || !wallet) {
    alert("Veuillez vous connecter et sélectionner le bon réseau.");
    return;
  }

  try {
    const name = prompt('Nom de la collection :');
    const cardCount = prompt('Nombre de cartes :');
    if (name && cardCount && !isNaN(parseInt(cardCount))) {
      // Appeler la fonction de création de collection
      const tx = await contract.createCollection(name, parseInt(cardCount));

      // Attendre que la transaction soit minée
      const receipt = await tx.wait();

      // Inspecter l'objet receipt pour voir la structure des événements
      console.log('Receipt:', receipt);

      // Vérifier si l'événement CollectionCreated est présent
      const event = receipt.events.find((event: { event: string; }) => event.event === "CollectionCreated");
      if (event && event.args) {
        const collectionId = event.args[0].toNumber(); 
        console.log('Collection créée avec l\'ID:', collectionId);
        setCollectionId(collectionId);  
        alert(`Collection créée avec succès avec l'ID ${collectionId}`);
      } else {
        console.error('Événement CollectionCreated non trouvé dans receipt:', receipt);
        alert('Erreur : Événement de création de collection non trouvé.');
      }
    } else {
      alert('Veuillez fournir un nom valide et un nombre de cartes.');
    }
  } catch (err) {
    console.error('Erreur lors de la création de la collection', err);
    alert('Erreur lors de la création de la collection.');
  }
};


 // Mint une carte Pokémon sélectionnée
 const mintPokemonCard = async () => {
  if (!selectedCard) {
    alert('Veuillez sélectionner une carte Pokémon à mint.');
    return;
  }

  const contract = getMainContract();
  if (!contract || !wallet) {
    alert("Veuillez vous connecter.");
    return;
  }

  try {
    const uri = selectedCard.images.large; // URI de l'image de la carte
    await contract.mintInCollection(collectionId, wallet.account, uri);
    
    // Ajouter le NFT minté à l'état
    const newNFT: MintedNFT = {
      tokenId: nfts.length + 1, // Utiliser un ID basé sur la longueur actuelle de nfts
      tokenURI: uri,
      name: selectedCard.name,
      image: uri
    };
    setNfts([...nfts, newNFT]); // Ajoute le nouveau NFT minté à l'état
    alert("Carte Pokémon mintée avec succès");
    setSelectedCard(null); // Réinitialiser la carte sélectionnée
  } catch (err) {
    console.error("Erreur lors du mint de la carte Pokémon", err);
  }
};


const loadMintedNFTs = async () => {
  const contract = getMainContract();
  if (!contract || !wallet) return;

  try {
    const nftData: MintedNFT[] = [];
    const ownedNFTsCount = await contract.balanceOfInCollection(collectionId, wallet.account);

    if (ownedNFTsCount > 0) {
      const ownedTokenIds = await contract.tokensOfOwnerInCollection(collectionId, wallet.account);
      for (let tokenId of ownedTokenIds) {
        const tokenURI = await contract.getCardImage(collectionId, tokenId);

        nftData.push({ 
          tokenId, 
          tokenURI, 
          name: `Carte #${tokenId}`, // Je vais utilisé un nom par défaut
          image: tokenURI 
        });
      }
    }

    setNfts(nftData);
  } catch (err) {
    console.error('Erreur lors du chargement des NFTs mintés:', err);
  }
};

// Ajuste la méthode pour mint plusieurs cartes Pokémon
const mintMultiplePokemonCards = async () => {
  const contract = getMainContract();
  if (!contract || !wallet) {
    alert("Veuillez vous connecter.");
    return;
  }

  try {
    const urisToMint = pokemonCards.slice(0, numberOfCards).map(card => card.images.large);
    await contract.mintMultipleInCollection(collectionId, wallet.account, urisToMint);
    alert("Cartes Pokémon mintées avec succès");
    await loadMintedNFTs();  // Recharger les NFTs après le mint
  } catch (err) {
    console.error("Erreur lors du mint de plusieurs cartes Pokémon", err);
  }
};


    // Fonction pour récupérer et afficher toutes les collections
    const fetchAllCollections = async () => {
      const contract = getMainContract();
      if (!contract) {
        alert("Le contrat n'est pas disponible.");
        return;
      }
  
      try {
        const collections = await contract.getAllCollections();
        console.log("Collections trouvées:", collections);
        if (collections.length === 0) {
          alert("Aucune collection n'a été trouvée.");
        } else {
          setCollections(collections); // Stocke les collections dans le state
        }
      } catch (err) {
        console.error('Erreur lors de la récupération des collections', err);
        alert('Erreur lors de la récupération des collections.');
      }
    };

  const checkCollectionExists = async (collectionId: number): Promise<boolean> => {
    const contract = getMainContract();
    // Vérifie si le contrat est valide
    if (!contract) {
      console.error("Contrat non disponible.");
      return false;
    }
  
    try {
      const collectionAddress = await contract.getCollection(collectionId);
      // Si l'adresse est valide, cela signifie que la collection existe.
      if (collectionAddress === ethers.constants.AddressZero) {
        return false; // La collection n'existe pas
      }
      return true; // La collection existe
    } catch (err) {
      console.error('Erreur lors de la vérification de la collection:', err);
      return false;
    }
  };
  
  
  // Mint une carte dans une collection
  const mintCard = async () => {
    const contract = getMainContract();
    if (!contract || !wallet) {
      alert("Veuillez vous connecter et sélectionner le bon réseau.");
      return;
    }

    try {
      const imgURI = prompt('Image URI de la carte :');
      if (imgURI) {
        await contract.mintInCollection(collectionId, wallet.account, imgURI);
        alert('Carte mintée avec succès');
      } else {
        alert('Veuillez fournir une URI d\'image valide.');
      }
    } catch (err) {
      console.error('Erreur lors du mint', err);
      alert('Erreur lors du mint de la carte.');
    }
  };

   // Mint plusieurs cartes dans une collection
   const mintMultipleCards = async () => {
    const contract = getMainContract();
    if (!contract || !wallet) {
      alert("Veuillez vous connecter et sélectionner le bon réseau.");
      return;
    }

    try {
      if (imgURIs.length === numberOfCards) {
        await contract.mintMultipleInCollection(collectionId, wallet.account, imgURIs);
        alert('Cartes mintées avec succès');
      } else {
        alert(`Veuillez fournir ${numberOfCards} URI d'images.`);
      }
    } catch (err) {
      console.error('Erreur lors du mint', err);
      alert('Erreur lors du mint des cartes.');
    }
  };


  

  //------------ test pokemon -------------
  const loadNFTs = async () => {
    const contract = getMainContract();
    if (!contract || !wallet) return;
  
    try {
      const nftData = [];
      const totalNFTs = 10; 
      for (let tokenId = 0; tokenId < totalNFTs; tokenId++) {
        try {
          const ownerAddress = await contract.ownerOf(collectionId, tokenId);
          if (ownerAddress === wallet.account) {
            // Récupérer les détails de la carte
            const [image, setName, cardId] = await contract.getCardDetails(collectionId, tokenId);
  
            // Convertir cardId en nombre s'il s'agit d'un BigNumber
            nftData.push({
              tokenId: tokenId,  // Assurez-vous que tokenId est bien un nombre
              image: image,
              setName: setName,
              cardId: cardId.toString()  // Convertir BigNumber en chaîne
            });
          }
        } catch (err) {
          console.error(`Erreur lors de la récupération du propriétaire du token ${tokenId}:`, err);
        }
      }
      setNfts(nftData);
    } catch (err) {
      console.error('Erreur lors du chargement des NFTs:', err);
    }
  };
  



 


   // Gestion de la saisie des URI
   const handleURIsChange = (index: number, value: string) => {
    const newURIs = [...imgURIs];
    newURIs[index] = value;
    setImgURIs(newURIs);
  };

 
  // Fonction pour récupérer les sets Pokémon depuis l'API
  const fetchPokemonSets = async () => {
    try {
      const response = await fetch('https://api.pokemontcg.io/v2/sets');
      const data = await response.json();
      console.log('Sets de cartes Pokémon disponibles:', data);
      setPokemonSets(data.data);  // Stocker les sets dans le state
    } catch (error) {
      console.error('Erreur lors de la récupération des sets Pokémon:', error);
    }
  };

  const addSelectedSetsToContract = async () => {
    const contract = getMainContract();
    if (!contract || !wallet) {
      alert("Veuillez vous connecter et sélectionner le bon réseau.");
      return;
    }
  
    try {
      for (const set of pokemonSets) { 
        await contract.addSet(set.id, set.name, set.total);
      }
      alert('Sets ajoutés avec succès au contrat');
    } catch (err) {
      console.error('Erreur lors de l\'ajout des sets:', err);
    }
  };
  

  

  function handleSetSelection(e: ChangeEvent<HTMLInputElement>, set: any): void {
    throw new Error('Function not implemented.');
  }


  

  return (
    <div className={styles.body}>
      <h1> Gestion de Pokémon Collection et NFTs</h1>

      {/* Sélectionner l'ID de la collection */}
      <label>
        Collection ID:
        <input
          type="number"
          value={collectionId}
          onChange={(e) => setCollectionId(Number(e.target.value))}
        />
      </label>

      {/* Bouton pour créer une collection */}
      <button onClick={createCollection}>Créer une Collection</button>

      
      <button onClick={loadMintedNFTs}>Charger vos NFTs</button>


 {/* Afficher le message de booster */}
 {boosterMessage && <p>{boosterMessage}</p>} {/* Affiche le message */}


       <h2>Vos NFTs Mintés</h2>
      <div className={styles.nftContainer}>
        {nfts.map((nft) => (
          <div key={nft.tokenId} className={styles.nftCard}>
            <img src={nft.image} alt={`NFT ${nft.tokenId}`} />
            <p>Nom de la carte : {nft.name}</p>
          </div>
        ))}
      </div>
     

      {/* Afficher les cartes Pokémon */}
      <h2>Cartes Pokémon</h2>
      {loadingPokemon ? (
        <p>Chargement des cartes Pokémon...</p>
      ) : (
        <div className={styles.cardContainer}>
          {pokemonCards.map((card) => (
            <div key={card.id} className={styles.card}>
              <img src={card.images.large} alt={card.name} />
              <p>{card.name}</p>
              <button onClick={() => setSelectedCard(card)}>Selectionner cette carte</button>
            </div>
          ))}
        </div>
      )}

      <button onClick={mintPokemonCard} disabled={!selectedCard}>Mint la carte sélectionnée</button>

  {/* Section pour créer un Booster */}
  <h2>Créer un Booster</h2>
      <label>
        Nom du Booster:
        <input
          type="text"
          value={boosterName}
          onChange={(e) => setBoosterName(e.target.value)}
        />
      </label>
      <button onClick={createBooster} disabled={!boosterName || selectedCardsForBooster.length === 0}>
        Créer le Booster
      </button>

      {/* Afficher le message de booster */}
      {boosterMessage && <p>{boosterMessage}</p>}
     
    </div>
  );

};

