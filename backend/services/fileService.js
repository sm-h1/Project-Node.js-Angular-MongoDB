const File = require('../models/File');

async function fileExists(filename) {
  try {
    const existingFile = await File.findOne({ filename });
    return existingFile !== null;
  } catch (error) {
    console.error(error);
    throw new Error('Error checking if file exists');
  }
}

async function saveFile(file) {
  try {
    const newFile = new File({
      filename: file.originalname,
      path: file.path
    });
    await newFile.save();
  } catch (error) {
    console.error(error);
    throw new Error('Error saving file');
  }
}

module.exports = { fileExists, saveFile };
