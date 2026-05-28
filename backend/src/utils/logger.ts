import config from '../config/env.js'

/**
 * Logger Utility
 * Structured logging with different log levels
 */
const LogLevel = {
  ERROR: 0,
  WARN: 1,
  INFO: 2,
  DEBUG: 3,
}

const currentLogLevel = LogLevel[config.logLevel.toUpperCase() as keyof typeof LogLevel] || LogLevel.INFO

function formatLog(level: string, message: string, data?: any) {
  const timestamp = new Date().toISOString()
  
  if (config.logFormat === 'json') {
    return JSON.stringify({
      timestamp,
      level,
      message,
      ...(data && { data }),
    })
  }
  
  return `[${timestamp}] [${level}] ${message} ${data ? JSON.stringify(data) : ''}`
}

export const logger = {
  error: (message: string, error?: any) => {
    if (currentLogLevel >= LogLevel.ERROR) {
      console.error(formatLog('ERROR', message, error))
    }
  },

  warn: (message: string, data?: any) => {
    if (currentLogLevel >= LogLevel.WARN) {
      console.warn(formatLog('WARN', message, data))
    }
  },

  info: (message: string, data?: any) => {
    if (currentLogLevel >= LogLevel.INFO) {
      console.log(formatLog('INFO', message, data))
    }
  },

  debug: (message: string, data?: any) => {
    if (currentLogLevel >= LogLevel.DEBUG) {
      console.debug(formatLog('DEBUG', message, data))
    }
  },
}

export default logger
