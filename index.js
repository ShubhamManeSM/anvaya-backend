// server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { initializeDatabase } = require('./db/db.connect');

const leadsRouter = require('./routes/leads');
const agentsRouter = require('./routes/agents');
const commentsRouter = require('./routes/comments');
const tagsRouter = require('./routes/tags');
const reportsRouter = require('./routes/reports');

const app = express();

// Middleware
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

// Routes
app.use('/leads', leadsRouter);
// Nested comments route: /leads/:id/comments
// commentsRouter uses mergeParams: true
app.use('/leads/:id/comments', commentsRouter);
app.use('/agents', agentsRouter);
app.use('/tags', tagsRouter);
app.use('/report', reportsRouter);

// Health check
app.get('/health', (req, res) => res.json({ status: 'ok', time: new Date() }));

// Connect to MongoDB and start server
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await initializeDatabase();
  app.listen(PORT, () => console.log(`🚀 Anvaya server running on http://localhost:${PORT}`));
};

startServer();
