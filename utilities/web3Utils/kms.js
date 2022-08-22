import { KMS } from 'aws-sdk'
import config from '../config'
import { EcdsaPubKey } from '../utilities/ans1Decoder'
import responseUtil from '../utilities/response'
import { keccak256 } from 'js-sha3'

const kms = new KMS(config.KMS.ACCOUNT_CRED)

const getPublicKey = async function (keyPairId) {
  return kms.getPublicKey({
    KeyId: keyPairId
  }).promise()
}

const sign = async function (msgHash) {
  const params = {
    // key id or 'Alias/<alias>'
    KeyId: config.KMS.KEY_ID,
    Message: msgHash,
    // 'ECDSA_SHA_256' is the one compatible with ECC_SECG_P256K1.
    SigningAlgorithm: 'ECDSA_SHA_256',
    MessageType: 'DIGEST'
  }
  const res = await kms.sign(params).promise()
  return res
}

const getEthereumAddress = async function () {
  const publicKey = await getPublicKey(config.KMS.KEY_ID)

  // The public key is ASN1 encoded in a format according to
  // https://tools.ietf.org/html/rfc5480#section-2
  // I used https://lapo.it/asn1js to figure out how to parse this
  // and defined the schema in the EcdsaPubKey object
  const decoded = EcdsaPubKey.decode(publicKey.PublicKey, 'der')
  let pubKeyBuffer = decoded.pubKey.data

  // The public key starts with a 0x04 prefix that needs to be removed
  // more info: https://www.oreilly.com/library/view/mastering-ethereum/9781491971932/ch04.html
  pubKeyBuffer = pubKeyBuffer.slice(1, pubKeyBuffer.length)

  const address = keccak256(pubKeyBuffer) // keccak256 hash of publicKey
  const buf2 = Buffer.from(address, 'hex')
  const EthAddr = '0x' + buf2.slice(-20).toString('hex') // take last 20 bytes as ethereum adress
  return EthAddr
  // return EthAddr;
}

const getAdminAddress = async function (req, res) {
  const address = await getEthereumAddress()
  return responseUtil.successResponse(res, 'admin address', address)
}
module.exports = {
  getEthereumAddress,
  sign,
  getAdminAddress
}
