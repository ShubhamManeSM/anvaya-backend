// routes/comments.js
const express = require('express');
const router = express.Router({ mergeParams: true }); // mergeParams to access :id from parent
const mongoose = require('mongoose');
const Comment = require('../models/Comment');
const Lead = require('../models/Lead');

// POST /leads/:id/comments — Add a comment to a lead
router.post('/', async (req, res) => {
  try {
    const { id } = req.params;
    const { commentText, author } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid lead ID.' });
    }
    if (!commentText) {
      return res.status(400).json({ error: 'commentText is required.' });
    }
    if (!author || !mongoose.Types.ObjectId.isValid(author)) {
      return res.status(400).json({ error: 'author must be a valid SalesAgent ObjectId.' });
    }

    const lead = await Lead.findById(id);
    if (!lead) return res.status(404).json({ error: `Lead with ID '${id}' not found.` });

    const comment = new Comment({ lead: id, author, commentText });
    await comment.save();
    await comment.populate('author', 'name email');

    res.status(201).json(comment);
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(400).json({ error: err.message });
    }
    res.status(500).json({ error: err.message });
  }
});

// GET /leads/:id/comments — Get all comments for a lead
router.get('/', async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid lead ID.' });
    }

    const lead = await Lead.findById(id);
    if (!lead) return res.status(404).json({ error: `Lead with ID '${id}' not found.` });

    const comments = await Comment.find({ lead: id })
      .populate('author', 'name email')
      .sort({ createdAt: 1 });

    res.json(comments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
