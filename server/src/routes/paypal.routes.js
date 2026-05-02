// server/src/routes/paypal.routes.js
import express from 'express'
import {
  confirmSubscription,
  createSubscription,
  getPayPalConfig,
  paypalWebhook,
} from '../controllers/paypal.controller.js'

const router = express.Router()

router.get('/config', getPayPalConfig)
router.post('/create-subscription', createSubscription)
router.post('/confirm-subscription', confirmSubscription)
router.post('/webhook', paypalWebhook)

export default router