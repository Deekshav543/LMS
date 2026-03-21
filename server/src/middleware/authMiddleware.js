const jwt = require('jsonwebtoken')

function requireAuth(req, res, next) {
  try {
    const header = req.headers.authorization
    if (!header?.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Missing token' })
    }

    const token = header.slice('Bearer '.length)
    const payload = jwt.verify(token, process.env.JWT_SECRET)

    req.user = {
      id: payload.sub,
      role: payload.role,
    }
    return next()
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' })
  }
}

function requireAdmin(req, res, next) {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ message: 'Admin only' })
  }
  return next()
}

module.exports = { requireAuth, requireAdmin }

