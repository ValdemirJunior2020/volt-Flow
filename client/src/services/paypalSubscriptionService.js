// C:\Users\Valdemir Goncalves\Downloads\Projetos Maio\Fildemora Pro\client\src\services\paypalSubscriptionService.js

import { apiRequest, publicApiRequest } from './apiClient'

const localPlanId = import.meta.env.VITE_PAYPAL_PLAN_ID

export const paypalSubscriptionService = {
  async getConfig() {
    try {
      const result = await publicApiRequest('/paypal-subscription/config')

      return {
        ...result,
        planId: result.planId || localPlanId,
      }
    } catch (error) {
      console.warn('Using local VITE_PAYPAL_PLAN_ID because config API failed:', error.message)

      return {
        success: true,
        planId: localPlanId,
        trialAmount: 20,
        amount: 70,
        currency: 'USD',
      }
    }
  },

  getMySubscription() {
    return apiRequest('/paypal-subscription/me')
  },

  confirmSubscription(subscriptionId) {
    return apiRequest('/paypal-subscription/confirm', {
      method: 'POST',
      body: JSON.stringify({
        subscriptionId,
      }),
    })
  },

  cancelSubscription() {
    return apiRequest('/paypal-subscription/cancel', {
      method: 'POST',
    })
  },
}