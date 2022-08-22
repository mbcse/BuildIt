import { ethers } from 'ethers'
import config from '../../config'

export async function getWallet (encryptedWalletJson) {
  const wallet = await ethers.Wallet.fromEncryptedJson(encryptedWalletJson, config.KEY_SECURE_PASSWORD)
  return wallet
}
