import { ethers } from 'ethers'
import config from '../../config'

export async function createWallet () {
  const wallet = ethers.Wallet.createRandom()
  const encryptedWalletJson = await wallet.encrypt(config.KEY_SECURE_PASSWORD)

  return { address: wallet.address, encryptedWalletJson, publicKey: wallet.publicKey }
}
