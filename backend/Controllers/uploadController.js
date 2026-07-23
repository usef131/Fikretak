const { cloudinary, isCloudinaryConfigured } = require('../Config/cloudinary');

// Returns the public URL of an uploaded image.
// Cloudinary in production (survives redeploys); local disk in dev.
exports.uploadImage = async (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'No image uploaded' });

  try {
    if (isCloudinaryConfigured) {
      const url = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: 'fikretak', resource_type: 'image' },
          (err, result) => (err ? reject(err) : resolve(result.secure_url)),
        );
        stream.end(req.file.buffer);
      });
      return res.status(201).json({ url });
    }

    // Disk fallback (multer already wrote the file)
    return res.status(201).json({ url: `/uploads/${req.file.filename}` });
  } catch (err) {
    return res.status(500).json({ message: 'Image upload failed' });
  }
};
