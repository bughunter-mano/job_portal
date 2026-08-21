const express = require('express');
const router = express.Router();
const uploadImage = require('../middleware/imageUploadMiddleware');
const { verifyAdmin } = require('../middleware/authMiddleware');
const { isCloudinaryConfigured, uploadImage: uploadToCloudinary } = require('../config/cloudinary');
const path = require('path');
const fs = require('fs');

router.post('/upload-image', verifyAdmin, uploadImage.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    let imageUrl = '';

    if (isCloudinaryConfigured()) {
      try {
        const uploadResult = await uploadToCloudinary(req.file.buffer, req.file.originalname);
        imageUrl = uploadResult.secure_url || uploadResult.url;
      } catch (cloudErr) {
        console.error('Cloudinary image upload error, falling back to local storage:', cloudErr.message);
        const uploadDir = path.join(__dirname, '..', 'uploads', 'images');
        if (!fs.existsSync(uploadDir)) {
          fs.mkdirSync(uploadDir, { recursive: true });
        }
        const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const filename = `img-${unique}${path.extname(req.file.originalname || '.jpg')}`;
        fs.writeFileSync(path.join(uploadDir, filename), req.file.buffer);
        imageUrl = `/uploads/images/${filename}`;
      }
    } else {
      const uploadDir = path.join(__dirname, '..', 'uploads', 'images');
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }
      const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
      const filename = `img-${unique}${path.extname(req.file.originalname || '.jpg')}`;
      fs.writeFileSync(path.join(uploadDir, filename), req.file.buffer);
      imageUrl = `/uploads/images/${filename}`;
    }

    res.json({
      success: true,
      message: 'Image uploaded successfully',
      url: imageUrl
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;

