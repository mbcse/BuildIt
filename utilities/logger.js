'use strict'

import appRoot from 'app-root-path'
import winston, { format } from 'winston'
import config from '../config'
import 'winston-daily-rotate-file'

const { printf, timestamp, combine } = format

const myFormat = printf(({ level, message, timestamp, exception, meta }) => {
  // return `${timestamp} Exception: ${exception} Level: ${level}: ${message}`
  if (exception) {
    return JSON.stringify({ level: [level], timestamp, exception: exception || false, message: message.split('\n')[0] })
  } else {
    return JSON.stringify({ level: [level], timestamp, exception: exception || false, message })
  }
})

// define the custom settings for each transport (file, console)
const options = {
  file: {
    level: config.LOGGER.LEVEL,
    filename: `${appRoot}/logs/app-%DATE%.log`,
    datePattern: 'YYYY-MM-DD',
    handleExceptions: true,
    json: true,
    zippedArchive: true,
    maxSize: '20m',
    maxFiles: '14d',
    colorize: false
  },
  console: {
    level: config.LOGGER.LEVEL,
    handleExceptions: true,
    json: false,
    colorize: true
  }
}

// instantiate a new Winston Logger with the settings defined above
const logger = winston.createLogger({
  format: combine(
    timestamp({ format: 'DD:MM:YYYY|HH:MM:SS' }),
    myFormat
  ),
  transports: [
    new winston.transports.DailyRotateFile(options.file),
    new winston.transports.Console(options.console)
  ],
  exitOnError: false // do not exit on handled exceptions
})

// create a stream object with a 'write' function that will be used by `morgan`
logger.stream = {
  write: function (message) {
    // use the 'info' log level so the output will be picked up by both transports
    logger.info(message)
  }
}

export default logger
