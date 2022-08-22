import mongoose from 'mongoose'
import config from '../config'

const Schema = mongoose.Schema

const eventSchema = new Schema({
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users',
    required: true
  },
  stock: {
    type: Number,
    required: true
  },
  minted: {
    type: Number,
    required: true,
    default: 0
  },
  eventName: {
    type: String,
    trim: true,
    required: true
  },
  eventOrganizer: {
    type: String,
    trim: true,
    required: true
  },
  eventPassImage: {
    type: String,
    trim: true,
    required: true
  },
  eventTicketPrice: {
    type: String,
    trim: true,
    required: true
  },
  eventTicketBurnValue: {
    type: String,
    trim: true,
    required: true
  },
  eventStartDate: {
    type: String,
    trim: true,
    required: true
  },
  eventEndDate: {
    type: String,
    trim: true,
    required: true
  },
  ticketsMinted: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'tickets'
  }],

  chain: {
    type: String,
    enum: ['GNOSIS', 'POLYGON', 'CRONOS'],
    default: 'POLYGON'
  }
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
})

const Event = mongoose.model('events', eventSchema)
export default Event
