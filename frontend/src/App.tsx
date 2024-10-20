/*import { useEffect, useMemo, useRef, useState } from 'react'
import styles from './styles.module.css'
import * as ethereum from '@/lib/ethereum'
import * as main from '@/lib/main'

type Canceler = () => void
const useAffect = (
  asyncEffect: () => Promise<Canceler | void>,
  dependencies: any[] = []
) => {
  const cancelerRef = useRef<Canceler | void>()
  useEffect(() => {
    asyncEffect()
      .then(canceler => (cancelerRef.current = canceler))
      .catch(error => console.warn('Uncatched error', error))
    return () => {
      if (cancelerRef.current) {
        cancelerRef.current()
        cancelerRef.current = undefined
      }
    }
  }, dependencies)
}

const useWallet = () => {
  const [details, setDetails] = useState<ethereum.Details>()
  const [contract, setContract] = useState<main.Main>()
  useAffect(async () => {
    const details_ = await ethereum.connect('metamask')
    if (!details_) return
    setDetails(details_)
    const contract_ = await main.init(details_)
    if (!contract_) return
    setContract(contract_)
  }, [])
  return useMemo(() => {
    if (!details || !contract) return
    return { details, contract }
  }, [details, contract])
}

export const App = () => {
  const wallet = useWallet();
  const [nfts, setNfts] = useState<any[]>([]); // État pour stocker les NFTs

  const loadNFTs = async () => {
    if (!wallet || !wallet.contract) return;

    try {
      const nftData = [];
      const totalNFTs = 10; // Exemple : récupérer 10 NFTs
      for (let tokenId = 0; tokenId < totalNFTs; tokenId++) {
        const ownerAddress = await wallet.contract.ownerOf(tokenId);
        if (ownerAddress === wallet.details.account) {
          const image = await wallet.contract.getCardImage(tokenId); // Hypothèse : une fonction getCardImage existe
          nftData.push({ tokenId, image });
        }
      }
      setNfts(nftData); // Mettre à jour l'état avec les NFT récupérés
    } catch (err) {
      console.error('Erreur lors du chargement des NFTs:', err);
    }
  };


  return (
   <div className={styles.body}>
      <h1>Welcome to Pokémon TCG</h1>

      {/* Bouton pour charger les NFTs /}
      <button onClick={loadNFTs}>Charger mes NFTs</button>

      {/* Affichage des NFTs /}
      <div className={styles.nftContainer}>
        {nfts.length > 0 ? (
          nfts.map((nft, index) => (
            <div key={index} className={styles.nftCard}>
              <img src={nft.image} alt={`NFT ${nft.tokenId}`} />
              <p>ID: {nft.tokenId}</p>
            </div>
          ))
        ) : (
          <p>Aucun NFT trouvé</p>
        )}
      </div>
    </div>
  )
}

*/

/*import { useEffect, useState } from 'react';
import { connect, getMainContract } from './lib/ethereum';
import styles from './styles.module.css';

export const App = () => {
  const [wallet, setWallet] = useState<any | null>(null);
  const [collectionId, setCollectionId] = useState<number>(0);
  const [nfts, setNfts] = useState<any[]>([]);

  // Connexion à Metamask
  useEffect(() => {
    const initWallet = async () => {
      const wallet_ = await connect();
      if (wallet_) setWallet(wallet_);
    };
    initWallet();
  }, []);

  // Créer une nouvelle collection
  const createCollection = async () => {
    const contract = getMainContract();
    if (!contract || !wallet) return;

    try {
      const name = prompt('Nom de la collection :');
      const cardCount = prompt('Nombre de cartes :');
      if (name && cardCount) {
        await contract.createCollection(name, parseInt(cardCount));
        alert('Collection créée avec succès');
      }
    } catch (err) {
      console.error('Erreur lors de la création de la collection', err);
    }
  };

  // Mint une carte dans une collection
  const mintCard = async () => {
    const contract = getMainContract();
    if (!contract || !wallet) return;

    try {
      const imgURI = prompt('Image URI de la carte :');
      if (imgURI) {
        await contract.mintInCollection(collectionId, wallet.account, imgURI);
        alert('Carte mintée avec succès');
      }
    } catch (err) {
      console.error('Erreur lors du mint', err);
    }
  };

  // Charger les NFTs de l'utilisateur
  const loadNFTs = async () => {
    const contract = getMainContract();
    if (!contract || !wallet) return;

    try {
      const nftData = [];
      const totalNFTs = 10; // Nombre de NFTs à charger
      for (let tokenId = 0; tokenId < totalNFTs; tokenId++) {
        const ownerAddress = await contract.ownerOf(collectionId, tokenId);
        if (ownerAddress === wallet.account) {
          const image = await contract.getCardImage(collectionId, tokenId);
          nftData.push({ tokenId, image });
        }
      }
      setNfts(nftData);
    } catch (err) {
      console.error('Erreur lors du chargement des NFTs:', err);
    }
  };

  return (
    <div className={styles.body}>
      <h1>Gestion de Collection et NFTs</h1>

      {/* Sélectionner l'ID de la collection /}
      <label>
        Collection ID:
        <input
          type="number"
          value={collectionId}
          onChange={(e) => setCollectionId(Number(e.target.value))}
        />
      </label>

      {/* Bouton pour créer une collection /}
      <button onClick={createCollection}>Créer une Collection</button>

      {/* Bouton pour mint une carte /}
      <button onClick={mintCard}>Mint une Carte</button>

      {/* Bouton pour charger les NFTs /}
      <button onClick={loadNFTs}>Charger mes NFTs</button>

      {/* Affichage des NFTs /}
      <div className={styles.nftContainer}>
        {nfts.length > 0 ? (
          nfts.map((nft, index) => (
            <div key={index} className={styles.nftCard}>
              <img src={nft.image} alt={`NFT ${nft.tokenId}`} />
              <p>ID: {nft.tokenId}</p>
            </div>
          ))
        ) : (
          <p>Aucun NFT trouvé</p>
        )}
      </div>
    </div>
  );
};

*/

