// shared/models.js
export const SYNC_ACTIONS = {
  CUSTOMER_SYNC: 'CUSTOMER_SYNC',
  INVOICE_SYNC: 'INVOICE_SYNC',
  PAYMENT_SYNC: 'PAYMENT_SYNC',
  COMPANY_INFO: 'COMPANY_INFO',
  TEST_CONNECTION: 'TEST_CONNECTION',
};

export const QUICKBOOKS_STATUS = {
  CONNECTED: 'connected',
  DISCONNECTED: 'disconnected',
  TOKEN_EXPIRED: 'token_expired',
  ERROR: 'error',
};
