import amqp from 'amqplib'
import logger from '../logger.js'
import config from '../../config'
import { shutDown } from '../serverUtils'
import publishToQueue from './publisher.js'
import consumeQueue from './consumer.js'

let channel
let conn
let queueConnected = false

try {
  conn = await amqp.connect(config.QUEUE.CONNECTION_URL)

  channel = await conn.createChannel()
  queueConnected = true

  console.log('RABIT-MQ CONNECTED')
  logger.info({ message: 'RabitMQ connected' })

  conn.on('error', (err) => {
    queueConnected = false
    logger.error({ message: `RabitMQ connection error - ${err.toString()}` })
  })
  conn.on('close', () => {
    queueConnected = false
    logger.warn({ message: 'RabitMQ connection Closed' })
  })
} catch (err) {
  logger.error({ message: `RabitMQ connection error - ${err.toString()}` })
  shutDown(true)
}

export {
  conn, channel, publishToQueue, consumeQueue, queueConnected
}
