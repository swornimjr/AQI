const mongoose = require('mongoose');

const pinSchema = new mongoose.Schema({
  creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  imageUrl: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, default: '' },
  style: {
    type: String,
    enum: ['Nature Aquarium', 'Iwagumi', 'Dutch', 'Biotope', 'Jungle', 'Paludarium', 'Blackwater', 'Other'],
  },
  tankSize: { type: String, enum: ['Nano', 'Small', 'Medium', 'Large'] },
  dimensions: { type: String, default: '' },
  substrate: {
    type: String,
    enum: ['ADA Aqua Soil', 'Dirted', 'Sand', 'Gravel', 'Mixed', ''],
    default: '',
  },
  co2: { type: String, enum: ['Injected', 'Excel/Liquid', 'None', ''], default: '' },
  flora: [String],
  fauna: [String],
  equipment: [String],
  progressionStage: {
    type: String,
    enum: ['New Setup', 'Growing In', 'Mature', 'Rescaped', ''],
    default: '',
  },
  saves: { type: Number, default: 0 },
  comments: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      text: String,
      createdAt: { type: Date, default: Date.now },
    },
  ],
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Pin', pinSchema);
