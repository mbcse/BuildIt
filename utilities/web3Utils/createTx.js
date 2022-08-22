import pkg from '@ethereumjs/tx'
import { getAdminWallet } from './adminWalletManager.js'
import { web3 } from './web3.js'
import { getNonce } from './nonceManager.js'
import config from '../../config'
import _Common, { Chain } from '@ethereumjs/common'
const Common = _Common.default
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

export const createTx = async (txObject, chainName) => {
  const chainId = config.NETWORK[chainName].CHAINID
  const networkId = config.NETWORK[chainName].NETWORKID
  console.log(chainId)
  console.log(networkId)

  const customChainParams = { name: chainName, chainId, networkId }

  const ADMIN_WALLET = await getAdminWallet()
  const adminAddress = ADMIN_WALLET.address

  // txObject.from = adminAddress
  console.log('hello address1')
  const gasPrice = await web3.eth.getGasPrice()
  txObject.gasPrice = web3.utils.toHex(gasPrice)

  const nonceCount = await getNonce(adminAddress, chainId)
  txObject.nonce = web3.utils.toHex(nonceCount)

  txObject.chainId = web3.utils.toHex(chainId)
  console.log('hello address2')

  // eslint-disable-next-line new-cap
  const privateKey = new Buffer.from(ADMIN_WALLET.privateKey.slice(2), 'hex')
  const common = Common.forCustomChain(Chain.Mainnet, customChainParams)

  let tx = Tx.fromTxData(txObject, { common, chain: chainName })
  console.log('hello address3')

  tx = tx.sign(privateKey)
  console.log('hello address4')

  const serializedTx = tx.serialize()

  return '0x' + serializedTx.toString('hex')
}
