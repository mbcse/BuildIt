import User from '../../database/user.js'
import Emailotp from '../../database/emailotps.js'
import { generateOTP, validateOTP } from '../../utilities/otpUtils'
import * as responseUtils from '../../utilities/responseUtils'
import logger from '../../utilities/logger.js'
import { createWallet } from '../../utilities/walletUtils'
import Wallet from '../../database/wallet.js'
import config from '../../config'
import { sendEmail } from '../../services/email.js'
import { getSigningData, verifySignature } from '../../utilities/web3Utils'

export const getAccountNounce = async (req, res) => {
  const email = req.body.email
  try {
    const user = await User.findOne({ email })
    responseUtils.response.successResponse(res, 'Nounce Is', { nounce: user.nounce })
  } catch (err) {
    logger.error(err)
    responseUtils.response.serverErrorResponse(res, err)
  }
}

export const signingData = async (req, res) => {
  const email = req.body.email
  try {
    let user = await User.findOne({ email })
    if (!user) {
      const newWalletData = await createWallet()
      const wallet = await new Wallet({
        type: config.DB_CONSTANTS.USER.WALLET_TYPE.PLATFORM_MANAGED,
        address: newWalletData.address,
        publicKey: newWalletData.publicKey,
        encryptedWalletJson: newWalletData.encryptedWalletJson,
        networkType: config.DB_CONSTANTS.NETWORK_TYPES.ETHEREUM
      }).save()

      const newUser = await new User({
        email,
        defaultWallet: wallet._id
      }).save()

      user = newUser
    }
    const signingData = await getSigningData('EventOnChain Login')
    user.nounce = signingData.nonce
    await user.save()
    responseUtils.response.successResponse(res, 'Signing Data', { signingData: signingData.data })
  } catch (err) {
    logger.error(err)
    responseUtils.response.serverErrorResponse(res, err)
  }
}

export const signatureVerifyAndLogin = async (req, res) => {
  const email = req.body.email
  let signer = req.body.signer
  signer = signer.toLowerCase()
  const signature = req.body.signature
  try {
    const user = await User.findOne({ email })
    console.log(signature)

    const result = await verifySignature('EventOnChain Login', user.nounce, signature, signer)
    if (!result) {
      return responseUtils.response.authorizationErrorResponse(res, 'Invalid Signature', { result })
    }

    if (!user.accountsConnected.includes(signer)) {
      user.accountsConnected.push(signer)
    }

    req.session.loggedIn = true
    req.session.userId = user._id
    req.session.loginType = 's-managed'
    req.session.address = signer

    console.log(req.session)
    responseUtils.response.successResponse(res, 'Logged In', { result })
  } catch (err) {
    logger.error(err)
    responseUtils.response.serverErrorResponse(res, err)
  }
}

export const sendLoginOtp = async (req, res) => {
  const email = req.body.email

  try {
    let user = await User.findOne({ email })
    if (!user) {
      const newWalletData = await createWallet()
      const wallet = await new Wallet({
        type: config.DB_CONSTANTS.USER.WALLET_TYPE.PLATFORM_MANAGED,
        address: newWalletData.address,
        publicKey: newWalletData.publicKey,
        encryptedWalletJson: newWalletData.encryptedWalletJson,
        networkType: config.DB_CONSTANTS.NETWORK_TYPES.ETHEREUM
      }).save()

      const newUser = await new User({
        email,
        defaultWallet: wallet._id
      }).save()

      user = newUser
    }

    try { const otps = await Emailotp.findOneAndRemove({ userId: user._id }) } catch (e) {}
    const otp = await generateOTP(6, config.OTP.TIMEOUT_WINDOW)
    const saveOtp = await new Emailotp({
      userId: user._id,
      email: user.email,
      otp: otp.token,
      secret: otp.secret
    }).save()
    await sendEmail('eventonchain@gmail.com', user.email, 'OTP for Login', 'Your otp for login is ' + otp.token)
    responseUtils.response.successResponse(res, 'OTP Sent to email ' + user.email)
  } catch (err) {
    logger.error(err)
    responseUtils.response.serverErrorResponse(res, err)
  }
}

export const login = async (req, res) => {
  const email = req.body.email
  const otp = req.body.otp
  try {
    const user = await User.findOne({ email }).populate('defaultWallet', 'address').exec()
    console.log(user)
    if (!user) {
      return responseUtils.response.authorizationErrorResponse(res, 'User Not Found')
    }

    const otpData = await Emailotp.findOne({ email })

    if (!otpData) {
      return responseUtils.response.authorizationErrorResponse(res, 'OTP Not Valid')
    }

    if (!await validateOTP(otp, otpData.secret, config.OTP.TIMEOUT_WINDOW)) {
      return responseUtils.response.authorizationErrorResponse(res, 'OTP Not Valid')
    }

    req.session.loggedIn = true
    req.session.userId = otpData.userId.toString()
    req.session.loginType = 'p-managed'
    req.session.address = user.defaultWallet.address

    console.log(req.session)

    await Emailotp.findOneAndRemove({ userId: otpData.userId })

    responseUtils.response.successResponse(res, 'User LoggedIn')
  } catch (err) {
    logger.error(err)
    responseUtils.response.serverErrorResponse(res, err)
  }
}

export const logout = async (req, res) => {
  try {
    req.session.destroy()
    res.redirect('/')
  } catch (err) {
    logger.error(err)
    responseUtils.response.serverErrorResponse(res, err)
  }
}
