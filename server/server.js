// server/server.js
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import pinoHttp from 'pino-http'
import { env } from './src/config/env.js'
import { logger } from './src/utils/logger.js'
import { errorHandler, notFound } from './src/middleware/errorHandler.js'
import { tenantContext } from './src/middleware/tenant.js'
import apiRoutes from './src/routes/index.js'

const app = express()

app.set('trust proxy', 1)
app.use(helmet())
app.use(cors({ origin: env.clientUrl, credentials: true }))
app.use(express.json({ limit: '1mb' }))
app.use(express.urlencoded({ extended: true }))
app.use(pinoHttp({ logger }))
app.use(rateLimit({ windowMs: 15 * 60 * 1000, limit: 300, standardHeaders: true, legacyHeaders: false }))
app.use(tenantContext)

app.get('/', (req, res) => {
  res.json({ success: true, message: 'VoltFlow QuickBooks API is running.', docs: '/api/v1/health' })
})

app.use('/api/v1', apiRoutes)
app.use(notFound)
app.use(errorHandler)

app.listen(env.port, () => {
  logger.info(`VoltFlow server running on http://localhost:${env.port}`)
})
