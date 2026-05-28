// routes/reports.js
const express = require('express');
const router = express.Router();
const Lead = require('../models/Lead');

// GET /report/last-week — Leads closed (status=Closed) in the last 7 days
router.get('/last-week', async (req, res) => {
  try {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const leads = await Lead.find({
      status: 'Closed',
      closedAt: { $gte: sevenDaysAgo },
    })
      .populate('salesAgent', 'name email')
      .sort({ closedAt: -1 });

    res.json(leads);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /report/pipeline — Total leads per status (excluding Closed)
router.get('/pipeline', async (req, res) => {
  try {
    const pipeline = await Lead.aggregate([
      { $match: { status: { $ne: 'Closed' } } },
      { $group: { _id: '$status', count: { $sum: 1 } } },
      { $sort: { _id: 1 } },
    ]);

    const totalLeadsInPipeline = pipeline.reduce((sum, s) => sum + s.count, 0);
    res.json({ totalLeadsInPipeline, breakdown: pipeline });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /report/closed-by-agent — Count of closed leads grouped by salesAgent
router.get('/closed-by-agent', async (req, res) => {
  try {
    const results = await Lead.aggregate([
      { $match: { status: 'Closed' } },
      {
        $group: {
          _id: '$salesAgent',
          count: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: 'salesagents',
          localField: '_id',
          foreignField: '_id',
          as: 'agent',
        },
      },
      { $unwind: { path: '$agent', preserveNullAndEmpty: true } },
      {
        $project: {
          _id: 0,
          agentId: '$_id',
          agentName: '$agent.name',
          count: 1,
        },
      },
      { $sort: { count: -1 } },
    ]);

    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
