const router = require('express').Router({ mergeParams: true })
const { createInvestment, getInvestments } = require('../Controllers/investmentController')
const { protect, authorize } = require('../Middleware/auth')

router.get('/', protect, getInvestments)
router.post('/', protect, authorize('investor'), createInvestment)

module.exports = router
