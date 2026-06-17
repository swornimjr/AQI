const express = require('express');
const User = require('../models/User');
const Pin = require('../models/Pin');
const Collection = require('../models/Collection');

const router = express.Router();

// GET /api/users/:username
router.get('/:username', async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username }).select('-passwordHash');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/users/:username/pins
router.get('/:username/pins', async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username });
    if (!user) return res.status(404).json({ message: 'User not found' });
    const pins = await Pin.find({ creator: user._id })
      .sort({ createdAt: -1 })
      .populate('creator', 'username avatar');
    res.json(pins);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/users/:username/collections
router.get('/:username/collections', async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username });
    if (!user) return res.status(404).json({ message: 'User not found' });
    const collections = await Collection.find({ owner: user._id, isPublic: true })
      .sort({ createdAt: -1 })
      .populate('pins', 'imageUrl title');
    res.json(collections);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
