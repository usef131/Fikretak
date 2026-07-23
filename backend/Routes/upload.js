const router = require('express').Router();
const upload = require('../Middleware/Upload');
const { protect } = require('../Middleware/auth');
const { uploadImage } = require('../Controllers/uploadController');

// Wrap multer so its errors (size/type) return 400 instead of a 500.
const single = (field) => (req, res, next) => {
  upload.single(field)(req, res, (err) => {
    if (err) return res.status(400).json({ message: err.message });
    next();
  });
};

router.post('/image', protect, single('image'), uploadImage);

module.exports = router;
