const express = require('express');
const Pin = require('../models/Pin');
const { protect } = require('../middleware/authMiddleware');
const { upload } = require('../utils/cloudinary');

const router = express.Router();

// GET /api/pins
router.get('/', async (req, res) => {
  try {
    const { style, tankSize, co2, search, sort } = req.query;
    const filter = {};

    if (style) filter.style = style;
    if (tankSize) filter.tankSize = tankSize;
    if (co2) filter.co2 = co2;
    if (search) {
      const re = new RegExp(search, 'i');
      filter.$or = [
        { title: re },
        { description: re },
        { flora: re },
        { fauna: re },
      ];
    }

    let sortOption = { createdAt: -1 };
    if (sort === 'saves') sortOption = { saves: -1 };
    if (sort === 'trending') sortOption = { saves: -1, createdAt: -1 };

    const pins = await Pin.find(filter)
      .sort(sortOption)
      .populate('creator', 'username avatar');

    res.json(pins);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/pins
router.post('/', protect, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'Image required' });

    const { title, description, style, tankSize, dimensions, substrate, co2, flora, fauna, equipment, progressionStage } = req.body;

    const pin = await Pin.create({
      creator: req.user._id,
      imageUrl: req.file.path,
      title,
      description,
      style,
      tankSize,
      dimensions,
      substrate,
      co2,
      flora: flora ? JSON.parse(flora) : [],
      fauna: fauna ? JSON.parse(fauna) : [],
      equipment: equipment ? JSON.parse(equipment) : [],
      progressionStage,
    });

    await pin.populate('creator', 'username avatar');
    res.status(201).json(pin);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/pins/:id
router.get('/:id', async (req, res) => {
  try {
    const pin = await Pin.findById(req.params.id)
      .populate('creator', 'username avatar')
      .populate('comments.user', 'username avatar');
    if (!pin) return res.status(404).json({ message: 'Pin not found' });
    res.json(pin);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE /api/pins/:id
router.delete('/:id', protect, async (req, res) => {
  try {
    const pin = await Pin.findById(req.params.id);
    if (!pin) return res.status(404).json({ message: 'Pin not found' });
    if (pin.creator.toString() !== req.user._id.toString())
      return res.status(403).json({ message: 'Not authorised' });
    await pin.deleteOne();
    res.json({ message: 'Pin deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/pins/:id/save
router.post('/:id/save', protect, async (req, res) => {
  try {
    const pin = await Pin.findByIdAndUpdate(req.params.id, { $inc: { saves: 1 } }, { new: true });
    if (!pin) return res.status(404).json({ message: 'Pin not found' });
    res.json({ saves: pin.saves });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE /api/pins/:id/save
router.delete('/:id/save', protect, async (req, res) => {
  try {
    const pin = await Pin.findByIdAndUpdate(
      req.params.id,
      { $inc: { saves: -1 } },
      { new: true }
    );
    if (!pin) return res.status(404).json({ message: 'Pin not found' });
    res.json({ saves: Math.max(0, pin.saves) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/pins/:id/comments
router.post('/:id/comments', protect, async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) return res.status(400).json({ message: 'Comment text required' });

    const pin = await Pin.findById(req.params.id);
    if (!pin) return res.status(404).json({ message: 'Pin not found' });

    pin.comments.push({ user: req.user._id, text });
    await pin.save();
    await pin.populate('comments.user', 'username avatar');

    res.status(201).json(pin.comments[pin.comments.length - 1]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
