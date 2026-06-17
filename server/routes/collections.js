const express = require('express');
const Collection = require('../models/Collection');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// POST /api/collections
router.post('/', protect, async (req, res) => {
  try {
    const { name, description, isPublic } = req.body;
    if (!name) return res.status(400).json({ message: 'Name required' });
    const collection = await Collection.create({ owner: req.user._id, name, description, isPublic });
    res.status(201).json(collection);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/collections/:id
router.put('/:id', protect, async (req, res) => {
  try {
    const collection = await Collection.findById(req.params.id);
    if (!collection) return res.status(404).json({ message: 'Collection not found' });
    if (collection.owner.toString() !== req.user._id.toString())
      return res.status(403).json({ message: 'Not authorised' });

    const { name, description, isPublic } = req.body;
    if (name !== undefined) collection.name = name;
    if (description !== undefined) collection.description = description;
    if (isPublic !== undefined) collection.isPublic = isPublic;
    await collection.save();
    res.json(collection);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE /api/collections/:id
router.delete('/:id', protect, async (req, res) => {
  try {
    const collection = await Collection.findById(req.params.id);
    if (!collection) return res.status(404).json({ message: 'Collection not found' });
    if (collection.owner.toString() !== req.user._id.toString())
      return res.status(403).json({ message: 'Not authorised' });
    await collection.deleteOne();
    res.json({ message: 'Collection deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/collections/:id/pins/:pinId
router.post('/:id/pins/:pinId', protect, async (req, res) => {
  try {
    const collection = await Collection.findById(req.params.id);
    if (!collection) return res.status(404).json({ message: 'Collection not found' });
    if (collection.owner.toString() !== req.user._id.toString())
      return res.status(403).json({ message: 'Not authorised' });
    if (!collection.pins.includes(req.params.pinId))
      collection.pins.push(req.params.pinId);
    await collection.save();
    res.json(collection);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE /api/collections/:id/pins/:pinId
router.delete('/:id/pins/:pinId', protect, async (req, res) => {
  try {
    const collection = await Collection.findById(req.params.id);
    if (!collection) return res.status(404).json({ message: 'Collection not found' });
    if (collection.owner.toString() !== req.user._id.toString())
      return res.status(403).json({ message: 'Not authorised' });
    collection.pins = collection.pins.filter((p) => p.toString() !== req.params.pinId);
    await collection.save();
    res.json(collection);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
