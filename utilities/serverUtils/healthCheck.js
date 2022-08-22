import database from '../../database'
import { web3 } from '../web3Utils'
import { queueConnected } from '../queueUtils'

function checkDatabaseConnection () {
  return database.readyState === 1
}

function checkQueueConnection () {
  return queueConnected
}

async function checkWeb3Connection () {
  try {
    const block = await web3.eth.getBlockNumber()
    if (block) return true
    return false
  } catch (err) {
    console.log(err)
    return false
  }
}

export async function healthCheck () {
  const healthCheckResponse = {
    uptime: process.uptime(),
    responsetime: process.hrtime(),
    message: 'OK',
    timestamp: Date.now(),
    services: {
      DATABASE: 'OK',
      QUEUE: 'OK',
      WEB3: 'OK'
    }
  }

  if (!checkDatabaseConnection()) {
    healthCheckResponse.message = 'NOT OK'
    healthCheckResponse.services.DATABASE = 'NOT OK'
  }

  if (!await checkWeb3Connection()) {
    healthCheckResponse.message = 'NOT OK'
    healthCheckResponse.services.WEB3 = 'NOT OK'
  }

  if (!checkQueueConnection()) {
    healthCheckResponse.message = 'NOT OK'
    healthCheckResponse.services.QUEUE = 'NOT OK'
  }

  return healthCheckResponse
}
