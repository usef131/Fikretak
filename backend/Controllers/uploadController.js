// Returns the public URL of an uploaded image.
// The file was already written to disk by the multer middleware.
exports.uploadImage = (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'No image uploaded' });
  res.status(201).json({ url: `/uploads/${req.file.filename}` });
};
