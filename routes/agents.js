// routes/agents.js
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const SalesAgent = require('../models/SalesAgent');

// POST /agents — Create a new sales agent
router.post('/', async (req, res) => {
  try {
    const { name, email } = req.body;
    if (!name || !email) {
      return res.status(400).json({ error: 'name and email are required.' });
    }

    const existing = await SalesAgent.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(409).json({ error: `Sales agent with email '${email}' already exists.` });
    }

    const agent = new SalesAgent({ name, email });
    await agent.save();
    res.status(201).json(agent);
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(400).json({ error: err.message });
    }
    res.status(500).json({ error: err.message });
  }
});

// GET /agents — Fetch all sales agents
router.get('/', async (req, res) => {
  try {
    const agents = await SalesAgent.find().sort({ name: 1 });
    res.json(agents);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /agents/:id — Delete a sales agent
router.delete('/:id', async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: 'Invalid agent ID.' });
    }
    const agent = await SalesAgent.findByIdAndDelete(req.params.id);
    if (!agent) return res.status(404).json({ error: `Sales agent with ID '${req.params.id}' not found.` });

    res.json({ message: 'Sales agent deleted successfully.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
