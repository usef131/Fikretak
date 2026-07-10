const router = require('express').Router()
const ctrl   = require('../controllers/postController')
const { protect } = require('../middleware/auth')

router.get('/', protect , ctrl.getPosts)
router.get('/my',  protect, ctrl.getMyPosts) 

router.post('/',   protect, ctrl.createPost)
router.delete('/:id', protect, ctrl.deletePost)
router.post('/:id/like', protect, ctrl.likePost)
router.post('/:id/comment',protect, ctrl.addComment)

module.exports = router
