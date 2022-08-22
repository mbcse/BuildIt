import validator from 'validator'
import mongoose from 'mongoose'
import config from '../config'

const Schema = mongoose.Schema

const emailotpSchema = new Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users'
  },
  email: {
    type: String,
    required: true
  },
  otp: {
    type: String,
    required: true
  },

  secret: {
    type: String,
    required: true
  }
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
})

const emailotp = mongoose.model('emailotp', emailotpSchema)
export default emailotp
