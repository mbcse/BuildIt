import logger from '../logger.js'
import config from '../../config'

export const successResponse = (res, message, data) => {
  const response = {
    status: 'success',
    message
  }

  if (data) {
    response.data = data
  }

  logger.debug('Response Sent: ' + JSON.stringify(response))

  res.status(config.HTTP_STATUS_CODES.OK).send(response)
}

export const serverErrorResponse = (res, error, data) => {
  const response = {
    status: 'error',
    message: error.toString(),
    error_code: config.HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR,
    data // or optional error payload
  }

  logger.debug('Response Sent: ' + JSON.stringify(response))

  res.status(config.HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).send(response)
}

export const validationErrorResponse = (res, errors, data) => {
  const response = {
    status: 'error',
    message: errors.toString(),
    error_code: config.HTTP_STATUS_CODES.UNPROCESSABLE_ENTITY,
    data // or optional error payload
  }

  logger.debug('Response Sent: ' + JSON.stringify(response))

  res.status(config.HTTP_STATUS_CODES.UNPROCESSABLE_ENTITY).json(response)
}

export const badRequestErrorResponse = (res, error, data) => {
  const response = {
    status: 'error',
    message: error.toString(),
    error_code: config.HTTP_STATUS_CODES.BAD_REQUEST,
    data // or optional error payload
  }

  logger.debug('Response Sent: ' + JSON.stringify(response))

  res.status(config.HTTP_STATUS_CODES.BAD_REQUEST).send(response)
}

export const authorizationErrorResponse = (res, error, data) => {
  const response = {
    status: 'error',
    message: error.toString(),
    error_code: config.HTTP_STATUS_CODES.UNAUTHORIZED,
    data // or optional error payload
  }

  logger.debug('Response Sent: ' + JSON.stringify(response))

  res.status(config.HTTP_STATUS_CODES.UNAUTHORIZED).send(response)
}

export const notFoundErrorResponse = (res, error, data) => {
  const response = {
    status: 'error',
    message: error.toString(),
    error_code: config.HTTP_STATUS_CODES.NOT_FOUND,
    data // or optional error payload
  }

  logger.debug('Response Sent: ' + JSON.stringify(response))

  res.status(config.HTTP_STATUS_CODES.NOT_FOUND).send(response)
}
