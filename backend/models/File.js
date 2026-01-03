const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
  filename: { type: String, required: true, unique: true },
  path: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('File', fileSchema);