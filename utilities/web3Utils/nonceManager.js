import { web3 } from './web3.js'
import logger from '../logger.js'
const NONCE = { 338: {}, 100: {}, 80001: {} }

const walletWalidator = (wallet) => {
  if (!wallet) throw Error('wallet not received')
  if (!web3.utils.isAddress(wallet)) throw Error('invalid address')
}

export const init = async (wallet, chainId) => {
  walletWalidator(wallet)
  NONCE[chainId][wallet] = await web3.eth.getTransactionCount(wallet, 'pending')
  console.log(NONCE[chainId][wallet])
  setInterval(async () => {
    NONCE[chainId][wallet] = await web3.eth.getTransactionCount(wallet, 'pending')
    // logger.debug('Current Admin Nounce: ' + NONCE[wallet])
  }, 60000)
}

export const updateNonce = (wallet, chainId) => {
  walletWalidator(wallet)
  NONCE[chainId][wallet]++
}

export const getNonce = async (wallet, chainId) => {
  console.log(chainId)
  walletWalidator(wallet)
  if (!NONCE[chainId][wallet]) await init(wallet, chainId)
  console.log(NONCE)
  logger.debug('Nounce: ' + NONCE[chainId][wallet])
  return NONCE[chainId][wallet]++
}
