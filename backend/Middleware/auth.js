const jwt  = require('jsonwebtoken') // imports jwt library for token verification
const User = require('../Models/User')

// Verify JWT and attach user to req
exports.protect = async (req, res, next) => {
  const header = req.headers.authorization
  if (!header?.startsWith('Bearer '))
    return res.status(401).json({ message: 'Not authenticated' })

  try {
    const token   = header.split(' ')[1]
    const decoded = jwt.verify(token, process.env.JWT_SECRET, { algorithms: ['HS256'] })
    const user    = await User.findById(decoded.id).select('-password')
    if (!user) return res.status(401).json({ message: 'User not found' })
    req.user = user
    next()
  } catch {
    res.status(401).json({ message: 'Invalid or expired token' })
  }
}

// Restrict to specific roles
exports.authorize = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role))
    return res.status(403).json({ message: 'Access denied' })
  next()
}
