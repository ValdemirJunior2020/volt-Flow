// server/src/middleware/errorHandler.js
import { logger } from '../utils/logger.js'

export function notFound(req, res) {
  res.status(404).json({ success: false, message: `Route not found: ${req.method} ${req.originalUrl}` })
}

export function errorHandler(err, req, res, next) {
  logger.error({ err }, 'Request failed')
  const status = err.statusCode || err.status || 500
  res.status(status).json({
    success: false,
    message: err.message || 'Internal server error',
    details: process.env.NODE_ENV === 'production' ? undefined : err.details,
  })
}
