import mongoose from 'mongoose'
import config from '../config'

const Schema = mongoose.Schema

const currentPassIdSchema = new Schema({
  _id: Number,
  passId: {
    type: Number,
    default: 0
  }
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
})

const CurrentPassId = mongoose.model('currentPassIds', currentPassIdSchema)
export default CurrentPassId
