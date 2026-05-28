// routes/tags.js
const express = require('express');
const router = express.Router();
const Tag = require('../models/Tag');

// POST /tags — Create a new tag
router.post('/', async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ error: 'name is required.' });
    }

    const existing = await Tag.findOne({ name: name.trim() });
    if (existing) {
      return res.status(409).json({ error: `Tag '${name}' already exists.` });
    }

    const tag = new Tag({ name });
    await tag.save();
    res.status(201).json(tag);
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(400).json({ error: err.message });
    }
    res.status(500).json({ error: err.message });
  }
});

// GET /tags — Fetch all tags
router.get('/', async (req, res) => {
  try {
    const tags = await Tag.find().sort({ name: 1 });
    res.json(tags);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
