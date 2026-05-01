// server/src/middleware/tenant.js
export function tenantContext(req, res, next) {
  req.tenantId = req.header('x-tenant-id') || 'default-company'
  next()
}
