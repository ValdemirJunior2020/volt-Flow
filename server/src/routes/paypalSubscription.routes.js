// C:\Users\Valdemir Goncalves\Downloads\Projetos Maio\Fildemora Pro\server\src\routes\paypalSubscription.routes.js
import express from 'express'
import {
  cancelSubscription,
  confirmPayPalSubscription,
  createFildemoraMonthlyPlan,
  getMySubscription,
  getSubscriptionConfig,
} from '../controllers/paypalSubscription.controller.js'
import { requireAuth } from '../middleware/requireAuth.js'

const router = express.Router()

router.post('/create-plan', createFildemoraMonthlyPlan)
router.get('/config', getSubscriptionConfig)
router.get('/me', requireAuth, getMySubscription)
router.post('/confirm', requireAuth, confirmPayPalSubscription)
router.post('/cancel', requireAuth, cancelSubscription)

export default router
