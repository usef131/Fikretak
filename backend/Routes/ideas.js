const router = require('express').Router()
const ctrl   = require('../controllers/ideaController')
const { protect, authorize } = require('../middleware/auth')
const upload = require('../Middleware/upload')

router.get('/',                      ctrl.getIdeas)
router.get('/my',                    protect, authorize('entrepreneur'), ctrl.getMyIdeas)
router.get('/interested',            protect, authorize('investor'), ctrl.getInterestedIdeas)
router.get('/interested-by/:userId', ctrl.getInterestedIdeasByUser)  
router.get('/by-user/:userId',       ctrl.getIdeasByUser)            
router.get('/:id',                   ctrl.getIdeaById)             

router.post('/',    protect, authorize('entrepreneur'), ctrl.createIdea)
router.put('/:id',  protect, authorize('entrepreneur'), ctrl.updateIdea)
router.delete('/:id',protect, authorize('entrepreneur'),ctrl.deleteIdea)


router.post('/:id/interest',   protect, authorize('investor'), ctrl.expressInterest)
router.delete('/:id/interest', protect, authorize('investor'), ctrl.withdrawInterest)

module.exports = router