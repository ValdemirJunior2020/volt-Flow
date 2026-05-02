// server/src/routes/paypal.routes.js
import express from 'express'
import {
  captureCheckoutOrder,
  createCheckoutOrder,
  getPayPalConfig,
  paypalWebhook,
} from '../controllers/paypal.controller.js'

const router = express.Router()

router.get('/config', getPayPalConfig)
router.post('/create-order', createCheckoutOrder)
router.post('/capture-order', captureCheckoutOrder)
router.post('/webhook', paypalWebhook)

export default router