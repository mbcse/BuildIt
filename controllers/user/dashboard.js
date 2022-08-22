import User from '../../database/user.js'
import * as responseUtils from '../../utilities/responseUtils'
import logger from '../../utilities/logger.js'
import Wallet from '../../database/wallet.js'
import Event from '../../database/events.js'
import config from '../../config'
import { sendEmail } from '../../services/email.js'
import { ipfsImageUploader } from '../../services/ipfsUploader'

// router.get('/', verifyLoggedIn, (req, res) => {
//   res.render('dashboard/index')
// })

// router.get('/addevent', verifyLoggedIn, (req, res) => {
//   res.render('dashboard/add-event')
// })

// router.get('/profile', verifyLoggedIn, (req, res) => {
//   res.render('dashboard/profile')
// })

// router.get('/myevents', verifyLoggedIn, (req, res) => {
//   res.render('dashboard/my-event')
// })

// router.get('/mytickets', verifyLoggedIn, (req, res) => {
//   res.render('dashboard/my-tickets')
// })

// router.get('/mintlist', verifyLoggedIn, (req, res) => {
//   res.render('dashboard/mintlist')
// })

// router.get('/burnedtickets', verifyLoggedIn, (req, res) => {
//   res.render('dashboard/burned-tickets')
// })

export const dashboard = async (req, res) => {
  try {
    const user = await User.findById(req.session.userId)
    const events = await Event.find()
    res.render('dashboard/index', {
      totalEvents: user.events.length,
      totalTickets: user.ticketsBrought.length,
      totalBurnedTickets: user.ticketsBurned.length,
      totalAccountsConnected: user.accountsConnected.length,
      events,
      userAddress: req.session.address
    })
  } catch (err) {
    logger.error(err)
    responseUtils.response.serverErrorResponse(res, err)
  }
}

export const addEvent = async (req, res) => {
  try {
    res.render('dashboard/add-event', {
      userAddress: req.session.address
    })
  } catch (err) {
    logger.error(err)
    responseUtils.response.serverErrorResponse(res, err)
  }
}

export const burnedTickets = async (req, res) => {
  try {
    res.render('dashboard/burned-tickets', {
      userAddress: req.session.address
    })
  } catch (err) {
    logger.error(err)
    responseUtils.response.serverErrorResponse(res, err)
  }
}

export const myEvents = async (req, res) => {
  try {
    const user = await User.findById(req.session.userId).populate('events').exec()
    console.log(user.events)
    res.render('dashboard/my-event', {
      events: user.events,
      userAddress: req.session.address
    })
  } catch (err) {
    logger.error(err)
    responseUtils.response.serverErrorResponse(res, err)
  }
}

export const updateName = async (req, res) => {
  const name = req.body.name
  try {
    const user = await User.findById(req.session.userId)
    user.name = name
    await user.save()
    responseUtils.response.successResponse(res, 'Name Updated Successfully', { result: true })
  } catch (err) {
    logger.error(err)
    responseUtils.response.serverErrorResponse(res, err)
  }
}

export const myTickets = async (req, res) => {
  try {
    const user = await User.findById(req.session.userId).populate({ path: 'ticketsBrought', populate: { path: 'eventId' } }).exec()
    res.render('dashboard/my-tickets', {
      tickets: user.ticketsBrought,
      userAddress: req.session.address
    })
  } catch (err) {
    logger.error(err)
    responseUtils.response.serverErrorResponse(res, err)
  }
}

export const myTransactions = async (req, res) => {
  try {
    const user = await User.findById(req.session.userId).populate({ path: 'transactions', populate: { path: 'eventId' } }).exec()
    res.render('dashboard/my-transactions', { transactions: user.transactions, userAddress: req.session.address })
  } catch (err) {
    logger.error(err)
    responseUtils.response.serverErrorResponse(res, err)
  }
}

export const checkIn = async (req, res) => {
  const eventId = req.params.eventId
  try {
    const eventData = await Event.findById(eventId).populate({ path: 'ticketsMinted', populate: { path: 'issuedTo eventId' } }).exec()
    res.render('dashboard/mint-list', { tickets: eventData.ticketsMinted, eventName: eventData.eventName, userAddress: req.session.address })
  } catch (err) {
    logger.error(err)
    responseUtils.response.serverErrorResponse(res, err)
  }
}
