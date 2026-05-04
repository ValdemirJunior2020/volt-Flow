// C:\Users\Valdemir Goncalves\Downloads\Projetos Maio\Fildemora Pro\server\src\middleware\requireSubscription.js
export function requireSubscription(req, res, next) {
  if (req.company?.subscription_status === 'active') {
    return next()
  }

  return res.status(402).json({
    success: false,
    message: 'Active subscription required.',
  })
}
