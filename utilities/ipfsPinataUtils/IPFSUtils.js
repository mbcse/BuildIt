import pinataSDK from '@pinata/sdk'
import config from '../../config'
const pinata = pinataSDK(config.PINATA.API_KEY, config.PINATA.API_SECRET)

export const saveFileToIPFS = async (data) => {
  try {
    const options = {
      pinataMetadata: {
        name: data.name
      },
      pinataOptions: {
        cidVersion: 0
      }
    }

    const pinataData = await pinata.pinFromFS(data.path, options)
    return pinataData
  } catch (e) {
    console.error(e)
    return false
  }
}

export const saveJSONToIPFS = async (json) => {
  try {
    const options = {
      pinataMetadata: {
        name: json.name
      },
      pinataOptions: {
        cidVersion: 0
      }
    }

    const pinataData = await pinata.pinJSONToIPFS(json, options)
    return pinataData
  } catch (e) {
    console.error(e)
    return false
  }
}

export const testIPFSAuth = () => {
  pinata
    .testAuthentication()
    .then((result) => {
      console.log('IPFS Auth')
      console.log(result)
    })
    .catch((err) => {
      console.log('IPFS Error')
      console.log(err)
    })
}
