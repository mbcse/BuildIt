import * as ethUtil from 'ethereumjs-util'

export const getSigningData = async (message) => {
  const nonce = Math.floor(Math.random() * 1000000)

  const signingData = message + ' ReqId:' + nonce

  // const dataBuffer = Buffer.from(signingData)
  // const dataHash = ethUtil.hashPersonalMessage(dataBuffer)
  // const signingDataHash = ethUtil.bufferToHex(dataHash)

  return { data: signingData, nonce }
}

export const verifySignature = async (message, nonce, signature, signer) => {
  const signingMessage = message + ' ReqId:' + nonce
  // const signingMessageHash = ethUtil.keccak256(Buffer.from(signingMessage, 'utf-8')) // If web3.eth.sign used in frontend
  const signingMessageHash = ethUtil.hashPersonalMessage(Buffer.from(signingMessage)) // If web3.perosnal.sign used in frontend
  const { v, r, s } = ethUtil.fromRpcSig(signature)
  const pubKey = ethUtil.ecrecover(signingMessageHash, v, r, s)
  const addrBuf = ethUtil.pubToAddress(pubKey)
  const addr = ethUtil.bufferToHex(addrBuf)
  console.log(addr)
  return addr.toLowerCase() === signer.toLowerCase()
}
