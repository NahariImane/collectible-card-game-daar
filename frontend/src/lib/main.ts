import { ethers } from 'ethers'
import * as ethereum from './ethereum'
import { contracts } from '@/contracts.json'
import type { Main } from '$/src/Main'
export type { Main } from '$/src/Main'

export const correctChain = () => {
  return 31337
}

/*export const init = async (details: ethereum.Details) => {
  const { provider, signer } = details
  const network = await provider.getNetwork()
  if (correctChain() !== network.chainId) {
    console.error('Please switch to HardHat')
    return null
  }
  const { address, abi } = contracts.Main
  const contract = new ethers.Contract(address, abi, provider)
  const deployed = await contract.deployed()
  if (!deployed) return null
  const contract_ = signer ? contract.connect(signer) : contract
  return contract_ as any as Main
}*/

/* Nouvelle fonction pour obtenir le propriétaire d'un NFT
export const ownerOf = async (contract: Main, tokenId: number) => {
  try {
    return await contract.ownerOf(tokenId)
  } catch (err) {
    console.error(`Erreur pour obtenir le propriétaire du NFT ${tokenId}`, err)
    return null
  }
}

// Nouvelle fonction pour obtenir l'image ou les métadonnées d'un NFT
export const getCardImage = async (contract: Main, tokenId: number) => {
  try {
    return await contract.getCardImage(tokenId) // Remplace avec le nom exact de ta fonction Solidity
  } catch (err) {
    console.error(`Erreur pour obtenir l'image du NFT ${tokenId}`, err)
    return null
  }
}*/


export const myShip = () => contracts.Main.address


