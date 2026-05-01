// server/src/routes/syncLog.routes.js
import express from 'express'
import { getLogs, createLog } from '../controllers/syncLog.controller.js'

const router = express.Router()

router.get('/', getLogs)
router.post('/', createLog)

export default router