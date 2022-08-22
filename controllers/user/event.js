import User from '../../database/user.js'
import * as responseUtils from '../../utilities/responseUtils'
import logger from '../../utilities/logger.js'
import Wallet from '../../database/wallet.js'
import Event from '../../database/events.js'
import config from '../../config'
import { sendEmail } from '../../services/email.js'
import { ipfsImageUploader } from '../../services/ipfsUploader'

export const getEvent = async (req, res) => {
  const eventId = req.body.eventId
  try {
    const event = await Event.findById(eventId)
    responseUtils.response.successResponse(res, 'Event Details!!', event)
  } catch (err) {
    logger.error(err)
    responseUtils.response.serverErrorResponse(res, err)
  }
}

export const deleteEvent = async (req, res) => {
  const eventId = req.body.eventId
  try {
    const event = await Event.findById(eventId)
    if (!req.session.id === event._id.toString()) {
      return responseUtils.response.authorizationErrorResponse(res, 'You are not the creator of the Event')
    }
    responseUtils.response.successResponse(res, 'Event Details!!', event)
  } catch (err) {
    logger.error(err)
    responseUtils.response.serverErrorResponse(res, err)
  }
}

export const createEvent = async (req, res) => {
  const {
    eventName, eventOrganizer, eventTicketPrice,
    eventTicketBurnValue, eventStartDate, eventEndDate, stock, chain
  } = req.body
  logger.debug(req.body)
  const ipfsFileLink = await ipfsImageUploader('eventpass' + eventName, req.file.path)
  console.log(ipfsFileLink)
  try {
    const user = await User.findById(req.session.userId)
    const newEvent = await new Event({
      createdBy: user._id,
      stock,
      eventName,
      eventOrganizer,
      eventTicketPrice,
      eventTicketBurnValue,
      eventStartDate,
      eventEndDate,
      eventPassImage: ipfsFileLink,
      chain
    }).save()

    user.events.push(newEvent._id)
    await user.save()

    responseUtils.response.successResponse(res, 'Event Created Successfully!!', newEvent)
  } catch (err) {
    logger.error(err)
    responseUtils.response.serverErrorResponse(res, err)
  }
}
