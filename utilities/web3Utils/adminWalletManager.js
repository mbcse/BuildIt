import ethers from 'ethers'
import config from '../../config'
// const { logger } = require('../../utilities/logger')

export const getAdminWallet = async () => {
  const wallet = new ethers.Wallet(config.PRIVATE_KEYS.COMMON)
  // logger.log(wallet.address)
  return wallet
}

// logger.log( module.exports.getAdminWallet().privateKey);
