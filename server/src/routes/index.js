// C:\Users\Valdemir Goncalves\Downloads\Projetos Maio\Fildemora Pro\server\src\routes\index.js
import express from 'express'
import quickBooksRoutes from './quickbooks.routes.js'
import syncLogsRoutes from './syncLogs.routes.js'
import webhooksRoutes from './webhooks.routes.js'

const router = express.Router()

router.get('/health', (req, res) => {
  res.json({ success: true, service: 'fildemora-pro-server', status: 'ok', timestamp: new Date().toISOString() })
})

router.use('/quickbooks', quickBooksRoutes)
router.use('/sync-logs', syncLogsRoutes)
router.use('/webhooks', webhooksRoutes)

export default router
