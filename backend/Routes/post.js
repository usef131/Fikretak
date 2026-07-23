const router = require('express').Router()
const ctrl   = require('../Controllers/postController')
const { protect } = require('../Middleware/auth')

router.get('/', ctrl.getPosts)          // public feed
router.get('/my',  protect, ctrl.getMyPosts)

router.post('/',   protect, ctrl.createPost)
router.delete('/:id', protect, ctrl.deletePost)
router.post('/:id/like', protect, ctrl.likePost)
router.post('/:id/comment',protect, ctrl.addComment)

module.exports = router
