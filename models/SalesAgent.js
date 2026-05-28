// models/SalesAgent.js
const mongoose = require('mongoose');

const salesAgentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Sales Agent name is required'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Sales Agent email is required'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address'],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('SalesAgent', salesAgentSchema);
