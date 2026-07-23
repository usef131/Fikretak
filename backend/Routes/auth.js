const router = require('express').Router()
const rateLimit = require('express-rate-limit')
const ctrl   = require('../Controllers/authController')
const { protect } = require('../Middleware/auth')

// Stricter limiter to slow brute-force / credential stuffing.
// Scoped to login/register only, and skipSuccessfulRequests means a valid
// sign-in doesn't burn the budget — only failed attempts count.
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,   // 15 minutes
  max: 20,                    // failed attempts per IP per window
  skipSuccessfulRequests: true,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many attempts, please try again later.' },
})

// ctrl.login -> when request is made to /auth/login, it will call the login function in authController and return the response to the client
router.post('/register',        authLimiter, ctrl.register)
router.post('/login',           authLimiter, ctrl.login)

// before calling getMe and updateMe, we need to protect the route by checking if the user is logged in or not, if not then return 401 error
router.get('/me',      protect, ctrl.getMe)
router.put('/me',      protect, ctrl.updateMe)

module.exports = router
