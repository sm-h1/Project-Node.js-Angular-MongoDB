const File = require('../models/File');

const saveFile = async (fileData) => {
  const newFile = new File({
    filename: fileData.filename,      
    originalname: fileData.originalname, 
    path: fileData.path
  });
  return await newFile.save();
};

const fileExists = async (name) => {
  return await File.findOne({ originalname: name });
};

module.exports = { saveFile, fileExists };