import { useEffect, useState } from 'react';
import { connect, getMainContract } from './lib/ethereum';
import styles from './styles.module.css';
import { ethers } from 'ethers';

export const App = () => {
  const [wallet, setWallet] = useState<any | null>(null);
  const [collectionId, setCollectionId] = useState<number>(0);
  const [nfts, setNfts] = useState<any[]>([]);

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

  // Créer une nouvelle collection
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
        await contract.createCollection(name, parseInt(cardCount));
        alert('Collection créée avec succès');
      } else {
        alert('Veuillez fournir un nom valide et un nombre de cartes.');
      }
    } catch (err) {
      console.error('Erreur lors de la création de la collection', err);
      alert('Erreur lors de la création de la collection.');
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

  // Charger les NFTs de l'utilisateur
  /*const loadNFTs = async () => {
    const contract = getMainContract();
    if (!contract || !wallet) {
      alert("Veuillez vous connecter et sélectionner le bon réseau.");
      return;
    }

    try {
      const nftData = [];
      const totalNFTs = 10; // Nombre de NFTs à charger (à ajuster selon le besoin)
      for (let tokenId = 0; tokenId < totalNFTs; tokenId++) {
        const ownerAddress = await contract.ownerOf(collectionId, tokenId);
        if (ownerAddress.toLowerCase() === wallet.account.toLowerCase()) {
          const image = await contract.getCardImage(collectionId, tokenId);
          nftData.push({ tokenId, image });
        }
      }
      setNfts(nftData);
    } catch (err) {
      console.error('Erreur lors du chargement des NFTs:', err);
      alert('Erreur lors du chargement des NFTs.');
    }
  };*/

/* --------------------- ca marche -------------------- 
  const loadNFTs = async () => {
    const contract = getMainContract();
    if (!contract || !wallet) return;
  
    try {
      const nftData = [];
      const totalNFTs = 10; // Nombre de NFTs à charger
      for (let tokenId = 0; tokenId < totalNFTs; tokenId++) {
        try {
          const ownerAddress = await contract.ownerOf(collectionId, tokenId);
          if (ownerAddress === wallet.account) {
            const image = await contract.getCardImage(collectionId, tokenId);
            nftData.push({ tokenId, image });
          }
        } catch (err) {
          console.error(`Erreur lors de la récupération de l'owner pour le token ${tokenId}:`, err);
        }
      }
      setNfts(nftData);
    } catch (err) {
      console.error('Erreur lors du chargement des NFTs:', err);
    }
  };
  */

  const loadNFTs = async () => {
    const contract = getMainContract();
    if (!contract || !wallet) return;
  
    try {
      const nftData = [];
      const totalNFTs = 10; // Nombre de NFTs à charger (en fonction de ta collection)
  
      for (let tokenId = 0; tokenId < totalNFTs; tokenId++) {
        try {
          // Vérifier si ce token existe avant d'essayer d'obtenir son propriétaire
          const ownerAddress = await contract.ownerOf(collectionId, tokenId);
          if (ownerAddress === wallet.account) {
            const image = await contract.getCardImage(collectionId, tokenId);
            nftData.push({ tokenId, image });
          }
        } catch (err) {
          console.error(`Erreur lors de la récupération du propriétaire pour le token ${tokenId}:`, err);
          // Si on capture une erreur (par exemple, token non existant), on continue à itérer
        }
      }
  
      setNfts(nftData);
    } catch (err) {
      console.error('Erreur lors du chargement des NFTs:', err);
    }
  };
  

  return (
    <div className={styles.body}>
  <h1>Gestion de Collection et NFTs</h1>

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

  {/* Bouton pour mint une carte */}
  <button onClick={mintCard}>Mint une Carte</button>

  {/* Bouton pour charger les NFTs */}
  <button onClick={loadNFTs}>Charger mes NFTs</button>

  {/* Affichage des NFTs */}
  <div className={styles.nftContainer}>
    {nfts.length > 0 ? (
      nfts.map((nft, index) => (
        <div key={index} className={styles.nftCard}>
          <img src={nft.image} alt={`NFT ${nft.tokenId}`} />
          <p>ID: {nft.tokenId}</p>
        </div>
      ))
    ) : (
      <p>Aucun NFT trouvé</p>
    )}
  </div>
</div>

  );
};

