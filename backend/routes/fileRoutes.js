const express = require('express');
const multer = require('multer');
const router = express.Router();
const { fileExists, saveFile } = require('../services/fileService');
const File = require('../models/File');
const path = require('path');
const fs = require('fs');

const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, file.originalname)
});
const upload = multer({ storage });

router.post('/upload', upload.single('file'), async (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

  try {
    const exists = await fileExists(req.file.originalname);
    if (exists) return res.status(409).json({ message: 'File already exists' });

    await saveFile(req.file);
    res.status(201).json({ message: 'File uploaded successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error uploading file' });
  }
});

router.get('/', async (req, res) => {
  try {
    const files = await File.find({}, { filename: 1, _id: 0 }); 
    res.json(files);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching files' });
  }
});

module.exports = router;