const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const multer = require('multer');
const { isCloudinaryConfigured } = require('../Config/cloudinary');

const UPLOAD_DIR = path.join(__dirname, '..', 'uploads');
const ALLOWED_EXT = new Set(['.png', '.jpg', '.jpeg', '.gif', '.webp']);

// When Cloudinary is configured we keep the file in memory and stream it up.
// Otherwise (local dev) we persist to disk as before.
let storage;
if (isCloudinaryConfigured) {
  storage = multer.memoryStorage();
} else {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
  storage = multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, UPLOAD_DIR),
    filename: (_req, file, cb) => {
      // Never trust originalname (path traversal); build our own random name.
      let ext = path.extname(file.originalname).toLowerCase();
      if (!ALLOWED_EXT.has(ext)) ext = '.png';
      cb(null, `${Date.now()}-${crypto.randomBytes(8).toString('hex')}${ext}`);
    },
  });
}

const upload = multer({
  storage,
  limits: { fileSize: 4 * 1024 * 1024 }, // 4 MB (stays under Vercel's serverless body limit)
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith('image/')) cb(null, true);
    else cb(new Error('Only image files are allowed'), false);
  },
});

module.exports = upload;
