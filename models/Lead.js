// models/Lead.js
const mongoose = require('mongoose');

const leadSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Lead name is required'],
    trim: true,
  },
  source: {
    type: String,
    required: [true, 'Lead source is required'],
    enum: ['Website', 'Referral', 'Cold Call', 'Advertisement', 'Email', 'Other'],
  },
  salesAgent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SalesAgent',
    required: [true, 'Sales Agent is required'],
  },
  status: {
    type: String,
    required: true,
    enum: ['New', 'Contacted', 'Qualified', 'Proposal Sent', 'Closed'],
    default: 'New',
  },
  tags: {
    type: [String],
    default: [],
  },
  timeToClose: {
    type: Number,
    required: [true, 'Time to Close is required'],
    min: [1, 'Time to Close must be a positive number'],
  },
  priority: {
    type: String,
    required: true,
    enum: ['High', 'Medium', 'Low'],
    default: 'Medium',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  closedAt: {
    type: Date,
  },
});

// Pre-save: update updatedAt and set closedAt when status → Closed
leadSchema.pre('save', async function () {
  this.updatedAt = Date.now();
  if (this.isModified('status') && this.status === 'Closed' && !this.closedAt) {
    this.closedAt = Date.now();
  }
});

// Pre-findOneAndUpdate: handle updatedAt and closedAt for update operations
leadSchema.pre('findOneAndUpdate', async function () {
  const update = this.getUpdate();
  // Ensure $set exists
  if (!update.$set) update.$set = {};
  // Always stamp updatedAt
  update.$set.updatedAt = Date.now();
  // If status is being set to Closed, stamp closedAt
  const newStatus = update.$set.status || update.status;
  if (newStatus === 'Closed') {
    if (!update.$set.closedAt) update.$set.closedAt = Date.now();
  }
});

module.exports = mongoose.model('Lead', leadSchema);
