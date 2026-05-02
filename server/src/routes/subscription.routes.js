// server/src/routes/subscription.routes.js
import express from 'express'
import {
  activateDemoSubscription,
  cancelSubscription,
  getStatus,
} from '../controllers/subscription.controller.js'

const router = express.Router()

router.get('/status', getStatus)
router.post('/cancel', cancelSubscription)
router.post('/activate-demo', activateDemoSubscription)

export default router