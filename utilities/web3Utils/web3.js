import Web3 from 'web3'
import config from '../../config'

export const web3 = new Web3(config.NETWORK.POLYGON.RPC_API)

export const setProvider = async (chainName) => {
  if (chainName === 'POLYGON') {
    web3.setProvider(config.NETWORK.POLYGON.RPC_API)
  } else if (chainName === 'CRONOS') {
    web3.setProvider(config.NETWORK.CRONOS.RPC_API)
  } else if (chainName === 'GNOSIS') {
    web3.setProvider(config.NETWORK.GNOSIS.RPC_API)
  }
}
