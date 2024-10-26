/*import { useEffect, useState } from 'react';
import axios from 'axios';
import { connect , getMainContract } from '../lib/ethereum';
import styles from '../styles.module.css';

const NftViewer = () => {
  const [nfts, setNfts] = useState<any[]>([]);
  const [wallet, setWallet] = useState<any | null>(null);
  
  // Connexion à Metamask
  useEffect(() => {
    const initWallet = async () => {
      const wallet_ = await connect();
      if (wallet_) {
        setWallet(wallet_);
        fetchNFTs(wallet_.account);
      } else {
        alert('Erreur lors de la connexion à MetaMask.');
      }
    };
    initWallet();
  }, []);

  // Récupérer tous les NFTs d'un utilisateur
  /*
  const fetchNFTs = async (account: string) => {
    const contract = getMainContract();
    if (!contract) {
      alert("Le contrat n'est pas disponible.");
      return;
    }
    console.log("Contract instance:", contract); // Ajoutez ce log


    try {
      const collectionId = 0;
      const balance = await contract.balanceOfInCollection(collectionId, account);

      console.log("Balance:", balance.toString()); // Ajoutez ce log

      const nftList = [];
      for (let i = 0; i < balance.toNumber(); i++) {
        const tokenId = await contract.tokenOfOwnerByIndex(account, i);
        const response = await axios.get(`http://localhost:3001/api/nft/${tokenId}`);
        nftList.push({ tokenId, ...response.data });
      }
      setNfts(nftList);
    } catch (err) {
      console.error('Erreur lors de la récupération des NFTs', err);
      alert('Erreur lors de la récupération des NFTs.');
    }
  };

  const fetchNFTs = async (account: string) => {
    const contract = getMainContract();
    if (!contract) {
      alert("Le contrat n'est pas disponible.");
      return;
    }
  
    try {
      const collectionId = 0; // Remplacez par l'ID de la collection appropriée
      const balance = await contract.balanceOfInCollection(collectionId, account); // Utiliser balanceOfInCollection
  
      const nftList = [];
      for (let i = 0; i < balance.toNumber(); i++) { // Assurez-vous que balance est un BigNumber
        const tokenId = await contract.tokensOfOwnerInCollection(collectionId, account); // Utiliser tokensOfOwnerInCollection
        nftList.push({ tokenId, ...await contract.getCardImage(collectionId, tokenId) }); // Obtenir l'image associée
      }
      setNfts(nftList);
    } catch (err) {
      console.error('Erreur lors de la récupération des NFTs', err);
      alert('Erreur lors de la récupération des NFTs.');
    }
  };
  

  // Rendu du composant
  return (
    <div className={styles.body}>
      <h1>Mes NFTs</h1>
      <div className={styles.nftContainer}>
        {nfts.length > 0 ? (
          nfts.map((nft, index) => (
            <div key={index} className={styles.nftCard}>
              <img src={nft.image} alt={`NFT ${nft.tokenId}`} />
              <p>{nft.name}</p>
              <p>ID: {nft.tokenId.toString()}</p>
            </div>
          ))
        ) : (
          <p>Aucun NFT trouvé</p>
        )}
      </div>
    </div>
  );
};

export default NftViewer;*/

import { useEffect, useState } from 'react'; 
import axios from 'axios';
import { connect, getMainContract } from '../lib/ethereum';
import styles from '../styles.module.css';

interface NFT {
  tokenId: number;
  image: string;
}

const NftViewer = () => {
  const [nfts, setNfts] = useState<NFT[]>([]);
  const [wallet, setWallet] = useState<any | null>(null);
  
  // Connexion à Metamask
  useEffect(() => {
    const initWallet = async () => {
      const wallet_ = await connect();
      if (wallet_) {
        setWallet(wallet_);
        fetchNFTs(wallet_.account);
      } else {
        alert('Erreur lors de la connexion à MetaMask.');
      }
    };
    initWallet();
  }, []);

  // Récupérer tous les NFTs d'un utilisateur
  /*const fetchNFTs = async (account: string) => {
    const contract = getMainContract();
    if (!contract) {
      alert("Le contrat n'est pas disponible.");
      return;
    }

    try {
      const collectionId = 0; // Remplacez par l'ID de la collection appropriée
      const balance = await contract.balanceOfInCollection(collectionId, account); // Utiliser balanceOfInCollection

      const tokenIds: number[] = await contract.tokensOfOwnerInCollection(collectionId, account); // Obtenir tous les token IDs

      const nftList = await Promise.all(tokenIds.map(async (tokenId: number) => {
        const imageURI = await contract.getCardImage(collectionId, tokenId); // Obtenir l'image associée
        return { tokenId, image: imageURI };
      }));

      setNfts(nftList);
    } catch (err) {
      console.error('Erreur lors de la récupération des NFTs', err);
      alert('Erreur lors de la récupération des NFTs.');
    }
  };*/
  const fetchNFTs = async (account: string) => {
    const contract = getMainContract();
    if (!contract) {
      alert("Le contrat n'est pas disponible.");
      return;
    }
  
    try {
      const collectionId = 0; // Remplacez par l'ID de la collection appropriée
      const balance = await contract.balanceOfInCollection(collectionId, account); // Nombre de NFTs

      const tokenIds: number[] = await contract.tokensOfOwnerInCollection(collectionId, account);
  
      // Récupérer les métadonnées pour tous les NFTs en une seule fois
      const nftList = await Promise.all(tokenIds.map(async (tokenId: number) => {
        const response = await axios.get(`http://localhost:3001/api/nft/${tokenId}`);
        return {
          tokenId : response.data.tokenId,
          image: response.data.image,
        };
      }));
  
      setNfts(nftList);
    } catch (err) {
      console.error('Erreur lors de la récupération des NFTs', err);
      alert('Erreur lors de la récupération des NFTs.');
    }
  };
  

  // Rendu du composant
  return (
    <div className={styles.body}>
      <h1>Mes NFTs</h1>
      <div className={styles.nftContainer}>
        {nfts.length > 0 ? (
          nfts.map((nft, index) => (
            <div key={index} className={styles.nftCard}>
              <img src={nft.image} alt={`NFT ${nft.tokenId}`} />
              <p>ID: {nft.tokenId.toString()}</p>
            </div>
          ))
        ) : (
          <p>Aucun NFT trouvé</p>
        )}
      </div>
    </div>
  );
};

export default NftViewer;


