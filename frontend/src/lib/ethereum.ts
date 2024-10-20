/*import { ethers } from 'ethers'
import * as providers from './ethereum/provider'
export * as account from './ethereum/account'
import contractData from '../contracts.json'



export type Wallet = 'metamask' | 'silent'

export type Details = {
  provider: ethers.providers.Provider
  signer?: ethers.providers.JsonRpcSigner
  account?: string
}

const contractABI = contractData.contracts.Main.abi;
const contractAddress = contractData.contracts.Main.address;


const metamask = async (requestAccounts = true): Promise<Details | null> => {
  const ethereum = (window as any).ethereum
  if (ethereum) {
    if (requestAccounts)
      await ethereum.request({ method: 'eth_requestAccounts' })
    const provider = new ethers.providers.Web3Provider(ethereum as any)
    const accounts = await provider.listAccounts()
    const account = accounts.length ? accounts[0] : undefined
    const signer = account ? provider.getSigner() : undefined
    return { provider, signer, account }
  }
  return null
}

const silent = async (): Promise<Details> => {
  const ethereum = (window as any).ethereum
  if (ethereum) {
    const unlocked = await ethereum?._metamask?.isUnlocked?.()
    if (unlocked) return (await metamask(false))!
    const provider = new ethers.providers.Web3Provider(ethereum as any)
    return { provider }
  }
  const provider = providers.fromEnvironment()
  return { provider }
}

export const connect = async (provider: Wallet) => {
  switch (provider) {
    case 'metamask':
      return metamask()
    case 'silent':
      return silent()
    default:
      return null
  }
}

// Fonction pour récupérer l'instance du contrat
export const getContract = async (signerOrProvider: ethers.Signer | ethers.providers.Provider) => {
  const contract = new ethers.Contract(contractAddress, contractABI, signerOrProvider);
  return contract;
};

// Connecter et charger le contrat
export const connectAndLoadContract = async (providerType: Wallet): Promise<{ details: Details, contract: ethers.Contract } | null> => {
  const details = await connect(providerType);
  if (details?.provider && details.signer) {
    const contract = await getContract(details.signer);
    return { details, contract };
  }
  return null;
};

// Gestion des changements de comptes
export const accountsChanged = (callback: (accounts: string[]) => void) => {
  const ethereum = (window as any).ethereum
  if (ethereum && ethereum.on) {
    ethereum.on('accountsChanged', callback)
    return () => ethereum.removeListener('accountsChanged', callback)
  } else {
    return () => {}
  }
}

// Gestion des changements de chaînes
export const chainChanged = (callback: (accounts: string[]) => void) => {
  const ethereum = (window as any).ethereum
  if (ethereum && ethereum.on) {
    ethereum.on('chainChanged', callback)
    return () => ethereum.removeListener('chainChanged', callback)
  } else {
    return () => {}
  }
}

// Fonction pour récupérer le propriétaire d'une carte NFT
export const getOwnerOf = async (providerType: Wallet, collectionId: number, tokenId: number) => {
  const result = await connectAndLoadContract(providerType);
  if (result) {
    const { contract } = result;

    // Appel de la fonction ownerOf du contrat
    const owner = await contract.ownerOf(collectionId, tokenId);
    console.log(`Propriétaire de la carte ${tokenId} dans la collection ${collectionId} :`, owner);
    return owner;
  }
  return null;
}

// Fonction pour récupérer l'image d'une carte NFT
export const getCardImage = async (providerType: Wallet, collectionId: number, tokenId: number) => {
  const result = await connectAndLoadContract(providerType);
  if (result) {
    const { contract } = result;

    // Appel de la fonction getCardImage du contrat
    const imageURI = await contract.getCardImage(collectionId, tokenId);
    console.log(`Image de la carte ${tokenId} dans la collection ${collectionId} :`, imageURI);
    return imageURI;
  }
  return null;
}*/

import { ethers } from 'ethers';
import MainABI from '../contracts.json'; // ABI du contrat Main après la compilation

let mainContract: ethers.Contract | null = null;

export const connect = async () => {
  try{
  if (!(window as any).ethereum) {
    alert('Metamask non détecté');
    return null;
  }

  const provider = new ethers.providers.Web3Provider((window as any).ethereum);
  await provider.send('eth_requestAccounts', []);
  const signer = provider.getSigner();

   // Vérifie si MetaMask est connecté au bon réseau (ici, Hardhat Network)
   const network = await provider.getNetwork();
   const expectedChainId = 31337; // ID de chaîne pour Hardhat

   if (network.chainId !== expectedChainId) {
     alert(`Veuillez vous connecter au bon réseau. ID de chaîne attendu : ${expectedChainId}`);
     return null;
   }

  // Adresse déployée du contrat Main
  const contractAddress = '0x5FbDB2315678afecb367f032d93F642f64180aa3'; 
  mainContract = new ethers.Contract(contractAddress, MainABI.contracts.Main.abi, signer);

  const account = await signer.getAddress();
  return { provider, signer, account };
} catch (error){
  console.error('Erreur lors de la connexion à MetaMask :', error);
  alert('Une erreur est survenue lors de la connexion à MetaMask.');
  return null;
}
};

export const getMainContract = () => {
  if (!mainContract) {
    alert('Le contrat n\'est pas encore initialisé. Assurez-vous de vous être connecté.');
  }
  return mainContract;
};
