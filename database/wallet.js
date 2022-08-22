import mongoose from 'mongoose'
import config from '../config'

const Schema = mongoose.Schema

const walletSchema = new Schema({
  type: {
    type: Number,
    required: true,
    enum: Object.values(config.DB_CONSTANTS.USER.WALLET_TYPE)
  },
  publicKey: {
    type: String,
    trim: true
  },

  address: {
    type: String,
    required: true,
    trim: true
  },

  encryptedWalletJson: {
    type: Object
  },

  networkType: {
    type: Number,
    required: true,
    enum: Object.values(config.DB_CONSTANTS.NETWORK_TYPES)
  }

}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
})

const Wallet = mongoose.model('wallets', walletSchema)
export default Wallet
