import { saveFileToIPFS } from '../utilities/ipfsPinataUtils'
import config from '../config'

export const ipfsImageUploader = async (name, path) => {
  const ipfsData = await saveFileToIPFS({
    name,
    path
  })

  if (!ipfsData) {
    throw new Error('Image upload failed')
  }

  const IPFS_URL = config.PINATA.URL + ipfsData.IpfsHash
  return IPFS_URL
}
