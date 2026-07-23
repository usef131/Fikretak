const { v2: cloudinary } = require('cloudinary');

// Configured only when the three env vars are present. When absent (e.g. local
// dev without a Cloudinary account) the app falls back to local disk storage.
const isConfigured = Boolean(
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_SECRET
);

if (isConfigured) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
  });
}

module.exports = { cloudinary, isCloudinaryConfigured: isConfigured };
