// routes/leads.js
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Lead = require('../models/Lead');

// POST /leads — Create a new lead
router.post('/', async (req, res) => {
  try {
    const { name, source, salesAgent, status, tags, timeToClose, priority } = req.body;

    if (!name || !source || !salesAgent || !timeToClose) {
      return res.status(400).json({ error: 'name, source, salesAgent, and timeToClose are required.' });
    }

    if (!mongoose.Types.ObjectId.isValid(salesAgent)) {
      return res.status(400).json({ error: 'salesAgent must be a valid ObjectId.' });
    }

    const lead = new Lead({ name, source, salesAgent, status, tags, timeToClose, priority });
    await lead.save();
    await lead.populate('salesAgent', 'name email');
    res.status(201).json(lead);
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(400).json({ error: err.message });
    }
    res.status(500).json({ error: err.message });
  }
});

// GET /leads — Fetch all leads with optional filters
router.get('/', async (req, res) => {
  try {
    const { salesAgent, status, tags, source, sortBy, order } = req.query;
    const filter = {};

    if (salesAgent) {
      if (!mongoose.Types.ObjectId.isValid(salesAgent)) {
        return res.status(400).json({ error: 'salesAgent must be a valid ObjectId.' });
      }
      filter.salesAgent = salesAgent;
    }

    if (status) {
      const validStatuses = ['New', 'Contacted', 'Qualified', 'Proposal Sent', 'Closed'];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({ error: `status must be one of: ${validStatuses.join(', ')}.` });
      }
      filter.status = status;
    }

    if (source) {
      const validSources = ['Website', 'Referral', 'Cold Call', 'Advertisement', 'Email', 'Other'];
      if (!validSources.includes(source)) {
        return res.status(400).json({ error: `source must be one of: ${validSources.join(', ')}.` });
      }
      filter.source = source;
    }

    if (tags) {
      const tagsArray = Array.isArray(tags) ? tags : tags.split(',').map(t => t.trim());
      filter.tags = { $in: tagsArray };
    }

    // Sorting — priority is a string so map to numeric weight
    const priorityWeight = { High: 1, Medium: 2, Low: 3 };
    let leads;
    if (sortBy === 'priority') {
      // Fetch all matching leads then sort by priority weight in JS
      leads = await Lead.find(filter).populate('salesAgent', 'name email');
      leads.sort((a, b) => {
        const diff = (priorityWeight[a.priority] || 99) - (priorityWeight[b.priority] || 99);
        return order === 'asc' ? diff : -diff;
      });
    } else {
      const sortField = sortBy === 'timeToClose' ? 'timeToClose' : 'createdAt';
      const sortOrder = order === 'asc' ? 1 : -1;
      leads = await Lead.find(filter)
        .populate('salesAgent', 'name email')
        .sort({ [sortField]: sortOrder });
    }

    res.json(leads);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /leads/:id — Get single lead
router.get('/:id', async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: 'Invalid lead ID.' });
    }
    const lead = await Lead.findById(req.params.id).populate('salesAgent', 'name email');
    if (!lead) return res.status(404).json({ error: `Lead with ID '${req.params.id}' not found.` });
    res.json(lead);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /leads/:id — Full update of a lead
router.put('/:id', async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: 'Invalid lead ID.' });
    }

    const { name, source, salesAgent, status, tags, timeToClose, priority } = req.body;

    if (salesAgent && !mongoose.Types.ObjectId.isValid(salesAgent)) {
      return res.status(400).json({ error: 'salesAgent must be a valid ObjectId.' });
    }

    // updatedAt and closedAt handled by pre-findOneAndUpdate hook in Lead model
    const updateData = { name, source, salesAgent, status, tags, timeToClose, priority };

    const lead = await Lead.findByIdAndUpdate(
      req.params.id,
      { $set: updateData },
      { new: true, runValidators: true }
    ).populate('salesAgent', 'name email');

    if (!lead) return res.status(404).json({ error: `Lead with ID '${req.params.id}' not found.` });
    res.json(lead);
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(400).json({ error: err.message });
    }
    res.status(500).json({ error: err.message });
  }
});

// DELETE /leads/:id
router.delete('/:id', async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: 'Invalid lead ID.' });
    }
    const lead = await Lead.findByIdAndDelete(req.params.id);
    if (!lead) return res.status(404).json({ error: `Lead with ID '${req.params.id}' not found.` });

    res.json({ message: 'Lead deleted successfully.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
