import mongoose from 'mongoose'
import config from '../config'

const Schema = mongoose.Schema

const paymentSchema = new Schema({
  payId: {
    type: Number,
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users',
    required: true
  },
  address: {
    type: String
  },
  type: {
    type: String,
    enum: ['CRYPTO', 'FIAT'],
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  eventId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'events',
    required: true
  }
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
})

const Payments = mongoose.model('payments', paymentSchema)
export default Payments
