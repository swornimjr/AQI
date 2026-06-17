const mongoose = require('mongoose');

const collectionSchema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  description: { type: String, default: '' },
  pins: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Pin' }],
  isPublic: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Collection', collectionSchema);
