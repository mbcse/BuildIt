import mongoose from 'mongoose'
import config from '../config'
import User from './user.js'
import Event from './events.js'
import Ticket from './tickets'

const Schema = mongoose.Schema

const transactionSchema = new Schema({
  _id: String,
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users'
  },
  eventId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'events'
  },
  address: {
    type: String
  },
  txHash: String,
  passId: String,
  ticketId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'tickets'
  },
  paymentType: {
    type: String,
    enum: ['CRYPTO', 'FIAT']
  },
  type: {
    type: String,
    enum: ['MINT', 'SELL', 'BUY', 'AUCTION', 'BOTH', 'BID', 'OTHER'],
    default: 'OTHER'
  },
  status: {
    type: String,
    enum: ['NONE', 'FAILED', 'SUCCESS', 'PROCESSING'],
    default: 'NONE'
  },

  error: {
    type: String
  }

}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
})

transactionSchema.methods.saveTransactionHash = async function (hash) {
  try {
    this.txHash = hash
    await this.save()
    return this
  } catch (err) {
    throw new Error(err)
  }
}

transactionSchema.methods.setFailed = async function () {
  try {
    this.status = 'FAILED'
    await this.save()
    const user = await User.findById(this.userId)
    user.transactions.push(this._id)
    await user.save()
    return this
  } catch (err) {
    throw new Error(err)
  }
}

transactionSchema.methods.setSuccess = async function () {
  try {
    this.status = 'SUCCESS'
    const ticket = await new Ticket({ issuedTo: this.userId, issuedToAddress: this.address, passId: this.passId, eventId: this.eventId, status: 'MINTED' }).save()
    this.ticketId = ticket._id
    await this.save()
    const user = await User.findById(this.userId)
    const event = await Event.findById(this.eventId)
    user.transactions.push(this._id)
    user.ticketsBrought.push(this.ticketId)
    await user.save()
    event.minted += 1
    event.ticketsMinted.push(this.ticketId)
    await event.save()
    return this
  } catch (err) {
    throw new Error(err)
  }
}

transactionSchema.methods.setProcessing = async function () {
  try {
    this.status = 'PROCESSING'
    await this.save()
    return this
  } catch (err) {
    throw new Error(err)
  }
}

const Transaction = mongoose.model('transactions', transactionSchema)
export default Transaction
