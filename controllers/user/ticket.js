import User from '../../database/user.js'
import * as responseUtils from '../../utilities/responseUtils'
import logger from '../../utilities/logger.js'
import Wallet from '../../database/wallet.js'
import Event from '../../database/events.js'
import Transaction from '../../database/transaction.js'
import Payment from '../../database/payments.js'
import config from '../../config'
import { sendEmail } from '../../services/email.js'
import { ipfsImageUploader } from '../../services/ipfsUploader'
import { saveJSONToIPFS } from '../../utilities/ipfsPinataUtils'
import { mintTicketByCrypto } from '../../services/blockchain/mint.js'
import { publishToQueue } from '../../utilities/queueUtils'
import CurrentPassId from '../../database/currentPassId.js'
import { v4 as uuid } from 'uuid'
import { generateOTP as getNewPayId } from '../../utilities/otpUtils'
import fetch from 'node-fetch'
import Ticket from '../../database/tickets.js'

// export const ticketMintByFiat = async (req, res) => {
//   const eventId = req.body.eventId
//   const userId = req.session.userId
//   try {
//     const eventData = await Event.findById(eventId)
//     const userData = await User.findById(userId)
//     const metadata = {
//       name: `${eventData.eventName} ticket`,
//       creator: 'Event-On-Chain',
//       description: `This NFT is EventOnChain NFT pass issued as event pass for event ${eventData.eventName} organized
//       by ${eventData.eventOrganizer}. The event is scheduled from ${eventData.eventStartDate} to ${eventData.eventEndDate}`,

//       //   animation_url: 'ar://3J32eR7rDG1LAy-nR0u8BdrKVXuXDyS2C14a53W_kpk',
//       image: eventData.eventPassImage,

//       external_url: 'https://eventonchain.io',
//       background_color: '#000000',
//       attributes: [
//         {
//           trait_type: 'cost',
//           value: eventData.eventTicketPrice.toString()
//         },
//         {
//           trait_type: 'burn-value',
//           value: eventData.eventTicketBurnValue.toString()
//         },
//         {
//           trait_type: 'Organizer',
//           value: eventData.eventOrganizer
//         }
//       ]
//     }

//     const metadataUri = await saveJSONToIPFS(metadata)
//     await publishToQueue(config.QUEUE.LIST.mint, { collectableId, creatorAddress, txId })
//   } catch (err) {
//     responseUtils.response.serverErrorResponse(res, err)
//   }
// }

export const ticketMintByCrypto = async (req, res) => {
  const eventId = req.body.eventId
  const userId = req.session.userId
  const paymentId = req.body.paymentId
  console.log(req.body)
  try {
    const eventData = await Event.findById(eventId)
    const userData = await User.findById(userId)
    const paymentData = await Payment.findById(paymentId)
    const metadata = {
      name: `${eventData.eventName} ticket`,
      creator: 'Event-On-Chain',
      description: `This NFT is EventOnChain NFT pass issued as event pass for event ${eventData.eventName} organized
      by ${eventData.eventOrganizer}. The event is scheduled from ${eventData.eventStartDate} to ${eventData.eventEndDate}`,

      //   animation_url: 'ar://3J32eR7rDG1LAy-nR0u8BdrKVXuXDyS2C14a53W_kpk',
      image: eventData.eventPassImage,

      external_url: 'https://eventonchain.io',
      background_color: '#000000',
      attributes: [
        {
          trait_type: 'cost',
          value: eventData.eventTicketPrice.toString()
        },
        {
          trait_type: 'burn-value',
          value: eventData.eventTicketBurnValue.toString()
        },
        {
          trait_type: 'Organizer',
          value: eventData.eventOrganizer
        }
      ]
    }

    const metadataUri = (await saveJSONToIPFS(metadata)).IpfsHash
    const passId = await generateNewPassId()
    console.log(passId)
    const txId = uuid()
    const tx = new Transaction({ _id: txId, type: 'MINT', userId: req.session.userId, paymentType: 'CRYPTO', eventId, address: req.session.address, passId, payId: paymentData.payId })
    await tx.save()
    await tx.setProcessing()

    await publishToQueue(config.QUEUE.LIST.mint, {
      receiverName: userData.name,
      receiver: req.session.address,
      passId,
      IPFSHash: metadataUri,
      ticketPrice: eventData.eventTicketPrice,
      ticketBurnValue: eventData.eventTicketBurnValue,
      txId,
      payId: paymentData.payId,
      chain: eventData.chain
    })
    responseUtils.response.successResponse(res, 'Minting Transaction Send TxId: ' + txId)
  } catch (err) {
    responseUtils.response.serverErrorResponse(res, err)
  }
}

const generateNewPassId = async () => {
  let currentPassId = await CurrentPassId.findById(1)
  if (!currentPassId) {
    currentPassId = await new CurrentPassId({ _id: 1, passId: 1 }).save()
    return 1
  } else {
    currentPassId.passId += 1
    await currentPassId.save()
    return currentPassId.passId
  }
}

export const getNewPaymentSession = async (req, res) => {
  const eventId = req.params.eventId
  try {
    const event = await Event.findById(eventId)
    const user = await User.findById(req.session.userId)

    let amount

    if (event.chain === 'POLYGON') {
      const usd = await (await fetch('https://min-api.cryptocompare.com/data/price?fsym=USD&tsyms=MATIC', {
        headers: {
          authorization: config.API_KEYS.CRYPTO_COMPARE
        }
      })).json()

      amount = usd.MATIC * event.eventTicketPrice
    } else if (event.chain === 'GNOSIS') {
      amount = event.eventTicketPrice
    } else if (event.chain === 'CRONOS') {
      const usd = await (await fetch('https://min-api.cryptocompare.com/data/price?fsym=USD&tsyms=CRO', {
        headers: {
          authorization: config.API_KEYS.CRYPTO_COMPARE
        }
      })).json()

      amount = usd.CRO * event.eventTicketPrice
    }

    const payId = (await getNewPayId(6, config.OTP.TIMEOUT_WINDOW)).token
    const newPayment = await new Payment({
      payId,
      userId: req.session.userId,
      eventId,
      amount,
      type: 'CRYPTO',
      address: req.session.address
    }).save()
    user.payments.push(newPayment._id)
    await user.save()
    responseUtils.response.successResponse(res, 'Amount is', { payDetails: newPayment, chain: event.chain })
  } catch (err) {
    logger.error(err)
    responseUtils.response.serverErrorResponse(res, err)
  }
}

export const checkInTicket = async (req, res) => {
  const ticketId = req.params.ticketId
  try {
    const ticketData = await Ticket.findById(ticketId)
    ticketData.status = 'CHECKEDIN'
    await ticketData.save()
    responseUtils.response.successResponse(res, 'CheckIn Successfull', { result: true })
  } catch (err) {
    logger.error(err)
    responseUtils.response.serverErrorResponse(res, err)
  }
}

export const consumeMintTicketByCryptoQueue = async (data) => {
  await mintTicketByCrypto(data.receiverName, data.receiver, data.passId, data.IPFSHash, data.ticketPrice, data.ticketBurnValue, data.txId, data.payId, data.chain)
}
