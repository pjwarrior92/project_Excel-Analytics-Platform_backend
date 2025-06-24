const express = require('express');
const router = express.Router();
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const { uploadExcel } = require('../controllers/fileController');
const verifyToken = require('../middleware/authMiddleware');
const ChartHistory = require('../models/ChartHistory');

// Use memory storage for Excel parsing, but also save to disk for download
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads'); // Save files to ./uploads
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + '-' + file.originalname;
    cb(null, uniqueName);
  }
});
const upload = multer({ storage });

// 🔐 Upload endpoint
router.post('/upload', verifyToken, upload.single('file'), uploadExcel);

// 🔐 History fetch endpoint
router.get('/history', verifyToken, async (req, res) => {
  try {
    console.log("📡 History route hit");
    const history = await ChartHistory.find({ userId: req.user.id })
      .sort({ createdAt: -1 })
      .limit(10);
    console.log("✅ Data from MongoDB:", history);
    res.json(history);
  } catch (err) {
    console.error("❌ MongoDB history fetch error:", err);
    res.status(500).json({ error: "Failed to fetch history." });
  }
});

// 🔽 Download uploaded Excel file again
router.get('/download/:filename', (req, res) => {
  const filename = req.params.filename;
  const filepath = path.join(__dirname, '..', 'uploads', filename);
  if (fs.existsSync(filepath)) {
    res.download(filepath);
  } else {
    res.status(404).json({ error: 'File not found' });
  }
});

// 🗑️ Delete a history entry
router.delete('/history/:id', verifyToken, async (req, res) => {
  try {
    const entry = await ChartHistory.findByIdAndDelete(req.params.id);
    if (!entry) return res.status(404).json({ error: 'Not found' });

    // Also delete associated Excel file if it exists
    if (entry.filePath) {
      const filepath = path.join(__dirname, '..', 'uploads', entry.filePath);
      if (fs.existsSync(filepath)) {
        fs.unlinkSync(filepath);
      }
    }

    res.json({ message: 'Entry deleted' });
  } catch (err) {
    console.error("❌ Deletion failed:", err);
    res.status(500).json({ error: 'Deletion failed' });
  }
});

module.exports = router;
