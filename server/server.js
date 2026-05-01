// server/server.js
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import dotenv from 'dotenv'

import quickBooksRoutes from './src/routes/quickbooks.routes.js'
import syncLogRoutes from './src/routes/syncLog.routes.js'
import payrollRoutes from './src/routes/payroll.routes.js'

dotenv.config()

const app = express()

const PORT = process.env.SERVER_PORT || 5000
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173'

app.use(
  cors({
    origin: CLIENT_URL,
    credentials: true,
  })
)

app.use(helmet())
app.use(express.json({ limit: '10mb' }))

app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 300,
  })
)

app.get('/', (req, res) => {
  res.json({
    app: 'VoltFlow API',
    status: 'running',
    payrollNotice:
      'VoltFlow prepares payroll summaries and estimates. Actual payroll/tax filing requires QuickBooks Payroll or an approved payroll provider.',
  })
})

app.use('/api/v1/quickbooks', quickBooksRoutes)
app.use('/api/v1/quickbooks/payroll', payrollRoutes)
app.use('/api/v1/sync-logs', syncLogRoutes)

app.use((req, res) => {
  res.status(404).json({
    message: 'Route not found',
  })
})

app.use((error, req, res, next) => {
  console.error(error)

  res.status(error.status || 500).json({
    message: error.message || 'Internal server error',
  })
})

app.listen(PORT, () => {
  console.log(`VoltFlow server running on http://localhost:${PORT}`)
})