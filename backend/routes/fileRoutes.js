const express = require('express');
const multer = require('multer');
const router = express.Router();
const { fileExists, saveFile } = require('../services/fileService');
const File = require('../models/File');
const path = require('path');
const fs = require('fs');

const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadDir),
    filename: (req, file, cb) => {
        const uniqueName = Date.now() + '-' + file.originalname;
        cb(null, uniqueName);
    }
});
const upload = multer({ storage });

router.post('/upload', upload.single('file'), async (req, res) => {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

    try {
        // בדיקה אם קובץ בשם המקורי כבר קיים ב-DB
        const exists = await fileExists(req.file.originalname);
        if (exists) {
            // מחיקת הקובץ הפיזי ש-Multer יצר כי לא נשמור אותו
            fs.unlinkSync(req.file.path);
            return res.status(409).json({ message: 'File already exists' });
        }

        // שמירה ב-Database
        await saveFile(req.file);
        
        res.status(201).json({ 
            message: 'File uploaded successfully',
            file: req.file 
        });
    } catch (error) {
        if (req.file) fs.unlinkSync(req.file.path); // ניקוי במקרה של שגיאה
        console.error(error);
        res.status(500).json({ message: 'Error uploading file' });
    }
});


router.get('/', async (req, res) => {
    try {
        const files = await File.find().sort({ createdAt: -1 });
        res.json(files);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching files' });
    }
});

module.exports = router;