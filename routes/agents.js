// routes/agents.js
const express = require('express');
const router = express.Router();
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

module.exports = router;
