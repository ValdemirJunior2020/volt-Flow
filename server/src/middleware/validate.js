// server/src/middleware/validate.js
export function validate(schema) {
  return (req, res, next) => {
    const result = schema.safeParse({ body: req.body, query: req.query, params: req.params })
    if (!result.success) {
      return res.status(400).json({ success: false, message: 'Validation failed', details: result.error.flatten() })
    }
    req.validated = result.data
    next()
  }
}
