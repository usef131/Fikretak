const Post = require('../Models/posts')

// GET /api/posts
exports.getPosts = async (req, res) => {
  try {
    const page  = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(50, Math.max(1, Number(req.query.limit) || 20));
    const skip  = (page - 1) * limit;

    const [posts, total] = await Promise.all([
      Post.find()
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate("user", "name avatar")
        .populate("comments.user", "name avatar"),
      Post.countDocuments(),
    ]);

    res.json({ posts, total, page, pages: Math.ceil(total / limit) })
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/posts/my
exports.getMyPosts = async (req, res) => {
  try {
    const posts = await Post.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .populate('user', 'name')
      .populate('comments.user', 'name')

    res.json({ posts })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// POST /api/posts
exports.createPost = async (req, res) => {
  try {
    const { text } = req.body

    if (!text?.trim()) {
      return res.status(400).json({ message: 'Text is required' })
    }

    const post = await Post.create({
      user: req.user._id,
      text,
    })

    await post.populate("user", "name avatar")

    res.status(201).json({ post })
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
}

// POST /api/posts/:id/like
exports.likePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)

    if (!post) {
      return res.status(404).json({ message: 'Post not found' })
    }

    const liked = post.likes.includes(req.user._id)

    if (liked) {
      post.likes = post.likes.filter(
        id => id.toString() !== req.user._id.toString()
      )
    } else {
      post.likes.push(req.user._id)
    }

    await post.save()

    res.json({
      likes: post.likes.length,
      liked: !liked,
    })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// POST /api/posts/:id/comment
exports.addComment = async (req, res) => {
  try {
    const { text } = req.body

    if (!text?.trim()) {
      return res.status(400).json({ message: 'Comment text is required' })
    }

    const post = await Post.findById(req.params.id)

    if (!post) {
      return res.status(404).json({ message: 'Post not found' })
    }

    post.comments.push({
      user: req.user._id,
      text,
    })

    await post.save()

    await post.populate('comments.user', 'name')

    res.json({
      comment: post.comments[post.comments.length - 1],
    })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// DELETE /api/posts/:id
exports.deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)

    if (!post) {
      return res.status(404).json({ message: 'Post not found' })
    }

    if (post.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' })
    }

    await post.deleteOne()

    res.json({ message: 'Post deleted' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}


