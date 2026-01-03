const File = require('../models/File');

async function fileExists(filename) {
  try {
    const existingFile = await File.findOne({ filename });
    return existingFile !== null;
  } catch (error) {
    throw new Error('Error checking if file exists');
  }
}

async function saveFile(file) {
  try {
    const newFile = new File({
      filename: file.originalname,
      path: file.path
    });
    return await newFile.save();
  } catch (error) {
    throw error;
  }
}

module.exports = { fileExists, saveFile };