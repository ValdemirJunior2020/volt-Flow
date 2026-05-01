// server/src/routes/syncLogs.routes.js
import express from 'express'
import { z } from 'zod'
import { syncLogsController } from '../controllers/syncLogs.controller.js'
import { validate } from '../middleware/validate.js'

const router = express.Router()

const createSyncLogSchema = z.object({
  body: z.object({
    action: z.string().min(1),
    status: z.enum(['success', 'error', 'skipped']),
    message: z.string().min(1),
    source: z.string().optional(),
    localId: z.string().optional(),
    qbId: z.string().optional(),
    durationMs: z.number().optional(),
    metadata: z.record(z.any()).optional(),
  }),
  query: z.object({}).passthrough(),
  params: z.object({}).passthrough(),
})

router.get('/', syncLogsController.list)
router.post('/', validate(createSyncLogSchema), syncLogsController.create)

export default router
