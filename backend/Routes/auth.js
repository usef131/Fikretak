const router = require('express').Router()
const ctrl   = require('../controllers/authController')
const { protect } = require('../middleware/auth')

// ctrl.login -> when request is made to /auth/login, it will call the login function in authController and return the response to the client 
router.post('/register',        ctrl.register)
router.post('/login',           ctrl.login)

// before calling getMe and updateMe, we need to protect the route by checking if the user is logged in or not, if not then return 401 error
router.get('/me',      protect, ctrl.getMe)
router.put('/me',      protect, ctrl.updateMe)

module.exports = router
