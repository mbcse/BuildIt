import pkg from '@ethereumjs/tx'
import { getAdminWallet } from './adminWalletManager.js'
import { web3 } from './web3.js'
import { getNonce } from './nonceManager.js'
import config from '../../config'
import Common, { Chain } from '@ethereumjs/common'
import xdc3 from 'xdc3'
const { Transaction: Tx } = pkg

// const common = require('ethereumjs-common')
// const chain = common.default.forCustomChain(
//   'mainnet', {
//     name: 'bnb',
//     networkId: config.CHAIN_ID[config.BNB.NETWORK.CHAIN_NAME],
//     chainId: config.CHAIN_ID[config.BNB.NETWORK.CHAIN_NAME]
//   },
//   'petersburg'
// )

const customChainParams = { name: 'TXDC', chainId: 51, networkId: 51 }

export const createTx = async (txObject) => {
  const ADMIN_WALLET = await getAdminWallet()
  const adminAddress = ADMIN_WALLET.address

  txObject.from = adminAddress

  const gasPrice = await web3.eth.getGasPrice()
  txObject.gasPrice = web3.utils.toHex(gasPrice)

  const nonceCount = await getNonce(adminAddress)
  txObject.nonce = web3.utils.toHex(nonceCount)
  console.log('hello1')

  txObject.chainId = web3.utils.toHex(51)
  console.log('hello2')

  txObject.from = xdc3.utils.toXdcAddress(adminAddress)
  console.log('hello3')

  txObject.to = xdc3.utils.toXdcAddress(txObject.to)
  console.log('hello4')
  console.log(txObject)

  // eslint-disable-next-line new-cap
  const privateKey = new Buffer.from(ADMIN_WALLET.privateKey.slice(2), 'hex')
  console.log(Common.default)
  const common = Common.default.forCustomChain('mainnet', customChainParams, 'petersburg')
  console.log('hello5')

  let tx = new Tx(txObject, { common, chain: 'TXDC', hardfork: 'petersburg' })
  console.log('hello6')

  tx = tx.sign(privateKey)
  console.log(tx)
  const serializedTx = tx.serialize()
  console.log(serializedTx)

  return '0x' + serializedTx.toString('hex')
}
